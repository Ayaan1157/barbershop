import React, { useEffect, useRef, useState } from 'react';

export default function RazorDivider() {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          // Once animated, we don't need to observe anymore
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`razor-divider-container ${isActive ? 'active' : ''}`}
      aria-hidden="true"
    >
      <div className="razor-divider-line"></div>
      <div className="razor-divider-path"></div>
      
      {/* SVG Straight Razor Icon */}
      <svg
        className="razor-divider-icon"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Razor Handle (Brass) */}
        <path
          d="M6 24C5 20.5 8 13.5 14 10.5L16 12.5C11 15 8.5 21 9 24.5C9.5 28 6.5 28.5 6 24Z"
          fill="#B8893E"
          stroke="#B8893E"
          strokeWidth="1.5"
        />
        {/* Razor Pivot Point */}
        <circle cx="15" cy="11.5" r="1.5" fill="#EDE8E0" />
        
        {/* Razor Blade (Steel/Off-White) */}
        <path
          d="M15 11.5L25 5L29 7.5L19 14.5L15 11.5Z"
          fill="#EDE8E0"
          stroke="#EDE8E0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Razor Blade Edge (Slightly lighter highlight) */}
        <path
          d="M19 14.5L29 7.5"
          stroke="#9A9087"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
