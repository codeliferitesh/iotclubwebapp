import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db, isDemoMode } from './firebase';
import { 
  UserProfile, 
  TeamMember, 
  IoTEvent, 
  EventRegistration, 
  GalleryItem, 
  ProjectItem, 
  BlogItem, 
  Announcement, 
  ResourceItem, 
  Sponsor, 
  Testimonial, 
  ContactMessage, 
  AchievementItem 
} from '../types';

// ==========================================
// PREPOPULATED MOCK DATA FOR DEMO MODE
// ==========================================

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 't1',
    name: 'Rhythm Dangar',
    position: 'President',
    teamName: 'Panel',
    bio: 'IoT enthusiast and visionary, leading the club towards technical excellence and innovation.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    email: 'rhythm.dangar2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    order: 1
  },
  {
    id: 't2',
    name: 'Devansh Rai',
    position: 'Vice-President',
    teamName: 'Panel',
    bio: 'Embedded hardware architect. Dedicated to organizing hands-on technical labs and development projects.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    email: 'devansh.rai2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    order: 2
  },
  {
    id: 't3',
    name: 'Pratyush Dubey',
    position: 'Chairperson',
    teamName: 'Panel',
    bio: 'AI-IoT integration specialist. Focused on streamlining club activities and industry-academic alignment.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    email: 'pratyush.dubey2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    order: 3
  },
  {
    id: 't4',
    name: 'Sanyogita Rajput',
    position: 'Joint Secretary',
    teamName: 'Panel',
    bio: 'Project manager and robotics developer. Coordinating smooth execution of inter-university hackathons.',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    email: 'sanyogita.rajput2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    order: 4
  },
  {
    id: 't5',
    name: 'Smruti Sagar Sethy',
    position: 'Lead',
    teamName: 'Media & Photography',
    bio: 'Visual designer and videographer captures moments and crafts modern media contents.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    email: 'smrutisagar.sethy2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 5
  },
  {
    id: 't6',
    name: 'Maanya Dadlani',
    position: 'Lead',
    teamName: 'Content',
    bio: 'Creative copywriter and editor managing club news, documentation, and educational resources.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    email: 'maanya.dadlani22@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 6
  },
  {
    id: 't7',
    name: 'Umanshi Goyal',
    position: 'Lead',
    teamName: 'Design',
    bio: 'UX/UI designer creating dark-mode layouts, high-fidelity mockups, and glassmorphic graphics.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    email: 'umanshi.goyal2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 7
  },
  {
    id: 't8',
    name: 'Smriti Singh',
    position: 'Co-Lead',
    teamName: 'Design',
    bio: 'Framer/Figma designer building premium components and micro-interactions.',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    email: 'smriti.singh2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 8
  },
  {
    id: 't9',
    name: 'Ritesh Kumar Verma',
    position: 'Lead',
    teamName: 'Technical',
    bio: 'Fullstack developer, IoT architect, ESP32 and Edge AI enthusiast.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    email: 'ritesh.kumar2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    order: 9
  },
  {
    id: 't10',
    name: 'Shagun Singh',
    position: 'Lead',
    teamName: 'Event Management',
    bio: 'Operations and logistics coordinator planning technical bootcamps and speaker sessions.',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    email: 'shagun.singh22@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 10
  },
  {
    id: 't11',
    name: 'Manthan Chandrawanshi',
    position: 'Co-Lead',
    teamName: 'Event Management',
    bio: 'IoT workshop organizer helping with component management and venue setups.',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    email: 'manthan.chandra2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 11
  },
  {
    id: 't12',
    name: 'Deepanshu',
    position: 'Lead',
    teamName: 'Social Media',
    bio: 'Growth hacker managing Instagram and LinkedIn outreach to expand club membership.',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    email: 'deepanshu22@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 12
  },
  {
    id: 't13',
    name: 'Saurish Modgil',
    position: 'Lead',
    teamName: 'PR & Outreach',
    bio: 'Public relations representative securing sponsorships and coordinating industry expert panels.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    email: 'saurish.modgil2022@vitbhopal.ac.in',
    linkedin: 'https://linkedin.com',
    order: 13
  }
];

