import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Barbers from './pages/Barbers';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Contact from './pages/Contact';

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash || '#/';
      setRoute(currentHash);
      window.scrollTo(0, 0); // Scroll to top on every route change
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse page path from hash route (e.g. "#/book?service=s1" -> "#/book")
  const getPath = () => {
    const hashWithoutQuery = route.split('?')[0];
    return hashWithoutQuery;
  };

  const renderPage = () => {
    const path = getPath();
    switch (path) {
      case '#/':
      case '#':
      case '':
        return <Home />;
      case '#/services':
        return <Services />;
      case '#/barbers':
        return <Barbers />;
      case '#/gallery':
        return <Gallery />;
      case '#/book':
        return <Booking />;
      case '#/contact':
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      {/* Navigation Header */}
      <Navbar currentRoute={getPath()} />
      
      {/* Main View Area */}
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>
      
      {/* Shop Footer */}
      <Footer />
    </div>
  );
}

export default App;
