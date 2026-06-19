import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import RazorDivider from '../components/RazorDivider';
import ScrollReveal from '../components/ScrollReveal';
import { Calendar, Shield, Award, Clock } from 'lucide-react';

export default function Home() {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredBarber, setFeaturedBarber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: servicesData } = await supabase.from('services').select('*');
        const { data: barbersData } = await supabase.from('barbers').select('*');

        if (servicesData) {
          // Grab 3 signature services (Classic Cut, Royal Shave, Beard Trim)
          const signatures = servicesData.filter(s => 
            s.name.includes('Classic Cut') || 
            s.name.includes('Royal Hot Towel') ||
            s.name.includes('Beard Trim & Razor')
          );
          setFeaturedServices(signatures.length ? signatures : servicesData.slice(0, 3));
        }

        if (barbersData && barbersData.length) {
          // Set Marcus Vance (or first barber) as featured
          const marcus = barbersData.find(b => b.name.includes('Marcus')) || barbersData[0];
          setFeaturedBarber(marcus);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const testimonials = [
    {
      quote: "Barbershop is exactly what a shop should be. Clean cuts, high-quality products, and a calm, confident atmosphere. Marcus does a skin fade like nobody else in Austin.",
      author: "Travis G.",
      service: "The Classic Cut"
    },
    {
      quote: "The Royal Hot Towel Shave is a spiritual experience. Silas Thorne handles the straight razor with absolute mastery. Highly recommended if you value proper grooming.",
      author: "Ethan R.",
      service: "Royal Hot Towel Shave"
    },
    {
      quote: "No gimmicks, no pretentious vibes. Just skilled craftspeople who take pride in what they do. Standard is incredibly high here.",
      author: "David L.",
      service: "Beard Trim & Lineup"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero-texture"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 1.5rem 80px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '800px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span
            className="uppercase-label"
            style={{
              display: 'inline-block',
              marginBottom: '16px',
              color: 'var(--color-accent)',
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
            }}
          >
            Est. 2024 / East Austin
          </span>
          <h1
            style={{
              fontSize: 'clamp(3.5rem, 8vw, 6rem)',
              lineHeight: '0.9',
              margin: '0 0 24px',
              fontFamily: 'var(--font-display)',
              fontWeight: '900',
              color: 'var(--color-text)',
              textTransform: 'uppercase',
            }}
          >
            Barbershop
          </h1>
          <p
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              color: 'var(--color-muted)',
              maxWidth: '460px',
              margin: '0 auto 40px',
              lineHeight: '1.4',
            }}
          >
            A neighborhood barbershop dedicated to the timeless craft of premium grooming.
          </p>
          <div>
            <a href="#/book" className="btn btn-primary" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
              Book Your Cut
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: 'var(--color-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll</span>
          <div
            style={{
              width: '1px',
              height: '30px',
              backgroundColor: 'var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--color-accent)',
                animation: 'scrollLine 2s infinite ease-in-out',
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Signature straight-razor divider */}
      <RazorDivider />

      {/* Intro / Philosophy Section */}
      <section className="section-padding container">
        <ScrollReveal>
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <span className="uppercase-label">The Philosophy</span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                margin: '1.5rem 0',
                color: 'var(--color-text)',
              }}
            >
              Honest Craft. No Shortcuts.
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '3rem' }}>
              We believe a haircut is more than just service—it’s a ritual. At Barbershop, we combine classical barbering techniques with modern style. No rush jobs. No templates. Every client walks out with a custom cut tailored specifically to their features, hair texture, and lifestyle, in an environment modeled after the neighborhood joints we grew up in.
            </p>
            
            {/* Features Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2.5rem',
                marginTop: '4rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <Award size={36} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Licensed Artisans</h3>
                <p style={{ fontSize: '0.9rem' }}>Every barber on our floor has years of active shop-floor service.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <Shield size={36} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Premium Products</h3>
                <p style={{ fontSize: '0.9rem' }}>We groom using only small-batch, oil-based, and natural formulations.</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-accent)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <Clock size={36} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Dedicated Time</h3>
                <p style={{ fontSize: '0.9rem' }}>We allocate full 30 to 45 minute blocks to prevent rushed cuts.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Signature Services Teaser */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
        className="section-padding"
      >
        <div className="container">
          <ScrollReveal
            style={{
              display: 'flex',
              flexDirection: 'column',
              mdDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '4rem',
            }}
            className="flex-header-row"
          >
            <div style={{ textAlign: 'left' }}>
              <span className="uppercase-label">Signature Cuts</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--color-text)', marginTop: '0.5rem' }}>
                Popular Services
              </h2>
            </div>
            <a
              href="#/services"
              className="btn btn-outline"
              style={{
                marginTop: '1rem',
              }}
            >
              View Full Menu
            </a>
          </ScrollReveal>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Loading services...</div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}
            >
              {featuredServices.map(service => (
                <ScrollReveal key={service.id} className="card-texture" style={{ padding: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>{service.name}</h3>
                    <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                      ${parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                  <span
                    className="uppercase-label"
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--color-muted)',
                      marginBottom: '1rem',
                      display: 'block',
                    }}
                  >
                    {service.duration} mins / {service.category}
                  </span>
                  <p style={{ fontSize: '0.9rem', marginBottom: '2rem', flexGrow: 1 }}>{service.description}</p>
                  <a href={`#/book?service=${service.id}`} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>
                    Book Service
                  </a>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Barber Spotlight */}
      {featuredBarber && (
        <section className="section-padding container">
          <ScrollReveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '4rem',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              {/* Image Container with Sharp Brass Border styling */}
              <div
                style={{
                  position: 'relative',
                  border: '1px solid var(--color-border)',
                  padding: '12px',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '24px',
                    height: '24px',
                    borderTop: '2px solid var(--color-accent)',
                    borderLeft: '2px solid var(--color-accent)',
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    right: '-6px',
                    width: '24px',
                    height: '24px',
                    borderBottom: '2px solid var(--color-accent)',
                    borderRight: '2px solid var(--color-accent)',
                  }}
                ></div>
                <img
                  src={
                    featuredBarber.image_url
                      ? featuredBarber.image_url.startsWith('http')
                        ? featuredBarber.image_url
                        : featuredBarber.image_url.includes('marcus')
                        ? 'https://images.unsplash.com/photo-1605497746444-ac9dbd3974a7?auto=format&fit=crop&q=80&w=600'
                        : '/' + featuredBarber.image_url
                      : ''
                  }
                  alt={featuredBarber.name}
                  style={{
                    width: '100%',
                    height: '450px',
                    objectFit: 'cover',
                    filter: 'grayscale(30%) contrast(110%)',
                  }}
                />
              </div>

              {/* Bio Details */}
              <div>
                <span className="uppercase-label">Featured Artisan</span>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-text)', margin: '0.5rem 0 1.5rem' }}>
                  {featuredBarber.name}
                </h2>
                <h3
                  className="uppercase-label"
                  style={{
                    color: 'var(--color-muted)',
                    fontSize: '0.8rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  Specialty: {featuredBarber.specialty} / {featuredBarber.experience_years} Years Experience
                </h3>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
                  "{featuredBarber.bio}"
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a href={`#/book?barber=${featuredBarber.id}`} className="btn btn-primary">
                    Book With {featuredBarber.name.split(' ')[0]}
                  </a>
                  <a href="#/barbers" className="btn btn-secondary">
                    Meet the Team
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Testimonials Strip */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
        className="section-padding"
      >
        <div className="container">
          <ScrollReveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="uppercase-label">Verified Guests</span>
            <h2 style={{ color: 'var(--color-text)', marginTop: '0.5rem' }}>What They Say</h2>
          </ScrollReveal>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {testimonials.map((t, idx) => (
              <ScrollReveal
                key={idx}
                style={{
                  borderLeft: '2px solid var(--color-accent)',
                  paddingLeft: '1.5rem',
                  textAlign: 'left',
                }}
              >
                <p
                  style={{
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    color: 'var(--color-text)',
                    lineHeight: '1.7',
                    marginBottom: '1rem',
                  }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <h4 style={{ color: 'var(--color-text)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                    {t.author}
                  </h4>
                  <span className="uppercase-label" style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>
                    Verified cut: {t.service}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section
        className="hero-texture"
        style={{
          padding: '8rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          <span className="uppercase-label" style={{ color: 'var(--color-accent)' }}>
            Ready to experience the craft?
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              color: 'var(--color-text)',
              margin: '1rem 0 1.5rem',
              lineHeight: '1.1',
            }}
          >
            Schedule Your Next Appointment
          </h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            Book in advance to secure your preferred slot. Walk-ins are subject to floor availability.
          </p>
          <a href="#/book" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
            Book Your Cut
          </a>
        </div>
      </section>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
        @media (max-width: 768px) {
          .flex-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
