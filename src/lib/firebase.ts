import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  OAuthProvider,
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider Configs
const googleProvider = new GoogleAuthProvider();
// Request Google Chat scopes
googleProvider.addScope('https://www.googleapis.com/auth/chat');

const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');
const appleProvider = new OAuthProvider('apple.com');

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentProvider: string | null = null;

// Initialize Auth
export const initAuth = (
  onAuthSuccess: (user: User, token: string | null, provider: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken, currentProvider || 'Google');
      } else {
        // Fallback or guest user in app
        onAuthSuccess(user, null, currentProvider || 'Google');
      }
    } else {
      cachedAccessToken = null;
      currentProvider = null;
      onAuthFailure();
    }
  });
};

// Social Sign-Ins
export const signInWithGoogle = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || null;
    currentProvider = 'Google';
    return { user: result.user, accessToken: cachedAccessToken, provider: 'Google' };
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signInWithGithub = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, githubProvider);
    currentProvider = 'GitHub';
    cachedAccessToken = null; // No workspace scopes needed for GitHub in this particular context
    return { user: result.user, accessToken: null, provider: 'GitHub' };
  } catch (error) {
    console.error('GitHub Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signInWithMicrosoft = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, microsoftProvider);
    currentProvider = 'Microsoft';
    cachedAccessToken = null;
    return { user: result.user, accessToken: null, provider: 'Microsoft' };
  } catch (error) {
    console.error('Microsoft Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const signInWithApple = async () => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, appleProvider);
    currentProvider = 'Apple';
    cachedAccessToken = null;
    return { user: result.user, accessToken: null, provider: 'Apple' };
  } catch (error) {
    console.error('Apple Auth Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Getcached token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout
export const handleLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentProvider = null;
};
