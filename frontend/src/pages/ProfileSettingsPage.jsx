import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const dummy = {
  parent: {
    name: "Ramesh K",
    email: "ramesh.k@example.com",
    phone: "9123456789",
  },
  student: {
    name: "Jyoshna",
    regNo: "231FA04131",
    department: "Computer Science",
    year: "2nd Year",
    cgpa: "8.5",
  },
};

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4 py-3 border-b border-white/10">
      <div className="text-sm font-semibold text-white/70">{label}</div>
      <div className="text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function Card({ title, badge, children }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/15 shadow-card backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {badge && (
          <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
            {badge}
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-midnight-100 text-white">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <div className="rounded-2xl bg-white/5 px-8 py-10 shadow-card backdrop-blur">
                <h1 className="text-3xl font-semibold text-white">Profile Settings</h1>
                <p className="mt-2 text-sm text-white/70">
                  Manage account details and notification preferences in one place.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Parent Information" badge="Account">
                  <InfoRow label="Full Name" value={dummy.parent.name} />
                  <InfoRow label="Email" value={dummy.parent.email} />
                  <InfoRow label="Phone" value={dummy.parent.phone} />
                </Card>

                <Card title="Linked Student" badge="Active">
                  <InfoRow label="Name" value={dummy.student.name} />
                  <InfoRow label="Reg No" value={dummy.student.regNo} />
                  <InfoRow label="Department" value={dummy.student.department} />
                  <InfoRow label="Year" value={dummy.student.year} />
                  <InfoRow label="Current CGPA" value={dummy.student.cgpa} />
                </Card>
              </div>

              <Card title="Notification Preferences" badge="Alerts">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-semibold text-white">Attendance Alerts</div>
                      <div className="text-xs text-white/60">Get notified when attendance drops below 75%.</div>
                    </div>
                    <button className="h-9 w-16 rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20">
                      <span className="block h-full w-full rounded-full bg-white/60" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                    <div>
                      <div className="text-sm font-semibold text-white">Exam Notifications</div>
                      <div className="text-xs text-white/60">Receive reminders for upcoming exams and results.</div>
                    </div>
                    <button className="h-9 w-16 rounded-full bg-white/10 ring-1 ring-white/20 transition hover:bg-white/20">
                      <span className="block h-full w-full rounded-full bg-white/60" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
