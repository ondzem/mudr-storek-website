import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isHomePage: boolean;
  heroSectionRef: React.RefObject<HTMLElement>;
}

const navLinks = [
  { title: 'Základní informace', path: '/' },
  { title: 'Ordinační hodiny', path: '/ordinacni-hodiny' },
  { title: 'Kontakt', path: '/kontakt' },
  { title: 'Ceník', path: '/cenik' },
  { title: 'Organizace', path: '/informace' },
  { title: 'Dovolená', path: '/dovolene' },
  { title: 'Zrušení rezervace', path: '/zrusit' },
];

// Dropdown menu items for "Poznejte nás"
const aboutUsLinks = [
  { title: 'Fotogalerie', path: '/fotogalerie' },
  { title: 'Personál', path: '/personal' },
];

const Navbar = ({ isHomePage, heroSectionRef }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAboutUs = () => {
    setIsAboutUsOpen(!isAboutUsOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsAboutUsOpen(false); // Close dropdown on route change
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getNavBarClasses = () => {
    if (isHomePage) {
      return isScrolled 
        ? 'bg-white shadow-md'
        : 'md:bg-transparent bg-primary-500';
    } else {
      return isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/90 backdrop-blur-sm';
    }
  };

  const getTextColorClass = () => {
    if (isHomePage && !isScrolled) {
      return 'text-white md:text-white';
    }
    return 'text-gray-800';
  };

  const getButtonClasses = () => {
    const baseClass = 'btn text-sm px-3 py-1.5';
    if (isHomePage && !isScrolled) {
      return `${baseClass} bg-primary-500 hover:bg-primary-600 text-white`;
    }
    return `${baseClass} btn-primary`;
  };

  const getMobileMenuButtonClasses = () => {
    const baseClass = "p-2 rounded-md lg:hidden focus:outline-none";
    if (isHomePage && !isScrolled) {
      return `${baseClass} text-white hover:bg-white/20`;
    }
    return `${baseClass} text-gray-600 hover:bg-gray-100`;
  };

  const getNavLinkClasses = (isActive: boolean) => {
    let baseClass = 'px-3 py-2 transition-colors rounded-md text-sm font-medium whitespace-nowrap';
    
    if (isActive) {
      if (isHomePage && !isScrolled) {
        return `${baseClass} bg-white/20 text-white`;
      } else {
        return `${baseClass} bg-primary-50 text-primary-600`;
      }
    } else {
      if (isHomePage && !isScrolled) {
        return `${baseClass} text-white hover:bg-white/20 hover:text-white`;
      } else {
        return `${baseClass} text-gray-800 hover:bg-primary-50/70 hover:text-primary-600`;
      }
    }
  };

  const getPositionClasses = () => {
    if (isHomePage) {
      return 'fixed top-0 w-full';
    } else {
      return 'sticky top-0';
    }
  };

  const isAboutUsActive = aboutUsLinks.some(link => link.path === location.pathname);

  return (
    <header
      className={`${getPositionClasses()} z-50 transition-all duration-300 ${getNavBarClasses()}`}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 z-10">
            <span className={`text-base font-semibold ${getTextColorClass()} whitespace-nowrap`}>
              MUDr. Ludvík Štorek
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md focus:outline-none ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Online Booking Button */}
            <Link to="/objednani" className={getButtonClasses()}>
              Objednat online
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={getMobileMenuButtonClasses()}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="container pb-2"
        >
          <div className="flex flex-col space-y-1 rounded-lg overflow-hidden bg-white shadow-md mt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-3 border-b border-gray-100 bg-primary-50 text-primary-600 font-medium block text-sm"
                    : "px-3 py-3 border-b border-gray-100 text-gray-800 hover:bg-gray-50 block text-sm"
                }
              >
                {link.title}
              </NavLink>
            ))}
            {/* "Poznejte nás" links */}
            {aboutUsLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-3 border-b border-gray-100 bg-primary-50 text-primary-600 font-medium block text-sm"
                    : "px-3 py-3 border-b border-gray-100 text-gray-800 hover:bg-gray-50 block text-sm"
                }
              >
                {link.title}
              </NavLink>
            ))}
            <Link
              to="/objednani"
              className="px-3 py-3 bg-primary-500 text-white font-medium text-center text-sm"
            >
              Objednat online
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;