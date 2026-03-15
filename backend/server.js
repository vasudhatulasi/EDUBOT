require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const otpGenerator = require("otp-generator");
const OpenAI = require("openai");

const Student = require("./models/Student");
const OTP = require("./models/OTP");

const app = express();

app.use(express.json());
app.use(cors());

// Simple sanitization helpers to prevent HTML/script injection in responses
const sanitizeString = (value = "") => {
  if (typeof value !== "string") return value;
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return sanitizeString(obj);
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = sanitizeObject(v);
  }
  return clean;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

/* MongoDB */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* SEND OTP */

app.post("/send-otp", async (req,res)=>{

const {regNo,phone} = req.body;

const student = await Student.findOne({
regNo,
parentPhone:phone
});

if(!student){
return res.json({
success:false,
message:"Student not found"
});
}

const otp = otpGenerator.generate(6,{
upperCaseAlphabets:false,
lowerCaseAlphabets:false,
specialChars:false
});

await OTP.create({phone,otp});

console.log("OTP:",otp);

res.json({
success:true,
message:"OTP generated"
});

});


/* VERIFY OTP */

app.post("/verify-otp", async(req,res)=>{

const {phone,otp} = req.body;

const record = await OTP.findOne({phone,otp});

if(!record){
return res.json({
success:false,
message:"Invalid OTP"
});
}

res.json({
success:true,
message:"Login successful"
});

});


/* STUDENT PROFILE */
app.get("/student", async (req, res) => {
  const { regNo } = req.query;
  if (!regNo) {
    return res.status(400).json({ success: false, message: "regNo is required" });
  }

  const student = await Student.findOne({ regNo });
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  // Sanitize student data before sending to the client
  const safeStudent = sanitizeObject(student.toObject());

  return res.json({ success: true, student: safeStudent });
});

/* CHATBOT */
app.post("/chatbot", async (req, res) => {
  const { regNo, message } = req.body;
  const userMessage = sanitizeString(message);

  const student = await Student.findOne({ regNo });
  if (!student) {
    return res.json({ reply: "Student not found" });
  }

  try {
    // Prepare student data for AI context
    const safeStudent = sanitizeObject(student.toObject());
    const studentData = {
      name: safeStudent.name,
      regNo: safeStudent.regNo,
      department: safeStudent.department,
      year: safeStudent.year,
      cgpa: safeStudent.cgpa,
      backlogs: safeStudent.backlogs,
      fees: safeStudent.fees,
      semesters: safeStudent.semesters.map((sem) => ({
        semesterNumber: sem.semesterNumber,
        subjects: sem.subjects.map((sub) => ({
          name: sub.name,
          attendance: sub.attendance,
          marks: sub.marks
        }))
      })),
      upcomingExams: safeStudent.upcomingExams,
      notifications: safeStudent.notifications
    };

    const prompt = `
You are an AI assistant for parents to help them understand their child's academic performance. You have access to the following student data:

Student Name: ${studentData.name}
Registration Number: ${studentData.regNo}
Department: ${studentData.department}
Year: ${studentData.year}

CGPA: Current ${studentData.cgpa?.current || 'N/A'}
Semester-wise CGPA: ${studentData.cgpa?.semesterWise?.map(s => `Sem ${s.semesterNumber}: ${s.cgpa}`).join(', ') || 'N/A'}

Backlogs: ${studentData.backlogs?.count || 0} backlogs
Backlog subjects: ${studentData.backlogs?.subjects?.map(b => `${b.subject} (Sem ${b.semester})`).join(', ') || 'None'}

Fees: Total ₹${studentData.fees?.total || 'N/A'}, Paid ₹${studentData.fees?.paid || 'N/A'}, Pending ₹${studentData.fees?.pending || 'N/A'}, Status: ${studentData.fees?.status || 'N/A'}

Subjects and Attendance/Marks:
${studentData.semesters.map(sem =>
  `Semester ${sem.semesterNumber}:\n${sem.subjects.map(sub =>
    `- ${sub.name}: Attendance ${sub.attendance?.percentage || 0}%, Mid1 ${sub.marks?.mid1 || 'N/A'}, Mid2 ${sub.marks?.mid2 || 'N/A'}, Semester Exam ${sub.marks?.semesterExam || 'N/A'}`
  ).join('\n')}`
).join('\n\n')}

Upcoming Exams:
${studentData.upcomingExams?.map(exam =>
  `- ${exam.title} on ${new Date(exam.date).toLocaleDateString()}: ${exam.subjects?.join(', ')} - ${exam.description || ''}`
).join('\n') || 'None'}

Recent Notifications:
${studentData.notifications?.slice(0,5).map(note =>
  `- ${note.title} (${new Date(note.date).toLocaleDateString()}): ${note.message}`
).join('\n') || 'None'}

Parent's question: "${message}"

Please provide a helpful, concise response about the student's academic performance. Only answer questions related to academics, attendance, marks, CGPA, backlogs, fees, exams, or notifications. If the question is not related to these topics, politely redirect to academic topics.

If appropriate, suggest visualizations like charts for attendance, CGPA progress, or grade distribution.
`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful academic assistant for parents. Provide clear, accurate information from the student data provided." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content.trim();

    return res.json({ reply });

  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.json({ reply: "Sorry, I'm having trouble processing your request right now. Please try again later." });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});