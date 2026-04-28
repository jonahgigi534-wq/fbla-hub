import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Basic touch detection so we don't show the custom cursor on mobile
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      // Easing for smooth movement on the main cursor
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    // Click effect
    const onMouseDown = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(0.9)`;
        cursorDotRef.current.style.transition = 'transform 0.1s ease';
      }
    };

    const onMouseUp = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
        // Reset transition so requestAnimationFrame takes over smoothly
        setTimeout(() => {
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transition = 'none';
            }
        }, 100);
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorDotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ transformOrigin: 'top left' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L8.5 20L11.5 12.5L19 9.5L0 0Z" fill="#0a2e7f" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export default CustomCursor;
