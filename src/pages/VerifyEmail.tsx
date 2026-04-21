import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { authService } from "../services/authService"; // Adjust import path if needed

export default function VerifyEmail() {
  // Grab the unique token from the URL (e.g., /verify/abc-123)
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        if (!token) {
          setError("No verification token found.");
          return;
        }
        
        // 🚀 The Courier talks to Django silently
        const response = await authService.verifyEmail(token);
        
        // 🔑 SAVE THE TOKENS! (Adjust these keys to match how your app normally stores them)
        if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            // If you have a global store function like useAppStore.getState().setUser(), call it here!
        }

        // Find out where to send them based on their role
        const userRole = response.data.role;
        
        // Teleport them directly to their dashboard!
        if (userRole === "staff" || userRole === "lecturer") {
           navigate("/staff");
        } else {
           navigate("/student");
        }
        
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.response?.data?.error || "This verification link is invalid or has expired.");
      }
    };

    // Run this function the moment the page loads
    verifyAccount();
  }, [token, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {error ? (
        <div className="text-center space-y-4 max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-blue-900 transition-colors"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4 p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#1e3a8a]" />
          <h2 className="text-xl font-semibold text-slate-800">Securing your account...</h2>
          <p className="text-slate-500">Please wait while we log you in.</p>
        </div>
      )}
    </div>
  );
}