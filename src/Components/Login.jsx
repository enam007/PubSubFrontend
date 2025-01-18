import { useEffect, useState } from "react";
import axios, { axiosWithCredentials } from "../api/axios";
import useAuth from "../hooks/useAuth.js";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { VERIFY_OTP_URL, RESEND_OTP_URL } from "../constant";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(RESEND_OTP_URL, { email });
      setOtpSent(true);
      setMessage("OTP sent to your email. Please check your inbox.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axiosWithCredentials.post(VERIFY_OTP_URL, {
        email,
        otp,
      });
      const accessToken = response?.data?.data?.accessToken;
      const Id = response?.data?.data?.user._id;
      setAuth({ email, accessToken, Id }); //TODO also store roles for role based login
      console.log(accessToken);

      setMessage("Login successful!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-md w-96">
        <h1 className="text-xl font-bold text-center mb-4">Login</h1>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-2 border rounded-md"
                placeholder="Enter the OTP"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Verify OTP
            </button>
          </form>
        )}
        {otpSent && (
          <button
            className=" p-2 m-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSendOtp}
          >
            Resend
          </button>
        )}
        <div className="">
          <input
            className="m-2"
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist" className="text-red-500 text-sm mt-3">
            Remember Me
          </label>
        </div>
        {message && <p className="text-green-500 text-sm mt-3">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
