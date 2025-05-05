import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Optional: decode JWT if you want to use it
// import jwtDecode from "jwt-decode";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Verify email and password
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "https://rfpdemo.velsof.com/api/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;
      const token = data?.token;
      const userId = data?.user_id;
      console.log(data);

      if (token && userId) {
        // Store token and user ID in localStorage
        localStorage.setItem("token", `Bearer ${token}`);
        localStorage.setItem("user_id", userId); // Save as string if needed
        console.log(token);
        navigate("/dashboard");
      } else {
        alert("Login failed: Required data not found");
      }
    } catch (error) {
      alert(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-gray-100">
      <div className="w-full max-w-md">
        <div className="card overflow-hidden shadow-lg rounded-lg">
          <div className="bg-blue-50 p-4 text-blue-600">
            <h5 className="text-xl font-semibold">Welcome to RFP System!</h5>
            <p>Sign in to continue</p>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control w-full px-3 py-2 border rounded ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="form-group mb-3">
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={`form-control w-full px-3 py-2 border rounded ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center mb-3">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-2 text-white"
              >
                Log In
              </button>

              <div className="text-center mt-4">
                <h5 className="text-sm mb-2">Sign in with</h5>
                <div className="flex justify-center space-x-3">
                  <a className="bg-blue-600 text-white p-2 rounded" href="#">
                    <i className="mdi mdi-facebook"></i>
                  </a>
                  <a className="bg-sky-400 text-white p-2 rounded" href="#">
                    <i className="mdi mdi-twitter"></i>
                  </a>
                  <a className="bg-red-600 text-white p-2 rounded" href="#">
                    <i className="mdi mdi-google"></i>
                  </a>
                </div>
              </div>

              <div className="mt-4 text-center">
                <a href="/register" className="text-sm text-muted">
                  <i className="mdi mdi-lock mr-1"></i> Register as Vendor
                </a>
              </div>

              <div className="mt-2 text-center">
                <a href="#" className="text-sm text-muted">
                  <i className="mdi mdi-lock mr-1"></i> Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
        <p className="text-center mt-5 text-sm text-gray-500">
          &copy; RFP System <i className="mdi mdi-heart text-danger"></i>
        </p>
      </div>
    </div>
  );
};

export default Login;
