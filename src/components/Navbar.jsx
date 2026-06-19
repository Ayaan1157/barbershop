import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';

export default function Navbar({ currentRoute }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '#/' },
    { name: 'Services', path: '#/services' },
    { name: 'Barbers', path: '#/barbers' },
    { name: 'Gallery', path: '#/gallery' },
    { name: 'Contact', path: '#/contact' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(28, 26, 24, 0.95)' : 'rgba(28, 26, 24, 0.8)',
        borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid rgba(58, 52, 46, 0.2)',
        backdropFilter: 'blur(12px)',
        transition: 'var(--transition-smooth)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px',
          padding: '0 2.5rem',
        }}
      >
        {/* Logo */}
        <a
          href="#/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: '900',
            color: 'var(--color-text)',
            letterSpacing: '0.05em',
            lineHeight: '1',
          }}
        >
          <Scissors size={24} style={{ color: 'var(--color-accent)', transform: 'rotate(-45deg)' }} />
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>BARBERSHOP</span>
        </a>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'none',
          }}
          className="desktop-nav"
        >
          <ul
            style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              alignItems: 'center',
            }}
          >
            {navLinks.map((link) => {
              const isActive = currentRoute === link.path || (link.path === '#/' && currentRoute === '');
              return (
                <li key={link.name} style={{ display: 'flex', alignItems: 'center' }}>
                  <a
                    href={link.path}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: isActive ? '600' : '400',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      lineHeight: '1',
                      paddingBottom: '6px',
                      borderBottom: `2px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
                    }}
                    className="nav-link-item"
                  >
                    {link.name}
                  </a>
                </li>
              );
            })}
            <li style={{ display: 'flex', alignItems: 'center' }}>
              <a
                href="#/book"
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8rem',
                  lineHeight: '1',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Book Your Cut
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
          className="mobile-nav-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className="mobile-nav-drawer"
        style={{
          position: 'fixed',
          top: '80px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--color-bg)',
          zIndex: 999,
          display: isOpen ? 'block' : 'none',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '3rem 2rem',
            listStyle: 'none',
          }}
        >
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path || (link.path === '#/' && currentRoute === '');
            return (
              <li key={link.name}>
                <a
                  href={link.path}
                  onClick={handleLinkClick}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '1.25rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                    display: 'block',
                    paddingBottom: '0.5rem',
                    borderBottom: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
          <li style={{ marginTop: '1.5rem' }}>
            <a
              href="#/book"
              onClick={handleLinkClick}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
              }}
            >
              Book Your Cut
            </a>
          </li>
        </ul>
      </div>

      {/* Embedded styles for Nav responsive behavior */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: block !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: block !important;
          }
        }
        .nav-link-item:hover {
          color: var(--color-accent) !important;
        }
      `}</style>
    </header>
  );
}
