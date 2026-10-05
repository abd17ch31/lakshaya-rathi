import gsap from 'gsap';

/**
 * Shared GSAP configuration and utilities for cinematic timelines.
 */
export const initGsap = () => {
  gsap.config({
    autoSleep: 60,
    force3D: true,
  });
  return gsap;
};

export { gsap };
export default gsap;
