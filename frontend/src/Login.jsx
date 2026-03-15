import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [regNo, setRegNo] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!regNo || !phone) {
      return alert("Please enter registration number and phone number.");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/send-otp", {
        regNo,
        phone
      });

      alert(res.data.message);
      if (res.data.success) setShowOtp(true);
    } catch (error) {
      console.error(error);
      alert("Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return alert("Please enter the OTP.");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        phone,
        otp
      });

      alert(res.data.message);
      if (res.data.success) {
        localStorage.setItem("parentRegNo", regNo);
        localStorage.setItem("parentPhone", phone);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>ParentBot</h1>
        <p>
          Track your child’s academic progress, attendance, and performance in one
          place.
        </p>
        <ul>
          <li>✔ Secure OTP login</li>
          <li>✔ Chatbot driven analytics</li>
          <li>✔ Attendance & marks overview</li>
        </ul>
      </div>

      <div className="right-panel">
        <h2>Welcome Back</h2>
        <p className="subtitle">Enter the student register number and parent mobile to continue.</p>

        <input
          className="input"
          placeholder="Registration Number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />

        <input
          className="input"
          placeholder="Parent Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="btn" onClick={sendOTP} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {showOtp && (
          <>
            <input
              className="input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="btn" onClick={verifyOTP} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;