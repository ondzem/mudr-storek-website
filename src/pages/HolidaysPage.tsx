import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, AlertTriangle, Info, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Announcements from "../components/Announcements";
import { AdminAnnouncements } from "../components/AdminAnnouncements";
import { supabase } from "../lib/supabase";

const HolidaysPage = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

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
        <title>Dovolená | MUDr. Ludvík Štorek</title>
        <meta 
          name="description" 
          content="Informace o plánovaných dovolených ordinace MUDr. Ludvíka Štorka." 
        />
      </Helmet>

      {/* Header */}
      <section className="bg-primary-500 text-white py-12">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            Dovolená
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
            Informace o plánované dovolené
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-gray-50">
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


          {/* Vacations Section */}
          <div>
            <div className="text-center mb-8">
              <h2>Dovolená</h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Informace o plánovaných dovolených
              </p>
            </div>
            <Announcements type="vacation" />
          </div>

          {/* Admin Button */}
          {!isAdminMode && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowLoginForm(true)}
                className="text-sm text-gray-500 hover:text-primary-500 transition-colors"
              >
                Správa dovolených
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HolidaysPage;