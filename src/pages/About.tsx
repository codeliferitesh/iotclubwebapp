import React, { useState, useEffect } from 'react';
import { ShieldCheck, Target, Award, Milestone, Calendar, Cpu, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import facultyImage from '../faculty.jpeg';

const iotFacts = [
  {
    id: 1,
    title: "Global Scale",
    fact: "By 2030, it is estimated that there will be over 29 billion IoT devices active worldwide, almost triple the number in 2020.",
    category: "Statistics"
  },
  {
    id: 2,
    title: "The First IoT Device",
    fact: "The concept of IoT dates back to 1982, when a modified Coca-Cola machine at Carnegie Mellon University became the first connected appliance, reporting its inventory and temperature.",
    category: "History"
  },
  {
    id: 3,
    title: "Smart Agriculture",
    fact: "IoT in agriculture uses smart sensors to monitor soil moisture and nutrients, helping farmers reduce water usage by up to 30% while increasing crop yields.",
    category: "Application"
  },
  {
    id: 4,
    title: "Coining the Term",
    fact: "The name 'Internet of Things' was coined by Kevin Ashton in 1999 during his presentation at Procter & Gamble (P&G).",
    category: "History"
  },
  {
    id: 5,
    title: "Edge AI & IoT",
    fact: "Edge Computing is transforming IoT by processing data closer to where it is generated, drastically reducing latency and bandwidth requirements.",
    category: "Technology"
  },
  {
    id: 6,
    title: "Smart Grids",
    fact: "Smart grids, powered by IoT, can automatically reroute electricity during blackouts, reducing outages and optimizing power distribution.",
    category: "Infrastructure"
  },
  {
    id: 7,
    title: "Wearable Health Tech",
    fact: "Wearable health monitors can track vitals in real-time, sending automatic alerts to healthcare providers before critical medical emergencies occur.",
    category: "Healthcare"
  }
];

export const About: React.FC = () => {
  const [currentFactIdx, setCurrentFactIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFactIdx((prev) => (prev + 1) % iotFacts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentFactIdx((prev) => (prev + 1) % iotFacts.length);
  };

  const handlePrev = () => {
    setCurrentFactIdx((prev) => (prev - 1 + iotFacts.length) % iotFacts.length);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Page Header */}
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">WHO WE ARE</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">About IoT Club</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          The IoT Club at VIT Bhopal University is a student-run technical organization dedicated to cultivating expertise in hardware prototyping, embedded computing, sensor networking, and cyber-physical security.
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-2xl glass-premium border border-white/10 flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 w-12 h-12 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-space font-bold text-2xl text-white">Our Vision</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            To build a vibrant ecosystem of hardware engineers and software developers who collaborate to build smart systems that solve environmental, operational, and commercial challenges.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-premium border border-white/10 flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-12 h-12 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-space font-bold text-2xl text-white">Our Mission</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            To supply students with microcontrollers, tools, and testing benches; hold training bootcamps; support prototyping; and link members to leading experts in IoT and Edge AI.
          </p>
        </div>
      </div>

      {/* Faculty Message */}
      <div className="rounded-2xl glass-premium border border-white/10 p-8 md:p-12 mb-20 flex flex-col md:flex-row items-center gap-8">
        <img
          src={facultyImage}
          alt="Faculty Coordinator"
          className="w-24 h-24 rounded-full object-cover border border-white/10"
        />
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">FACULTY COORDINATOR MESSAGE</span>
          <h3 className="font-space font-bold text-2xl text-white mb-2">Ashfaq Ahmad Najar</h3>
          <p className="text-sm text-gray-400 leading-relaxed italic mb-4">
            "The rapid convergence of embedded hardware and cloud compute calls for engineers who are comfortable building in both domains. The IoT Club offers students the exact sandbox needed to bridge these worlds and innovate."
          </p>
          <span className="text-xs font-semibold text-gray-500">School of Computing Science and Engineering, VIT Bhopal</span>
        </div>
      </div>

      {/* Core Objectives */}
      <div className="mb-20">
        <h2 className="font-space font-bold text-3xl text-white mb-8 text-center md:text-left">Club Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Practical Learning', desc: 'Move beyond slide decks. We configure nodes, wire shields, solder circuits, and write firmware.' },
            { title: 'Collaboration', desc: 'Pair hardware designers with web builders and cloud architects to form cross-functional groups.' },
            { title: 'Industry Linkage', desc: 'Secure industry sponsorships, organize technical lectures, and prepare students for core IoT roles.' }
          ].map((obj, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-3">
              <span className="text-cyan-400 font-space font-bold text-lg">0{i+1}.</span>
              <h4 className="font-space font-bold text-lg text-white">{obj.title}</h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IoT Facts Carousel */}
      <div className="mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">DID YOU KNOW?</span>
          <h2 className="font-space font-bold text-3xl sm:text-4xl text-white mt-2">Fascinating IoT Facts</h2>
          <p className="text-sm text-gray-400 mt-2">Discover how the Internet of Things is shaping our world.</p>
        </div>

        <div className="relative max-w-3xl mx-auto px-4">
          <div className="relative rounded-2xl glass-premium border border-white/10 p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-spaceBlack/50 via-white/5 to-cyan-500/5">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="h-48 sm:h-40 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFactIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 uppercase tracking-wider">
                      {iotFacts[currentFactIdx].category}
                    </span>
                    <span className="text-xs font-mono text-gray-500">
                      {currentFactIdx + 1} / {iotFacts.length}
                    </span>
                  </div>

                  <div className="flex gap-4 items-start mt-2">
                    <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 mt-1 shrink-0">
                      <Lightbulb className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-space font-bold text-lg text-white mb-2">
                        {iotFacts[currentFactIdx].title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {iotFacts[currentFactIdx].fact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition duration-200"
                aria-label="Previous fact"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition duration-200"
                aria-label="Next fact"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-play progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
              <motion.div
                key={currentFactIdx}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
