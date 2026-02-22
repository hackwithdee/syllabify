import { useState, useCallback } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, signUp, signIn, signOut, updateUser } from '@/lib/storage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  const login = useCallback((email: string, password: string) => {
    const u = signIn(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const u = signUp(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
  }, []);

  const update = useCallback((updates: Partial<User>) => {
    const u = updateUser(updates);
    setUser(u);
    return u;
  }, []);

  return { user, login, register, logout, update };
}
