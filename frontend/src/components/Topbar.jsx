export default function Topbar({ language = "English" }) {
  return (
    <header className="flex items-center justify-between gap-4 bg-midnight-200/80 p-4 shadow-card backdrop-blur">
      <div>
        <h1 className="text-xl font-semibold text-white">Workspace</h1>
        <p className="text-sm text-white/70">Manage your student’s academic progress</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
          {language}
        </div>
        <select
          className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white outline-none ring-0 focus:ring-2 focus:ring-accent"
          value={language}
          onChange={() => {}}
        >
          <option value="English">English</option>
          <option value="Español">Español</option>
          <option value="हिन्दी">हिन्दी</option>
        </select>
      </div>
    </header>
  );
}
