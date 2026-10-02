import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { storage } from '../utils/storage';
import { mockUsers } from '../data/mockUsers';
import { hashPassword } from '../utils/crypto';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem('inventaris_sai_currentUser');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('inventaris_sai_currentUser'));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.isAnonymous) {
          const raw = sessionStorage.getItem('inventaris_sai_currentUser');
          const localUser = raw ? JSON.parse(raw) : null;
          if (localUser && localUser.isMock) {
            setUser(localUser);
          } else {
            setUser(null);
            sessionStorage.removeItem('inventaris_sai_currentUser');
          }
          setLoading(false);
          return;
        }
        try {
          const userDoc = await get(ref(db, `app_users/${firebaseUser.uid}`));
          const userEmail = firebaseUser.email || '';
          if (userDoc.exists()) {
            const userData = { id: firebaseUser.uid, email: userEmail, ...userDoc.val(), role: 'admin' };
            setUser(userData);
            sessionStorage.setItem('inventaris_sai_currentUser', JSON.stringify(userData));
          } else {
            const fallbackUser = { id: firebaseUser.uid, email: userEmail, role: 'admin', name: userEmail.split('@')[0] || 'Admin' };
            setUser(fallbackUser);
            sessionStorage.setItem('inventaris_sai_currentUser', JSON.stringify(fallbackUser));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          const userEmail = firebaseUser.email || '';
          const fallbackUser = { id: firebaseUser.uid, email: userEmail, role: 'admin', name: userEmail.split('@')[0] || 'Admin' };
          setUser(fallbackUser);
          sessionStorage.setItem('inventaris_sai_currentUser', JSON.stringify(fallbackUser));
        }
      } else {
        signInAnonymously(auth).catch(e => console.warn('Anonymous auth failed:', e));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (username, password) => {
    const searchUsername = username.trim().toLowerCase();
    const passwordTrimmed = password.trim();
    const hashedPassword = await hashPassword(passwordTrimmed);

    const storedUsers = storage.get('users', []) || [];
    let found = storedUsers.find(
      u => (u.username || '').trim().toLowerCase() === searchUsername &&
           u.password && (u.password === hashedPassword || u.password === passwordTrimmed)
    );
    if (!found) {
      found = mockUsers.find(
        u => (u.username || '').trim().toLowerCase() === searchUsername &&
             u.password && (u.password === hashedPassword || u.password === passwordTrimmed)
      );
    }

    if (found) {
      const userData = { ...found, isMock: true };
      delete userData.password;
      setUser(userData);
      sessionStorage.setItem('inventaris_sai_currentUser', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    try {
      const email = username.includes('@') ? username : `${username}@sarpras.sch.id`;
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.warn('Login error:', error);
      return { success: false, message: 'Username atau password salah' };
    }
  }, []);

  const logout = useCallback(async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
    setUser(null);
    sessionStorage.removeItem('inventaris_sai_currentUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
