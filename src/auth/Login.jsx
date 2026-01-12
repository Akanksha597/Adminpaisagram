import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Shreelogo from "../../src/assets/logo/Paisagramindia_Logo_.webp";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      login(res.data.token);
      toast.success("Login successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        onClose: () => navigate("/admin"),
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });
    }
  };

  return (
    <>
      <ToastContainer />

      <div
        className="vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{
          background: "linear-gradient(120deg, #1f1c2c, #928dab)",
          fontFamily: "'Poppins', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Animated Background */}
        <div className="position-absolute w-100 h-100 top-0 start-0">
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
              top: "-120px",
              left: "-120px",
              animation: "float 8s infinite alternate",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "50%",
              bottom: "-120px",
              right: "-60px",
              animation: "float 10s infinite alternate-reverse",
            }}
          />
        </div>

        {/* Login Card */}
        <div
          className="p-4 p-sm-5 rounded-4"
          style={{
            maxWidth: "380px",
            width: "90%",
            backdropFilter: "blur(15px)",
            background: "rgba(0, 0, 0, 0.125)",
            boxShadow: "0 8px 32px rgba(31,38,135,0.37)",
            zIndex: 2,
            color: "#fff",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-4">
            <img src={Shreelogo} alt="Logo" style={{ width: "150px" }} />
            <h2 className="mt-3 fw-bold">Sign In</h2>
            <p className="text-light small">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                name="email"
                className="form-control bg-transparent text-white border-light"
                id="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email" className="text-light">
                Email
              </label>
            </div>

            <div className="form-floating mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control bg-transparent text-white border-light"
                id="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password" className="text-light">
                Password
              </label>

              <span
                className="position-absolute top-50 end-0 translate-middle-y pe-3"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
                ></i>
              </span>
            </div>

            <div className="d-flex justify-content-end mb-4">
              <button
                type="button"
                className="btn btn-link p-0 text-light small text-decoration-none"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold"
              style={{
                background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
                color: "#fff",
                fontSize: "16px",
                transition: "0.3s",
              }}
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <small className="text-light-50">
              © 2026 NewgenSoftTech. All rights reserved.
            </small>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(50px); }
          }

          .form-control:focus {
            box-shadow: none;
            border-color: #ff416c;
          }

          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          }

          @media (max-width: 576px) {
            h2 {
              font-size: 1.6rem;
            }

            p {
              font-size: 0.85rem;
            }

            .btn {
              font-size: 15px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Login;
