import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Icon } from "../../chat/components";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const submitForm = async (event) => {
    event.preventDefault();
    const payload = { username, email, password };
    try {
      await handleRegister(payload);
      toast.success("Registration successful! Please check your email to verify account.");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="relative min-h-screen bg-[#050507] flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full bg-[#5ef58a]/10 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#00e8c6]/10 blur-[100px] animate-pulse [animation-delay:3s]" />
      </div>

      {/* 3-D Card — no hover transform jitter, only shadow + border glow */}
      <div className="
        relative z-10 w-full max-w-md
        rounded-[28px] px-10 py-11
        bg-gradient-to-br from-[#1c1e20]/95 to-[#0e1012]/98
        border border-[#9ffe9a]/[0.13]
        shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_60px_rgba(110,231,120,0.07)]
        transition-shadow duration-500
        hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.95),0_0_90px_rgba(110,231,120,0.16)]
        hover:border-[#9ffe9a]/25
      ">
        {/* top sheen line */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[#9ffe9a]/50 to-transparent rounded-full" />

        {/* Heading — single line, centered */}
        <div className="mb-8 text-center">
          <h1 className="text-[1.9rem] font-extrabold tracking-tight leading-tight">
            <span className="text-white">Create </span>
            <span className="bg-gradient-to-r from-[#9ffe9a] to-[#00e8c6] bg-clip-text text-transparent">
              Account.
            </span>
          </h1>
          <p className="mt-2 text-[0.8rem] text-white/40 font-normal tracking-wide">
            Register with your details below.
          </p>
        </div>

        <form onSubmit={submitForm} className="space-y-5">

          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40">
              Username
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 flex items-center">
                <Icon name="person" className="text-[1.1rem]" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                autoComplete="username"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#9ffe9a]/50 focus:bg-[#9ffe9a]/[0.04] focus:shadow-[0_0_0_3px_rgba(159,254,154,0.12)]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40">
              Email Address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 flex items-center">
                <Icon name="mail" className="text-[1.1rem]" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#9ffe9a]/50 focus:bg-[#9ffe9a]/[0.04] focus:shadow-[0_0_0_3px_rgba(159,254,154,0.12)]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white/40">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 flex items-center">
                <Icon name="lock" className="text-[1.1rem]" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-11 pr-11 py-3 text-white text-sm placeholder:text-white/20 outline-none transition-all duration-200 focus:border-[#9ffe9a]/50 focus:bg-[#9ffe9a]/[0.04] focus:shadow-[0_0_0_3px_rgba(159,254,154,0.12)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center p-1 text-white/30 hover:text-white/70 transition-colors duration-200"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-[1.1rem]" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full mt-2 py-3.5 rounded-[14px] bg-gradient-to-r from-[#9ffe9a] via-[#5ef58a] to-[#00e8c6] text-[#0a1a0a] text-[0.92rem] font-bold tracking-wide overflow-hidden shadow-[0_4px_20px_rgba(94,245,138,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(94,245,138,0.5)] hover:brightness-105 active:scale-[0.99] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="mt-7 text-center text-[0.79rem] text-white/35">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#9ffe9a] hover:text-[#acfebb] transition-colors duration-200"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;