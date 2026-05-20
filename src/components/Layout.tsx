import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const heroSectionRef = useRef<HTMLElement>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar isHomePage={isHomePage} heroSectionRef={heroSectionRef} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ heroSectionRef }} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;