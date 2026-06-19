-- Supabase Schema for Barbershop

-- 1. Create Services Table
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- 'Haircuts', 'Beard & Shave', 'Grooming Add-ons'
  price numeric(6, 2) not null,
  duration integer not null, -- in minutes
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Barbers Table
create table if not exists barbers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialty text not null,
  experience_years integer not null,
  bio text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Bookings Table
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  service_id uuid references services(id) not null,
  barber_id uuid references barbers(id), -- Nullable for "Any Barber"
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  booking_date date not null,
  booking_time time not null, -- e.g., '10:30:00'
  duration integer not null, -- copied from service at booking time
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for all tables
alter table services enable row level security;
alter table barbers enable row level security;
alter table bookings enable row level security;

-- Create policies (for public read access to services and barbers)
create policy "Allow public read access to services" on services
  for select using (true);

create policy "Allow public read access to barbers" on barbers
  for select using (true);

-- Create policies for bookings
create policy "Allow public inserts to bookings" on bookings
  for insert with check (true);

create policy "Allow public read access to bookings" on bookings
  for select using (true);

-- Seed Services
insert into services (name, category, price, duration, description) values
('The Classic Cut', 'Haircuts', 45.00, 30, 'Precision clipper and scissors work, tailored to your head shape. Includes a hot lather neck shave and premium styling finish.'),
('The Barbershop Signature', 'Haircuts', 65.00, 45, 'Our signature haircut paired with a detailed wash, cooling scalp massage, and a hot towel treatment for ultimate relaxation.'),
('Buzz & Fade', 'Haircuts', 35.00, 30, 'A clean, high-and-tight cut using single-guard clippers, finished with a crisp foil taper and hot lather neck cleanup.'),
('Classic Beard Trim', 'Beard & Shave', 30.00, 30, 'Beard shaping and length reduction using clippers and shears, lined up with a precision trimmer and finished with premium beard oil.'),
('The Royal Hot Towel Shave', 'Beard & Shave', 55.00, 45, 'A traditional straight-razor shave with a sequence of pre-shave oils, three steaming towels, thick shaving cream, and a cooling aftershave splash.'),
('Beard Trim & Razor Lineup', 'Beard & Shave', 40.00, 30, 'Our classic beard trim enhanced with a sharp straight-razor cheek and neck lineup for a clean, sharp look.'),
('Scalp Detox Therapy', 'Grooming Add-ons', 20.00, 15, 'Exfoliating wash that removes product buildup, paired with a tea tree scalp massage and cold towel finish.'),
('Nose & Ear Waxing', 'Grooming Add-ons', 15.00, 10, 'Quick and efficient hair removal from ears and nose using gentle, warm peel-off wax.'),
('Charcoal Face Mask', 'Grooming Add-ons', 25.00, 20, 'Deep cleansing peel-off charcoal mask to unclog pores and revitalize the skin, followed by a warm steam wrap and moisturizer.');

-- Seed Barbers
insert into barbers (name, specialty, experience_years, bio, image_url) values
('Marcus Vance', 'Modern Fades & Razor Lineups', 12, 'Marcus is a master of contrast and clean lines. With over a decade of experience, he specializes in high skin fades, intricate razor work, and beard sculpts.', 'marcus_vance.jpg'),
('Silas Thorne', 'Classic Scissor Cuts & Shaves', 9, 'Silas blends old-school barbering heritage with contemporary style. He is our resident straight-razor expert and a firm believer in the art of the slow shave.', 'silas_thorne.jpg'),
('Julian Pierce', 'Textured Cuts & Styled Flows', 6, 'Julian loves working with longer hair and textured styles. If you want a modern flow, crop, or textured fringe, Julian is your go-to artisan.', 'julian_pierce.jpg'),
('Devon Cole', 'Beard Sculpting & Grooming Care', 8, 'Devon is passionate about beard care. He treats every beard like a sculpture, matching it to his client''s jawline and advising on long-term beard health.', 'devon_cole.jpg');
