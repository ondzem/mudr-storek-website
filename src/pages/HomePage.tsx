import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ArrowRight, Phone, Mail, MapPin, Clock, FileText, CreditCard, Globe, ExternalLink, AlertTriangle, Building, Info, Check, X, ChevronRight, UserPlus, User, Building2, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Announcements from "../components/Announcements.tsx";
import { AdminAnnouncements } from "../components/AdminAnnouncements.tsx";
import { supabase } from "../lib/supabase.ts";

const officeHours = [
  {
    day: 'PO',
    hours: '08:00–14:30',
    acute: '08:00–08:30',
    web: '08:30–10:30',
    phone: '10:30–11:30',
    phoneBooking: '11:30–14:30',
    company: '–'
  },
  {
    day: 'ÚT',
    hours: '07:00–13:00',
    acute: '07:00–07:30',
    web: '07:30–08:30',
    phone: '08:30–09:30',
    phoneBooking: '09:30–11:30',
    company: '11:30–13:00'
  },
  {
    day: 'ST',
    hours: '13:00–18:30',
    acute: '13:00–13:30',
    web: '13:30–15:30',
    phone: '15:30–16:15',
    phoneBooking: '16:30–18:30',
    company: '–'
  },
  {
    day: 'ČT',
    hours: '07:00–14:00',
    acute: '07:00–07:30',
    web: '07:30–09:30',
    phone: '09:30–10:30',
    phoneBooking: '11:30–14:00',
    company: '10:30–11:30'
  },
  {
    day: 'PÁ',
    hours: '07:00–12:00',
    acute: '07:00–07:30',
    web: '07:30–08:30',
    phone: '08:30–09:30',
    phoneBooking: '09:30–12:00',
    company: '–'
  }
];

