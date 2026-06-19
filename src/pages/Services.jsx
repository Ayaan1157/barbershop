import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ScrollReveal from '../components/ScrollReveal';

export default function Services() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase.from('services').select('*');
        if (data) {
          const grouped = data.reduce((acc, service) => {
            const cat = service.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(service);
            return acc;
          }, {});
          setCategories(grouped);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const categoryDescriptions = {
    'Haircuts': 'Every cut begins with a detailed consultation regarding your head shape, hair growth patterns, and styling routine. Includes a hot lather neck cleanup and premium finish.',
    'Beard & Shave': 'Classic barbershop traditions brought to life. We utilize multiple hot towels, pre-shave hydration oils, and traditional straight razors to deliver a clean, comfortable finish.',
    'Grooming Add-ons': 'Complete your routine with specialized grooming care. These shorter, highly therapeutic treatments will refresh your skin and clean up fine details.'
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }} className="container">
      {/* Header */}
      <ScrollReveal style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span className="uppercase-label">The Menu</span>
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            marginTop: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--color-text)',
            textTransform: 'uppercase',
          }}
        >
          Services & Pricing
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
          Crafted haircuts, traditional straight-razor shaves, and grooming therapies. Prices are transparent, and durations are guaranteed.
        </p>
      </ScrollReveal>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '3rem' }}>
          Loading menu items...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {Object.entries(categories).map(([category, items]) => (
            <ScrollReveal key={category}>
              {/* Category Header */}
              <div
                style={{
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '1.5rem',
                  marginBottom: '2.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2
                    style={{
                      fontSize: '2rem',
                      color: 'var(--color-text)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {category}
                  </h2>
                  <span
                    className="uppercase-label"
                    style={{
                      color: 'var(--color-muted)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {items.length} Items Available
                  </span>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', maxWidth: '800px' }}>
                  {categoryDescriptions[category] || ''}
                </p>
              </div>

              {/* Service Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '2rem',
                }}
              >
                {items.map((service) => (
                  <div
                    key={service.id}
                    className="card-texture"
                    style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          color: 'var(--color-text)',
                          fontWeight: '700',
                        }}
                      >
                        {service.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '1.2rem',
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-accent)',
                          fontWeight: 'bold',
                        }}
                      >
                        ${parseFloat(service.price).toFixed(2)}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.75rem',
                        color: 'var(--color-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '1rem',
                      }}
                    >
                      <span>{service.duration} Minutes</span>
                      <span>&bull;</span>
                      <span>Incl. Hot Towel</span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        marginBottom: '2rem',
                        flexGrow: 1,
                      }}
                    >
                      {service.description}
                    </p>

                    <a
                      href={`#/book?service=${service.id}`}
                      className="btn btn-secondary"
                      style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        marginTop: 'auto',
                      }}
                    >
                      Book Appointment
                    </a>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Note Section */}
      <ScrollReveal
        style={{
          marginTop: '6rem',
          backgroundColor: 'var(--color-surface)',
          padding: '3rem',
          border: '1px solid var(--color-border)',
          textAlign: 'left',
          maxWidth: '800px',
          margin: '6rem auto 0',
        }}
      >
        <h3 style={{ fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
          Important Grooming Notes
        </h3>
        <ul
          style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.9rem',
            color: 'var(--color-muted)',
          }}
        >
          <li style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-accent)' }}>&bull;</span>
            <span><strong>Cancellations:</strong> Please notify us at least 24 hours in advance to cancel or reschedule.</span>
          </li>
          <li style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-accent)' }}>&bull;</span>
            <span><strong>Late Arrivals:</strong> If you are more than 10 minutes late, we may need to shorten your service or reschedule to protect back-to-back client slots.</span>
          </li>
          <li style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ color: 'var(--color-accent)' }}>&bull;</span>
            <span><strong>Walk-ins:</strong> Walk-ins are accommodated Tuesday through Friday depending on booking capacity. Saturdays are strictly by appointment only.</span>
          </li>
        </ul>
      </ScrollReveal>
    </div>
  );
}
