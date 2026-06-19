import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
    title: 'Low Skin Taper Fade',
    category: 'Haircuts',
    description: 'Precision scissor-over-comb blend with a crisp foil taper shave.'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    title: 'Royal Straight Razor Shave',
    category: 'Shaves',
    description: 'Traditional hot towel protocol with hand-whipped warm lather.'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1593702295094-aec22597af65?auto=format&fit=crop&q=80&w=800',
    title: 'Craft Tools & Pomades',
    category: 'Shop',
    description: 'Our collection of premium combs, natural beard oils, and styling waxes.'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1605497746444-ac9dbd3974a7?auto=format&fit=crop&q=80&w=800',
    title: 'Beard Sculpt & Mustache Work',
    category: 'Shaves',
    description: 'Detailed beard trim mapped to the natural jawline shape.'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800',
    title: 'The Mid-Fade & Lineup',
    category: 'Haircuts',
    description: 'Clean mid-skin fade with a laser sharp hairline edge.'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1517832606589-7a598b647192?auto=format&fit=crop&q=80&w=800',
    title: 'Classic Side Part',
    category: 'Haircuts',
    description: 'Timeless retro slick back styled with high-sheen wax.'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800',
    title: 'Vintage Leather Chairs',
    category: 'Shop',
    description: 'Our heavy-gauge Belmont leather chairs, built for comfort.'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?auto=format&fit=crop&q=80&w=800',
    title: 'The Brass Blade Signage',
    category: 'Shop',
    description: 'Welcome to the shop. Genuine craft on E 11th Street.'
  }
];

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Haircuts', 'Shaves', 'Shop'];

  const filteredImages = filter === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === filter);

  // Lightbox navigation functions
  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  // Keyboard events inside Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev(e);
      if (e.key === 'ArrowRight') showNext(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages]);

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
      <div className="container">
        {/* Header */}
        <ScrollReveal style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="uppercase-label">The Visuals</span>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              marginTop: '0.5rem',
              marginBottom: '1rem',
              color: 'var(--color-text)',
              textTransform: 'uppercase',
            }}
          >
            The Shop Gallery
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            A look inside our shop, the tools we clean with, and the sharp lines we cut daily on our clients.
          </p>
        </ScrollReveal>

        {/* Filter Buttons */}
        <ScrollReveal
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
            flexWrap: 'wrap',
          }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="btn"
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: '0.8rem',
                border: '1px solid var(--color-border)',
                backgroundColor: filter === cat ? 'var(--color-accent)' : 'var(--color-surface)',
                color: filter === cat ? '#1C1A18' : 'var(--color-text)',
              }}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Masonry-Style Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gridAutoRows: '260px',
            gap: '1.5rem',
          }}
        >
          {filteredImages.map((image, index) => {
            // Give some items a double vertical span to create a dynamic layout structure
            const isTall = index % 3 === 0;
            return (
              <ScrollReveal
                key={image.id}
                style={{
                  gridRowEnd: isTall ? 'span 2' : 'span 1',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border)',
                }}
                className="gallery-item-card"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(50%) contrast(110%)',
                    transition: 'var(--transition-smooth)',
                  }}
                  className="gallery-thumbnail"
                />
                
                {/* Overlay details */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem',
                    background: 'linear-gradient(to top, rgba(28, 26, 24, 0.9) 0%, rgba(28, 26, 24, 0) 100%)',
                    transform: 'translateY(10px)',
                    opacity: 0,
                    transition: 'var(--transition-smooth)',
                    textAlign: 'left',
                  }}
                  className="gallery-overlay"
                >
                  <span
                    className="uppercase-label"
                    style={{ fontSize: '0.65rem', color: 'var(--color-accent)', marginBottom: '0.25rem', display: 'block' }}
                  >
                    {image.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                    {image.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                    {image.description}
                  </p>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-accent)' }}>
                    <Maximize2 size={16} />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(28, 26, 24, 0.98)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          {/* Top Actions */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              display: 'flex',
              gap: '1.5rem',
              color: 'var(--color-text)',
            }}
          >
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Controls */}
          <button
            onClick={showPrev}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '1.5rem',
              background: 'rgba(42, 37, 32, 0.6)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2010,
            }}
            className="lightbox-nav-btn"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={showNext}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '1.5rem',
              background: 'rgba(42, 37, 32, 0.6)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              cursor: 'pointer',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2010,
            }}
            className="lightbox-nav-btn"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image and Details Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '85%',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={filteredImages[lightboxIndex].url}
              alt={filteredImages[lightboxIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                border: '1px solid var(--color-border)',
              }}
            />
            <div
              style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                maxWidth: '600px',
              }}
            >
              <span className="uppercase-label" style={{ fontSize: '0.7rem' }}>
                {filteredImages[lightboxIndex].category}
              </span>
              <h2 style={{ color: 'var(--color-text)', fontSize: '1.6rem', marginTop: '0.25rem' }}>
                {filteredImages[lightboxIndex].title}
              </h2>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                {filteredImages[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles for animations */}
      <style>{`
        .gallery-item-card:hover .gallery-thumbnail {
          filter: grayscale(0%) contrast(100%) !important;
          transform: scale(1.05);
        }
        .gallery-item-card:hover .gallery-overlay {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .lightbox-nav-btn:hover {
          background-color: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
          color: #1C1A18 !important;
        }
      `}</style>
    </div>
  );
}