const INITIAL_EVENTS: IoTEvent[] = [
  {
    id: 'e1',
    title: 'IoT-a-Thon 2026',
    description: 'VIT Bhopal\'s flagship 36-hour physical IoT hackathon. Build smart, connected solutions for environmental sustainability, smart cities, and healthcare using ESP32, Raspberry Pi, and Cloud services.',
    type: 'hackathon',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    location: 'Central Block, VIT Bhopal',
    countdownTarget: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    status: 'upcoming',
    slots: 200,
    registeredCount: 145,
    certificateEnabled: true
  },
  {
    id: 'e2',
    title: 'Edge AI Workshop',
    description: 'Hands-on bootcamp on deploying deep learning models on resource-constrained devices like Raspberry Pi Pico and ESP32 using MicroPython and TensorFlow Lite.',
    type: 'workshop',
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    location: 'Lab 305, Academic Block',
    countdownTarget: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    registrationDeadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    status: 'upcoming',
    slots: 60,
    registeredCount: 22,
    certificateEnabled: true
  },
  {
    id: 'e3',
    title: 'PCB Design Hands-On',
    description: 'A 2-day workshop detailing schematic capture, component routing, and manufacturing guidelines using KiCad, including a live etching showcase.',
    type: 'workshop',
    date: 'Jun 12, 2026',
    location: 'Electronics Lab, VIT Bhopal',
    countdownTarget: new Date('2026-06-12T10:00:00Z').toISOString(),
    registrationDeadline: new Date('2026-06-10T10:00:00Z').toISOString(),
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    status: 'past',
    slots: 80,
    registeredCount: 80,
    certificateEnabled: true
  }
];

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Smart Campus Grid',
    description: 'A sensor network powered by LoRaWAN that tracks environmental quality, parking spots, and trash levels in real-time across the VIT Bhopal campus.',
    teamMembers: ['Ritesh Kumar Verma', 'Devansh Rai'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    githubUrl: 'https://github.com/iot-club-vitb/smart-campus',
    liveUrl: 'https://smartcampus.vitbhopal.ac.in',
    category: 'Smart Systems',
    tags: ['ESP32', 'LoRaWAN', 'React', 'NodeJS', 'Grafana']
  },
  {
    id: 'p2',
    title: 'Autonomous Edge Rover',
    description: 'An AI-powered robotics vehicle that navigates obstacles and maps indoor layouts using LiDAR and Edge AI running on a Raspberry Pi.',
    teamMembers: ['Sanyogita Rajput', 'Pratyush Dubey'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    githubUrl: 'https://github.com/iot-club-vitb/edge-rover',
    category: 'Robotics & AI',
    tags: ['Raspberry Pi', 'Python', 'ROS', 'OpenCV', 'TensorFlow']
  },
  {
    id: 'p3',
    title: 'Smart Precision Agriculture System',
    description: 'Automated solar-powered telemetry nodes checking soil moisture, ambient temperature, NPK soil nutrients, and triggering smart micro-drip pumps.',
    teamMembers: ['Rhythm Dangar', 'Devansh Rai'],
    image: 'https://images.unsplash.com/photo-1563514223727-6fc964d399c3?auto=format&fit=crop&q=80&w=600',
    githubUrl: 'https://github.com/iot-club-vitb/smart-agri',
    category: 'Automation',
    tags: ['Arduino Nano', 'NBIoT', 'Capacitive Sensors', 'Solar PMIC']
  },
  {
    id: 'p4',
    title: 'Wearable Biosensor Band',
    description: 'A smartwatch style health node reading pulse rate, SpO2 metrics, and temperature, featuring local anomaly fallback alerts.',
    teamMembers: ['Sanyogita Rajput', 'Umanshi Goyal'],
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
    githubUrl: 'https://github.com/iot-club-vitb/health-band',
    category: 'Embedded Devices',
    tags: ['ESP32-S3', 'MAX30102', 'BLE', 'LVGL Graphic library']
  },
  {
    id: 'p5',
    title: 'Industrial IoT Modbus Gateway',
    description: 'An RS485 to Ethernet converter pulling register values from motor controllers, storing data locally, and posting to AWS MQTT brokers.',
    teamMembers: ['Ritesh Kumar Verma', 'Pratyush Dubey'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    githubUrl: 'https://github.com/iot-club-vitb/modbus-gateway',
    category: 'Cloud IoT',
    tags: ['ESP32', 'RS485 Modbus RTU', 'AWS IoT Core', 'Grafana']
  }
];

const INITIAL_BLOGS: BlogItem[] = [
  {
    id: 'b1',
    title: 'Getting Started with ESP32 & FreeRTOS',
    summary: 'Learn how to leverage multi-tasking in microcontrollers by implementing FreeRTOS tasks on ESP32 boards.',
    content: 'ESP32 is a dual-core microcontroller that supports FreeRTOS right out of the box in the Arduino framework. This article will show you how to write concurrent tasks, create semaphores, and manage shared memory buffers to prevent crashes when building high-performance IoT nodes.',
    author: 'Ritesh Kumar Verma',
    authorImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=600',
    tags: ['ESP32', 'FreeRTOS', 'C++', 'Microcontrollers'],
    readTime: '6 min read',
    status: 'published',
    publishedAt: 'July 15, 2026'
  },
  {
    id: 'b2',
    title: 'Demystifying LoRaWAN for Campus Networks',
    summary: 'A deep-dive into low-power wide-area networking protocols and building cheap outdoor gateways.',
    content: 'LoRa and LoRaWAN are shifting the landscape for campus-wide telemetry. In this blog, we review link budgets, frequency bands (868/915 MHz), and setting up a single-channel gateway to capture air quality data from nodes deployed blocks away with minimal battery drain.',
    author: 'Devansh Rai',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=600',
    tags: ['LoRaWAN', 'Networking', 'ESP32'],
    readTime: '8 min read',
    status: 'published',
    publishedAt: 'July 10, 2026'
  },
  {
    id: 'b3',
    title: 'TinyML: Edge AI Inference on ESP32-S3',
    summary: 'Deploying neural networks directly onto microcontrollers using TensorFlow Lite Micro.',
    content: 'Running machine learning models locally on edge microcontrollers eliminates network latency and reduces bandwidth consumption. We walk through model quantization, compiling with Espressif NN compiler tools, and using camera modules to classify objects in real-time.',
    author: 'Pratyush Dubey',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    tags: ['TinyML', 'Edge AI', 'ESP32-S3', 'TensorFlow'],
    readTime: '10 min read',
    status: 'published',
    publishedAt: 'July 05, 2026'
  },
  {
    id: 'b4',
    title: 'Designing High-Speed PCB Layouts in KiCad',
    summary: 'Best practices for schematic entry, routing constraints, ground plane isolation, and decoupling capacitors.',
    content: 'In high-speed microcontroller and wireless circuit designs, layout decisions directly impact signal integrity. Learn how to map out transmission lines, routing return path loops, isolating RF matching circuits, and preparing Gerber packages for fab labs.',
    author: 'Devansh Rai',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    tags: ['PCB Design', 'Electronics', 'KiCad'],
    readTime: '9 min read',
    status: 'published',
    publishedAt: 'June 28, 2026'
  },
  {
    id: 'b5',
    title: 'SPI vs I2C vs UART: Core Hardware Protocols',
    summary: 'A direct comparative review of bus architectures, clocking requirements, and wire footprints.',
    content: 'Connecting auxiliary sensors to microcontrollers calls for picking the right serial protocol. We review hardware pin requirements, read/write speeds, master-slave constraints, and logic analyzer debugging steps for SPI, I2C, and UART channels.',
    author: 'Ritesh Kumar Verma',
    coverImage: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600',
    tags: ['SPI', 'I2C', 'Hardware Protocols', 'Microcontrollers'],
    readTime: '7 min read',
    status: 'published',
    publishedAt: 'June 20, 2026'
  },
  {
    id: 'b6',
    title: 'Securing MQTT Brokers in Enterprise IoT',
    summary: 'Implementing SSL/TLS certificates, ACL client policies, and payload encryption for telemetry queues.',
    content: 'By default, raw MQTT messages are transmitted in plain text. We detail configuring Mosquitto broker setups with custom Let\'s Encrypt certificates, client authentication hashes, and setting up token verification schemas to protect metrics streams.',
    author: 'Pratyush Dubey',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    tags: ['MQTT', 'Cybersecurity', 'Cloud IoT'],
    readTime: '8 min read',
    status: 'published',
    publishedAt: 'June 12, 2026'
  },
  {
    id: 'b7',
    title: 'Building a Solar Power harvesting IoT Node',
    summary: 'Calculating active energy budgets, matching solar cell sizing, and configuring low-power deep sleep cycles.',
    content: 'Creating a truly self-sustaining outdoor sensor requires fine-tuning PMIC hardware. This article details active sleep cycle power draw calculations, custom LiFePO4 batteries setups, and software sleep overrides to prolong node life for years.',
    author: 'Rhythm Dangar',
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
    tags: ['Energy Harvesting', 'Embedded Systems', 'ESP32'],
    readTime: '9 min read',
    status: 'published',
    publishedAt: 'June 05, 2026'
  },
  {
    id: 'b8',
    title: 'Introduction to Robot Operating System (ROS 2)',
    summary: 'Understanding nodes, publishers, subscribers, and publisher topics inside the ROS environment.',
    content: 'ROS 2 handles coordinate mapping, pathfinding, and sensor telemetry queues in modern robotics. We write custom publisher/subscriber nodes in Python, and trace robot position data inside RViz visualizations.',
    author: 'Sanyogita Rajput',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    tags: ['ROS 2', 'Robotics', 'Python'],
    readTime: '11 min read',
    status: 'published',
    publishedAt: 'May 28, 2026'
  },
  {
    id: 'b9',
    title: 'LiDAR Sensor Integration on Autonomous rovers',
    summary: 'Interfacing scanning laser scanners to map physical environments in real-time.',
    content: 'LiDAR scanners gather distance data vectors around an autonomous rover. We review hardware interfaces, parsing distance streams in microcontrollers, and feeding point cloud arrays directly to mapping algorithms.',
    author: 'Sanyogita Rajput',
    coverImage: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=600',
    tags: ['LiDAR', 'Robotics', 'Arduino'],
    readTime: '8 min read',
    status: 'published',
    publishedAt: 'May 15, 2026'
  },
  {
    id: 'b10',
    title: 'Interfacing BLE Client Services on ESP32',
    summary: 'Advertising BLE services, subscribing to hardware notifications, and client pairing.',
    content: 'Bluetooth Low Energy is standard for battery-constrained sensor telemetry. We build custom BLE UUID services, manage characteristics updates, and interface ESP32 servers directly with custom mobile apps.',
    author: 'Ritesh Kumar Verma',
    coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=600',
    tags: ['BLE', 'ESP32', 'Wireless Protocols'],
    readTime: '6 min read',
    status: 'published',
    publishedAt: 'May 10, 2026'
  }
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    title: 'ESP32 IoT Prototyping Module',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-10T10:00:00Z'
  },
  {
    id: 'g2',
    title: 'Raspberry Pi Single-Board Computer',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1517055720413-77a2702f583a?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-11T12:00:00Z'
  },
  {
    id: 'g3',
    title: 'Arduino Microcontroller Breadboard Prototyping',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-12T14:30:00Z'
  },
  {
    id: 'g4',
    title: 'ESP8266 and Microchip Transceiver Units',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-13T10:00:00Z'
  },
  {
    id: 'g5',
    title: 'Students Debugging Microcontrollers in IoT Lab',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-14T11:00:00Z'
  },
  {
    id: 'g6',
    title: 'Smart City LoRaWAN Node Assembly',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-15T09:30:00Z'
  },
  {
    id: 'g7',
    title: 'PCB Fabrication Circuit Etching Showcase',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-16T15:00:00Z'
  },
  {
    id: 'g8',
    title: 'Autonomous Robotics Rover Chassis and Sensors',
    category: 'photos',
    mediaUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600',
    createdAt: '2026-06-17T16:20:00Z'
  }
];

