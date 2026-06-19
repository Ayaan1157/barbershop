import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Appointment Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      alert('Please fill out all required fields.');
      return;
    }
    // Simulate API request
    setSubmitted(true);
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <ScrollReveal style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="uppercase-label">Visit Us</span>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--color-text)',
              textTransform: 'uppercase',
            }}
          >
            Contact & Location
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Have questions or want to schedule a custom group booking? Reach out or visit us in East Austin.
          </p>
        </ScrollReveal>

        {/* Contact Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            textAlign: 'left',
            alignItems: 'start',
          }}
        >
          {/* Details Column */}
          <ScrollReveal>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              The Shop Details
            </h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              <li style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-accent)', padding: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>Location</h3>
                  <p style={{ fontSize: '0.95rem' }}>1209 E 11th St, Austin, TX 78702</p>
                  <a
                    href="https://maps.google.com/?q=1209+E+11th+St,+Austin,+TX+78702"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-accent)',
                      textDecoration: 'underline',
                      marginTop: '0.5rem',
                      display: 'inline-block',
                    }}
                  >
                    Get Directions &rarr;
                  </a>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-accent)', padding: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>Hours of Operation</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.95rem', minWidth: '220px' }}>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted)' }}>Tuesday – Friday</span>
                      <span>10:00 AM – 8:00 PM</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted)' }}>Saturday</span>
                      <span>9:00 AM – 6:00 PM</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted)' }}>Sunday</span>
                      <span>11:00 AM – 5:00 PM</span>
                    </li>
                    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted)' }}>Monday</span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>CLOSED</span>
                    </li>
                  </ul>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-accent)', padding: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>Phone</h3>
                  <p style={{ fontSize: '0.95rem' }}>Call or Text: (512) 555-0192</p>
                </div>
              </li>

              <li style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-accent)', padding: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>Email</h3>
                  <p style={{ fontSize: '0.95rem' }}>info@barbershop.com</p>
                </div>
              </li>
            </ul>
          </ScrollReveal>

          {/* Form Column */}
          <ScrollReveal>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2.5rem',
              }}
            >
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ color: 'var(--color-accent)', display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Thanks for reaching out. We will read your message and reply to <strong>{formState.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setFormState({ name: '', email: '', subject: 'Appointment Inquiry', message: '' });
                      setSubmitted(false);
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Send a Message
                  </h2>

                  <div>
                    <label htmlFor="con-name" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                      Your Name *
                    </label>
                    <input
                      id="con-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="con-email" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                      Email Address *
                    </label>
                    <input
                      id="con-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="con-subject" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                      Subject
                    </label>
                    <select
                      id="con-subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                      }}
                    >
                      <option value="Appointment Inquiry">Appointment Inquiry</option>
                      <option value="Group Booking (3+ people)">Group Booking (3+ people)</option>
                      <option value="Career Opportunities">Career / Apply</option>
                      <option value="Other feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="con-message" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                      Message *
                    </label>
                    <textarea
                      id="con-message"
                      required
                      rows="4"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '1rem',
                        resize: 'vertical',
                        fontFamily: 'var(--font-body)',
                      }}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Custom Styled Map Panel */}
        <ScrollReveal style={{ marginTop: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '1.5rem', textTransform: 'uppercase', textAlign: 'left' }}>
            Find Our Shop
          </h2>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Custom Aesthetic Styled Vector Map representation */}
            <svg
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0.15,
              }}
            >
              {/* Decorative grid & map lines */}
              <line x1="0%" y1="10%" x2="100%" y2="10%" stroke="var(--color-text)" strokeWidth="1" />
              <line x1="0%" y1="35%" x2="100%" y2="35%" stroke="var(--color-text)" strokeWidth="1" />
              <line x1="0%" y1="60%" x2="100%" y2="60%" stroke="var(--color-text)" strokeWidth="1" />
              <line x1="0%" y1="85%" x2="100%" y2="85%" stroke="var(--color-text)" strokeWidth="1" />

              <line x1="15%" y1="0%" x2="15%" y2="100%" stroke="var(--color-text)" strokeWidth="1" />
              <line x1="45%" y1="0%" x2="45%" y2="100%" stroke="var(--color-text)" strokeWidth="1" />
              <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="var(--color-text)" strokeWidth="1" />

              {/* Angle roads */}
              <line x1="0%" y1="20%" x2="100%" y2="80%" stroke="var(--color-text)" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Highlight Pin Area */}
              <circle cx="45%" cy="35%" r="10" fill="var(--color-accent)" opacity="0.3" />
            </svg>

            {/* Foreground Card */}
            <div
              style={{
                zIndex: 2,
                backgroundColor: 'rgba(28, 26, 24, 0.95)',
                border: '1px solid var(--color-accent)',
                padding: '2.5rem',
                maxWidth: '420px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Barbershop</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
                1209 E 11th St, Austin, TX 78702 <br />
                Located in the historic East Austin district. Street parking is available along E 11th.
              </p>
              <a
                href="https://maps.google.com/?q=1209+E+11th+St,+Austin,+TX+78702"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
