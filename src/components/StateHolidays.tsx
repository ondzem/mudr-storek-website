import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Holiday {
  id: string;
  date: string;
  name: string;
  year: number;
}

export const StateHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const availableYears = [2026, 2027, 2028, 2029, 2030, 2031];

  useEffect(() => {
    fetchHolidays();
  }, [selectedYear]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('holidays')
        .select('*')
        .eq('year', selectedYear)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;

      setHolidays(data || []);
    } catch (err) {
      console.error('Error fetching holidays:', err);
      setError('Nepodařilo se načíst svátky');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}. ${month}. (${dayName})`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-red-800 font-medium">Chyba při načítání</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Státní svátky</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="year-select" className="text-sm text-gray-600">
            Rok:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="form-input py-1 px-3"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {holidays.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Pro rok {selectedYear} nejsou k dispozici žádné svátky</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {holidays.map((holiday, index) => (
            <motion.div
              key={holiday.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800">{holiday.name}</h3>
                    <span className="text-sm text-gray-500 ml-4">
                      {formatDate(holiday.date)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
