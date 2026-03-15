import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Dummy data
const dummyAttendance = {
  dayWise: [
    { date: "2024-03-15", periods: ["P", "P", "A", "P", "P", "P", "A"] },
    { date: "2024-03-14", periods: ["P", "A", "P", "P", "P", "A", "P"] },
    { date: "2024-03-13", periods: ["P", "P", "P", "A", "P", "P", "P"] },
    { date: "2024-03-12", periods: ["A", "P", "P", "P", "A", "P", "P"] },
    { date: "2024-03-11", periods: ["P", "P", "A", "P", "P", "P", "A"] },
    { date: "2024-03-10", periods: ["P", "A", "P", "P", "P", "A", "P"] },
    { date: "2024-03-09", periods: ["P", "P", "P", "A", "P", "P", "P"] },
  ],
  subjectWise: [
    { subject: "Data Structures", conducted: 45, attended: 40 },
    { subject: "Algorithms", conducted: 42, attended: 38 },
    { subject: "Database Systems", conducted: 48, attended: 44 },
    { subject: "Operating Systems", conducted: 40, attended: 35 },
    { subject: "Computer Networks", conducted: 46, attended: 41 },
  ],
  semesterWise: [
    { semester: "Semester 1", percentage: 85 },
    { semester: "Semester 2", percentage: 82 },
    { semester: "Semester 3", percentage: 88 },
    { semester: "Semester 4 (Current)", percentage: 78 },
  ],
  stats: {
    currentCgpa: 8.2,
    totalSubjects: 24,
    overallAttendance: 83,
    requiredFor75: 12,
  },
};

function StatCard({ title, value, subtitle, color = "accent" }) {
  const colorClasses = {
    accent: "text-accent",
    green: "text-green-400",
    purple: "text-purple-400",
    orange: "text-orange-400",
  };

  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur">
      <div className="text-sm font-medium text-white/70">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]} mt-2`}>{value}</div>
      {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
    </div>
  );
}

function AttendanceTable({ data, title }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 shadow-card backdrop-blur">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-white/70 font-medium">Date</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">1Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">2Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">3Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">4Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">5Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">6Hr</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">7Hr</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 px-2 text-white font-medium">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  {day.periods.map((period, i) => (
                    <td key={i} className="text-center py-3 px-2">
                      <span
                        className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          period === "P"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {period}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubjectTable({ data }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 shadow-card backdrop-blur">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Subject-wise Attendance</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-white/70 font-medium">Subject</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">Conducted</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">Attended</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((subject, index) => {
                const percentage = Math.round((subject.attended / subject.conducted) * 100);
                return (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-2 text-white font-medium">{subject.subject}</td>
                    <td className="text-center py-3 px-2 text-white/70">{subject.conducted}</td>
                    <td className="text-center py-3 px-2 text-white/70">{subject.attended}</td>
                    <td className="text-center py-3 px-2">
                      <span className={`font-bold ${percentage >= 75 ? "text-green-400" : "text-red-400"}`}>
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SemesterTable({ data }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 shadow-card backdrop-blur">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Semester-wise Attendance</h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-white/70 font-medium">Semester</th>
                <th className="text-center py-3 px-2 text-white/70 font-medium">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sem, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3 px-2 text-white font-medium">{sem.semester}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`font-bold ${sem.percentage >= 75 ? "text-green-400" : "text-red-400"}`}>
                      {sem.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const overallAttendance = dummyAttendance.stats.overallAttendance;
  const totalClasses = dummyAttendance.subjectWise.reduce((sum, sub) => sum + sub.conducted, 0);
  const attendedClasses = dummyAttendance.subjectWise.reduce((sum, sub) => sum + sub.attended, 0);
  const absentClasses = totalClasses - attendedClasses;

  const chartData = {
    labels: ["Attended", "Absent"],
    datasets: [
      {
        data: [attendedClasses, absentClasses],
        backgroundColor: ["#10B981", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-midnight-100 text-white">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Attendance Management</h1>
              <p className="text-white/70">Track your attendance across subjects and semesters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Current CGPA"
                value={dummyAttendance.stats.currentCgpa}
                color="accent"
              />
              <StatCard
                title="Total Subjects"
                value={dummyAttendance.stats.totalSubjects}
                color="green"
              />
              <StatCard
                title="Overall Attendance"
                value={`${overallAttendance}%`}
                color="purple"
              />
              <StatCard
                title="Classes to Attend (75%)"
                value={dummyAttendance.stats.requiredFor75}
                subtitle="to reach 75% attendance"
                color="orange"
              />
            </div>

            {/* Overall Attendance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white mb-4">Overall Attendance</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Total Classes</span>
                    <span className="text-white font-medium">{totalClasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Attended</span>
                    <span className="text-green-400 font-medium">{attendedClasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Absent</span>
                    <span className="text-red-400 font-medium">{absentClasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Percentage</span>
                    <span className="text-accent font-bold">{overallAttendance}%</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${overallAttendance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white mb-4">Attendance Chart</h2>
                <div className="h-64">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Day-wise Attendance */}
            <div className="mb-8">
              <AttendanceTable data={dummyAttendance.dayWise} title="Day-wise Attendance" />
            </div>

            {/* Subject-wise and Semester-wise */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubjectTable data={dummyAttendance.subjectWise} />
              <SemesterTable data={dummyAttendance.semesterWise} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}