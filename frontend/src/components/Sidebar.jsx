import { NavLink } from "react-router-dom";

const navItems = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { key: "profile", label: "Student Profile", to: "/dashboard", icon: "👤" },
  { key: "academic", label: "Academic Performance", to: "/dashboard", icon: "📊" },
  { key: "attendance", label: "Attendance", to: "/attendance", icon: "✅" },
  { key: "fees", label: "Fee Status", to: "/dashboard", icon: "💰" },
  { key: "notifications", label: "Notifications", to: "/dashboard", icon: "🔔" },
  { key: "settings", label: "Settings", to: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="h-full w-64 flex-shrink-0 bg-midnight-200 border-r border-white/10 p-5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="text-2xl font-bold text-white">EduBot</div>
          <p className="text-xs text-white/70">Student Intelligence</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white ${
                isActive ? "bg-accent/20 text-white" : ""
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-10">
        <div className="text-xs text-white/50">Logged in as</div>
        <div className="mt-2 font-semibold text-white">Parent User</div>
        <div className="text-xs text-white/50">9123456789</div>
      </div>
    </aside>
  );
}
