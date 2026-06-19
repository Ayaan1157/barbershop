import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ScrollReveal from '../components/ScrollReveal';
import { Calendar as CalendarIcon, User, CheckCircle2, Clock, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Booking() {
  // Booking state
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Wizard Steps
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null); // null means "Any Available Barber"
  const [selectedDate, setSelectedDate] = useState(''); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState(''); // HH:MM
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Calendar UI states
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11

  // Parse initial query params from hash link (e.g. #/book?service=s1&barber=b1)
  useEffect(() => {
    async function loadData() {
      try {
        const { data: sData } = await supabase.from('services').select('*');
        const { data: bData } = await supabase.from('barbers').select('*');
        const { data: bkData } = await supabase.from('bookings').select('*');

        if (sData) setServices(sData);
        if (bData) setBarbers(bData);
        if (bkData) setBookings(bkData);

        // Process URL parameters
        const hash = window.location.hash;
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        
        const serviceId = params.get('service');
        const barberId = params.get('barber');

        if (sData && serviceId) {
          const matchedService = sData.find(s => s.id === serviceId);
          if (matchedService) setSelectedService(matchedService);
        }
        if (bData && barberId) {
          const matchedBarber = bData.find(b => b.id === barberId);
          if (matchedBarber) setSelectedBarber(matchedBarber);
        }
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Time conversion helper (minutes since midnight)
  const timeToMinutes = (timeStr) => {
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  // Availability algorithm helper
  const checkSlotAvailability = (date, timeStr, duration, barberObj, existingBookings, allBarbers) => {
    const startMins = timeToMinutes(timeStr);
    const endMins = startMins + duration;

    // Filter bookings on this specific day
    const dayBookings = existingBookings.filter(b => b.booking_date === date);

    if (barberObj) {
      // Checking for a specific barber
      const conflicts = dayBookings.filter(b => {
        // Match either this barber specifically, or matches "Any Barber" (which might have been assigned this barber)
        const isSameBarber = b.barber_id === barberObj.id || b.barber_id === null || b.barber_id === undefined;
        if (!isSameBarber) return false;

        const bStart = timeToMinutes(b.booking_time);
        const bEnd = bStart + b.duration;
        // Overlap math: start1 < end2 AND start2 < end1
        return bStart < endMins && startMins < bEnd;
      });

      return conflicts.length === 0;
    } else {
      // Checking if "Any Barber" is available (at least one barber must be free)
      const freeBarbers = allBarbers.filter(barber => {
        const conflicts = dayBookings.filter(b => {
          const isSameBarber = b.barber_id === barber.id;
          if (!isSameBarber) return false;

          const bStart = timeToMinutes(b.booking_time);
          const bEnd = bStart + b.duration;
          return bStart < endMins && startMins < bEnd;
        });
        return conflicts.length === 0;
      });

      return freeBarbers.length > 0;
    }
  };

  // Generate list of time slots for the chosen day
  const getAvailableSlotsForDate = (date) => {
    if (!date || !selectedService) return [];

    const dateObj = new Date(date + 'T00:00:00');
    const day = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    if (day === 1) return []; // Closed Mondays

    // Determine shop hours
    let startHour = 10;
    let endHour = 20; // Tue-Fri: 10am-8pm
    if (day === 6) { startHour = 9; endHour = 18; } // Sat: 9am-6pm
    if (day === 0) { startHour = 11; endHour = 17; } // Sun: 11am-5pm

    const duration = selectedService.duration;
    const slots = [];

    // Loop through 30-min intervals
    let curr = new Date(dateObj);
    curr.setHours(startHour, 0, 0, 0);

    const limit = new Date(dateObj);
    limit.setHours(endHour, 0, 0, 0);

    const now = new Date();
    const isToday = now.toDateString() === dateObj.toDateString();

    while (curr.getTime() + duration * 60 * 1000 <= limit.getTime()) {
      const slotTimeStr = curr.toTimeString().split(' ')[0].substring(0, 5); // "10:30"
      
      // If date is today, filter out times already in the past
      let inPast = false;
      if (isToday) {
        const slotHour = curr.getHours();
        const slotMin = curr.getMinutes();
        if (slotHour < now.getHours() || (slotHour === now.getHours() && slotMin <= now.getMinutes())) {
          inPast = true;
        }
      }

      const available = !inPast && checkSlotAvailability(
        date,
        slotTimeStr,
        duration,
        selectedBarber,
        bookings,
        barbers
      );

      slots.push({
        time: slotTimeStr,
        display: curr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        available
      });

      curr.setMinutes(curr.getMinutes() + 30);
    }

    return slots;
  };

  // Handle month changes in calendar
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((yr) => yr - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((yr) => yr + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Render Calendar Helper
  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    const calendarCells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      calendarCells.push(<div key={`empty-${i}`} style={{ aspectRatio: '1' }}></div>);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDateObj = new Date(currentYear, currentMonth, day);
      const isMonday = dayDateObj.getDay() === 1;
      const isPast = dayDateObj < today;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;

      const isDisabled = isMonday || isPast;

      calendarCells.push(
        <button
          key={`day-${day}`}
          disabled={isDisabled}
          onClick={() => {
            setSelectedDate(dateStr);
            setSelectedTime(''); // Reset selected time when date changes
          }}
          style={{
            aspectRatio: '1',
            backgroundColor: isSelected
              ? 'var(--color-accent)'
              : isDisabled
              ? 'transparent'
              : 'var(--color-surface)',
            border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
            color: isSelected
              ? '#1C1A18'
              : isDisabled
              ? 'var(--color-border)'
              : 'var(--color-text)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'var(--transition-fast)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          className={isDisabled ? '' : 'calendar-day-btn'}
        >
          <span>{day}</span>
          {isMonday && (
            <span style={{ fontSize: '0.55rem', color: '#ff6b6b', position: 'absolute', bottom: '4px' }}>
              Closed
            </span>
          )}
        </button>
      );
    }

    return calendarCells;
  };

  // Submit appointment to Supabase
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert('Please fill out all contact details.');
      return;
    }

    setLoading(true);

    const bookingPayload = {
      service_id: selectedService.id,
      barber_id: selectedBarber ? selectedBarber.id : null,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      booking_date: selectedDate,
      booking_time: selectedTime + ':00',
      duration: selectedService.duration
    };

    try {
      const { data, error } = await supabase.from('bookings').insert(bookingPayload);
      if (error) throw error;
      
      // Update local cache and step forward
      const newBookingWithDetails = {
        ...bookingPayload,
        service: selectedService,
        barber: selectedBarber
      };
      setBookings((prev) => [...prev, newBookingWithDetails]);
      setStep(6);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('There was a problem submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar integration url generator
  const getGoogleCalendarUrl = () => {
    if (!selectedService || !selectedDate || !selectedTime) return '';
    const dateFormatted = selectedDate.replace(/-/g, '');
    const startTimeStr = selectedTime.replace(/:/g, '') + '00';
    
    // Calculate end time
    const startMins = timeToMinutes(selectedTime);
    const endMins = startMins + selectedService.duration;
    const endHour = Math.floor(endMins / 60);
    const endMin = endMins % 60;
    const endTimeStr = String(endHour).padStart(2, '0') + String(endMin).padStart(2, '0') + '00';

    const title = encodeURIComponent(`Haircut @ Barbershop (${selectedService.name})`);
    const details = encodeURIComponent(
      `Appointment details:\nService: ${selectedService.name}\nBarber: ${selectedBarber ? selectedBarber.name : 'Any Available Barber'}\nDuration: ${selectedService.duration} mins\nAddress: 1209 E 11th St, Austin, TX 78702`
    );
    const location = encodeURIComponent('1209 E 11th St, Austin, TX 78702');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T${startTimeStr}/${dateFormatted}T${endTimeStr}&details=${details}&location=${location}`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];

  if (loading && step !== 6) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', color: 'var(--color-muted)' }}>Loading booking details...</div>;
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="uppercase-label">Reservations</span>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
            Book Your Cut
          </h1>
          {/* Progress Indicators */}
          {step < 6 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '2rem',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: step >= 1 ? 'var(--color-accent)' : 'var(--color-muted)' }}>1. Service</span>
              <span>&rarr;</span>
              <span style={{ color: step >= 2 ? 'var(--color-accent)' : 'var(--color-muted)' }}>2. Barber</span>
              <span>&rarr;</span>
              <span style={{ color: step >= 3 ? 'var(--color-accent)' : 'var(--color-muted)' }}>3. Date & Time</span>
              <span>&rarr;</span>
              <span style={{ color: step >= 5 ? 'var(--color-accent)' : 'var(--color-muted)' }}>4. Details</span>
            </div>
          )}
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <ScrollReveal style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              Select a Grooming Service
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: selectedService?.id === service.id ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                    border: `1px solid ${selectedService?.id === service.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition-fast)',
                  }}
                  className="booking-service-item"
                >
                  <div style={{ flexGrow: 1, paddingRight: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{service.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>{service.description}</p>
                    <span className="uppercase-label" style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>
                      Duration: {service.duration} mins / Category: {service.category}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                      ${parseFloat(service.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                disabled={!selectedService}
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ opacity: selectedService ? 1 : 0.5, cursor: selectedService ? 'pointer' : 'not-allowed' }}
              >
                Next Step &rarr;
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* STEP 2: BARBER SELECTION */}
        {step === 2 && (
          <ScrollReveal style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              Choose a Barber
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Any Barber Card */}
              <div
                onClick={() => setSelectedBarber(null)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: selectedBarber === null ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                  border: `1px solid ${selectedBarber === null ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  cursor: 'pointer',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '260px',
                  transition: 'var(--transition-fast)',
                }}
                className="booking-barber-item"
              >
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1rem' }}>
                  <User size={48} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Any Available Barber</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  Select this for maximum availability. We will match you with the first free artisan.
                </p>
              </div>

              {/* Barbers Grid */}
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber)}
                  style={{
                    padding: '1.25rem',
                    backgroundColor: selectedBarber?.id === barber.id ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                    border: `1px solid ${selectedBarber?.id === barber.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition-fast)',
                  }}
                  className="booking-barber-item"
                >
                  <img
                    src={
                      barber.image_url
                        ? barber.image_url.startsWith('http')
                          ? barber.image_url
                          : barber.image_url.includes('marcus')
                          ? '/marcus_vance.jpg'
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
                      height: '140px',
                      objectFit: 'cover',
                      filter: 'grayscale(40%)',
                      marginBottom: '1rem',
                    }}
                  />
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{barber.name}</h3>
                  <span className="uppercase-label" style={{ fontSize: '0.6rem', marginBottom: '0.5rem', display: 'block' }}>
                    {barber.specialty}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', lineHeight: '1.4' }}>
                    {barber.bio.substring(0, 75)}...
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">
                &larr; Back
              </button>
              <button onClick={() => setStep(3)} className="btn btn-primary">
                Next Step &rarr;
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* STEP 3 & 4: CALENDAR & TIME SELECTOR */}
        {step === 3 && (
          <ScrollReveal style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
              Select Date & Time
            </h2>
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Calendar Container */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handlePrevMonth}
                      aria-label="Previous Month"
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '6px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      aria-label="Next Month"
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '6px 12px',
                        cursor: 'pointer',
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Days of week row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textAlign: 'center',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    color: 'var(--color-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Calendar grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                  }}
                >
                  {renderCalendarDays()}
                </div>
              </div>

              {/* Time Slots Container */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                  {selectedDate ? `Available Slots for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}` : 'Select a date first'}
                </h3>

                {selectedDate ? (
                  timeSlots.length === 0 ? (
                    <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-muted)' }}>
                      We are closed on this date.
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '8px',
                        maxHeight: '340px',
                        overflowY: 'auto',
                        paddingRight: '6px',
                      }}
                    >
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          style={{
                            padding: '0.75rem 0.5rem',
                            backgroundColor: selectedTime === slot.time
                              ? 'var(--color-accent)'
                              : slot.available
                              ? 'var(--color-surface)'
                              : 'transparent',
                            border: `1px solid ${
                              selectedTime === slot.time
                                ? 'var(--color-accent)'
                                : slot.available
                                ? 'var(--color-border)'
                                : 'rgba(58, 52, 46, 0.3)'
                            }`,
                            color: selectedTime === slot.time
                              ? '#1C1A18'
                              : slot.available
                              ? 'var(--color-text)'
                              : 'var(--color-border)',
                            cursor: slot.available ? 'pointer' : 'not-allowed',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            textAlign: 'center',
                            transition: 'var(--transition-fast)',
                          }}
                          className={slot.available ? 'booking-time-btn' : ''}
                        >
                          {slot.display}
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  <div style={{ flexGrow: 1, border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', padding: '2rem', textAlign: 'center' }}>
                    Please select a date on the calendar to view available appointments.
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary">
                &larr; Back
              </button>
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(5)}
                className="btn btn-primary"
                style={{ opacity: (selectedDate && selectedTime) ? 1 : 0.5, cursor: (selectedDate && selectedTime) ? 'pointer' : 'not-allowed' }}
              >
                Next Step &rarr;
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* STEP 5: CUSTOMER DETAILS & BOOKING SUMMARY */}
        {step === 5 && (
          <ScrollReveal style={{ textAlign: 'left' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '3rem',
                alignItems: 'start',
                marginBottom: '2.5rem',
              }}
            >
              {/* Input Form */}
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  Contact Information
                </h2>
                
                <div>
                  <label htmlFor="cus-name" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                    Full Name *
                  </label>
                  <input
                    id="cus-name"
                    type="text"
                    required
                    value={customerDetails.name}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="cus-email" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                    Email Address *
                  </label>
                  <input
                    id="cus-email"
                    type="email"
                    required
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="cus-phone" style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
                    Phone Number *
                  </label>
                  <input
                    id="cus-phone"
                    type="tel"
                    required
                    placeholder="(512) 555-0100"
                    value={customerDetails.phone}
                    onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '1rem',
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
                  * Required fields. We will only use your details for appointment notifications and confirmations.
                </div>
              </form>

              {/* Booking Summary Panel */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                }}
              >
                <h3 className="uppercase-label" style={{ marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                  Booking Summary
                </h3>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                  <li style={{ display: 'flex', gap: '1rem' }}>
                    <Clock size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Service</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: '600' }}>{selectedService?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>{selectedService?.duration} Mins</div>
                    </div>
                  </li>

                  <li style={{ display: 'flex', gap: '1rem' }}>
                    <User size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Barber</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: '600' }}>{selectedBarber ? selectedBarber.name : 'Any Available Barber'}</div>
                    </div>
                  </li>

                  <li style={{ display: 'flex', gap: '1rem' }}>
                    <CalendarIcon size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Date & Time</div>
                      <div style={{ color: 'var(--color-text)', fontWeight: '600' }}>
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ color: 'var(--color-text)', fontWeight: '600' }}>{selectedTime}</div>
                    </div>
                  </li>
                </ul>

                {/* Total Cost */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total (Pay at shop)</span>
                  <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                    ${parseFloat(selectedService?.price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setStep(3)} className="btn btn-secondary">
                &larr; Back
              </button>
              <button onClick={handleBookingSubmit} className="btn btn-primary">
                Confirm Booking &rarr;
              </button>
            </div>
          </ScrollReveal>
        )}

        {/* STEP 6: CONFIRMATION SCREEN */}
        {step === 6 && (
          <ScrollReveal style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ color: 'var(--color-accent)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <CheckCircle2 size={64} />
            </div>
            
            <h2 style={{ fontSize: '2rem', color: 'var(--color-text)', marginBottom: '0.75rem' }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem' }}>
              Thank you, {customerDetails.name}. Your appointment has been secured. A confirmation email has been queued to <strong>{customerDetails.email}</strong>.
            </p>

            {/* Recipient details recap box */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                padding: '1.5rem',
                textAlign: 'left',
                marginBottom: '2.5rem',
              }}
            >
              <h3 className="uppercase-label" style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                Your Reservation Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div><strong>Service:</strong> {selectedService?.name}</div>
                <div><strong>Barber:</strong> {selectedBarber ? selectedBarber.name : 'Any Available Barber'}</div>
                <div>
                  <strong>When:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} at {selectedTime}
                </div>
                <div><strong>Location:</strong> 1209 E 11th St, Austin, TX 78702</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                Add to Google Calendar
              </a>
              <button
                onClick={() => {
                  // Reset states and go back to step 1
                  setSelectedService(null);
                  setSelectedBarber(null);
                  setSelectedDate('');
                  setSelectedTime('');
                  setCustomerDetails({ name: '', email: '', phone: '' });
                  setStep(1);
                }}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Book Another Appointment
              </button>
            </div>
            
            {/* Edge function notification detail */}
            <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2.5rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1.5rem' }}>
              Note: Automated SMS notifications can be configured using Supabase Edge Functions with Twilio/Resend.
            </div>
          </ScrollReveal>
        )}
      </div>

      {/* Styles for booking custom elements */}
      <style>{`
        .booking-service-item:hover {
          border-color: var(--color-accent) !important;
        }
        .booking-barber-item:hover {
          border-color: var(--color-accent) !important;
        }
        .calendar-day-btn:hover {
          background-color: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
          color: #1C1A18 !important;
        }
        .booking-time-btn:hover {
          background-color: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
          color: #1C1A18 !important;
        }
      `}</style>
    </div>
  );
}
