import { createContext, useContext, useState, useCallback } from 'react';

const ProfileContext = createContext(null);

const defaultProfile = {
  age: 30,
  gender: '',
  state: '',
  occupation: '',
  income: 150000,
  category: '',
  hasBPL: '',
  hasHouse: '',
  hasLand: '',
  hasGirlChild: '',
  isPregnant: '',
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({ ...defaultProfile });
  const [matchedSchemes, setMatchedSchemes] = useState(null);

  const resetProfile = useCallback(() => {
    setProfile({ ...defaultProfile });
    setMatchedSchemes(null);
    localStorage.removeItem('sm_profile_draft');
  }, []);

  const updateProfile = useCallback((key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        matchedSchemes,
        setMatchedSchemes,
        resetProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
