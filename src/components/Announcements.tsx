import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from "../lib/supabase.ts";
import { Calendar, AlertTriangle } from 'lucide-react';

const Announcements = ({ type }: { type: 'announcement' | 'vacation' }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('type', type)
          .order('active', { ascending: false })
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Chyba při načítání aktualit:', error);
          setError('Nepodařilo se načíst aktuality. Zkuste to znovu.');
          return;
        }

        setAnnouncements(data || []);
      } catch (err) {
        console.error('Chyba při komunikaci s Supabase:', err);
        setError('Chyba při komunikaci s databází.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();

    // Real-time subscription
    const subscription = supabase
      .channel(`announcements-public-${type}-${Date.now()}`)
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

  const formatVacationPeriod = (start, end) => {
    if (!start || !end) return '';
    const formatDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}.${month}.${year}`;
    };
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const filteredAnnouncements = announcements.filter((a) => a.type === type);

  return (
    <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
      {isLoading ? (
        <div className="text-center p-8">
          <p>Načítání...</p>
        </div>
      ) : error ? (
        <div className="p-2 bg-red-50 text-red-600 rounded-md text-sm mb-3">
          <AlertTriangle className="w-4 h-4 inline-block mr-1" />
          {error}
        </div>
      ) : (
        <>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`card relative ${announcement.type === 'vacation' ? 'bg-orange-50' : ''}`}
              >
                <div className="card-body">
                  <div className="flex justify-between mb-2">
                    <h3 className={`text-xl font-semibold pr-20 ${announcement.type === 'vacation' ? 'text-orange-800' : ''}`}>{announcement.title}</h3>
                    <span className={`text-sm ${announcement.type === 'vacation' ? 'text-orange-700' : 'text-gray-500'}`}>{announcement.date}</span>
                  </div>
                  <p className={announcement.type === 'vacation' ? 'text-orange-700' : 'text-gray-600'}>{announcement.content}</p>
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
              <p>Žádné aktuální oznámení k dispozici.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Announcements;