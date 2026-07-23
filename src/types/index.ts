export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  regNo: string;
  branch: string;
  year: string;
  role: 'student' | 'admin';
  profilePhoto?: string;
  skills: string[];
  membershipStatus: 'pending' | 'approved' | 'active' | 'suspended';
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  teamName: 'Panel' | 'Media & Photography' | 'Content' | 'Design' | 'Technical' | 'Event Management' | 'Social Media' | 'PR & Outreach';
  bio: string;
  photoUrl: string;
  email: string;
  linkedin: string;
  github?: string;
  order: number;
  regNo?: string;
  phone?: string;
}

export interface ResearchApplication {
  id: string;
  name: string;
  email: string;
  regNo: string;
  phone: string;
  researchArea: string;
  proposalTitle: string;
  abstract: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface RecruitmentApplication {
  id: string;
  name: string;
  email: string;
  regNo: string;
  phone: string;
  teamName: string;
  position: string;
  portfolioUrl?: string;
  sop: string;
  createdAt: string;
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected';
}


export type EventType = 'workshop' | 'hackathon' | 'bootcamp' | 'seminar' | 'guest-lecture';

export interface IoTEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  location: string;
  countdownTarget: string; // ISO String
  registrationDeadline: string; // ISO String
  image: string;
  status: 'upcoming' | 'past';
  slots: number;
  registeredCount: number;
  certificateEnabled: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  regNo: string;
  name: string;
  email: string;
  attended: boolean;
  certificateUrl?: string;
  registeredAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'photos' | 'videos';
  mediaUrl: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  teamMembers: string[];
  image: string;
  githubUrl: string;
  liveUrl?: string;
  category: string;
  tags: string[];
}

export interface BlogItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorImage?: string;
  coverImage: string;
  tags: string[];
  readTime: string;
  status: 'draft' | 'published';
  publishedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: 'announcement' | 'event' | 'certificate';
  target: 'all' | 'subscribers' | 'registered';
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  description: string;
  addedAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  tier: 'gold' | 'silver' | 'bronze';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  avatar: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
}
