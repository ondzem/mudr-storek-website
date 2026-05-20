import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Trash2, Plus, Loader, AlertTriangle, Info, X, Check } from 'lucide-react';
import { fetchVacationDates, addVacationDate, removeVacationDate } from '../lib/holidays';

interface VacationManagerProps {
  isAdminMode: boolean;
}

const VacationManager = ({ isAdminMode }: VacationManagerProps) => {
  const [vacationDates, setVacationDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminMode) {
      loadVacationDates();
    } else {
      setLoading(false);
    }
  }, [isAdminMode]);

  const loadVacationDates = async () => {
    try {
      setLoading(true);
      setError(null);
      const dates = await fetchVacationDates();
      setVacationDates(dates);
    } catch (err) {
      setError('Chyba při načítání dovolených');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVacation = async () => {
    if (!startDate || !endDate) {
      setError('Vyberte datum začátku i konce dovolené');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Datum začátku dovolené nemůže být později než konec');
      return;
    }

    try {
      setAdding(true);
      setError(null);
      setSuccess(null);
      
      const result = await addVacationDate(startDate, endDate);
      
      if (result.success) {
        setSuccess('Dovolená byla úspěšně přidána');
        setStartDate('');
        setEndDate('');
        await loadVacationDates();
      } else {
        setError('Chyba při přidávání dovolené');
      }
    } catch (err) {
      setError('Chyba při přidávání dovolené');
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveVacation = async (id: string) => {
    if (!window.confirm('Opravdu chcete odstranit tuto dovolenou?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await removeVacationDate(id);
      
      if (result.success) {
        setSuccess('Dovolená byla úspěšně odebrána');
        await loadVacationDates();
      } else {
        setError('Chyba při odebírání dovolené');
      }
    } catch (err) {
      setError('Chyba při odebírání dovolené');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return new Intl.DateTimeFormat('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getTodayFormatted = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isAdminMode) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5 text-yellow-800">
        <AlertTriangle className="w-5 h-5 mr-2 inline-block" />
        Pro správu dovolených se přihlaste jako administrátor.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" /> 
          <p>{error}</p>
          <button 
            className="ml-auto p-1.5 bg-red-100 text-red-500 rounded-full"
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{success}</p>
          <button 
            className="ml-auto p-1.5 bg-green-100 text-green-500 rounded-full"
            onClick={() => setSuccess(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Přidat novou dovolenou</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="form-label">Datum začátku</label>
              <div className="flex items-center relative">
                <CalendarIcon className="w-5 h-5 absolute left-3 text-gray-400" />
                <input
                  type="date"
                  id="startDate"
                  className="form-input pl-10"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getTodayFormatted()}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="form-label">Datum konce</label>
              <div className="flex items-center relative">
                <CalendarIcon className="w-5 h-5 absolute left-3 text-gray-400" />
                <input
                  type="date"
                  id="endDate"
                  className="form-input pl-10"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || getTodayFormatted()}
                />
              </div>
            </div>
            
            <button
              className="btn btn-primary flex items-center justify-center w-full"
              onClick={handleAddVacation}
              disabled={adding || !startDate || !endDate}
            >
              {adding ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              Přidat dovolenou
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Vybrané období bude automaticky blokováno v systému objednávek.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Naplánované dovolené</h3>
          {loading ? (
            <div className="flex justify-center p-6">
              <Loader className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : vacationDates.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              <CalendarIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p>Žádné naplánované dovolené</p>
            </div>
          ) : (
            <div className="space-y-3">
              {vacationDates.map((date) => (
                <div key={date} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0" />
                    <span className="font-medium">{formatDate(date)}</span>
                  </div>
                  <button
                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                    onClick={() => handleRemoveVacation(date)}
                    aria-label="Odstranit dovolenou"
                    title="Odstranit dovolenou"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VacationManager;