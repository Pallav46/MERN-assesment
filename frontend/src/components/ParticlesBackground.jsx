import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim'; // Changed from loadFull to loadSlim

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine); // Changed to loadSlim
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "#fff",
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#1E90FF", "#FF6347", "#FFD700", "#9370DB", "#32CD32"],
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: { min: 0.5, max: 2 },
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle"],
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 4,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default ParticlesBackground;