import React, { useState } from 'react';
// 1. Import your real Axios courier service
import { authService } from '../services/authService';

// 'props' allow us to pass the email from the login page to this page
interface SetPasswordProps {
  email: string;
  onSignup: () => void;
}

const SetPassword = ({ email, onSignup }: SetPasswordProps) => {
  // We create a local memory for the email, starting with whatever Login sent us
  const [localEmail, setLocalEmail] = useState(email); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'staff'>('student');

  const handleCreateAccount = async () => {
    try {
      //  2. Send the real package to Django
      const response = await authService.loginSync({
        email: localEmail,
        password: password,
        confirm_password: confirmPassword, // Sending in snake_case for Django
        role: role, // Mapping UI 'staff' to DB 'lecturer'
      });

      console.log('Signup started successfully!', response);
      
      // Switch to the "Check your email" success screen!
      onSignup(); 
      
    } catch (error: any) {
      //  3. Show the real backend error (e.g., "Passwords do not match")
      console.error("Signup failed:", error.response?.data || error.message);
      
      // Alert pops up on the screen so you don't have to guess why it failed
      const errorMessage = error.response?.data?.error || 
                           error.response?.data?.confirm_password || 
                           "Signup failed. Please check your details.";
      alert(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-semibold text-slate-800 text-center mb-2">
        First-Time Setup
      </h2>
      {/* If the original email prop is empty, show an input box. Otherwise, show text! */}
      {email === '' ? (
        <div className="mb-6 px-1">
          <label className="block text-sm font-medium text-slate-700 mb-1 text-left">University Email</label>
          <input 
            type="email" 
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      ) : (
        <p className="text-slate-500 text-center mb-8">
          Create an account for <span className="font-medium text-slate-700">{localEmail}</span>
        </p>
      )}
      

      <div className="space-y-4">
        {/* The Role Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-xl transition-all text-sm font-medium ${
              role === 'student'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('staff')}
            className={`flex-1 py-2 rounded-xl transition-all text-sm font-medium ${
              role === 'staff'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Lecturer
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={handleCreateAccount}
          className="w-full py-3 bg-[#1e3a8a] text-white font-semibold rounded-2xl hover:bg-blue-900 transition-colors mt-6"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default SetPassword;