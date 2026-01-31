import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const HolographicCube = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleArray: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 4 + Math.random() * 2
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      <div className="holographic-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -500],
              x: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative w-64 h-64"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'translateZ(80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'translateZ(-80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'rotateY(90deg) translateZ(80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'rotateY(-90deg) translateZ(80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'rotateX(90deg) translateZ(80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />
        <div
          className="absolute w-full h-full border-2 border-primary/60 rounded-lg"
          style={{
            transform: 'rotateX(-90deg) translateZ(80px)',
            background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(31, 106, 165, 0.2))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(30, 144, 255, 0.6)',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-6xl font-bold glow-text"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            LOGO
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute top-10 right-10 w-32 h-32 holographic rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 left-10 w-40 h-40 holographic rounded-full blur-3xl opacity-60" />
    </div>
  );
};

export default HolographicCube;
