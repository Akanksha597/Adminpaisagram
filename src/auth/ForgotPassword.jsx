import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // ================= Request OTP =================
  const requestOtp = async () => {
    if (!email) {
      toast.warning("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email,
      });

      toast.success(res.data.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ================= Reset Password =================
  const resetPassword = async () => {
    if (!otp) {
      toast.warning("Please enter OTP");
      return;
    }

    if (!newPass.newPassword || !newPass.confirmPassword) {
      toast.warning("Please fill all password fields");
      return;
    }

    if (newPass.newPassword !== newPass.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword: newPass.newPassword,
        confirmPassword: newPass.confirmPassword,
      });

      toast.success(res.data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="p-4 border rounded shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h4 className="text-center mb-4">Forgot Password</h4>

        {step === 1 ? (
          <>
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-warning w-100" onClick={requestOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="form-label fw-semibold">OTP</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter new password"
              value={newPass.newPassword}
              onChange={(e) =>
                setNewPass({ ...newPass, newPassword: e.target.value })
              }
            />

            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm new password"
              value={newPass.confirmPassword}
              onChange={(e) =>
                setNewPass({ ...newPass, confirmPassword: e.target.value })
              }
            />

            <button className="btn btn-success w-100" onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
