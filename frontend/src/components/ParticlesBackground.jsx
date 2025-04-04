import { useCallback } from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: "#fff",
          },
        },
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#1E90FF", "#FF6347", "#FFD700", "#9370DB", "#32CD32"]
          },
          shape: {
            type: ["circle", "triangle", "star"],
            options: {
              star: {
                sides: 5
              }
            }
          },
          opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: {
              enable: true,
              speed: 1,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 5 },
            animation: {
              enable: true,
              speed: 4,
              minimumValue: 0.3,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: { min: 0.5, max: 2 },
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "out"
            },
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 5
          },
          zIndex: {
            value: { min: 0, max: 100 },
            opacityRate: 7,
            sizeRate: 2,
            velocityRate: 2
          }
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
              parallax: {
                enable: true,
                force: 60,
                smooth: 10
              }
            },
            onClick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: 15,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            push: {
              quantity: 4
            },
            repulse: {
              distance: 100,
              duration: 0.4
            }
          }
        },
        retina_detect: true,
        motion: {
          reduce: {
            factor: 4,
            value: true
          }
        }
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