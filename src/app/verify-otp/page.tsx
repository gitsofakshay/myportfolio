"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AlertBar from "@/components/Alert";
import FullPageLoader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  // On mount, get email and newPassword from localStorage
  useEffect(() => {
    setEmail(localStorage.getItem("resetEmail") || "");
    setNewPassword(localStorage.getItem("resetNewPassword") || "");
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setAlert(null);
    try {
      // 1. Verify OTP
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Invalid OTP");
      // 2. Change password (now authenticated via cookie)
      const res2 = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data2 = await res2.json();
      if (!res2.ok || data2.error)
        throw new Error(data2.error || "Failed to change password");
      setIsVerified(true);
      setAlert({ type: "success", message: "Password changed successfully!" });
      // Clean up localStorage
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetNewPassword");
    } catch (err: any) {
      setAlert({
        type: "error",
        message:
          err.message || "Failed to verify OTP or change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        {!isVerified ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>
            {alert && <AlertBar type={alert.type} message={alert.message} />}
            {loading && <FullPageLoader />}
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-4 border rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleVerify}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !otp}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Password Changed Successfully!
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-6">
              You may now log in with your new password.
            </p>
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Go to Login Page
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
