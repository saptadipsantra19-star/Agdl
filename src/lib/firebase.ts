import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { useState, useEffect } from 'react';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Simple connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Suppress expected errors when rules block read or when offline
  }
}
testConnection();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setError(null);
        // Ensure user document exists
        try {
           const userDoc = doc(db, 'users', currentUser.uid);
           const docSnap = await getDocFromServer(userDoc);
           if (!docSnap.exists()) {
             await setDoc(userDoc, {
               isGuest: false,
               name: currentUser.displayName || 'Farmer',
               region: 'Unknown',
               createdAt: serverTimestamp(),
               updatedAt: serverTimestamp()
             });
           }
        } catch (e) {
           console.error("Error creating user profile", e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Google sign-in failed:", err);
      if (err.code === 'auth/admin-restricted-operation') {
        setError('Google sign-in is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.');
      } else {
        setError(err.message);
      }
    }
  };

  const logOut = () => signOut(auth);

  return { user, loading, error, signIn, logOut };
}
