import React from 'react';
import { MailCheck } from 'lucide-react'; // This is a nice icon for the "Check Email" vibe

interface SignupSuccessProps {
  email: string;
}

const SignupSuccess = ({ email }: SignupSuccessProps) => {
  return (
    <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
      {/* Icon Container */}
      <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        <MailCheck size={32} />
      </div>

      <h2 className="text-2xl font-semibold text-slate-800 mb-3">
        Check your email
      </h2>
      
      <p className="text-slate-500 leading-relaxed mb-8">
        We've sent a verification link to <br />
        <span className="font-semibold text-slate-700">{email}</span>. 
        Please click the link in the email to finish your registration.
      </p>

      <div className="pt-6 border-t border-slate-100">
        <p className="text-sm text-slate-400">
          Didn't receive it? Check your spam folder or try again in a few minutes.
        </p>
      </div>
    </div>
  );
};

export default SignupSuccess;