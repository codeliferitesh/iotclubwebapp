import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isDemoMode } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, regNo: string, branch: string, year: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const translateFirebaseError = (error: any): string => {
  const code = error?.code || '';
  console.error('Firebase Auth error code:', code, error);
  switch (code) {
    case 'auth/invalid-credential':
      return 'Account not found, or incorrect password. Please make sure you are registered, or click Sign Up below to create a new account in your Firebase database.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase Console. Go to Build -> Authentication -> Sign-in method and enable Email/Password and Google.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered on this portal. Try logging in instead.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use a password with at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address syntax.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'permission-denied':
      return 'Firestore permission denied. Ensure you have created the database in your console and published the firestore.rules.';
    default:
      return error.message || 'Authentication error. Please check your network and Firebase configuration.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Auth state
  useEffect(() => {
    if (isDemoMode) {
      // Mock mode initialization
      const storedUser = localStorage.getItem('iot_club_mock_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    } else {
      // Production Firebase auth listener
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Get detailed profile from Firestore
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              if (firebaseUser.email === 'stacksolveofficial@gmail.com') {
                data.role = 'admin';
              }
              setUser(data);
            } else {
              // Check if user is registered in the admins collection
              const adminRef = doc(db, 'admins', firebaseUser.uid);
              const adminSnap = await getDoc(adminRef);
              
              const isUserAdmin = adminSnap.exists() || firebaseUser.email === 'stacksolveofficial@gmail.com';
              const profile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'IoT Member',
                regNo: 'TEMP' + Math.floor(Math.random() * 9000 + 1000),
                branch: 'CSE',
                year: '3rd',
                role: isUserAdmin ? 'admin' : 'student',
                skills: [],
                membershipStatus: 'active',
                createdAt: new Date().toISOString(),
                profilePhoto: firebaseUser.photoURL || undefined
              };
              
              await setDoc(docRef, profile);
              setUser(profile);
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        } finally {
          setLoading(false);
        }
      });
      return unsubscribe;
    }
  }, []);

  const validateVITEmail = (email: string) => {
    return email.endsWith('@vitbhopal.ac.in') || email === 'stacksolveofficial@gmail.com';
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isDemoMode) {
        // Special credentials for mock mode
        if (email === 'stacksolveofficial@gmail.com' && pass === 'stack_99') {
          const adminProfile: UserProfile = {
            uid: 'mock-admin-uid',
            email: 'stacksolveofficial@gmail.com',
            name: 'Club Administrator',
            regNo: 'ADMIN001',
            branch: 'IoT',
            year: 'Faculty/Lead',
            role: 'admin',
            membershipStatus: 'approved',
            skills: ['IoT', 'Embedded Systems', 'Cloud'],
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('iot_club_mock_user', JSON.stringify(adminProfile));
          setUser(adminProfile);
          return;
        }

        // Mock student login
        const storedUser = localStorage.getItem('iot_club_mock_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.email === email && pass === 'password123') {
            setUser(parsed);
            return;
          }
        }
        
        // Default guest student
        if (validateVITEmail(email)) {
          const studentProfile: UserProfile = {
            uid: 'mock-student-uid',
            email: email,
            name: email.split('@')[0].toUpperCase(),
            regNo: '22MIM1001',
            branch: 'CSE (IoT)',
            year: '3rd',
            role: 'student',
            membershipStatus: 'approved',
            skills: ['Arduino', 'React'],
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('iot_club_mock_user', JSON.stringify(studentProfile));
          setUser(studentProfile);
          return;
        }

        throw new Error('Invalid VIT Bhopal email or password in Demo Mode. (Use password123, or admin@vitbhopal.ac.in / admin123)');
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    } catch (err: any) {
      setLoading(false);
      throw new Error(translateFirebaseError(err));
    }
  };

  const signup = async (
    email: string, 
    pass: string, 
    name: string, 
    regNo: string, 
    branch: string, 
    year: string
  ) => {
    setLoading(true);
    try {
      if (!validateVITEmail(email)) {
        throw new Error('Access Denied: Only @vitbhopal.ac.in email addresses are permitted to register.');
      }

      if (isDemoMode) {
        const studentProfile: UserProfile = {
          uid: 'mock-user-' + Math.random().toString(36).substr(2, 9),
          email,
          name,
          regNo,
          branch,
          year,
          role: 'student',
          membershipStatus: 'pending',
          skills: [],
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('iot_club_mock_user', JSON.stringify(studentProfile));
        setUser(studentProfile);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        const profile: UserProfile = {
          uid: res.user.uid,
          email,
          name,
          regNo,
          branch,
          year,
          role: 'student',
          membershipStatus: 'pending',
          skills: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', res.user.uid), profile);
        setUser(profile);
      }
    } catch (err: any) {
      setLoading(false);
      throw new Error(translateFirebaseError(err));
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        const googleProfile: UserProfile = {
          uid: 'mock-google-uid',
          email: 'google.student@vitbhopal.ac.in',
          name: 'Google Student',
          regNo: '23BCE1002',
          branch: 'CSE',
          year: '2nd',
          role: 'student',
          membershipStatus: 'approved',
          skills: ['Python', 'Electronics'],
          createdAt: new Date().toISOString(),
          profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
        };
        localStorage.setItem('iot_club_mock_user', JSON.stringify(googleProfile));
        setUser(googleProfile);
      } else {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        const email = res.user.email || '';
        
        if (!validateVITEmail(email)) {
          await firebaseSignOut(auth);
          throw new Error('Access Denied: Only @vitbhopal.ac.in email addresses are permitted.');
        }

        const docRef = doc(db, 'users', res.user.uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          const profile: UserProfile = {
            uid: res.user.uid,
            email,
            name: res.user.displayName || 'IoT Student',
            regNo: '22BCE' + Math.floor(Math.random() * 9000 + 1000),
            branch: 'CSE',
            year: '3rd',
            role: 'student',
            membershipStatus: 'pending',
            skills: [],
            createdAt: new Date().toISOString(),
            profilePhoto: res.user.photoURL || undefined
          };
          await setDoc(docRef, profile);
          setUser(profile);
        } else {
          setUser(docSnap.data() as UserProfile);
        }
      }
    } catch (err: any) {
      setLoading(false);
      throw new Error(translateFirebaseError(err));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        localStorage.removeItem('iot_club_mock_user');
        setUser(null);
      } else {
        await firebaseSignOut(auth);
        setUser(null);
      }
    } catch (err: any) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updated = { ...user, ...profileUpdates };
      if (isDemoMode) {
        localStorage.setItem('iot_club_mock_user', JSON.stringify(updated));
        setUser(updated);
      } else {
        await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
        setUser(updated);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isDemo: isDemoMode, 
      login, 
      signup, 
      loginWithGoogle, 
      logout,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
