import React, { useMemo, useState } from 'react';
import './ProfileSettings.css';

export default function ProfileSettings({ student }) {
  const parentName = student?.parentName ?? '--';
  const parentEmail = student?.parentEmail ?? '--';
  const parentPhone = student?.parentPhone ?? '--';

  const studentName = student?.name ?? '--';
  const studentRegNo = student?.regNo ?? '--';
  const studentDept = student?.department ?? '--';
  const studentYear = student?.year ?? '--';
  const studentCgpa = student?.cgpa?.current ?? '--';

  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [notifyExams, setNotifyExams] = useState(true);

  const notificationSettings = useMemo(
    () => [
      {
        key: 'notifyAttendance',
        label: 'Attendance Alerts',
        desc: 'Get notified when attendance drops below 75%',
        enabled: notifyAttendance,
        toggle: () => setNotifyAttendance((prev) => !prev),
      },
      {
        key: 'notifyExams',
        label: 'Exam Notifications',
        desc: 'Receive reminders for upcoming exams and results',
        enabled: notifyExams,
        toggle: () => setNotifyExams((prev) => !prev),
      },
    ],
    [notifyAttendance, notifyExams]
  );

  return (
    <div className="settings-root">
      <header className="settings-header">
        <p className="settings-subtitle">Settings</p>
        <h2 className="settings-title">Profile Settings</h2>
        <p className="settings-description">
          Your workspace information is read-only. Use toggles to control notification settings.
        </p>
      </header>

      <div className="settings-content">
        <section className="settings-card">
          <div className="settings-card-header">
            <h3>Parent Information</h3>
            <span className="settings-card-badge">Account</span>
          </div>

          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Full Name</span>
              <span className="info-value">{parentName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{parentEmail}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{parentPhone}</span>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <h3>Linked Student</h3>
            <span className="settings-card-badge">Active</span>
          </div>

          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">{studentName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Reg No</span>
              <span className="info-value">{studentRegNo}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Department</span>
              <span className="info-value">{studentDept}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Year</span>
              <span className="info-value">{studentYear}</span>
            </div>
            <div className="info-row">
              <span className="info-label">CGPA</span>
              <span className="info-value">{studentCgpa}</span>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <h3>Notification Settings</h3>
            <span className="settings-card-badge">Alerts</span>
          </div>

          <div className="settings-grid">
            {notificationSettings.map(({ key, label, desc, enabled, toggle }) => (
              <div key={key} className="settings-toggle">
                <div className="settings-toggle-text">
                  <p className="settings-label">{label}</p>
                  <p className="settings-help">{desc}</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={enabled} onChange={toggle} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
