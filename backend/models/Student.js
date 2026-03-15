const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  attendance: {
    totalClasses: Number,
    attendedClasses: Number,
    percentage: Number
  },
  marks: {
    mid1: Number,
    mid2: Number,
    semesterExam: Number
  }
});

const semesterSchema = new mongoose.Schema({
  semesterNumber: Number,
  subjects: [subjectSchema]
});

const cgpaSemesterSchema = new mongoose.Schema({
  semesterNumber: Number,
  cgpa: Number
});

const backlogSchema = new mongoose.Schema({
  subject: String,
  semester: Number,
  status: String // e.g. "Pending" | "Cleared"
});

const examSchema = new mongoose.Schema({
  title: String,
  date: Date,
  subjects: [String],
  description: String
});

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  category: String,
  date: Date
});

const studentSchema = new mongoose.Schema({
  regNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: String,
  year: Number, // 1 to 4
  studentPhone: String,
  parentPhone: { type: String, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  profilePhoto: String,
  semesters: [semesterSchema],

  cgpa: {
    current: Number,
    semesterWise: [cgpaSemesterSchema]
  },

  backlogs: {
    count: Number,
    subjects: [backlogSchema]
  },

  fees: {
    total: Number,
    paid: Number,
    pending: Number,
    status: String,
    dueDate: Date,
    scholarship: {
      amount: Number,
      type: String,
      description: String
    }
  },

  // Coding profile data (e.g., LeetCode / CodeChef performance)
  codingProfile: {
    leetcode: {
      username: String,
      rating: Number,
      problemsSolved: Number,
      easySolved: Number,
      mediumSolved: Number,
      hardSolved: Number
    },
    codechef: {
      username: String,
      rating: Number,
      problemsSolved: Number,
      fullySolved: Number,
      partiallySolved: Number
    }
  },

  notifications: [notificationSchema],
  upcomingExams: [examSchema]
});

module.exports = mongoose.model("Student", studentSchema);