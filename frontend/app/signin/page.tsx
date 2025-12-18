"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { sendOtp, verifyOtp, otpSent, loading, error } = useAuth();
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp(phone);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // allow digits only

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are filled
    if (value && index === 3) {
      setTimeout(() => handleVerifyOtp(newOtp.join("")), 100);
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpValue?: string) => {
    const otpString = otpValue || otp.join("");
    if (otpString.length !== 4) {
      alert("Please enter all 4 digits");
      return;
    }

    try {
      await verifyOtp(otpString);
      // The redirect is handled in the AuthContext
    } catch (err) {
      // Error is handled in context
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) return; // Only digits allowed

    const digits = pasted.split("").slice(0, 4 - index);

    const newOtp = [...otp];
    digits.forEach((d, i) => {
      if (index + i < 4) newOtp[index + i] = d;
    });

    setOtp(newOtp);

    // Auto-submit if we have all 4 digits
    if (newOtp.join("").length === 4) {
      setTimeout(() => handleVerifyOtp(newOtp.join("")), 100);
    } else {
      // Focus next empty box
      const nextIndex = Math.min(index + digits.length, 3);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-6" style={{ backgroundImage: "url('/uploads/heroBackgroudImg.png')" }}>
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-sans mb-2 text-white">
          JOBuzz
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Sign in with your phone number
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>

              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-zinc-800 border text-zinc-500 border-zinc-700 rounded-lg text-sm font-medium whitespace-nowrap">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPhone(val.slice(0, 10));
                  }}
                  placeholder="10-digit number"
                  maxLength={10}
                  className="w-full px-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-2 bg-white text-black rounded-lg font-medium hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter OTP
              </label>
              <p className="text-xs text-gray-400 mb-4">
                A 4-digit OTP has been sent to +91{phone}
              </p>

              {/* OTP Input Boxes */}
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    onPaste={(e) => handlePaste(e, index)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-zinc-700 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={() => handleVerifyOtp()}
              disabled={loading || otp.join("").length !== 4}
              className="w-full py-2 bg-white text-black rounded-lg font-medium hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP */}
            <button
              onClick={() => {
                setOtp(["", "", "", ""]);
                handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
              }}
              disabled={loading}
              className="w-full py-2 text-white border border-zinc-700 rounded-lg font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Resend OTP
            </button>

            {/* Edit Phone Number */}
            <button
              onClick={() => {
                setPhone("");
                setOtp(["", "", "", ""]);
                window.location.reload();
              }}
              disabled={loading}
              className="w-full py-2 text-sm text-gray-400 hover:text-white"
            >
              Edit Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