const HomePage = () => {
  const { heroSectionRef } = useOutletContext<{ heroSectionRef: React.RefObject<HTMLElement> }>();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  const toggleDay = (day: string) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };

  const toggleRule = (index: number) => {
    if (expandedRule === index) {
      setExpandedRule(null);
    } else {
      setExpandedRule(index);
    }
  };

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminMode(isAdminLoggedIn);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (loginCredentials.username !== 'admin') {
        setLoginError('Nesprávné uživatelské jméno');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'mudrstorek@gmail.com',
        password: loginCredentials.password,
      });

      if (error) {
        setLoginError('Nesprávné přihlašovací údaje');
        return;
      }

      setIsAdminMode(true);
      localStorage.setItem('isAdminLoggedIn', 'true');
      setShowLoginForm(false);
      setLoginError('');
      setLoginCredentials({ username: '', password: '' });
    } catch (err) {
      setLoginError('Chyba při přihlášení');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminMode(false);
    localStorage.removeItem('isAdminLoggedIn');
    setShowLoginForm(false);
  };

  return (
    <>
      <Helmet>
        <title>MUDr. Ludvík Štorek | Praktický lékař Pardubice</title>
        <meta
          name="description"
          content="Ordinace praktického lékaře MUDr. Ludvíka Štorka v Pardubicích. Profesionální zdravotní péče, preventivní prohlídky, očkování a objednávání online."
        />
        <meta name="keywords" content="praktický lékař Pardubice, ordinace, MUDr. Ludvík Štorek, online objednání, preventivní prohlídky, ordinační hodiny" />
        <link rel="canonical" href="https://mudrstorek.cz/" />
        <meta property="og:title" content="MUDr. Ludvík Štorek | Praktický lékař Pardubice" />
        <meta property="og:description" content="Ordinace praktického lékaře MUDr. Ludvíka Štorka v Pardubicích. Profesionální zdravotní péče, preventivní prohlídky a možnost online objednání." />
        <meta property="og:url" content="https://mudrstorek.cz/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Physician",
            "name": "MUDr. Ludvík Štorek",
            "url": "https://mudrstorek.cz/",
            "image": "https://i.imgur.com/dDUaBoY.png",
            "telephone": "+420466030435",
            "email": "mudr.storek@seznam.cz",
            "description": "Praktický lékař pro dospělé s moderním přístupem a profesionální zdravotní péčí v Pardubicích.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Arnošta z Pardubic 2082",
              "addressLocality": "Pardubice",
              "postalCode": "530 02",
              "addressCountry": "CZ"
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Monday",
                "opens": "08:00",
                "closes": "14:30"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Tuesday",
                "opens": "07:00",
                "closes": "13:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Wednesday",
                "opens": "13:00",
                "closes": "18:30"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Thursday",
                "opens": "07:00",
                "closes": "14:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Friday",
                "opens": "07:00",
                "closes": "12:00"
              }
            ],
            "medicalSpecialty": "General Practice"
          }
        `}</script>
      </Helmet>

      {/* Hero Section */}
<section className="h-screen overflow-hidden relative" ref={heroSectionRef}>
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div className="hidden md:block h-full relative">
      <img
        src="/Storek uvodni fotka.webp"
        alt="Ordinace praktického lékaře MUDr. Ludvíka Štorka v Pardubicích"
        className="w-full h-full object-cover brightness-50 scale-100 absolute"
        style={{ top: '-15%' }} // Posune obrázek o 10 % nahoru
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
    <div className="md:hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2)_0%,transparent_35%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15)_0%,transparent_45%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1))]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.2)_0%,transparent_100%)]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-600/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-600/50 to-transparent"></div>
      </div>
    </div>
  </div>
  <div className="absolute inset-0 z-[1] hidden md:block">
    <div
      className="absolute left-0 w-full h-full bg-primary-500"
      style={{
        top: '20%',
        clipPath: 'polygon(0 60%, 100% 20%, 100% 100%, 0% 100%)',
        opacity: 100,
      }}
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1)_0%,transparent_60%)] pointer-events-none" />
    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05))] pointer-events-none" />
  </div>
  <div className="relative z-[2] h-full container mx-auto px-5 flex items-center md:items-end md:justify-end pointer-events-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-md md:max-w-xl md:pb-12 md:pl-8 text-white text-center md:text-left relative pb-6 mx-auto md:mx-0"
    >
      <div className="absolute inset-0 -m-8 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50 blur-xl"></div>
      <div className="space-y-8 md:space-y-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2">
            MUDr. Ludvík Štorek
          </h1>
          <h2 className="text-xl md:text-4xl font-light mt-2 md:mt-2">
            Praktický lékař pro dospělé
          </h2>
        </div>
        <div className="flex flex-col gap-4 w-full mx-auto md:max-w-none md:flex-row md:mx-0 mt-8 md:mt-0">
          <Link
            to="/objednani"
            className="relative z-[3] px-6 py-4 md:py-3 bg-white text-primary-500 rounded-lg font-medium transition-all hover:bg-gray-100 hover:shadow-lg text-center shadow-lg whitespace-nowrap w-full md:w-auto"
          >
            Online objednání
          </Link>
        </div>

        {/* Scroll Indicator - Desktop Only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="hidden md:flex flex-col items-start gap-2 cursor-pointer mt-12"
          onClick={() => {
            const section = document.getElementById('ordinacni-doba');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-start gap-2"
          >
            <span className="text-white text-sm font-medium tracking-wide opacity-90">
              Pokračujte dolů
            </span>
            <ChevronDown className="w-6 h-6 text-white opacity-90" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  </div>

  {/* Scroll Indicator - Mobile Only */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1, delay: 1.5 }}
  className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[3] flex flex-col items-center gap-2 cursor-pointer"
  onClick={() => {
    const section = document.getElementById('ordinacni-doba');
    section?.scrollIntoView({ behavior: 'smooth' });
  }}
>
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="flex flex-col items-center gap-3"
  >
    <span className="bg-white text-black text-base font-medium tracking-wide opacity-90 px-4 py-2 rounded-lg shadow-md">
      Pokračujte dolů
    </span>
    <ChevronDown className="w-10 h-10 text-white opacity-90" />
  </motion.div>
</motion.div>
</section>

      {/* Office Hours Section */}
<section className="section bg-white py-12" id="ordinacni-doba">
  <div className="container">
    <div className="text-center mb-4 md:mb-6"> {/* Sníženo z mb-8 md:mb-10 */}
      <h2 className="mb-4">Ordinační a provozní doba</h2> {/* Změněno z mb-4 na mb-0 */}
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="card shadow-card">
        <div className="card-body p-4 md:p-1">
          <div className="flex items-center mb-1">
          </div>
          <div className="hidden md:block w-full">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-primary-50">
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[10%]">Den</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">Ordinační doba</th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Akutní stavy bez objednání
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Pacienti objednaní online
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Telefonní konzultace a objednávání
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Pacienti objednaní po telefonu
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-sm text-primary-700 w-[15%]">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Závodní péče – objednaní online
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {officeHours.map((item, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-3 px-4 font-medium border-b border-gray-100">{item.day}</td>
                    <td className="py-3 px-4 border-b border-gray-100 font-medium text-primary-600">{item.hours}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-red-600">{item.acute}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-green-600">{item.web}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-blue-600">{item.phone}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-yellow-600">{item.phoneBooking}</td>
                    <td className="py-3 px-4 border-b border-gray-100 text-purple-600">{item.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Accordion Days */}
          <div className="md:hidden space-y-4">
            {officeHours.map((item, index) => (
              <div key={index} className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Day and Hours Header - Clickable for accordion */}
                <button 
                  className="w-full bg-primary-50 px-5 py-4 font-semibold text-lg flex justify-between items-center"
                  onClick={() => toggleDay(item.day)}
                  aria-expanded={expandedDay === item.day}
                  aria-controls={`day-content-${item.day}`}
                >
                  <span>{item.day}</span>
                  <div className="flex items-center">
                    <span className="text-primary-500 mr-2">{item.hours}</span>
                    {expandedDay === item.day ? (
                      <ChevronUp className="w-5 h-5 text-primary-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary-500" />
                    )}
                  </div>
                </button>
                
                {/* Content Section - Expanded/collapsed based on state */}
                {expandedDay === item.day && (
                  <div id={`day-content-${item.day}`} className="p-5 space-y-4 border-t border-gray-100">
                    {/* Acute Care */}
                    <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center flex-1">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-4 flex-shrink-0"></span>
                        <span className="font-medium text-red-800 text-sm sm:text-base">
                          Akutní stavy bez objednání
                        </span>
                      </div>
                      <span className="text-red-600 font-medium text-sm sm:text-base pl-6">
                        {item.acute}
                      </span>
                    </div>

                    {/* Web Appointments */}
                    <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center flex-1">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-4 flex-shrink-0"></span>
                        <span className="font-medium text-green-800 text-sm sm:text-base">
                          Pacienti objednaní online
                        </span>
                      </div>
                      <span className="text-green-600 font-medium text-sm sm:text-base pl-6">
                        {item.web}
                      </span>
                    </div>

                    {/* Phone Consultations */}
                    <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center flex-1">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-4 flex-shrink-0"></span>
                        <span className="font-medium text-blue-800 text-sm sm:text-base">
                          Telefonní konzultace a objednávání
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium text-sm sm:text-base pl-6">
                        {item.phone}
                      </span>
                    </div>

                    {/* Phone Bookings */}
                    <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center flex-1">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-4 flex-shrink-0"></span>
                        <span className="font-medium text-yellow-800 text-sm sm:text-base">
                          Pacienti objednaní po telefonu
                        </span>
                      </div>
                      <span className="text-yellow-600 font-medium text-sm sm:text-base pl-6">
                        {item.phoneBooking}
                      </span>
                    </div>

                    {/* Company Care (Conditional) */}
                    {item.company !== '–' && (
                      <div className="p-4 rounded-lg bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center flex-1">
                          <span className="w-3 h-3 bg-purple-500 rounded-full mr-4 flex-shrink-0"></span>
                          <span className="font-medium text-purple-800 text-sm sm:text-base">
                            Závodní péče – objednaní online
                          </span>
                        </div>
                        <span className="text-purple-600 font-medium text-sm sm:text-base pl-6">
                          {item.company}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-600 flex items-start">
            <Info className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
            <p>
              Pro akutní stavy je vyhrazen čas na začátku ordinační doby. V případě život ohrožujícího stavu volejte linku 155.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

           {/* Announcements Section */}
      <section className="section bg-gray-50" id="aktuality">
        <div className="container">
          {/* Admin Controls */}
          <div className="mb-6 flex justify-end items-center space-x-4">
            {!isAdminMode ? null : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Přihlášen jako správce
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Odhlásit se
                </button>
              </div>
            )}
          </div>

          {/* Login Form */}
          {showLoginForm && !isAdminMode && (
            <motion.div
              id="admin-login-form"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="card mb-6 max-w-md mx-auto"
            >
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Přihlášení správce</h3>
                  <button
                    onClick={() => {
                      setShowLoginForm(false);
                      setLoginError('');
                      setLoginCredentials({ username: '', password: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {loginError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{loginError}</p>
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label">Uživatelské jméno</label>
                    <input
                      type="text"
                      id="username"
                      className="form-input"
                      value={loginCredentials.username}
                      onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Heslo</label>
                    <input
                      type="password"
                      id="password"
                      className="form-input"
                      value={loginCredentials.password}
                      onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Přihlásit se
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Admin Announcements Component */}
          {isAdminMode && <AdminAnnouncements />}

          {/* Announcements Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2>Důležité aktuality</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Informace a oznámení k chodu ordinace
              </p>
            </div>
            <Announcements type="announcement" />
          </div>

          {/* Admin Button */}
          {!isAdminMode && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowLoginForm(true);
                  setTimeout(() => {
                    document.getElementById('admin-login-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }}
                className="text-sm text-gray-500 hover:text-primary-500 transition-colors"
              >
                Správa aktualit
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Patient Guidelines Section */}
      <section className="section bg-white" id="pravidla-navstev">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="mb-4">Pravidla návštěvy ordinace</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Pro zajištění plynulého chodu ordinace a kvalitní péče o všechny pacienty
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {[
              {
                title: 'Objednávkový systém',
                content: 'Každý pacient se objednává buď přes online objednávání na vyšetření (nyní i pro prevenci a závodní péči), nebo telefonicky u sestry pro jakékoli vyšetření, kde přizpůsobíme dobu vyšetření vašemu požadavku. Neohlášený pacient nebude s výjimkou akutních stavů v úvodu ordinační doby vpuštěn do ordinace. Rezervaci lze zrušit nejpozději 24 hodin před termínem přes odkaz v potvrzovacím emailu.'
              },
              {
                title: 'Telefonní komunikace',
                content: 'Pro plynulý chod bude telefonní linka garantovaně obsluhována jen ve stanovený čas. Mimo stanovenou dobu sestra zvedá telefony dle možností. Komunikaci, prosím, omezte na nejnutnější důvody. Berte na vědomí, že pracujeme pouze ve dvou.'
              },
              {
                title: 'E-mailová komunikace',
                content: 'E-mail je určen pouze pro neakutní dotazy, jako předepisování e-receptů, žádosti o laboratorní vyšetření, interpretaci výsledků nebo jednoduché zdravotní dotazy. Odpovídám obvykle do 48 hodin (většinou ten den po práci). O víkendu a mimo ordinační dobu nepracuji.'
              },
              {
                title: 'Akutní stavy',
                content: 'První půlhodina ordinační doby je určena POUZE pro akutní stavy (náhle vzniklé potíže) bez předchozího objednání. Poté pokračuje objednávkový systém – buď přes online objednání, nebo telefonicky u sestry.'
              },
              {
                title: 'Lázeňská péče',
                content: 'Dle úpravy zákona č.48/1997, par. 33 sepisuje návrh na komplexní lázeňskou péči lékař, který vydal doporučení. Praktik může doplnit anamnézu, provést EKG. Zbytek obstarává specialista.'
              },
              {
                title: 'Dochvilnost',
                content: 'Choďte do čekárny načas.'
              },
              {
                title: 'Ochrana obličeje',
                content: 'Ochranu obličeje vyžadujeme pouze u pacientů s respiračním infektem.'
              },
              {
                title: 'Laboratorní výsledky',
                content: 'Pokud máte zájem o laboratorní výsledky z Medily, požádejte o ně při odběru krve (přepošlou je na váš email). Já je již elektronicky neposílám, ale výsledky lze vyzvednout u sestry v tištěné podobě.'
              }
            ].map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card"
              >
                <div className="card-body p-0">
                  {/* Clickable header */}
                  <button
                    onClick={() => toggleRule(index)}
                    className="w-full flex items-center justify-between py-4 px-5 rounded-t-lg bg-primary-50 hover:bg-primary-100 transition-colors"
                    aria-expanded={expandedRule === index}
                    aria-controls={`rule-content-${index}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-primary-500 font-semibold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-left">{guideline.title}</h3>
                    </div>
                    {expandedRule === index ? (
                      <ChevronUp className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {/* Expandable content */}
                  {expandedRule === index && (
                    <div id={`rule-content-${index}`} className="p-5 border-t border-primary-100">
                      <p className="text-gray-600">{guideline.content}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Zastup Section */}
      <section className="section bg-gray-50 py-16" id="zastupovani">
        <div className="container">
          <div className="text-center mb-2 md:mb-4">
            <h2 className="mb-4">Zástup po dobu nepřítomnosti</h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-2">
                    </div>
                    <div className="space-y-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">MUDr. Markéta Marešová</p>
                            <div className="mt-2 space-y-3 text-sm">
                              <p className="flex items-center">
                                <Phone className="w-4 h-4 text-primary-500 mr-2" />
                                <a href="tel:467000104" className="hover:text-primary-600">467 000 104</a>
                              </p>
                              <p className="flex items-center">
                                <Globe className="w-4 h-4 text-primary-500 mr-2" />
                                <a href="http://www.mudrmaresova.cz" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                                  www.mudrmaresova.cz
                                </a>
                              </p>
                              <p className="flex items-center">
                                <MapPin className="w-4 h-4 text-primary-500 mr-2" />
                                Sukova třída 1556 (bývalý Plynostav, přízemí vlevo)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-yellow-800">
                            Zástup u MUDr. Marešové je určen pouze pro akutní stavy po předchozí telefonické konzultaci. Veškeré ostatní záležitosti jako předepisování trvalé medikace, vyplňování formulářů pro pojišťovny, vystavování výpisů ze zdravotní dokumentace, zdravotní a řidičské průkazy aj. řešte výhradně se mnou. Naše databáze nejsou propojeny a vzájemně neznáme podrobně váš zdravotní stav.
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg mt-4">
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-green-800">
                            Informace pro pacienty dr. Marešové (zástup po dobu její dovolené):<br />
                            - Akutní stavy vyšetříme první půlhodinu ordinační doby.<br />
                            - Ostatní záležitosti nejdříve konzultujte telefonicky, ideálně během doby k tomu určené (viz ordinační doba na webových stránkách). Prosím nechodit mimo dobu určenou pro akutní stavy, přímo do ordinace.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="card">
                  <div className="card-body">
                    <div className="flex items-center mb-6">
                      <Clock className="w-6 h-6 text-primary-500 mr-3" />
                      <h3 className="text-xl font-semibold">Mimo ordinační dobu</h3>
                    </div>
                    <div className="space-y-6 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-start">
                          <Building2 className="w-5 h-5 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Pohotovost v areálu nemocnice</p>
                            <p className="text-sm text-gray-600 mt-1">Slouží pro akutní stavy, jež nesnesou vyčkat do vyšetření zde</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="flex items-start">
                          <Phone className="w-5 h-5 text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Konzultace zdravotního stavu</p>
                            <p className="text-sm text-gray-600 mt-1">
                              <a href="tel:469666666" className="text-primary-500 hover:text-primary-600">469 666 666</a>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-50">
                        <div className="flex items-start">
                          <HeartPulse className="w-5 h-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-red-600">Při ohrožení života</p>
                            <p className="text-sm text-gray-600 mt-1">
                              <a href="tel:155" className="text-red-500 hover:text-red-600 font-medium">155</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section bg-gray-50" id="kde-nas-najdete">
        <div className="container">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="mb-4">Kde nás najdete</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Ordinace je umístěna v Pardubicích s dobrou dostupností MHD i autem.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="card shadow-card">
              <div className="flex flex-col md:grid md:grid-cols-2">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-primary-500 mr-2" />
                    <h3 className="text-xl font-semibold">Adresa ordinace</h3>
                  </div>
                  <p className="mb-4">Arnošta z Pardubic 2082<br />530 02 Pardubice<br />Česká republika</p>
                  <p className="mb-4">
                    <strong>Dostupnost:</strong><br />
                    Trolejbus: <span className="text-gray-600">č. 6, 8, 25, 88 – zastávka Karla IV.</span><br />
                    Parkování: <span className="text-gray-600">Dostupné před ordinací</span>
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Arno%C5%A1ta+z+Pardubic+2082,+530+02+Pardubice,+%C4%8Cesko"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2 inline-flex items-center justify-center w-full md:w-auto"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Zobrazit na mapě
                  </a>
                </div>
                <div className="relative h-64 md:h-full min-h-[250px] w-full overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.7887927172037!2d15.770187899999999!3d50.0382897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470dc95560d35b39%3A0x67db26b0b366d928!2sArno%C5%A1ta%20z%20Pardubic%202082%2C%20530%2002%20Pardubice%2C%20%C4%8Cesko!5e0!3m2!1scs!2scz!4v1698837293251!5m2!1scs!2scz"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa ordinace MUDr. Ludvík Štorek"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;