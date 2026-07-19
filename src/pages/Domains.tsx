import React, { useState } from 'react';
import { Cpu, ShieldAlert, Cpu as Microchip, Landmark, Zap, Code, HardDrive, Compass } from 'lucide-react';

export const Domains: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState(0);

  const domainList = [
    {
      title: 'Internet of Things (IoT)',
      icon: <Cpu className="w-6 h-6" />,
      desc: 'Integrating microcontrollers, sensors, and gateway channels to transmit environmental metrics.',
      tools: ['MQTT', 'CoAP', 'ESP32', 'Raspberry Pi', 'LoRaWAN', 'InfluxDB'],
      roadmap: ['Sensing & Signals', 'Local Data Logging', 'Wireless Transmission', 'Cloud Dashboards'],
      careers: ['IoT Solutions Architect', 'Embedded Web Developer']
    },
    {
      title: 'Embedded Systems & Electronics',
      icon: <Microchip className="w-6 h-6" />,
      desc: 'Low-level C/C++ firmware compiler builds, hardware architectures, and real-time execution kernels.',
      tools: ['FreeRTOS', 'KiCad', 'STM32', 'Bare-metal C', 'Oscilloscopes', 'SPI/I2C'],
      roadmap: ['Digital Electronics', 'Microcontroller Architectures', 'RTOS Scheduling', 'Hardware Debugging'],
      careers: ['Firmware Engineer', 'Electronics Hardware Design Engineer']
    },
    {
      title: 'Robotics & Automation',
      icon: <Zap className="w-6 h-6" />,
      desc: 'Designing autonomous motorized chassis incorporating sensor fusion and spatial mapping algorithms.',
      tools: ['ROS 2', 'LiDAR', 'OpenCV', 'IMUs', 'Python', 'Arduino Mega'],
      roadmap: ['Motor Kinematics', 'Sensor Data Processing', 'SLAM Prototyping', 'Autonomous Navigation'],
      careers: ['Robotics Software Engineer', 'Automation Lead']
    },
    {
      title: 'Edge AI & Cloud IoT',
      icon: <Compass className="w-6 h-6" />,
      desc: 'Deploying neural networks directly onto cheap microcontroller nodes for local inference.',
      tools: ['TensorFlow Lite', 'TinyML', 'AWS IoT Core', 'Grafana', 'Node-RED', 'Edge Impulse'],
      roadmap: ['ML Model Reduction', 'Microcontroller Inference', 'MQTT Broker Routing', 'Analytics & Alerts'],
      careers: ['Edge AI Engineer', 'Cloud-IoT Architect']
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-left relative z-10">
      {/* Header */}
      <div className="mb-16 text-center md:text-left">
        <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">DOMAINS OF STUDY</span>
        <h1 className="font-space font-bold text-4xl sm:text-6xl text-white mt-2 mb-6">Technical Verticals</h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed">
          The IoT Club organizes educational tracks across multiple engineering sectors. Toggle the domains below to view learning roadmaps, tools, and career paths.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation List */}
        <div className="flex flex-col gap-3">
          {domainList.map((dom, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDomain(idx)}
              className={`p-5 rounded-xl border text-left flex items-center gap-4 transition-all duration-300 ${
                activeDomain === idx 
                  ? 'glass border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'border-white/5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeDomain === idx ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5'}`}>
                {dom.icon}
              </div>
              <span className="font-space font-bold text-sm sm:text-base">{dom.title}</span>
            </button>
          ))}
        </div>

        {/* Detailed Pane */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl glass-premium border border-white/10 flex flex-col gap-8">
          <div>
            <h2 className="font-space font-bold text-2xl sm:text-3xl text-white mb-3">
              {domainList[activeDomain].title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              {domainList[activeDomain].desc}
            </p>
          </div>

          {/* Tools Grid */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">CORE TOOLS & TECHNOLOGY</h3>
            <div className="flex flex-wrap gap-2.5">
              {domainList[activeDomain].tools.map((tool) => (
                <span 
                  key={tool} 
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/5 text-gray-300"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Roadmap */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">LEARNING ROADMAP</h3>
            <div className="relative pl-6 border-l border-white/10 flex flex-col gap-5">
              {domainList[activeDomain].roadmap.map((step, sIdx) => (
                <div key={sIdx} className="relative flex items-center gap-3">
                  <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-cyan-400 border-4 border-spaceBlack" />
                  <span className="font-mono text-xs text-cyan-400">Step 0{sIdx+1}.</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">CAREER OPPORTUNITIES</h3>
            <div className="flex flex-col gap-2">
              {domainList[activeDomain].careers.map((career, cIdx) => (
                <div key={cIdx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-medium">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  {career}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Domains;
