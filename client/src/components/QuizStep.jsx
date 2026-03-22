import { motion } from 'framer-motion';

export default function QuizStep({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
      style={{
        background: 'var(--white)',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(15, 31, 61, 0.08)',
        padding: '48px',
      }}
    >
      {children}
    </motion.div>
  );
}
