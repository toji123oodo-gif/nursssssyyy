import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier } from '../types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../src/firebase';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhoneMock: (phone: string) => Promise<void>;
  signup: (data: Omit<User, 'id'> & { password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get extra user data from localStorage since we don't have a DB yet
  const getStoredUserData = (uid: string) => {
    try {
      const data = localStorage.getItem(`nursy_user_data_${uid}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  const saveUserDataToLocal = (uid: string, data: Partial<User>) => {
    const current = getStoredUserData(uid) || {};
    localStorage.setItem(`nursy_user_data_${uid}`, JSON.stringify({ ...current, ...data }));
  };

  useEffect(() => {
    // 1. If Firebase Auth is not initialized (missing keys), check for Mock Session
    if (!auth) {
      console.warn("Nursy: Firebase Auth not initialized (Missing API Key). Running in Mock Mode.");
      const mockSession = localStorage.getItem('nursy_mock_session');
      if (mockSession) {
        try {
          setUser(JSON.parse(mockSession));
        } catch (e) {
          localStorage.removeItem('nursy_mock_session');
        }
      }
      setIsLoading(false);
      return;
    }

    // 2. Real Firebase Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase User to App User
        const localData = getStoredUserData(firebaseUser.uid);
        
        const mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || localData?.name || 'Student',
          // Handle cases where email might be null (e.g. Phone Auth)
          email: firebaseUser.email || `phone_${firebaseUser.phoneNumber}` || '',
          phone: firebaseUser.phoneNumber || localData?.phone || '',
          subscriptionTier: localData?.subscriptionTier || 'free'
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    if (!auth) {
      // Mock Login
      console.log("Mock Mode: Logging in...");
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network
      const mockUser: User = {
        id: 'mock-user-123',
        name: 'Demo Student',
        email: email,
        phone: '01000000000',
        subscriptionTier: 'free'
      };
      setUser(mockUser);
      localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
      saveUserDataToLocal(mockUser.id, { name: mockUser.name, subscriptionTier: 'free' });
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async (): Promise<void> => {
    if (!auth) {
      // Mock Google Login
      console.log("Mock Mode: Google Login...");
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser: User = {
        id: 'mock-google-' + Date.now(),
        name: 'Google User (Demo)',
        email: 'demo.google@nursy.com',
        phone: '',
        subscriptionTier: 'free'
      };
      setUser(mockUser);
      localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
      saveUserDataToLocal(mockUser.id, { name: mockUser.name, subscriptionTier: 'free' });
      return;
    }

    if (!googleProvider) throw new Error("Google Auth Provider failed to initialize.");
    
    const result = await signInWithPopup(auth, googleProvider);
    // Initialize local data if new user
    const localData = getStoredUserData(result.user.uid);
    if (!localData) {
      saveUserDataToLocal(result.user.uid, {
        name: result.user.displayName || 'Student',
        subscriptionTier: 'free'
      });
    }
  };

  const loginWithPhoneMock = async (phone: string): Promise<void> => {
    // Only used when !auth
    console.log("Mock Mode: Phone Login...");
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: User = {
      id: 'mock-phone-' + Date.now(),
      name: 'Phone User',
      email: '',
      phone: phone,
      subscriptionTier: 'free'
    };
    setUser(mockUser);
    localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
    saveUserDataToLocal(mockUser.id, { name: mockUser.name, phone: phone, subscriptionTier: 'free' });
  };

  const signup = async (data: Omit<User, 'id'> & { password?: string }) => {
    if (!auth) {
      // Mock Signup
      console.log("Mock Mode: Signing up...");
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser: User = {
        id: 'mock-user-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      };
      setUser(mockUser);
      localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
      saveUserDataToLocal(mockUser.id, { 
        name: data.name, 
        phone: data.phone, 
        subscriptionTier: data.subscriptionTier 
      });
      return;
    }

    if (!data.password) throw new Error("Password is required");
    
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      });
      
      // Persist extra fields to local storage for now
      saveUserDataToLocal(userCredential.user.uid, {
        name: data.name,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      });
      
      // Force update state
      setUser({
        id: userCredential.user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      });
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    // Clear state and mock storage
    setUser(null);
    localStorage.removeItem('nursy_mock_session');
    localStorage.removeItem('nursy_user'); 
  };

  const upgradeToPro = () => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: 'pro' as SubscriptionTier };
      setUser(updatedUser);
      // Persist to local storage so it survives refresh
      saveUserDataToLocal(user.id, { subscriptionTier: 'pro' });
      
      // Also update mock session if active
      if (!auth) {
        localStorage.setItem('nursy_mock_session', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AppContext.Provider value={{ user, isLoading, login, loginWithGoogle, loginWithPhoneMock, signup, logout, upgradeToPro }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};