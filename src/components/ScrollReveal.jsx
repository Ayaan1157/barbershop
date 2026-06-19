import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '' }) {
  const elementRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -60px 0px' // Trigger slightly before it fully rolls into the viewport
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`reveal-on-scroll ${isRevealed ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