const INITIAL_SPONSORS: Sponsor[] = [
  { id: 's1', name: 'Google Developers', logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=200', website: 'https://developers.google.com', tier: 'gold' },
  { id: 's2', name: 'GitHub Education', logoUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=200', website: 'https://education.github.com', tier: 'gold' },
  { id: 's3', name: 'Arduino Inc', logoUrl: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=200', website: 'https://arduino.cc', tier: 'silver' }
];

const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 'tst1', name: 'Prof. M. K. Nair', role: 'Faculty Coordinator, IoT Club', review: 'The IoT Club provides a state-of-the-art playground for student builders to transform electronics theories into actual products. Excellent initiative!', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { id: 'tst2', name: 'Aarav Mehta', role: 'Alumni, Batch of 2025', review: 'Building projects in the IoT Club and presenting them at hackathons is exactly what secured my position as a hardware engineer at a robotics startup.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
];

const generateMockResources = (baseResources: ResourceItem[]): ResourceItem[] => {
  const learningSites = [
    { title: 'Random Nerd Tutorials - ESP32 Hub', url: 'https://randomnerdtutorials.com', desc: 'The most comprehensive step-by-step programming tutorials for ESP32 and ESP8266 microcontrollers.', category: 'Microcontrollers', type: 'link' },
    { title: 'Adafruit Learning System', url: 'https://learn.adafruit.com', desc: 'High-quality electronics tutorials, wiring diagrams, and library documentations for sensors and displays.', category: 'Sensors & Transducers', type: 'link' },
    { title: 'Arduino Project Hub', url: 'https://create.arduino.cc/projecthub', desc: 'Explore thousands of community-built electronics schematics, layouts, and source code downloads.', category: 'Microcontrollers', type: 'link' },
    { title: 'Raspberry Pi Documentation Hub', url: 'https://www.raspberrypi.com/documentation/', desc: 'Official guides for configuring Raspberry Pi computers, Linux OS administration, and GPIO scripts.', category: 'Microcontrollers', type: 'pdf' },
    { title: 'Paul McWhorter Hardware Class', url: 'https://www.youtube.com/@PaulMcWhorter', desc: 'The absolute gold-standard video series for learning Arduino circuitry and Raspberry Pi computing.', category: 'Microcontrollers', type: 'video' },
    { title: 'Hackster.io Community Blueprints', url: 'https://www.hackster.io', desc: 'Build guides, source codes, and 3D files shared by global IoT developers.', category: 'Wireless Protocols', type: 'link' },
    { title: 'Instructables - DIY Circuits Archive', url: 'https://www.instructables.com/circuits/', desc: 'Step-by-step maker blueprints for smart devices, automated rovers, and home automation.', category: 'Sensors & Transducers', type: 'link' },
    { title: 'Edge Impulse - TinyML Edge AI Academy', url: 'https://docs.edgeimpulse.com', desc: 'Learn how to collect accelerometer/voice datasets and train machine learning models for edge devices.', category: 'TinyML & Edge AI', type: 'link' },
    { title: 'SparkFun Electronics Start Learning', url: 'https://learn.sparkfun.com', desc: 'Introductory courses covering Ohm\'s Law, soldering, capacitor sizing, and SPI/I2C communication.', category: 'Sensors & Transducers', type: 'pdf' },
    { title: 'Coursera: IoT Specialization Curriculum', url: 'https://www.coursera.org', desc: 'Structured academic certifications covering wireless architectures, sensors, and gateway security.', category: 'Roadmaps', type: 'link' }
  ];

  const list = [...baseResources];
  // Add curated learning sites
  learningSites.forEach((site, index) => {
    list.push({
      id: `r-curated-${index}`,
      title: site.title,
      category: site.category,
      type: site.type as 'pdf' | 'link' | 'video',
      url: site.url,
      description: site.desc,
      addedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString()
    });
  });

  const categories = ['Microcontrollers', 'Sensors & Transducers', 'Wireless Protocols', 'TinyML & Edge AI', 'Roadmaps'];
  const types: ('pdf' | 'link' | 'video')[] = ['pdf', 'link', 'video'];
  
  for (let i = 1; i <= 95; i++) {
    const category = categories[i % categories.length];
    const type = types[i % types.length];
    list.push({
      id: `r-gen-${i}`,
      title: `${category} Technical Reference Sheet v${(i % 3) + 1}.${i % 10}`,
      category,
      type,
      url: 'https://randomnerdtutorials.com',
      description: `Official engineering notes, register mappings, calibration curves, and hardware pinout connections for ${category} modules.`,
      addedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString()
    });
  }
  return list;
};

const INITIAL_RESOURCES: ResourceItem[] = generateMockResources([
  { id: 'r1', title: 'ESP32 Pinout & Datasheet QuickRef', category: 'Microcontrollers', type: 'pdf', url: 'https://espressif.com', description: 'Detailed pin diagram and reference manual for ESP-WROOM-32 module.', addedAt: new Date().toISOString() },
  { id: 'r2', title: 'IoT Club Learning Path 2026', category: 'Roadmaps', type: 'link', url: 'https://github.com', description: 'Comprehensive curriculum list compiled by the technical team.', addedAt: new Date().toISOString() }
]);

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'ac1', title: 'Smart City Hackathon: 1st Place', description: 'IoT club developers won the top prize of ₹50,000 at the Inter-VIT Hackathon.', date: 'May 2026', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600', category: 'Hackathon' }
];

// Helper to initialize and retrieve items in Mock Mode
const getMockItems = <T>(key: string, initial: T[]): T[] => {
  const stored = localStorage.getItem(key);
  const versionKey = `${key}_v2_flush`;
  const isUpdated = localStorage.getItem(versionKey);

  if (!stored || !isUpdated || JSON.parse(stored).length !== initial.length) {
    localStorage.setItem(key, JSON.stringify(initial));
    localStorage.setItem(versionKey, 'true');
    return initial;
  }
  return JSON.parse(stored);
};

const saveMockItems = <T>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

// ==========================================
// DB SERVICE METHODS (PRODUCTION / DEMO MODE)
// ==========================================

export const dbService = {
  // --- Team ---
  getTeam: async (): Promise<TeamMember[]> => {
    if (isDemoMode) {
      return getMockItems<TeamMember>('iot_mock_team', INITIAL_TEAM);
    }
    const snap = await getDocs(query(collection(db, 'team'), orderBy('order')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));
  },
  
  saveTeamMember: async (member: TeamMember): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<TeamMember>('iot_mock_team', INITIAL_TEAM);
      const idx = list.findIndex(m => m.id === member.id);
      if (idx !== -1) list[idx] = member;
      else list.push(member);
      saveMockItems('iot_mock_team', list);
      return;
    }
    await setDoc(doc(db, 'team', member.id), member);
  },

  deleteTeamMember: async (id: string): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<TeamMember>('iot_mock_team', INITIAL_TEAM);
      const filtered = list.filter(m => m.id !== id);
      saveMockItems('iot_mock_team', filtered);
      return;
    }
    await deleteDoc(doc(db, 'team', id));
  },

  // --- Events ---
  getEvents: async (): Promise<IoTEvent[]> => {
    if (isDemoMode) {
      return getMockItems<IoTEvent>('iot_mock_events', INITIAL_EVENTS);
    }
    const snap = await getDocs(collection(db, 'events'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as IoTEvent));
  },

  saveEvent: async (event: IoTEvent): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<IoTEvent>('iot_mock_events', INITIAL_EVENTS);
      const idx = list.findIndex(e => e.id === event.id);
      if (idx !== -1) list[idx] = event;
      else list.push(event);
      saveMockItems('iot_mock_events', list);
      return;
    }
    await setDoc(doc(db, 'events', event.id), event);
  },

  deleteEvent: async (id: string): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<IoTEvent>('iot_mock_events', INITIAL_EVENTS);
      const filtered = list.filter(e => e.id !== id);
      saveMockItems('iot_mock_events', filtered);
      return;
    }
    await deleteDoc(doc(db, 'events', id));
  },

  // --- Registrations ---
  getRegistrations: async (): Promise<EventRegistration[]> => {
    if (isDemoMode) {
      return getMockItems<EventRegistration>('iot_mock_registrations', []);
    }
    const snap = await getDocs(collection(db, 'registrations'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventRegistration));
  },

  registerForEvent: async (eventId: string, user: UserProfile): Promise<void> => {
    const regId = `r-${eventId}-${user.uid}`;
    const newReg: EventRegistration = {
      id: regId,
      eventId,
      userId: user.uid,
      regNo: user.regNo,
      name: user.name,
      email: user.email,
      attended: false,
      registeredAt: new Date().toISOString()
    };
    
    if (isDemoMode) {
      const regs = getMockItems<EventRegistration>('iot_mock_registrations', []);
      if (regs.some(r => r.id === regId)) throw new Error('You are already registered for this event!');
      regs.push(newReg);
      saveMockItems('iot_mock_registrations', regs);

      // Increment registeredCount in event
      const events = getMockItems<IoTEvent>('iot_mock_events', INITIAL_EVENTS);
      const eIdx = events.findIndex(e => e.id === eventId);
      if (eIdx !== -1) {
        events[eIdx].registeredCount = (events[eIdx].registeredCount || 0) + 1;
        saveMockItems('iot_mock_events', events);
      }
      return;
    }

    await setDoc(doc(db, 'registrations', regId), newReg);
  },

  updateRegistration: async (reg: EventRegistration): Promise<void> => {
    if (isDemoMode) {
      const regs = getMockItems<EventRegistration>('iot_mock_registrations', []);
      const idx = regs.findIndex(r => r.id === reg.id);
      if (idx !== -1) {
        regs[idx] = reg;
        saveMockItems('iot_mock_registrations', regs);
      }
      return;
    }
    await setDoc(doc(db, 'registrations', reg.id), reg);
  },

  // --- Projects ---
  getProjects: async (): Promise<ProjectItem[]> => {
    if (isDemoMode) {
      return getMockItems<ProjectItem>('iot_mock_projects', INITIAL_PROJECTS);
    }
    const snap = await getDocs(collection(db, 'projects'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectItem));
  },

  saveProject: async (project: ProjectItem): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<ProjectItem>('iot_mock_projects', INITIAL_PROJECTS);
      const idx = list.findIndex(p => p.id === project.id);
      if (idx !== -1) list[idx] = project;
      else list.push(project);
      saveMockItems('iot_mock_projects', list);
      return;
    }
    await setDoc(doc(db, 'projects', project.id), project);
  },

  deleteProject: async (id: string): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<ProjectItem>('iot_mock_projects', INITIAL_PROJECTS);
      const filtered = list.filter(p => p.id !== id);
      saveMockItems('iot_mock_projects', filtered);
      return;
    }
    await deleteDoc(doc(db, 'projects', id));
  },

  // --- Blogs ---
  getBlogs: async (): Promise<BlogItem[]> => {
    if (isDemoMode) {
      return getMockItems<BlogItem>('iot_mock_blogs', INITIAL_BLOGS);
    }
    const snap = await getDocs(collection(db, 'blogs'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogItem));
  },

  saveBlog: async (blog: BlogItem): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<BlogItem>('iot_mock_blogs', INITIAL_BLOGS);
      const idx = list.findIndex(b => b.id === blog.id);
      if (idx !== -1) list[idx] = blog;
      else list.push(blog);
      saveMockItems('iot_mock_blogs', list);
      return;
    }
    await setDoc(doc(db, 'blogs', blog.id), blog);
  },

  deleteBlog: async (id: string): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<BlogItem>('iot_mock_blogs', INITIAL_BLOGS);
      const filtered = list.filter(b => b.id !== id);
      saveMockItems('iot_mock_blogs', filtered);
      return;
    }
    await deleteDoc(doc(db, 'blogs', id));
  },

  // --- Gallery ---
  getGallery: async (): Promise<GalleryItem[]> => {
    if (isDemoMode) {
      return getMockItems<GalleryItem>('iot_mock_gallery', INITIAL_GALLERY);
    }
    const snap = await getDocs(collection(db, 'gallery'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
  },

  saveGalleryItem: async (item: GalleryItem): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<GalleryItem>('iot_mock_gallery', INITIAL_GALLERY);
      list.push(item);
      saveMockItems('iot_mock_gallery', list);
      return;
    }
    await setDoc(doc(db, 'gallery', item.id), item);
  },

  deleteGalleryItem: async (id: string): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<GalleryItem>('iot_mock_gallery', INITIAL_GALLERY);
      const filtered = list.filter(g => g.id !== id);
      saveMockItems('iot_mock_gallery', filtered);
      return;
    }
    await deleteDoc(doc(db, 'gallery', id));
  },

  // --- Sponsors ---
  getSponsors: async (): Promise<Sponsor[]> => {
    if (isDemoMode) return getMockItems<Sponsor>('iot_mock_sponsors', INITIAL_SPONSORS);
    const snap = await getDocs(collection(db, 'sponsors'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Sponsor));
  },

  // --- Testimonials ---
  getTestimonials: async (): Promise<Testimonial[]> => {
    if (isDemoMode) return getMockItems<Testimonial>('iot_mock_testimonials', INITIAL_TESTIMONIALS);
    const snap = await getDocs(collection(db, 'testimonials'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
  },

  // --- Resources ---
  getResources: async (): Promise<ResourceItem[]> => {
    if (isDemoMode) return getMockItems<ResourceItem>('iot_mock_resources', INITIAL_RESOURCES);
    const snap = await getDocs(collection(db, 'resources'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceItem));
  },

  saveResource: async (res: ResourceItem): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<ResourceItem>('iot_mock_resources', INITIAL_RESOURCES);
      list.push(res);
      saveMockItems('iot_mock_resources', list);
      return;
    }
    await setDoc(doc(db, 'resources', res.id), res);
  },

  // --- Achievements ---
  getAchievements: async (): Promise<AchievementItem[]> => {
    if (isDemoMode) return getMockItems<AchievementItem>('iot_mock_achievements', INITIAL_ACHIEVEMENTS);
    const snap = await getDocs(collection(db, 'achievements'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AchievementItem));
  },

  // --- Contact Messages ---
  submitContactMessage: async (msg: ContactMessage): Promise<void> => {
    if (isDemoMode) {
      const messages = getMockItems<ContactMessage>('iot_mock_contact_messages', []);
      messages.push(msg);
      saveMockItems('iot_mock_contact_messages', messages);
      return;
    }
    await setDoc(doc(db, 'contact_messages', msg.id), msg);
  },

  getContactMessages: async (): Promise<ContactMessage[]> => {
    if (isDemoMode) {
      return getMockItems<ContactMessage>('iot_mock_contact_messages', []);
    }
    const snap = await getDocs(collection(db, 'contact_messages'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
  },

  // --- Newsletter ---
  subscribeNewsletter: async (email: string): Promise<void> => {
    const newSub = { id: `n-${Date.now()}`, email, subscribedAt: new Date().toISOString() };
    if (isDemoMode) {
      const list = getMockItems<any>('iot_mock_newsletter', []);
      if (list.some((l: any) => l.email === email)) throw new Error('Already subscribed!');
      list.push(newSub);
      saveMockItems('iot_mock_newsletter', list);
      return;
    }
    await addDoc(collection(db, 'newsletter'), newSub);
  },

  // --- Notifications ---
  getNotifications: async (): Promise<Announcement[]> => {
    const defaultNotifs: Announcement[] = [
      { id: 'n1', title: 'Welcome to the IoT Club!', body: 'We are thrilled to launch our new premium student platform. Complete your profile to get verified!', type: 'announcement', target: 'all', createdAt: new Date().toISOString() }
    ];
    if (isDemoMode) return getMockItems<Announcement>('iot_mock_notifications', defaultNotifs);
    const snap = await getDocs(collection(db, 'notifications'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
  },

  sendNotification: async (notif: Announcement): Promise<void> => {
    if (isDemoMode) {
      const list = getMockItems<Announcement>('iot_mock_notifications', []);
      list.unshift(notif); // Add new at the top
      saveMockItems('iot_mock_notifications', list);
      return;
    }
  },

  // --- Instagram Telemetry Cache ---
  getInstagramTelemetry: async (): Promise<any> => {
    const defaultTelemetry = {
      followerCount: '1,250',
      lastUpdated: new Date().toISOString(),
      status: 'cached',
      apiHealth: 'healthy',
      cacheStatus: 'synced'
    };
    
    if (isDemoMode) {
      const stored = localStorage.getItem('iot_instagram_telemetry');
      if (!stored) {
        localStorage.setItem('iot_instagram_telemetry', JSON.stringify(defaultTelemetry));
        return defaultTelemetry;
      }
      return JSON.parse(stored);
    }
    
    try {
      const docSnap = await getDoc(doc(db, 'metadata', 'instagram'));
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        await setDoc(doc(db, 'metadata', 'instagram'), defaultTelemetry);
        return defaultTelemetry;
      }
    } catch (err) {
      console.error('Error fetching Firestore Instagram telemetry cache:', err);
      return defaultTelemetry;
    }
  },

  updateInstagramTelemetry: async (telemetry: any): Promise<void> => {
    if (isDemoMode) {
      localStorage.setItem('iot_instagram_telemetry', JSON.stringify(telemetry));
      return;
    }
    try {
      await setDoc(doc(db, 'metadata', 'instagram'), telemetry, { merge: true });
    } catch (err) {
      console.error('Error updating Firestore Instagram telemetry cache:', err);
    }
  }
};
export default dbService;
