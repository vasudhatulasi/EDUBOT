import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "./Dashboard.css";
import AcademicProgress from "./AcademicProgress";
import ProfileSettings from "./ProfileSettings";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

// Quick actions are rendered dynamically based on current language
  const getQuickActions = (t) => [
    { label: t("quickActions.attendance"), query: "Show attendance" },
    { label: t("quickActions.marks"), query: "Show marks" },
    { label: t("quickActions.cgpa"), query: "Show CGPA" },
    { label: t("quickActions.backlogs"), query: "Do I have backlogs" },
    { label: t("quickActions.fees"), query: "Pending fees" },
    { label: t("quickActions.exams"), query: "Next exam" }
  ];

const SidebarItem = ({ active, onClick, icon, label }) => (
  <button className={`sidebar-item ${active ? "active" : ""}`} onClick={onClick}>
    <span className="sidebar-icon">{icon}</span>
    <span className="sidebar-text">{label}</span>
  </button>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("chat");
  const [language, setLanguage] = useState(() => localStorage.getItem("preferredLang") || "en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const regNo = localStorage.getItem("parentRegNo");

  const translations = useMemo(
    () => ({
      en: {
        title: "EduBot",
        online: "Online",
        greeting: "Hi there! Ask me about attendance, marks, CGPA, backlogs, fees, or exams.",
        dashboard: "Dashboard",
        profile: "Student Profile",
        academics: "Academic Performance",
        attendance: "Attendance",
        fees: "Fee Status",
        notifications: "Notifications",
        settings: "Settings",
        studentIntelligence: "Student Intelligence",
        quickActions: {
          attendance: "Show attendance",
          marks: "Show marks",
          cgpa: "Show CGPA",
          backlogs: "Do I have backlogs",
          fees: "Pending fees",
          exams: "Next exam"
        },
        send: "Send",
        placeholder: "Type your message..."
      },
      te: {
        title: "పేరెంట్ అసిస్టెంట్",
        online: "ఆన్‌లైన్",
        greeting: "హాయ్! హాజరు, మార్కులు, CGPA, బ్యాక్లాగ్స్, ఫీజులు లేదా పరీక్షలు గురించి నన్ను అడగండి.",
        dashboard: "డ్యాష్‌బోర్డ్",
        profile: "స్టూడెంట్ ప్రొఫైల్",
        academics: "శైక్షణిక పనితీరు",
        attendance: "హాజరు",
        fees: "ఫీజు స్థితి",
        notifications: "నోటిఫికేషన్స్",
        settings: "సెట్టింగ్స్",
        studentIntelligence: "విద్యార్థి ఇంటెలిజెన్స్",
        quickActions: {
          attendance: "హాజరు చూపించు",
          marks: "మార్కులు చూపించు",
          cgpa: "CGPA చూపించు",
          backlogs: "నాకు బ్యాక్లాగ్స్ ఉందా",
          fees: "మిగిలిన ఫీజు",
          exams: "తరువాతి పరీక్ష"
        },
        send: "పంపండి",
        placeholder: "మీ సందేశాన్ని టైప్ చేయండి..."
      },
      hi: {
        title: "पेरेंट असिस्टेंट",
        online: "ऑनलाइन",
        greeting: "नमस्ते! उपस्थिति, अंक, CGPA, बैकलॉग, फीस या परीक्षाओं के बारे में मुझसे पूछें।",
        dashboard: "डैशबोर्ड",
        profile: "छात्र प्रोफ़ाइल",
        academics: "शैक्षणिक प्रदर्शन",
        attendance: "उपस्थिति",
        fees: "शुल्क की स्थिति",
        notifications: "सूचनाएं",
        settings: "सेटिंग्स",
        studentIntelligence: "छात्र बुद्धिमत्ता",
        quickActions: {
          attendance: "उपस्थिति दिखाएं",
          marks: "अंक दिखाएं",
          cgpa: "CGPA दिखाएं",
          backlogs: "क्या मेरे पास बैकलॉग हैं",
          fees: "बकाया फीस",
          exams: "अगला परीक्षा"
        },
        send: "भेजें",
        placeholder: "अपना संदेश टाइप करें..."
      }
    }),
    []
  );

  const t = useCallback((key) => {
    const parts = key.split(".");
    let obj = translations[language] || translations.en;
    for (const part of parts) {
      obj = obj?.[part];
      if (obj == null) return key;
    }
    return obj;
  }, [language, translations]);

  const quickActions = getQuickActions(t);
  const QUICK_ACTIONS = quickActions;

  const setLanguageAndTranslate = (lang) => {
    setLanguage(lang);
    localStorage.setItem("preferredLang", lang);
  };

  useEffect(() => {
    setMessages([{ role: "bot", text: t("greeting") }]);
  }, [language, t]);

  useEffect(() => {
    if (!regNo) {
      navigate("/");
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/student", { params: { regNo } });
        if (res.data.success) {
          setStudent(res.data.student);
        } else {
          setError(res.data.message || "Unable to fetch student data.");
        }
      } catch {
        setError("Unable to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [navigate, regNo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (query) => {
    if (!query?.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);

    // Check if academic query for charts
    if (isAcademicQuery(query)) {
      const academicReply = generateAcademicReply(query);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: academicReply.text },
        ...(academicReply.type === "chart" ? [{ role: "bot", type: "chart", chart: academicReply.chart }] : [])
      ]);
    }

    try {
      const res = await axios.post("http://localhost:5000/chatbot", {
        regNo,
        message: query
      });

      // If academic, we already showed chart, now add AI response
      if (isAcademicQuery(query)) {
        setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
      } else {
        // For non-academic, just show the AI response
        setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Server error. Please try again." }]);
    }

    setInput("");
  };

  const handleAction = (query) => sendMessage(query);

  const handleLogout = () => {
    localStorage.removeItem("parentRegNo");
    localStorage.removeItem("parentPhone");
    navigate("/");
  };

  const totalSubjects = useMemo(() => {
    if (!student) return 0;
    return student.semesters.reduce((sum, sem) => sum + (sem.subjects?.length || 0), 0);
  }, [student]);

  const backlogCount = student?.backlogs?.count ?? 0;

  const attendancePercent = useMemo(() => {
    if (!student) return 0;
    const subjects = student.semesters.flatMap((sem) => sem.subjects || []);
    if (!subjects.length) return 0;
    const avg =
      subjects.reduce((acc, s) => acc + (s.attendance?.percentage || 0), 0) / subjects.length;
    return Math.round(avg);
  }, [student]);

  const subjectAttendanceData = useMemo(() => {
    if (!student) return null;
    const subjects = student.semesters.flatMap((sem) => sem.subjects || []);
    if (!subjects.length) return null;

    const max = 7;
    const topSubjects = subjects.slice(0, max);

    const labels = topSubjects.map((s) => s.name || "Unnamed");
    const data = topSubjects.map((s) => s.attendance?.percentage ?? 0);

    if (data.every((v) => v === 0)) return null;

    const palette = [
      "rgba(124, 58, 237, 0.85)",
      "rgba(99, 102, 241, 0.85)",
      "rgba(37, 99, 235, 0.85)",
      "rgba(34, 197, 94, 0.85)",
      "rgba(248, 113, 113, 0.85)",
      "rgba(249, 115, 22, 0.85)",
      "rgba(16, 185, 129, 0.85)"
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: palette.slice(0, labels.length),
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 2
        }
      ]
    };
  }, [student]);

  const cgpaProgressData = useMemo(() => {
    const current = student?.cgpa?.current ?? 0;
    const capped = Math.min(current, 10);
    const remaining = 10 - capped;

    return {
      labels: ["Achieved", "Remaining"],
      datasets: [
        {
          data: [capped, remaining],
          backgroundColor: ["rgba(124, 58, 237, 0.85)", "rgba(255,255,255,0.12)"],
          borderColor: "rgba(255,255,255,0.2)",
          borderWidth: 2
        }
      ]
    };
  }, [student]);

  const cgpaProgressOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    rotation: -Math.PI,
    circumference: Math.PI,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.label === "Achieved") {
              return `CGPA: ${student?.cgpa?.current ?? 0} / 10`;
            }
            return `Remaining: ${10 - (student?.cgpa?.current ?? 0)}`;
          }
        }
      }
    }
  }), [student]);

  const isAcademicQuery = (query) => {
    const normalized = query.trim().toLowerCase();
    return /attendance|cgpa|marks|grades|backlog|exam|performance|gpa/.test(normalized);
  };

  const generateAcademicReply = (query) => {
    const normalized = query.trim().toLowerCase();

    if (/attendance/.test(normalized)) {
      return {
        text: `Your current overall attendance is ${attendancePercent}% (based on subject averages).`,
        type: "chart",
        chart: {
          type: "bar",
          data: {
            labels: ["Attendance"],
            datasets: [
              {
                label: "Attendance %",
                data: [attendancePercent],
                backgroundColor: "rgba(34, 197, 94, 0.8)"
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true, max: 100 }
            },
            plugins: { legend: { display: false } }
          }
        }
      };
    }

    if (/cgpa|gpa/.test(normalized)) {
      return {
        text: `Current CGPA is ${student?.cgpa?.current ?? "-"}. Here's the progress toward 10.0.`,
        type: "chart",
        chart: {
          type: "progress",
          data: cgpaProgressData,
          options: cgpaProgressOptions
        }
      };
    }

    if (/marks|grade/.test(normalized)) {
      return {
        text: `Here is your grade distribution across all subjects:`,
        type: "chart",
        chart: {
          type: "pie",
          data: performancePieData,
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom", labels: { color: "rgba(226,232,240,0.8)" } }
            }
          }
        }
      };
    }

    return {
      text: "I can help with academic insights like attendance, CGPA, grades, backlogs, and exams. Ask me about those!",
      type: "text"
    };
  };

  const nextExam = useMemo(() => {
    if (!student?.upcomingExams?.length) return null;
    const now = new Date();
    const upcoming = student.upcomingExams
      .filter((e) => e.date && new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return upcoming[0];
  }, [student]);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="logo">{t("title")}</div>
            <div className="language-select">
              <span className="language-icon">🌐</span>
              <select value={language} onChange={(e) => setLanguageAndTranslate(e.target.value)}>
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
          <div className="sidebar-title">{t("studentIntelligence")}</div>
        </div>

        <div className="sidebar-menu">
          <SidebarItem
            active={activeView === "chat"}
            onClick={() => setActiveView("chat")}
            icon="💬"
            label={t("dashboard")}
          />
          <SidebarItem
            active={activeView === "profile"}
            onClick={() => setActiveView("profile")}
            icon="👤"
            label={t("profile")}
          />
          <SidebarItem
            active={activeView === "academics"}
            onClick={() => setActiveView("academics")}
            icon="📊"
            label={t("academics")}
          />
          <SidebarItem
            active={activeView === "attendance"}
            onClick={() => setActiveView("attendance")}
            icon="✅"
            label={t("attendance")}
          />
          <SidebarItem
            active={activeView === "fees"}
            onClick={() => setActiveView("fees")}
            icon="💰"
            label={t("fees")}
          />
          <SidebarItem
            active={activeView === "notifications"}
            onClick={() => setActiveView("notifications")}
            icon="🔔"
            label={t("notifications")}
          />
          <SidebarItem
            active={activeView === "settings"}
            onClick={() => setActiveView("settings")}
            icon="⚙️"
            label={t("settings")}
          />
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{student?.name?.[0] || "P"}</div>
            <div>
              <div className="sidebar-user-name">{student?.name || "Parent"}</div>
              <div className="sidebar-user-email">{localStorage.getItem("parentPhone")}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {loading ? (
          <div className="loading">Loading student data...</div>
        ) : error ? (
          <div className="loading error">{error}</div>
        ) : (
          <>
            {activeView === "chat" && (
              <section className="chat-panel">
                <header className="chat-panel-header">
                  <div>
                    <h2>{t("title")}</h2>
                    <p className="status">
                      <span className="status-dot" /> {t("online")}
                    </p>
                  </div>
                </header>

                <div className="chat-messages">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`chat-message ${m.role === "bot" ? "bot" : "user"}`}
                    >
                      {m.type === "chart" ? (
                        <div className="chat-chart">
                          {m.chart.type === "pie" && <Pie data={m.chart.data} options={m.chart.options} />}
                          {m.chart.type === "progress" && (
                            <div className="semi-pie-wrapper">
                              <Doughnut data={m.chart.data} options={m.chart.options} />
                              <div className="semi-pie-label">
                                <span>{student?.cgpa?.current ?? 0}</span>
                                <span className="muted">/ 10</span>
                              </div>
                            </div>
                          )}
                          {m.chart.type === "bar" && (
                            <div className="chat-bar">
                              <Line data={m.chart.data} options={m.chart.options} />
                            </div>
                          )}
                        </div>
                      ) : (
                        m.text
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                <div className="quick-actions">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="quick-action"
                      onClick={() => handleAction(action.query)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                <div className="chat-input">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("placeholder")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendMessage(input);
                    }}
                  />
                  <button onClick={() => sendMessage(input)}>{t("send")}</button>
                </div>
              </section>
            )}

            {activeView === "profile" && (
              <section className="profile-panel">
                <div className="profile-card">
                  <div className="profile-header">
                    <img
                      className="profile-avatar"
                      src={student?.profilePhoto || "https://i.pravatar.cc/150"}
                      alt="Student"
                    />
                    <div>
                      <h2>{student?.name}</h2>
                      <p className="muted">Reg No: {student?.regNo}</p>
                      <p className="muted">Department: {student?.department}</p>
                      <p className="muted">Year: {student?.year}</p>
                    </div>
                  </div>

                  <div className="profile-details">
                    <div className="profile-row">
                      <span>Student Phone</span>
                      <span>{student?.studentPhone || "-"}</span>
                    </div>
                    <div className="profile-row">
                      <span>Parent Phone</span>
                      <span>{student?.parentPhone}</span>
                    </div>
                  </div>

                  <div className="coding-profile">
                    <h3>Coding Profiles</h3>
                    <div className="coding-grid">
                      <div className="coding-card">
                        <h4>LeetCode</h4>
                        <div className="coding-row">
                          <span>Username</span>
                          <span>{student?.codingProfile?.leetcode?.username || "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Rating</span>
                          <span>{student?.codingProfile?.leetcode?.rating ?? "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Problems Solved</span>
                          <span>{student?.codingProfile?.leetcode?.problemsSolved ?? "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Easy / Med / Hard</span>
                          <span>
                            {student?.codingProfile?.leetcode?.easySolved ?? 0} / {student?.codingProfile?.leetcode?.mediumSolved ?? 0} / {student?.codingProfile?.leetcode?.hardSolved ?? 0}
                          </span>
                        </div>
                      </div>

                      <div className="coding-card">
                        <h4>CodeChef</h4>
                        <div className="coding-row">
                          <span>Username</span>
                          <span>{student?.codingProfile?.codechef?.username || "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Rating</span>
                          <span>{student?.codingProfile?.codechef?.rating ?? "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Problems Solved</span>
                          <span>{student?.codingProfile?.codechef?.problemsSolved ?? "-"}</span>
                        </div>
                        <div className="coding-row">
                          <span>Fully / Partial</span>
                          <span>
                            {student?.codingProfile?.codechef?.fullySolved ?? 0} / {student?.codingProfile?.codechef?.partiallySolved ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeView === "academics" && (
              <section className="info-panel">
                <AcademicProgress student={student} />
              </section>
            )}

            {activeView === "attendance" && (
              <section className="info-panel">
                <h2>Attendance Overview</h2>
                <p className="muted">Attendance per subject for the current year.</p>
                <div className="table">
                  <div className="table-row header">
                    <div>Semester</div>
                    <div>Subject</div>
                    <div>Attendance</div>
                  </div>
                  {student?.semesters?.flatMap((sem) =>
                    sem.subjects.map((sub) => (
                      <div key={`${sem.semesterNumber}-${sub.name}`} className="table-row">
                        <div>{sem.semesterNumber}</div>
                        <div>{sub.name}</div>
                        <div>{sub.attendance.percentage}%</div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeView === "fees" && (
              <section className="info-panel">
                <h2>Fee Status</h2>
                <div className="summary-row">
                  <span>Total Fees</span>
                  <span>₹{student?.fees?.total ?? "-"}</span>
                </div>
                <div className="summary-row">
                  <span>Paid</span>
                  <span>₹{student?.fees?.paid ?? "-"}</span>
                </div>
                <div className="summary-row">
                  <span>Pending</span>
                  <span>₹{student?.fees?.pending ?? "-"}</span>
                </div>
                <div className="summary-row">
                  <span>Status</span>
                  <span>{student?.fees?.status ?? "-"}</span>
                </div>
                <div className="summary-row">
                  <span>Due Date</span>
                  <span>{student?.fees?.dueDate ? new Date(student.fees.dueDate).toLocaleDateString() : "-"}</span>
                </div>
              </section>
            )}

            {activeView === "notifications" && (
              <section className="info-panel">
                <h2>Notifications</h2>
                <ul className="notification-list">
                  {(student?.notifications || [])
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((note, idx) => (
                      <li key={idx} className="notification-item">
                        <div className="notification-title">{note.title}</div>
                        <div className="notification-meta">
                          {note.category} • {new Date(note.date).toLocaleDateString()}
                        </div>
                        <div className="notification-message">{note.message}</div>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {activeView === "settings" && (
              <section className="info-panel">
                <ProfileSettings student={student} />
              </section>
            )}
          </>
        )}
      </main>

      <aside className="analytics-panel">
        <div className="analytics-header">
          <h2>Student Performance</h2>
          <p className="muted">Performance analyzer & insights</p>
        </div>

        <div className="analytics-grid">
          <div className="card">
            <h3>Subject Attendance</h3>

            {subjectAttendanceData ? (
              <div className="relative h-52">
                <Doughnut
                  data={subjectAttendanceData}
                  options={{
                    responsive: true,
                    cutout: "70%",
                    rotation: -Math.PI,
                    circumference: Math.PI,
                    plugins: {
                      legend: { position: "bottom", labels: { color: "rgba(226,232,240,0.8)" } }
                    }
                  }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-3xl font-semibold text-white">{attendancePercent}%</div>
                  <div className="text-xs text-white/60">Overall Attendance</div>
                </div>
              </div>
            ) : (
              <p className="muted">Not enough attendance data to show subject chart.</p>
            )}
          </div>

          <div className="card">
            <h3>Quick Stats</h3>
            <div className="summary-row">
              <span>Current CGPA</span>
              <span>{student?.cgpa?.current ?? "-"}</span>
            </div>
            <div className="summary-row">
              <span>Total Subjects</span>
              <span>{totalSubjects}</span>
            </div>
            <div className="summary-row">
              <span>Backlogs</span>
              <span>{backlogCount}</span>
            </div>
            <div className="summary-row">
              <span>Attendance</span>
              <span>{attendancePercent}%</span>
            </div>
          </div>

          <div className="card">
            <h3>Next Important Event</h3>
            {nextExam ? (
              <>
                <p className="event-title">{nextExam.title}</p>
                <p className="muted">{new Date(nextExam.date).toLocaleDateString()}</p>
                <p className="muted">{nextExam.subjects.join(", ")}</p>
                <p className="muted">{nextExam.description}</p>
              </>
            ) : (
              <p className="muted">No upcoming exams scheduled.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
