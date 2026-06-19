import React from 'react';
import { Scissors, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            textAlign: 'left',
            marginBottom: '4rem',
          }}
        >
          {/* Logo & Bio */}
          <div>
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
                marginBottom: '1.5rem',
              }}
            >
              <Scissors size={24} style={{ color: 'var(--color-accent)', transform: 'rotate(-45deg)' }} />
              <span>BARBERSHOP</span>
            </a>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              A neighborhood barbershop dedicated to the craft of traditional and contemporary grooming. Built on trust, good conversation, and precision work.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  color: 'var(--color-muted)',
                  transition: 'var(--transition-fast)',
                }}
                className="social-hover"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  color: 'var(--color-muted)',
                  transition: 'var(--transition-fast)',
                }}
                className="social-hover"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="uppercase-label"
              style={{
                marginBottom: '1.5rem',
                color: 'var(--color-text)',
              }}
            >
              The Shop
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href="#/" style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }} className="link-hover">
                  Home
                </a>
              </li>
              <li>
                <a href="#/services" style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }} className="link-hover">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#/barbers" style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }} className="link-hover">
                  Our Barbers
                </a>
              </li>
              <li>
                <a href="#/gallery" style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }} className="link-hover">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#/contact" style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }} className="link-hover">
                  Contact & Location
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3
              className="uppercase-label"
              style={{
                marginBottom: '1.5rem',
                color: 'var(--color-text)',
              }}
            >
              Hours
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Tuesday – Friday</span>
                <span style={{ color: 'var(--color-text)' }}>10:00 AM – 8:00 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Saturday</span>
                <span style={{ color: 'var(--color-text)' }}>9:00 AM – 6:00 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Sunday</span>
                <span style={{ color: 'var(--color-text)' }}>11:00 AM – 5:00 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: 'var(--color-muted)' }}>Monday</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>CLOSED</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3
              className="uppercase-label"
              style={{
                marginBottom: '1.5rem',
                color: 'var(--color-text)',
              }}
            >
              Get In Touch
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>1209 E 11th St, Austin, TX 78702</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <a href="tel:+15125550192" className="link-hover">
                  (512) 555-0192
                </a>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <a href="mailto:info@barbershop.com" className="link-hover">
                  info@barbershop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            mdDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--color-muted)',
          }}
          className="footer-bottom"
        >
          <span>&copy; {new Date().getFullYear()} Barbershop LLC. All rights reserved.</span>
          <span style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#/privacy" className="link-hover">Privacy Policy</a>
            <a href="#/terms" className="link-hover">Terms of Service</a>
          </span>
        </div>
      </div>
      <style>{`
        .social-hover:hover {
          color: var(--color-accent) !important;
          transform: translateY(-2px);
        }
        .link-hover:hover {
          color: var(--color-accent) !important;
        }
        @media (min-width: 769px) {
          .footer-bottom {
            flex-direction: row !important;
          }
        }
      `}</style>
    </footer>
  );
}
