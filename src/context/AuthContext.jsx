import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authAPI.getMe();
        setUser(userData);
        await loadUserProfile();
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const loadUserProfile = async () => {
    try {
      const profileData = await profileAPI.getMyProfile();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const register = async (email, password, userData) => {
    try {
      const data = await authAPI.register({
        email,
        password,
        fullName: userData.full_name || userData.fullName,
        role: userData.role,
        phone: userData.phone,
      });

      setUser(data);
      await loadUserProfile();
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      setUser(data);
      await loadUserProfile();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      authAPI.logout();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      await profileAPI.updateMyProfile(updates);
      await loadUserProfile();
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    register,
    login,
    logout,
    updateProfile,
    refreshProfile: loadUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
