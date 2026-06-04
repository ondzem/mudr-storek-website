import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Calendar, Clock, User, Phone, Mail, FileText, Loader, Edit, Trash2, X, Check, AlertTriangle, Ban, Info
} from 'lucide-react';

interface Booking {
  id: string;
  created_at: string;
  name: string;
  birthyear: number | null;
  phone: string | null;
  email: string | null;
  insurance: string | null;
  note: string | null;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  cancelled_at: string | null;
  cancellation_token: string;
}

interface GroupedBooking {
  id: string;
  relatedIds: string[];
  startTime: string;
  endTime: string;
  duration: number;
  cancelled_at: string | null;
  [key: string]: any;
}

interface BookingListProps {
  isAdminMode: boolean;
  onBookingDelete?: () => void;
}

const BookingList = ({ isAdminMode, onBookingDelete }: BookingListProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<GroupedBooking | null>(null);
  const [editForm, setEditForm] = useState<Partial<Booking>>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('appointment_date', today)
        .is('cancelled_at', null)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError('Nepodařilo se načíst rezervace.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminMode) {
      fetchBookings();

      const subscription = supabase
        .channel(`bookings-channel-${Date.now()}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings' },
          () => {
            fetchBookings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } else {
      setLoading(false);
    }
  }, [isAdminMode]);

  const getNextTimeSlot = (time: string, minutes: number = 10) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const groupBookings = (bookings: Booking[]): GroupedBooking[] => {
    const sortedBookings = [...bookings].sort((a, b) => {
      if (a.appointment_date !== b.appointment_date) return a.appointment_date.localeCompare(b.appointment_date);
      return a.appointment_time.localeCompare(b.appointment_time);
    });

    const grouped: GroupedBooking[] = [];
    const processed = new Set<string>();
    const twentyMinReasons = ['Preventivní prohlídka po 2 letech', 'Pracovnělékařská prohlídka', 'Diabetická kontrola', 'Vyšetření pro zbrojní průkaz'];

    let i = 0;
    while (i < sortedBookings.length) {
      const current = sortedBookings[i];
      const key = `${current.id}-${current.appointment_date}-${current.appointment_time}-${current.name}`;
      if (processed.has(key)) {
        i++;
        continue;
      }

      let duration = 10;
      let relatedBookings: Booking[] = [current];
      let endTime = getNextTimeSlot(current.appointment_time, 10);

      const [year, month, day] = current.appointment_date.split('-').map(Number);
      const apptDate = new Date(year, month - 1, day);
      const dayName = apptDate.toLocaleDateString('cs-CZ', { weekday: 'short' }).replace(' ', '');

      if (
        twentyMinReasons.includes(current.reason) &&
        i + 1 < sortedBookings.length &&
        current.appointment_time < '11:30'
      ) {
        const next = sortedBookings[i + 1];
        if (
          current.appointment_date === next.appointment_date &&
          current.name === next.name &&
          current.reason === next.reason &&
          getNextTimeSlot(current.appointment_time) === next.appointment_time
        ) {
          relatedBookings.push(next);
          const nextKey = `${next.id}-${next.appointment_date}-${next.appointment_time}-${next.name}`;
          processed.add(nextKey);
          duration = 20;
          endTime = getNextTimeSlot(current.appointment_time, 20);
          i += 2;
        } else {
          i++;
        }
      } else if (
        current.reason === 'Pracovnělékařská prohlídka' &&
        ['Út', 'Čt'].includes(dayName) &&
        current.appointment_time >= '10:30'
      ) {
        duration = 15;
        endTime = getNextTimeSlot(current.appointment_time, 15);
        i++;
      } else {
        i++;
      }

      processed.add(key);

      grouped.push({
        id: relatedBookings.map(b => b.id).join('-'),
        relatedIds: relatedBookings.map(b => b.id),
        startTime: current.appointment_time,
        endTime,
        duration,
        ...current
      });
    }

    return grouped.sort((a, b) => {
      if (a.appointment_date !== b.appointment_date) return a.appointment_date.localeCompare(b.appointment_date);
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const handleEdit = (booking: GroupedBooking) => {
    if (booking.cancelled_at) {
      setUpdateError('Nelze upravovat zrušenou rezervaci');
      return;
    }
    setUpdateError(null);
    setEditingBooking(booking);
    setEditForm({
      ...booking,
      appointment_time: booking.startTime
    });
  };

  const validateForm = () => {
    if (!editForm.name?.trim()) {
      setUpdateError('Jméno je povinné');
      return false;
    }
    if (
      editForm.birthyear &&
      (editForm.birthyear < 1900 || editForm.birthyear > new Date().getFullYear())
    ) {
      setUpdateError(`Rok narození musí být mezi 1900 a ${new Date().getFullYear()}`);
      return false;
    }
    const phone = editForm.phone?.trim();
    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!/^(?:\+?420)?\d{9}$/.test(cleanPhone)) {
        setUpdateError('Telefonní číslo musí být ve formátu +420 XXX XXX XXX nebo XXX XXX XXX');
        return false;
      }
    }
    const email = editForm.email?.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUpdateError('Zadejte platnou emailovou adresu');
      return false;
    }
    if (!editForm.appointment_date) {
      setUpdateError('Datum návštěvy je povinné');
      return false;
    }
    if (!editForm.appointment_time?.trim()) {
      setUpdateError('Čas návštěvy je povinný');
      return false;
    }
    if (!editForm.reason?.trim()) {
      setUpdateError('Důvod návštěvy je povinný');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!editingBooking?.id) {
      setUpdateError('Žádná rezervace k úpravě');
      return;
    }
    if (!validateForm()) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const grouped = groupBookings(bookings);
      const group = grouped.find(g => g.id === editingBooking.id);
      if (!group) throw new Error('Rezervace nenalezena');

      const is20Min = group.duration === 20;
      const timesToCheck = is20Min
        ? [editForm.appointment_time, getNextTimeSlot(editForm.appointment_time || '')]
        : [editForm.appointment_time];

      const { data: duplicates, error: dupError } = await supabase
        .from('bookings')
        .select('id')
        .eq('appointment_date', editForm.appointment_date)
        .in('appointment_time', timesToCheck)
        .not('id', 'in', `(${group.relatedIds.join(',')})`)
        .is('cancelled_at', null);

      if (dupError) throw new Error(`Chyba při kontrole dostupnosti termínu: ${dupError.message}`);
      if (duplicates.length > 0) {
        setUpdateError('Tento termín je již obsazený');
        setIsUpdating(false);
        return;
      }

      const updatePromises = group.relatedIds.map(async (id, index) => {
        const time = timesToCheck[index] || timesToCheck[0];
        const updatedBooking = {
          name: editForm.name?.trim(),
          birthyear: editForm.birthyear ? parseInt(editForm.birthyear.toString()) : null,
          phone: editForm.phone?.trim() || null,
          email: editForm.email?.trim() || null,
          insurance: editForm.insurance?.trim() || null,
          note: editForm.note?.trim() || null,
          appointment_date: editForm.appointment_date,
          appointment_time: time,
          reason: editForm.reason?.trim()
        };

        const { error: updateError } = await supabase
          .from('bookings')
          .update(updatedBooking)
          .eq('id', id);

        if (updateError) throw new Error(`Chyba při aktualizaci rezervace: ${updateError.message}`);
      });

      await Promise.all(updatePromises);

      if (editForm.email && editForm.email !== group.email) {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-cancellation-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editForm.name?.trim(),
            email: editForm.email?.trim(),
            appointment_date: editForm.appointment_date,
            appointment_time: editForm.appointment_time,
            reason: editForm.reason?.trim(),
            cancellation_token: group.cancellation_token,
          }),
        });
        if (!response.ok) {
          console.error('Chyba při odesílání aktualizovaného emailu:', await response.text());
        }
      }

      await fetchBookings();
      if (onBookingDelete) onBookingDelete();
      setEditingBooking(null);
      setEditForm({});
    } catch (err) {
      setUpdateError(err.message || 'Nepodařilo se uložit změny');
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      const grouped = groupBookings(bookings);
      const group = grouped.find(g => g.id === id);
      if (!group) throw new Error('Rezervace nenalezena');

      const { error } = await supabase
        .from('bookings')
        .delete()
        .in('id', group.relatedIds);

      if (error) throw new Error(`Chyba při mazání rezervace: ${error.message}`);

      await fetchBookings();
      if (onBookingDelete) onBookingDelete();
    } catch (err) {
      setDeleteError(err.message || 'Nepodařilo se smazat rezervaci');
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isAdminMode) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 text-yellow-800">
        <AlertTriangle className="w-5 h-5 mr-2 inline-block" />
        Pro zobrazení rezervací se přihlas jako admin.
      </div>
    );
  }

  const groupedBookings = groupBookings(bookings);

  return (
    <div className="overflow-x-auto">
      {deleteError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" /> {deleteError}
        </div>
      )}
      {updateError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" /> {updateError}
        </div>
      )}
      {loading ? (
        <div className="text-center"><Loader className="animate-spin w-6 h-6 mx-auto" /></div>
      ) : groupedBookings.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Žádné rezervace k zobrazení.</div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum a čas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pacient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Důvod</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poznámka</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kód pro zrušení</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupedBookings.map(group => {
              const isEditing = editingBooking?.id === group.id;
              const [year, month, day] = group.appointment_date.split('-').map(Number);
              const appointmentDate = new Date(year, month - 1, day);
              const dateStr = new Intl.DateTimeFormat('cs-CZ', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }).format(appointmentDate);

              return (
                <tr key={group.id} className={`hover:bg-gray-50 ${group.cancelled_at ? 'bg-gray-100 opacity-70' : ''}`}>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="date"
                          className="form-input w-full text-sm"
                          value={editForm.appointment_date || ''}
                          onChange={e => setEditForm({ ...editForm, appointment_date: e.target.value })}
                        />
                        <input
                          type="text"
                          className="form-input w-full text-sm"
                          value={editForm.appointment_time || ''}
                          onChange={e => setEditForm({ ...editForm, appointment_time: e.target.value })}
                          placeholder="HH:MM"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-primary-500 mr-2" />
                        <div>
                          <div className="font-medium">{dateStr}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> {group.startTime} - {group.endTime}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          className="form-input w-full text-sm"
                          value={editForm.name || ''}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        />
                        <input
                          type="number"
                          className="form-input w-full text-sm"
                          value={editForm.birthyear || ''}
                          onChange={e => setEditForm({ ...editForm, birthyear: parseInt(e.target.value) || null })}
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                        <select
                          className="form-input w-full text-sm"
                          value={editForm.insurance || ''}
                          onChange={e => setEditForm({ ...editForm, insurance: e.target.value })}
                        >
                          <option value="">Vyberte pojišťovnu</option>
                          <option value="111">VZP (111)</option>
                          <option value="201">VoZP (201)</option>
                          <option value="205">ČPZP (205)</option>
                          <option value="207">OZP (207)</option>
                          <option value="209">ZPŠ (209)</option>
                          <option value="211">ZPMV (211)</option>
                          <option value="213">RBP (213)</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-primary-500 mr-2" />
                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-gray-500">Pojišťovna: {group.insurance || '-'}</div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="tel"
                          className="form-input w-full text-sm"
                          value={editForm.phone || ''}
                          onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                          placeholder="+420 XXX XXX XXX"
                        />
                        <input
                          type="email"
                          className="form-input w-full text-sm"
                          value={editForm.email || ''}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="email"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" /> {group.phone || '-'}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" /> {group.email || '-'}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input w-full text-sm"
                        value={editForm.reason || ''}
                        onChange={e => setEditForm({ ...editForm, reason: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-primary-500 mr-2" /> {group.reason}
                        {group.duration === 20 && (
                          <span className="ml-2 text-xs text-gray-500">(20 min)</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input w-full text-sm"
                        value={editForm.note || ''}
                        onChange={e => setEditForm({ ...editForm, note: e.target.value })}
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{group.note || '-'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Info className="w-4 h-4 text-primary-500 mr-2" />
                      <span className="text-sm font-mono text-gray-700">{group.cancellation_token}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          disabled={isUpdating}
                          className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                        >
                          {isUpdating ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => { setEditingBooking(null); setEditForm({}); setUpdateError(null); }}
                          disabled={isUpdating}
                          className="p-1 text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : group.cancelled_at ? (
                      <div className="text-sm text-gray-500 flex items-center justify-end">
                        <Ban className="w-4 h-4 mr-1" /> Zrušeno
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(group)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)} // Přímo volána funkce handleDelete
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;