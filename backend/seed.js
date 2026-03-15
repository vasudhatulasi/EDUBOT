// Sample data for testing the Student Parent Dashboard
// Run this file to populate the database with sample student data

const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

const sampleStudents = [
  {
    regNo: "2021001",
    name: "John Doe",
    department: "Computer Science",
    year: 2, // 2nd year -> Sem1-Sem4
    studentPhone: "9123456780",
    parentPhone: "9876543210",
    parentName: "Jane Doe",
    parentEmail: "jane.doe@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=5",
    semesters: [
      {
        semesterNumber: 1,
        subjects: [
          {
            name: "Data Structures",
            attendance: { totalClasses: 50, attendedClasses: 42, percentage: 84 },
            marks: { mid1: 18, mid2: 20, semesterExam: 75 }
          },
          {
            name: "Algorithms",
            attendance: { totalClasses: 45, attendedClasses: 40, percentage: 89 },
            marks: { mid1: 22, mid2: 19, semesterExam: 80 }
          }
        ]
      },
      {
        semesterNumber: 2,
        subjects: [
          {
            name: "Database Systems",
            attendance: { totalClasses: 48, attendedClasses: 43, percentage: 90 },
            marks: { mid1: 20, mid2: 21, semesterExam: 78 }
          },
          {
            name: "Operating Systems",
            attendance: { totalClasses: 52, attendedClasses: 38, percentage: 73 },
            marks: { mid1: 16, mid2: 18, semesterExam: 72 }
          }
        ]
      },
      {
        semesterNumber: 3,
        subjects: [
          {
            name: "Computer Networks",
            attendance: { totalClasses: 46, attendedClasses: 41, percentage: 89 },
            marks: { mid1: 19, mid2: 22, semesterExam: 82 }
          },
          {
            name: "Software Engineering",
            attendance: { totalClasses: 44, attendedClasses: 39, percentage: 89 },
            marks: { mid1: 21, mid2: 20, semesterExam: 85 }
          }
        ]
      },
      {
        semesterNumber: 4,
        subjects: [
          {
            name: "Web Technologies",
            attendance: { totalClasses: 50, attendedClasses: 45, percentage: 90 },
            marks: { mid1: 23, mid2: 24, semesterExam: 88 }
          },
          {
            name: "Machine Learning",
            attendance: { totalClasses: 48, attendedClasses: 42, percentage: 88 },
            marks: { mid1: 20, mid2: 22, semesterExam: 80 }
          }
        ]
      }
    ],
    cgpa: {
      current: 8.5,
      semesterWise: [
        { semesterNumber: 1, cgpa: 8.2 },
        { semesterNumber: 2, cgpa: 8.4 },
        { semesterNumber: 3, cgpa: 8.7 },
        { semesterNumber: 4, cgpa: 8.5 }
      ]
    },
    backlogs: {
      count: 1,
      subjects: [
        { subject: "Operating Systems", semester: 2, status: "Pending" }
      ]
    },
    fees: {
      total: 60000,
      paid: 45000,
      pending: 15000,
      status: "Due",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 24)),
      scholarship: {
        amount: 5000,
        type: "Merit",
        description: "Academic excellence scholarship"
      }
    },
    codingProfile: {
      leetcode: {
        username: "john_doe",
        rating: 1850,
        problemsSolved: 280,
        easySolved: 120,
        mediumSolved: 130,
        hardSolved: 30
      },
      codechef: {
        username: "john_doe_cc",
        rating: 1780,
        problemsSolved: 210,
        fullySolved: 180,
        partiallySolved: 30
      }
    },
    notifications: [
      {
        title: "New Assignment Uploaded",
        message: "Assignment 3 for Data Structures is uploaded.",
        category: "Assignment",
        date: new Date()
      },
      {
        title: "Fee Reminder",
        message: "Pending fees are due in 3 days.",
        category: "Finance",
        date: new Date(new Date().setDate(new Date().getDate() - 2))
      }
    ],
    upcomingExams: [
      {
        title: "Internal Exam",
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        subjects: ["Mathematics", "Data Structures"],
        description: "Prepare chapters 1-5."
      },
      {
        title: "Mid Term",
        date: new Date(new Date().setDate(new Date().getDate() + 30)),
        subjects: ["Algorithms", "Operating Systems"],
        description: "Covers entire syllabus."
      }
    ],
    assessments: [
      {
        title: "Data Structures Assignment",
        type: "Assignment",
        subject: "Data Structures",
        deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
        description: "Implement sorting algorithms",
        status: "Pending"
      },
      {
        title: "Algorithms Quiz",
        type: "Quiz",
        subject: "Algorithms",
        deadline: new Date(new Date().setDate(new Date().getDate() + 10)),
        description: "Online quiz on graph algorithms",
        status: "Pending"
      }
    ]
  },
  {
    regNo: "2022002",
    name: "Jane Smith",
    department: "Information Technology",
    year: 1, // 1st year -> Sem1-Sem2
    studentPhone: "9123456781",
    parentPhone: "9876543211",
    parentName: "Robert Smith",
    parentEmail: "robert.smith@email.com",
    profilePhoto: "https://i.pravatar.cc/150?img=12",
    semesters: [
      {
        semesterNumber: 1,
        subjects: [
          {
            name: "Programming Fundamentals",
            attendance: { totalClasses: 50, attendedClasses: 47, percentage: 94 },
            marks: { mid1: 24, mid2: 23, semesterExam: 90 }
          },
          {
            name: "Mathematics",
            attendance: { totalClasses: 48, attendedClasses: 44, percentage: 92 },
            marks: { mid1: 22, mid2: 21, semesterExam: 85 }
          }
        ]
      },
      {
        semesterNumber: 2,
        subjects: [
          {
            name: "Data Structures",
            attendance: { totalClasses: 52, attendedClasses: 48, percentage: 92 },
            marks: { mid1: 21, mid2: 23, semesterExam: 87 }
          },
          {
            name: "Discrete Mathematics",
            attendance: { totalClasses: 46, attendedClasses: 42, percentage: 91 },
            marks: { mid1: 20, mid2: 22, semesterExam: 83 }
          }
        ]
      }
    ],
    cgpa: {
      current: 9.1,
      semesterWise: [
        { semesterNumber: 1, cgpa: 9.0 },
        { semesterNumber: 2, cgpa: 9.2 }
      ]
    },
    backlogs: {
      count: 0,
      subjects: []
    },
    fees: {
      total: 60000,
      paid: 60000,
      pending: 0,
      status: "Paid",
      dueDate: new Date(),
      scholarship: {
        amount: 10000,
        type: "Need-based",
        description: "Financial aid scholarship"
      }
    },
    codingProfile: {
      leetcode: {
        username: "jane_smith",
        rating: 1520,
        problemsSolved: 160,
        easySolved: 90,
        mediumSolved: 60,
        hardSolved: 10
      },
      codechef: {
        username: "jane_cc",
        rating: 1400,
        problemsSolved: 130,
        fullySolved: 110,
        partiallySolved: 20
      }
    },
    notifications: [
      {
        title: "Welcome to the Portal",
        message: "You can now access all your academic information.",
        category: "General",
        date: new Date()
      }
    ],
    upcomingExams: [
      {
        title: "First Term Exam",
        date: new Date(new Date().setDate(new Date().getDate() + 12)),
        subjects: ["Programming Fundamentals", "Mathematics"],
        description: "Exam will be conducted in the main hall."
      }
    ],
    assessments: [
      {
        title: "Programming Project",
        type: "Project",
        subject: "Programming Fundamentals",
        deadline: new Date(new Date().setDate(new Date().getDate() + 14)),
        description: "Build a simple calculator application",
        status: "Pending"
      },
      {
        title: "Math Homework",
        type: "Assignment",
        subject: "Mathematics",
        deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
        description: "Solve problems from chapter 3",
        status: "Submitted"
      }
    ]
  }
];

async function insertSampleData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Student.deleteMany({});
    console.log("🗑️ Cleared existing student data");

    // Insert sample data
    await Student.insertMany(sampleStudents);
    console.log("✅ Sample student data inserted successfully");

    console.log("\n📋 Sample Students:");
    sampleStudents.forEach((student) => {
      console.log(`- ${student.name} (${student.regNo}) - Year ${student.year} - Phone: ${student.parentPhone}`);
    });

    console.log("\n🤖 Test Chatbot Queries:");
    console.log("- 'Show attendance'");
    console.log("- 'Attendance for Data Structures'");
    console.log("- 'Show marks'");
    console.log("- 'Mid1 marks'");
    console.log("- 'Show semester 3 marks'");
    console.log("- 'Show CGPA'");
    console.log("- 'Do I have backlogs'");
    console.log("- 'Pending fees'");
    console.log("- 'Next exam'");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

insertSampleData();