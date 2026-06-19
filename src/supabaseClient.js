import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock Data
const mockServices = [
  { id: 's1', name: 'The Classic Cut', category: 'Haircuts', price: 45.00, duration: 30, description: 'Precision clipper and scissors work, tailored to your head shape. Includes a hot lather neck shave and premium styling finish.' },
  { id: 's2', name: 'The Barbershop Signature', category: 'Haircuts', price: 65.00, duration: 45, description: 'Our signature haircut paired with a detailed wash, cooling scalp massage, and a hot towel treatment for ultimate relaxation.' },
  { id: 's3', name: 'Buzz & Fade', category: 'Haircuts', price: 35.00, duration: 30, description: 'A clean, high-and-tight cut using single-guard clippers, finished with a crisp foil taper and hot lather neck cleanup.' },
  { id: 's4', name: 'Classic Beard Trim', category: 'Beard & Shave', price: 30.00, duration: 30, description: 'Beard shaping and length reduction using clippers and shears, lined up with a precision trimmer and finished with premium beard oil.' },
  { id: 's5', name: 'The Royal Hot Towel Shave', category: 'Beard & Shave', price: 55.00, duration: 45, description: 'A traditional straight-razor shave with a sequence of pre-shave oils, three steaming towels, thick shaving cream, and a cooling aftershave splash.' },
  { id: 's6', name: 'Beard Trim & Razor Lineup', category: 'Beard & Shave', price: 40.00, duration: 30, description: 'Our classic beard trim enhanced with a sharp straight-razor cheek and neck lineup for a clean, sharp look.' },
  { id: 's7', name: 'Scalp Detox Therapy', category: 'Grooming Add-ons', price: 20.00, duration: 15, description: 'Exfoliating wash that removes product buildup, paired with a tea tree scalp massage and cold towel finish.' },
  { id: 's8', name: 'Nose & Ear Waxing', category: 'Grooming Add-ons', price: 15.00, duration: 10, description: 'Quick and efficient hair removal from ears and nose using gentle, warm peel-off wax.' },
  { id: 's9', name: 'Charcoal Face Mask', category: 'Grooming Add-ons', price: 25.00, duration: 20, description: 'Deep cleansing peel-off charcoal mask to unclog pores and revitalize the skin, followed by a warm steam wrap and moisturizer.' }
];

const mockBarbers = [
  { id: 'b1', name: 'Marcus Vance', specialty: 'Modern Fades & Razor Lineups', experience_years: 12, bio: 'Marcus is a master of contrast and clean lines. With over a decade of experience, he specializes in high skin fades, intricate razor work, and beard sculpts.', image_url: 'https://images.unsplash.com/photo-1605497746444-ac9dbd3974a7?auto=format&fit=crop&q=80&w=600' },
  { id: 'b2', name: 'Silas Thorne', specialty: 'Classic Scissor Cuts & Shaves', experience_years: 9, bio: 'Silas blends old-school barbering heritage with contemporary style. He is our resident straight-razor expert and a firm believer in the art of the slow shave.', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
  { id: 'b3', name: 'Julian Pierce', specialty: 'Textured Cuts & Styled Flows', experience_years: 6, bio: 'Julian loves working with longer hair and textured styles. If you want a modern flow, crop, or textured fringe, Julian is your go-to artisan.', image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600' },
  { id: 'b4', name: 'Devon Cole', specialty: 'Beard Sculpting & Grooming Care', experience_years: 8, bio: 'Devon is passionate about beard care. He treats every beard like a sculpture, matching it to his client\'s jawline and advising on long-term beard health.', image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600' }
];

// Helper to get local bookings
const getLocalBookings = () => {
  const data = localStorage.getItem('barbershop_bookings');
  return data ? JSON.parse(data) : [];
};

// Helper to save local bookings
const saveLocalBookings = (bookings) => {
  localStorage.setItem('barbershop_bookings', JSON.stringify(bookings));
};

const createMockSupabase = () => {
  console.warn('Supabase URL/Key missing. Using client-side mock database.');
  return {
    from: (table) => {
      return {
        select: (query = '*') => {
          let data = [];
          if (table === 'services') data = [...mockServices];
          if (table === 'barbers') data = [...mockBarbers];
          if (table === 'bookings') data = getLocalBookings();

          return {
            data,
            error: null,
            // Allow chaining then() directly
            then: (resolve) => resolve({ data, error: null })
          };
        },
        insert: (rows) => {
          if (table === 'bookings') {
            const currentBookings = getLocalBookings();
            const formattedRows = (Array.isArray(rows) ? rows : [rows]).map(row => ({
              id: Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              ...row
            }));
            const updated = [...currentBookings, ...formattedRows];
            saveLocalBookings(updated);
            return {
              data: formattedRows,
              error: null,
              then: (resolve) => resolve({ data: formattedRows, error: null })
            };
          }
          return { data: null, error: 'Write error', then: (resolve) => resolve({ data: null, error: 'Write error' }) };
        }
      };
    }
  };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();
