"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  phone: string | null;
  otpSent: boolean;
  loading: boolean;
  error: string | null;
  sendOtp: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedPhone = localStorage.getItem("phone");
    if (stored) setToken(stored);
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      if (phoneNumber.length < 10) {
        throw new Error("Enter a valid phone number");
      }

      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: "+91" + phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setPhone(phoneNumber);
      setOtpSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      if (!phone) {
        throw new Error("Phone number not found");
      }

      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "+91" + phone,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      const newToken = data.token || data.access_token || phone;
      localStorage.setItem("token", newToken);
      localStorage.setItem("phone", phone);
      
      // Set token in cookie for server-side authentication (proxy)
      document.cookie = `token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      setToken(newToken);
      setOtpSent(false);
      
      // Use replace to ensure smooth navigation
      router.replace("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to verify OTP";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    document.cookie = "token=; path=/; max-age=0";
    setToken(null);
    setPhone(null);
    setOtpSent(false);
    setError(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        phone,
        otpSent,
        loading,
        error,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
