import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;


const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // await api.post("/auth/signup", form);
      const res = await axios.post(`${API_URL}/api/auth/signup`, form);
      alert("Signup successful, please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-50 mx-auto mt-4">
      <h2>Sign Up</h2>
      {["name", "email", "mobileNumber", "password", "confirmPassword"].map((field) => (
        <div className="mb-2" key={field}>
          <input
            name={field}
            placeholder={field}
            type={field.includes("password") ? "password" : "text"}
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default Signup;
