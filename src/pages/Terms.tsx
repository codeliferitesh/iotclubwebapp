import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-left relative z-10">
      <h1 className="font-space font-bold text-3xl sm:text-5xl text-white mb-6">Terms & Conditions</h1>
      <p className="text-xs text-gray-500 mb-8 font-mono">Last Updated: July 2026</p>
      
      <div className="space-y-6 text-sm text-gray-400 leading-relaxed">
        <p>
          Welcome to the official website of the IoT Club, VIT Bhopal University. By accessing or registering on our student portal, you agree to comply with the terms listed below.
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">1. Registration Criteria</h2>
        <p>
          Student sign-ups are strictly limited to active students of VIT Bhopal University holding a valid `@vitbhopal.ac.in` domain email. Any registrations using personal gmail or external email handlers are blocked automatically.
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">2. Event Attendance and Certificates</h2>
        <p>
          Certificates of attendance are issued electronically only to students who registered online, attended the workshops, and completed the check-in verification via QR scanner at the venue.
        </p>

        <h2 className="font-space font-bold text-xl text-white mt-8 mb-2">3. Portal Conduct</h2>
        <p>
          Students must ensure their profile information (registration number, name) is accurate. Any impersonation, scanning portal endpoints, or sharing QR codes maliciously will be reported to university administrators.
        </p>
      </div>
    </div>
  );
};
export default Terms;
