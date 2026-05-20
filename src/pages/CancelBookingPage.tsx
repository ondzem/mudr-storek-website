import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Check, Loader, Calendar, Clock, User, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Booking {
  id: string;
  name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  cancellation_token: string;
}

const CancelBookingPage = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || ''; // Token z URL, pokud existuje

  const [tokenInput, setTokenInput] = useState(initialToken); // Políčko pro zadání tokenu
  const [tokenSubmitted, setTokenSubmitted] = useState(!!initialToken); // Indikuje, zda byl token odeslán (automaticky pro předvyplněný token)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async (token: string) => {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setError('Zadejte prosím token pro zrušení rezervace');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('cancellation_token', trimmedToken)
        .is('cancelled_at', null);

      if (fetchError || !data || data.length === 0) {
        setError('Neplatný token nebo rezervace již byla zrušena');
        setBooking(null);
        setLoading(false);
        return;
      }

      const appointmentDate = new Date(`${data[0].appointment_date}T${data[0].appointment_time}`);
      const now = new Date();
      const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        setError('Rezervaci nelze zrušit méně než 24 hodin před termínem');
        setBooking(null);
        setLoading(false);
        return;
      }

      setBooking(data[0]);
      setLoading(false);
    } catch (err) {
      setError('Chyba při načítání rezervace');
      setBooking(null);
      setLoading(false);
    }
  };

  // Automatické načtení rezervace, pokud je token v URL
  useEffect(() => {
    if (initialToken) {
      fetchBooking(initialToken.trim());
    } else {
      setLoading(false);
    }
  }, [initialToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTokenSubmitted(true);
    fetchBooking(tokenInput.trim());
  };

  const handleCancel = async () => {
    if (!booking) return;

    setCancelling(true);
    try {
      // Smazat všechny rezervace se stejným tokenem (může být více slotů pro 20min rezervace)
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('cancellation_token', tokenInput.trim())
        .is('cancelled_at', null);

      if (deleteError) {
        console.error('Delete error:', deleteError);

        // Zkontrolovat, jestli je problém s 24h limitem
        if (deleteError.code === 'PGRST301' || deleteError.message.includes('policy')) {
          setError('Rezervaci nelze zrušit méně než 24 hodin před termínem nebo token je neplatný');
        } else {
          setError(`Chyba při rušení rezervace: ${deleteError.message}`);
        }

        setCancelling(false);
        return;
      }

      setSuccess(true);
      setShowConfirm(false);
    } catch (err) {
      console.error('Cancel error:', err);
      setError('Chyba při rušení rezervace');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getNextTimeSlot = (time: string, minutes: number = 10) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatTimeRange = (booking: Booking) => {
    const startTime = booking.appointment_time;
    const twentyMinReasons = ['Preventivní prohlídka po 2 letech', 'Pracovnělékařská prohlídka', 'Diabetická kontrola', 'Vyšetření pro zbrojní průkaz'];
    const dayName = new Date(booking.appointment_date).toLocaleDateString('cs-CZ', { weekday: 'short' }).replace(' ', '');

    let duration = 10;
    if (twentyMinReasons.includes(booking.reason) && startTime < '11:30') {
      duration = 20;
    } else if (booking.reason === 'Pracovnělékařská prohlídka' && ['Út', 'Čt'].includes(dayName) && startTime >= '10:30') {
      duration = 15;
    }

    const endTime = getNextTimeSlot(startTime, duration);
    return `${startTime} - ${endTime}`;
  };

  return (
    <>
      <Helmet>
        <title>Zrušení rezervace | MUDr. Ludvík Štorek</title>
        <meta name="description" content="Zrušení rezervace termínu u MUDr. Ludvíka Štorka" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <section className="bg-primary-500 text-white py-12">
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            Zrušení rezervace
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-light"
          >
            Zrušení termínu návštěvy
          </motion.p>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!tokenSubmitted ? (
              <div className="card">
                <div className="card-body py-12">
                  <h2 className="text-xl font-semibold mb-6 text-center">Zadejte kód pro zrušení rezervace</h2>
                  <form onSubmit={handleTokenSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <label htmlFor="token" className="form-label">Kód pro zrušení</label>
                      <input
                        type="text"
                        id="token"
                        className="form-input font-mono"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="rezervace123"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 mr-2 animate-spin" />
                          Načítání...
                        </>
                      ) : (
                        'Zobrazit rezervaci'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : loading ? (
              <div className="card">
                <div className="card-body flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-primary-500" />
                  <span className="ml-3 text-gray-600">Načítání rezervace...</span>
                </div>
              </div>
            ) : error ? (
              <div className="card">
                <div className="card-body">
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Chyba při načítání rezervace</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center space-x-4">
                    <Link to="/" className="btn btn-primary inline-flex items-center">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Zpět na úvodní stránku
                    </Link>
                    <Link to="/objednani" className="btn btn-outline inline-flex items-center">
                      Vytvořit novou rezervaci
                    </Link>
                  </div>
                </div>
              </div>
            ) : success ? (
              <div className="card">
                <div className="card-body">
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start mb-6">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Rezervace byla úspěšně zrušena</p>
                      <p className="mt-1">Děkujeme za včasné oznámení.</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Link to="/" className="btn btn-primary inline-flex items-center">
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Zpět na úvodní stránku
                    </Link>
                    <Link to="/objednani" className="btn btn-outline inline-flex items-center">
                      Vytvořit novou rezervaci
                    </Link>
                  </div>
                </div>
              </div>
            ) : booking ? (
              <div className="card">
                <div className="card-body">
                  <h2 className="text-xl font-semibold mb-6">Detaily rezervace</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Datum</dt>
                        <dd className="text-gray-900">{formatDate(booking.appointment_date)}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Čas</dt>
                        <dd className="text-gray-900">{formatTimeRange(booking)}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Jméno</dt>
                        <dd className="text-gray-900">{booking.name}</dd>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Důvod návštěvy</dt>
                        <dd className="text-gray-900">{booking.reason}</dd>
                      </div>
                    </div>
                  </div>

                  {showConfirm ? (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                        <p className="text-yellow-800 font-medium">Opravdu chcete zrušit tuto rezervaci?</p>
                        <p className="text-yellow-700 text-sm mt-1">Tuto akci nelze vrátit zpět.</p>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="btn btn-outline"
                          disabled={cancelling}
                        >
                          Zpět
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn bg-red-500 hover:bg-red-600 text-white"
                          disabled={cancelling}
                        >
                          {cancelling ? (
                            <>
                              <Loader className="w-5 h-5 mr-2 animate-spin" />
                              Rušení...
                            </>
                          ) : (
                            'Potvrdit zrušení'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="btn btn-primary w-full"
                    >
                      Zrušit rezervaci
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default CancelBookingPage;