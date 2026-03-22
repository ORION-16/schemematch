import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { matchProfile } from '../utils/api';
import { motion } from 'framer-motion';

export default function Loading() {
  const navigate = useNavigate();
  const { profile, setMatchedSchemes } = useProfile();

  useEffect(() => {
    let mounted = true;

    async function fetchMatches() {
      try {
        const [response] = await Promise.all([
          matchProfile(profile),
          new Promise(res => setTimeout(res, 2500)) // Force minimum 2.5s visual loading
        ]);
        if (mounted) {
          setMatchedSchemes(response.schemes);
          navigate('/results', { replace: true });
        }
      } catch (error) {
        console.error("Match error:", error);
        if (mounted) {
          setMatchedSchemes([]);
          navigate('/results', { replace: true });
        }
      }
    }

    fetchMatches();
    return () => { mounted = false; };
  }, [profile, navigate, setMatchedSchemes]);

  return (
    <div className="min-h-screen pt-16 bg-[var(--off-white)] flex flex-col items-center justify-center p-6 text-center">
      <div className="spinner mb-8"></div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <h2 className="text-2xl font-bold text-[var(--navy)] mb-2" style={{ fontFamily: 'var(--font-family-heading)' }}>
          Scanning 200+ Government Schemes
        </h2>
        <p className="text-[var(--muted)] text-lg">
          Finding the best matches for your profile...
        </p>
      </motion.div>
    </div>
  );
}
