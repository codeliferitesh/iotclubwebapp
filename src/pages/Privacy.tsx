import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-left relative z-10">
      <h1 className="font-space font-bold text-3xl sm:text-5xl text-white mb-6">Privacy Policy</h1>
      <p className="text-xs text-gray-500 mb-8 font-mono">Last Updated: July 2026</p>
      
      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <p>
          At the IoT Club, VIT Bhopal University, accessible from our official portal, one of our main priorities is the privacy of our student members. This Privacy Policy document contains types of information that is collected and recorded by our portal and how we use it.
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">1. Information We Collect</h2>
        <p>
          If you register on our student portal, we collect details including your name, registration number, branch, year of study, skills, profile picture, and your university-issued email address (`@vitbhopal.ac.in`).
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">2. How We Use Your Information</h2>
        <p>
          We use the information we collect to manage your club membership, issue event check-in QR codes, generate workshop certificates, distribute push announcements, and email newsletters.
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">3. Security</h2>
        <p>
          We leverage Firebase client-side security rules to isolate personal student files and databases from malicious access. Only authenticated executives and club administrators have administrative access to user profiles.
        </p>
      </div>
    </div>
  );
};
export default Privacy;
