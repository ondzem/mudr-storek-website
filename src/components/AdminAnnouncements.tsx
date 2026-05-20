import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from "../lib/supabase.ts";
import { AlertTriangle, X, Info, Edit, Trash, Calendar } from 'lucide-react';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type?: string;
  vacation_start?: string;
  vacation_end?: string;
  date: string;
  active?: boolean;
  priority?: number;
  created_at?: string;
}

export const AdminAnnouncements = () => {
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>({
    id: null,
    title: '',
    content: '',
    type: 'announcement',
    vacation_start: '',
    vacation_end: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dateValidationError, setDateValidationError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('active', { ascending: false })
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          setErrorMessage('Nepodařilo se načíst aktuality.');
          return;
        }
        setAnnouncements(data || []);
      } catch (err) {
        setErrorMessage('Chyba při komunikaci s databází.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();

    const subscription = supabase
      .channel(`announcements-admin-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const validateVacationDates = () => {
    if (newAnnouncement.type !== 'vacation') return true;
    setDateValidationError('');
    if (!newAnnouncement.vacation_start || !newAnnouncement.vacation_end) {
      setDateValidationError('Prosím vyplňte datum začátku i konce dovolené');
      return false;
    }
    const startDate = new Date(newAnnouncement.vacation_start);
    const endDate = new Date(newAnnouncement.vacation_end);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setDateValidationError('Datum začátku dovolené nemůže být v minulosti');
      return false;
    }
    if (endDate < startDate) {
      setDateValidationError('Datum konce dovolené musí být později než datum začátku');
      return false;
    }
    return true;
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.type === 'vacation' && !validateVacationDates()) {
      return;
    }
    if (newAnnouncement.title) {
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
      try {
        if (isEditing && newAnnouncement.id) {
          const { error } = await supabase
            .from('announcements')
            .update({
              title: newAnnouncement.title,
              content: newAnnouncement.content || '', // Changed from null to empty string
              type: newAnnouncement.type,
              vacation_start: newAnnouncement.vacation_start || null,
              vacation_end: newAnnouncement.vacation_end || null,
              date: formattedDate
            })
            .eq('id', newAnnouncement.id);

          if (error) {
            setErrorMessage('Nepodařilo se uložit změny.');
            return;
          }
          setAnnouncements((prev) =>
            prev.map((a) =>
              a.id === newAnnouncement.id
                ? {
                    ...a,
                    title: newAnnouncement.title,
                    content: newAnnouncement.content || '',
                    type: newAnnouncement.type,
                    vacation_start: newAnnouncement.vacation_start || null,
                    vacation_end: newAnnouncement.vacation_end || null,
                    date: formattedDate,
                  }
                : a
            )
          );
        } else {
          const { data, error } = await supabase
            .from('announcements')
            .insert([
              {
                title: newAnnouncement.title,
                content: newAnnouncement.content || '', // Changed from null to empty string
                type: newAnnouncement.type,
                vacation_start: newAnnouncement.vacation_start || null,
                vacation_end: newAnnouncement.vacation_end || null,
                date: formattedDate,
                active: true,
                priority: 0,
                created_at: new Date().toISOString(),
              },
            ])
            .select();

          if (error) {
            setErrorMessage('Nepodařilo se přidat aktualitu.');
            return;
          }
          setAnnouncements((prev) => [data[0], ...prev]);
        }
        setNewAnnouncement({
          id: null,
          title: '',
          content: '',
          type: 'announcement',
          vacation_start: '',
          vacation_end: ''
        });
        setIsEditing(false);
        setDateValidationError('');
        window.dispatchEvent(new Event('announcementsUpdated'));
      } catch (err) {
        setErrorMessage('Chyba při komunikaci s databází.');
      }
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setNewAnnouncement({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content || '',
      type: announcement.type || 'announcement',
      vacation_start: announcement.vacation_start || '',
      vacation_end: announcement.vacation_end || ''
    });
    setIsEditing(true);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Opravdu chcete smazat tuto položku?')) {
      try {
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', id);

        if (error) {
          setErrorMessage('Nepodařilo se smazat aktualitu.');
          return;
        }
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        window.dispatchEvent(new Event('announcementsUpdated'));
      } catch (err) {
        setErrorMessage('Chyba při komunikaci s databází.');
      }
    }
  };

  const cancelForm = () => {
    setNewAnnouncement({
      id: null,
      title: '',
      content: '',
      type: 'announcement',
      vacation_start: '',
      vacation_end: ''
    });
    setIsEditing(false);
    setDateValidationError('');
  };

  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card mb-8 max-w-6xl mx-auto"
    >
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {isEditing ? 'Upravit položku' : 'Nová položka'}
          </h3>
          {isEditing && (
            <button 
              onClick={cancelForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAddAnnouncement}>
          <div className="mb-4">
            <label className="form-label">Typ</label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  newAnnouncement.type === 'announcement' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setNewAnnouncement({...newAnnouncement, type: 'announcement'})}
              >
                Aktualita
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  newAnnouncement.type === 'vacation' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setNewAnnouncement({...newAnnouncement, type: 'vacation'})}
              >
                Dovolená
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">Nadpis</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
              required
            />
          </div>

          {newAnnouncement.type === 'vacation' && (
            <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <h4 className="font-medium mb-3 text-orange-800">Období dovolené</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label htmlFor="vacationStart" className="form-label text-orange-800">Datum začátku</label>
                  <input
                    type="date"
                    id="vacationStart"
                    className="form-input border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                    value={newAnnouncement.vacation_start}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, vacation_start: e.target.value})}
                    min={getTodayFormatted()}
                  />
                </div>
                <div>
                  <label htmlFor="vacationEnd" className="form-label text-orange-800">Datum konce</label>
                  <input
                    type="date"
                    id="vacationEnd"
                    className="form-input border-orange-200 focus:ring-orange-500 focus:border-orange-500"
                    value={newAnnouncement.vacation_end}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, vacation_end: e.target.value})}
                    min={newAnnouncement.vacation_start || getTodayFormatted()}
                  />
                </div>
              </div>
              
              {dateValidationError && (
                <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm mb-3">
                  <AlertTriangle className="w-4 h-4 inline-block mr-1" />
                  {dateValidationError}
                </div>
              )}
              
              <p className="text-sm text-orange-700">
                <Info className="w-4 h-4 inline-block mr-1" />
                V tomto období budou automaticky zablokovány termíny v Online objednávání
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              {newAnnouncement.type === 'vacation' ? 'Dodatečné informace (např. zástup)' : 'Obsah'} (volitelné)
            </label>
            <textarea
              id="content"
              rows={4}
              className="form-input"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={cancelForm}
              className="btn btn-outline"
            >
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Ukládání...' : isEditing ? 'Uložit změny' : 'Přidat položku'}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Existující aktuality</h3>
          {isLoading ? (
            <div className="text-center p-8">
              <p>Načítání...</p>
            </div>
          ) : announcements.length > 0 ? (
            announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`card relative ${announcement.type === 'vacation' ? 'bg-orange-50' : ''}`}
              >
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button 
                    onClick={() => handleEditAnnouncement(announcement)}
                    className={`p-1.5 ${announcement.type === 'vacation' ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} rounded-full`}
                    aria-label="Upravit"
                    title="Upravit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className={`p-1.5 ${announcement.type === 'vacation' ? 'bg-orange-100 hover:bg-red-100 text-orange-700 hover:text-red-600' : 'bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600'} rounded-full`}
                    aria-label="Smazat"
                    title="Smazat"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                <div className="card-body">
                  <div className="flex justify-between mb-2">
                    <h3 className={`text-xl font-semibold pr-20 ${announcement.type === 'vacation' ? 'text-orange-800' : ''}`}>
                      {announcement.title}
                    </h3>
                    <span className={`text-sm ${announcement.type === 'vacation' ? 'text-orange-700' : 'text-gray-500'}`}>
                      {announcement.date}
                    </span>
                  </div>
                  <p className={announcement.type === 'vacation' ? 'text-orange-700' : 'text-gray-600'}>
                    {announcement.content || 'Žádné dodatečné informace'}
                  </p>
                  {announcement.vacation_start && announcement.vacation_end && (
                    <div className="mt-2 flex items-center">
                      <Calendar className="w-4 h-4 text-orange-500 mr-1" />
                      <span className="text-sm font-medium text-orange-800">
                        {formatVacationPeriod(announcement.vacation_start, announcement.vacation_end)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-8 text-gray-500">
              <p>Žádné aktuality k zobrazení.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const formatVacationPeriod = (start: string, end: string): string => {
  if (!start || !end) return '';
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };
  return `${formatDate(start)} - ${formatDate(end)}`;
};