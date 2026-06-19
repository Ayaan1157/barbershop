import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ScrollReveal from '../components/ScrollReveal';

export default function Barbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBarbers() {
      try {
        const { data, error } = await supabase.from('barbers').select('*');
        if (data) {
          setBarbers(data);
        }
      } catch (err) {
        console.error('Error fetching barbers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBarbers();
  }, []);

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }} className="container">
      {/* Header */}
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="uppercase-label">The Team</span>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            marginTop: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
          }}
        >
          Our Barbers
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
          Meet the experienced artisans of Barbershop. Each barber brings unique specialty skillsets, detailed training, and dedicated craftsmanship to our chairs.
        </p>
      </ScrollReveal>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '3rem' }}>
          Loading team profiles...
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
          }}
        >
          {barbers.map((barber) => (
            <ScrollReveal
              key={barber.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
              }}
              className="barber-profile-card"
            >
              {/* Image Frame with Double Accent Corner styling */}
              <div
                style={{
                  position: 'relative',
                  border: '1px solid var(--color-border)',
                  padding: '8px',
                  backgroundColor: 'var(--color-surface)',
                  marginBottom: '1.5rem',
                  overflow: 'hidden',
                  transition: 'var(--transition-smooth)',
                }}
                className="barber-img-frame"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '-4px',
                    width: '16px',
                    height: '16px',
                    borderTop: '2px solid var(--color-accent)',
                    borderLeft: '2px solid var(--color-accent)',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="barber-corner-top"
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    borderBottom: '2px solid var(--color-accent)',
                    borderRight: '2px solid var(--color-accent)',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="barber-corner-bottom"
                ></div>
                <img
                  src={
                    barber.image_url
                      ? barber.image_url.startsWith('http')
                        ? barber.image_url
                        : barber.image_url.includes('marcus')
                        ? 'https://images.unsplash.com/photo-1605497746444-ac9dbd3974a7?auto=format&fit=crop&q=80&w=600'
                        : barber.image_url.includes('silas')
                        ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
                        : barber.image_url.includes('julian')
                        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600'
                        : barber.image_url.includes('devon')
                        ? 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600'
                        : '/' + barber.image_url
                      : ''
                  }
                  alt={barber.name}
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    filter: 'grayscale(60%) contrast(110%)',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="barber-img"
                />
              </div>

              {/* Text content */}
              <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontSize: '1.6rem',
                    color: 'var(--color-text)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {barber.name}
                </h3>
                <span
                  className="uppercase-label"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-accent)',
                    marginBottom: '1rem',
                    display: 'block',
                  }}
                >
                  {barber.specialty} &bull; {barber.experience_years} Yrs Exp
                </span>
                <p
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    flexGrow: 1,
                  }}
                >
                  {barber.bio}
                </p>
                <a
                  href={`#/book?barber=${barber.id}`}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                  }}
                >
                  Book with {barber.name.split(' ')[0]}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Styles for interactive barber card hover states */}
      <style>{`
        .barber-profile-card:hover .barber-img {
          filter: grayscale(0%) contrast(100%) !important;
          transform: scale(1.03);
        }
        .barber-profile-card:hover .barber-img-frame {
          border-color: var(--color-accent) !important;
        }
        .barber-profile-card:hover .barber-corner-top {
          top: 4px !important;
          left: 4px !important;
        }
        .barber-profile-card:hover .barber-corner-bottom {
          bottom: 4px !important;
          right: 4px !important;
        }
      `}</style>
    </div>
  );
}
