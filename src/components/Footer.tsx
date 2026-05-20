import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-500 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-600/50"></div>
      <div className="container section" style={{ paddingBottom: '1rem' }}>
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Logo & About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="font-semibold text-xl tracking-tight">MUDr. Ludvík Štorek</span>
            </div>
            <p className="text-gray-100 leading-relaxed">
              Praktický lékař pro dospělé.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h4 className="mb-5 text-lg font-semibold tracking-tight">Kontaktní informace</h4>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-white/75 group-hover:text-white transition-colors" />
                <a href="mailto:mudr.storek@seznam.cz" className="hover:text-white/90 transition-colors">
                  mudr.storek@seznam.cz
                </a>
              </li>
              <li className="flex items-start group">
                <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-white/75 group-hover:text-white transition-colors" />
                <a href="tel:+420466030435" className="hover:text-white/90 transition-colors">
                  +420 466 030 435
                </a>
              </li>
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-white/75 group-hover:text-white transition-colors" />
                <a 
                  href="https://maps.google.com/?q=Arnošta+z+Pardubic+2082,+530+02+Pardubice" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white/90 transition-colors flex items-start"
                >
                  <span>
                    Arnošta z Pardubic 2082<br />
                    530 02 Pardubice
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="mb-5 text-lg font-semibold tracking-tight">Právní informace</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/ochrana-osobnich-udaju" 
                  className="hover:text-white/90 transition-colors inline-flex items-center"
                >
                  Ochrana osobních údajů
                </Link>
              </li>
              <li>
                <Link 
                  to="/obchodni-podminky" 
                  className="hover:text-white/90 transition-colors inline-flex items-center"
                >
                  Podmínky zdravotních služeb
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="text-white/75 flex md:flex-row flex-col md:justify-between justify-center items-center">
          <p>© {currentYear} MUDr. Ludvík Štorek.</p>
          <p className="mt-6 md:mt-0">
            Stránky vytvořil{' '}
            <a 
              href="https://ozeman.cz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white/90 transition-colors cursor-pointer text-decoration-underline"
              style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
              onClick={() => console.log('Odkaz kliknutý')}
            >
              ozeman.cz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;