import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, FileText, User, Phone, Mail, Check, Info, AlertCircle, Loader,
  ChevronLeft, ChevronRight, AlertTriangle, Lock, XCircle
} from 'lucide-react';
import BookingList from '../components/BookingList';
import { supabase } from '../lib/supabase';
import { isVacationDate as isVacationDateFn, fetchVacationDates } from '../lib/holidays';

const czechHolidays = [
  { date: "2026-01-01", name: "Nový rok + Den obnovy samostatného českého státu", reason: "Státní svátek" },
  { date: "2026-04-03", name: "Velký pátek", reason: "Státní svátek - křesťanský svátek před Velikonocemi" },
  { date: "2026-04-06", name: "Velikonoční pondělí", reason: "Státní svátek - křesťanský svátek" },
  { date: "2026-05-01", name: "Svátek práce", reason: "Státní svátek - mezinárodní dělnický svátek" },
  { date: "2026-05-08", name: "Den vítězství", reason: "Státní svátek - konec 2. světové války v Evropě" },
  { date: "2026-07-05", name: "Den slovanských věrozvěstů Cyrila a Metoděje", reason: "Státní svátek - příchod věrozvěstů" },
  { date: "2026-07-06", name: "Den upálení mistra Jana Husa", reason: "Státní svátek - upálení mistra Jana Husa" },
  { date: "2026-09-28", name: "Den české státnosti", reason: "Státní svátek - svátek sv. Václava" },
  { date: "2026-10-28", name: "Den vzniku samostatného československého státu", reason: "Státní svátek - vznik samostatného československého státu" },
  { date: "2026-11-17", name: "Den boje za svobodu a demokracii", reason: "Státní svátek - sametová revoluce" },
  { date: "2026-12-24", name: "Štědrý den", reason: "Státní svátek - Vánoce" },
  { date: "2026-12-25", name: "1. svátek vánoční", reason: "Státní svátek - Vánoce" },
  { date: "2026-12-26", name: "2. svátek vánoční", reason: "Státní svátek - Vánoce" }
];

const reasonOptions = [
  { id: 'check', label: 'Preventivní prohlídka po 2 letech' },
  { id: 'acute', label: 'Akutní onemocnění' },
  { id: 'chronic', label: 'Kontrola, předpis léků' },
  { id: 'prescription', label: 'Diabetická kontrola' },
  { id: 'workcheck', label: 'Pracovnělékařská prohlídka' },
  { id: 'driver', label: 'Řidičský průkaz' },
  { id: 'gunlicense', label: 'Vyšetření pro zbrojní průkaz' },
  { id: 'other', label: 'Jiné' }
];

const reasonDurations = {
  'Preventivní prohlídka po 2 letech': 20,
  'Pracovnělékařská prohlídka': 20,
  'Akutní onemocnění': 10,
  'Kontrola, předpis léků': 10,
  'Diabetická kontrola': 20,
  'Řidičský průkaz': 10,
  'Vyšetření pro zbrojní průkaz': 20,
  'Jiné': 10
};

const getAvailableWorkCheckTimesOnTuesday = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (year === 2026 && month === 0) {
    return [];
  }

  return [
    { start: '11:30', end: '11:45' },
    { start: '11:45', end: '12:00' }
  ];
};

const blockedWorkCheckTimesOnTuesday = [
  '12:00-12:15',
  '12:15-12:30',
  '12:30-12:45',
  '12:45-13:00'
];

const generateCancellationToken = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `rezervace-${timestamp}-${random}`;
};

const AppointmentPage = () => {
  const [isAdminMode, setIsAdminMode] = useState(() => localStorage.getItem('isAdminLoggedIn') === 'true');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [availableDays, setAvailableDays] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birthyear: 0,
    phone: '',
    email: '',
    insurance: '',
    note: '',
    cancellationToken: ''
  });
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const [bookingsFetched, setBookingsFetched] = useState(false);
  const [isFetchingBookings, setIsFetchingBookings] = useState(false);
  const [vacationDates, setVacationDates] = useState([]);
  const [isVacationDatesLoaded, setIsVacationDatesLoaded] = useState(false);
  const [isNoteRequired, setIsNoteRequired] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState(null);

  const formRef = useRef(null);
  const summaryRef = useRef(null);

  const handleLogin = async e => {
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
  };

  const isHoliday = date => czechHolidays.some(holiday => {
    const [y, m, d] = holiday.date.split('-').map(Number);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  });

  const getHolidayInfo = date => czechHolidays.find(holiday => {
    const [y, m, d] = holiday.date.split('-').map(Number);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  });

  useEffect(() => {
    const loadVacationDates = async () => {
      try {
        const dates = await fetchVacationDates();
        setVacationDates(dates);
        setIsVacationDatesLoaded(true);
      } catch (error) {
        setVacationDates([]);
        setIsVacationDatesLoaded(true);
      }
    };

    loadVacationDates();
    window.addEventListener('announcementsUpdated', loadVacationDates);
    return () => window.removeEventListener('announcementsUpdated', loadVacationDates);
  }, []);

  const isWeekend = date => [0, 6].includes(date.getDay());

  const isVacationDate = date => isVacationDateFn(date, vacationDates);

  const getNextTimeSlot = (time, minutes = 10) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const generateExactTimeSlots = dayName => {
    const ranges = {
      Po: ['08:30', '10:30'],
      Út: ['07:30', '08:30'],
      St: ['13:30', '15:30'],
      Čt: ['07:30', '09:30'],
      Pá: ['07:30', '08:30']
    };
    const [start, end] = ranges[dayName] || [];
    if (!start || !end) return [];
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const slots = [];
    let cur = new Date(0, 0, 0, h1, m1);
    const endTime = new Date(0, 0, 0, h2, m2);
    endTime.setMinutes(endTime.getMinutes() - 10);
    while (cur <= endTime) {
      slots.push(`${cur.getHours().toString().padStart(2, '0')}:${cur.getMinutes().toString().padStart(2, '0')}`);
      cur.setMinutes(cur.getMinutes() + 10);
    }
    return slots;
  };

  const generateWorkCheckSlots = date => {
    const dayName = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][date.getDay()];
    if (dayName !== 'Čt') return [];

    const extraSlots = [
      { start: '10:30', end: '10:45' },
      { start: '10:45', end: '11:00' },
      { start: '11:00', end: '11:15' },
      { start: '11:15', end: '11:30' }
    ];

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayBookings = existingBookings.filter(b => b.appointment_date === dateKey && b.reason === 'Pracovnělékařská prohlídka');
    const groupedBookings = groupBookings(dayBookings);
    const now = new Date();

    return extraSlots.map(slot => {
      const [startH, startM] = slot.start.split(':').map(Number);
      const appointmentTime = new Date(date);
      appointmentTime.setHours(startH, startM);
      const isPast = appointmentTime < now;

      let isTaken = false;
      const booking = dayBookings.find(
        b => b.appointment_time === slot.start && b.cancelled_at === null
      );
      isTaken = !!booking;

      return {
        time: `${slot.start}-${slot.end}`,
        isTaken: isTaken || isPast,
        duration: 15
      };
    });
  };

  const groupBookings = bookings => {
    const grouped = [];

    for (const booking of bookings) {
      const duration = ['Preventivní prohlídka po 2 letech', 'Pracovnělékařská prohlídka', 'Diabetická kontrola', 'Vyšetření pro zbrojní průkaz'].includes(booking.reason) ? 20 : 10;
      const startTime = booking.appointment_time;
      const endTime = duration === 10 ? getNextTimeSlot(startTime, 10) : getNextTimeSlot(getNextTimeSlot(startTime, 10), 10);

      grouped.push({
        startTime,
        endTime,
        duration,
        reason: booking.reason
      });
    }

    return grouped;
  };

  const generateTimeSlotsForDay = date => {
    if (!date || isWeekend(date) || isHoliday(date) || isVacationDate(date)) {
      return { regular: [] };
    }

    const dayName = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][date.getDay()];
    const regularSlots = generateExactTimeSlots(dayName);

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayBookings = existingBookings.filter(b => b.appointment_date === dateKey && !b.cancelled_at);

    if (dateKey === '2026-03-19') {
      console.log('=== 19.3.2026 DEBUG ===');
      console.log('dateKey hledám:', dateKey);
      console.log('existingBookings celkem:', existingBookings.length);
      console.log('Prvních 5 bookings:', existingBookings.slice(0, 5).map(b => ({
        date: b.appointment_date,
        time: b.appointment_time,
        cancelled: b.cancelled_at
      })));
      const march = existingBookings.filter(b => b.appointment_date && b.appointment_date.includes('2026-03'));
      console.log('Všechny březen 2026:', march.map(b => b.appointment_date));
      console.log('dayBookings pro 19.3:', dayBookings);
    }

    const now = new Date();

    const regular = regularSlots.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const appointmentTime = new Date(date);
      appointmentTime.setHours(hours, minutes);
      const isPast = appointmentTime < now;

      const isTaken = dayBookings.some(b => b.appointment_time === time);

      return { time, isTaken: isTaken || isPast };
    });

    return { regular };
  };

  const getDatesInMonth = (year, month) => {
    const dates = [];
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    for (let d = 1; d <= last.getDate(); d++) {
      dates.push(new Date(year, month, d));
    }
    return dates;
  };

  const groupDaysByWeek = days => {
    const weeks = [];
    let week = [];
    days.forEach(d => {
      if (week.length === 0 || d.getDay() !== 1) {
        week.push(d);
      } else {
        weeks.push(week);
        week = [d];
      }
    });
    if (week.length) weeks.push(week);
    return weeks;
  };

  const generateAvailableDaysForMonth = (year, month) => {
    const days = getDatesInMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return days.map(date => {
      const isPast = date < today;
      const holiday = isHoliday(date);
      const vac = isVacationDate(date);
      const weekend = isWeekend(date);
      const slots = generateTimeSlotsForDay(date);
      const dayName = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][date.getDay()];
      const workCheckSlots = generateWorkCheckSlots(date);
      const hasFree = slots.regular.some(slot => !slot.isTaken) || 
        (dayName === 'Čt' && workCheckSlots.some(slot => !slot.isTaken));

      return {
        fullDate: date,
        date: `${date.getDate()}.${date.getMonth() + 1}.`,
        day: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][date.getDay()],
        slots,
        isHoliday: holiday,
        holidayInfo: holiday ? getHolidayInfo(date) : null,
        isVacation: vac,
        isWeekend: weekend,
        isAvailable: !isPast && !holiday && !vac && !weekend && hasFree,
      };
    });
  };

  const generateAvailableMonths = () => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      arr.push({
        date: d,
        month: d.getMonth(),
        year: d.getFullYear(),
        monthName: new Intl.DateTimeFormat('cs-CZ', { month: 'long' }).format(d)
      });
    }
    return arr;
  };

  const fetchBookings = async (force = false) => {
    console.log('fetchBookings zavoláno, force:', force, 'isFetching:', isFetchingBookings);
    if (isFetchingBookings && !force) {
      console.log('fetchBookings přeskočeno - už běží');
      return;
    }
    setIsFetchingBookings(true);
    const today = new Date().toISOString().split('T')[0];
    const max = new Date();
    max.setMonth(max.getMonth() + 6);
    const last = max.toISOString().split('T')[0];

    console.log('Dotaz na bookings od', today, 'do', last);

    const { data, error } = await supabase
      .from('bookings')
      .select('id, created_at, name, phone, email, insurance, note, appointment_date, appointment_time, reason, birthyear, cancelled_at')
      .gte('appointment_date', today)
      .lte('appointment_date', last);

    console.log('Výsledek dotazu:', { data: data?.length, error });
    if (data && data.length > 0) {
      console.log('První 3 rezervace:', data.slice(0, 3));
      console.log('Formát appointment_date v datech:', typeof data[0]?.appointment_date, data[0]?.appointment_date);
      const march19 = data.filter(b => b.appointment_date === '2026-03-19');
      console.log('Rezervace pro 2026-03-19:', march19);
      const allDates = [...new Set(data.map(b => b.appointment_date))].sort();
      console.log('Všechna unikátní data v bookings:', allDates.slice(0, 10));
    }

    if (!error && data) {
      console.log('Nastavuji existingBookings na', data.length, 'rezervací');
      setExistingBookings([...data]);
    } else if (error) {
      console.error('Chyba při načítání rezervací:', error);
    }
    setBookingsFetched(true);
    setIsFetchingBookings(false);
  };

  useEffect(() => {
    console.log('Initial useEffect - načítání dat');
    setAvailableMonths(generateAvailableMonths());
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    console.log('Supabase URL:', url);
    console.log('Supabase key exists:', !!key);
    const ok = url && key && !url.includes('váš-projekt') && !key.includes('váš-anon');
    console.log('Supabase connected:', ok);
    setIsSupabaseConnected(ok);
    if (ok) {
      console.log('Volám fetchBookings...');
      fetchBookings();
    } else {
      console.log('Supabase není připojeno, přeskakuji fetch');
      setBookingsFetched(true);
    }
  }, []);

  useEffect(() => {
    if (!bookingsFetched || !isVacationDatesLoaded) return;

    const loadDays = () => {
      console.log('Generuji dny pro měsíc s', existingBookings.length, 'rezervacemi');
      const days = generateAvailableDaysForMonth(selectedMonth.getFullYear(), selectedMonth.getMonth());
      setAvailableDays(days);

      if (selectedDay) {
        const updated = days.find(d => d.fullDate.getTime() === selectedDay.fullDate.getTime());
        if (updated) {
          setSelectedDay(updated);
          if (updated.slots.regular.every(s => s.isTaken)) setSelectedTime('');
        } else {
          setSelectedDay(null);
          setSelectedTime('');
        }
      }
    };

    loadDays();
  }, [selectedMonth, bookingsFetched, existingBookings, vacationDates, isVacationDatesLoaded]);

  useEffect(() => {
    if (!selectedDay || !isVacationDatesLoaded) return;
    const refreshed = generateTimeSlotsForDay(selectedDay.fullDate);
    setSelectedDay(day => ({ ...day, slots: refreshed }));
  }, [existingBookings, vacationDates, isVacationDatesLoaded]);

  const handleMonthChange = m => setSelectedMonth(m.date);

  const handlePrevMonth = () => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() - 1);
    const now = new Date();
    if (d < new Date(now.getFullYear(), now.getMonth(), 1)) return;
    setSelectedMonth(d);
  };

  const handleNextMonth = () => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + 1);
    const max = new Date();
    max.setMonth(max.getMonth() + 4);
    if (d > new Date(max.getFullYear(), max.getMonth(), 1)) return;
    setSelectedMonth(d);
  };

  const handleDaySelect = day => {
    if (!day.isAvailable || day.slots.regular.length === 0) return;
    setSelectedDay(day);
    setSelectedReason('');
    setSelectedDuration(null);
    setSelectedTime('');
  };

  const generateAvailableTimes = () => {
    if (!selectedDay || !selectedDuration) return [];

    const regularSlots = selectedDay.slots.regular;
    const availableTimes = [];
    const dayName = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][selectedDay.fullDate.getDay()];
    const isTuesday = dayName === 'Út';
    const isThursday = dayName === 'Čt';
    const isWorkCheck = selectedReason === 'workcheck';
    const now = new Date();

    if (selectedDuration === 10) {
      regularSlots.forEach(slot => {
        availableTimes.push({
          time: slot.time,
          isTaken: slot.isTaken
        });
      });
    } else if (selectedDuration === 20) {
      for (let i = 0; i < regularSlots.length - 1; i++) {
        const current = regularSlots[i];
        const next = regularSlots[i + 1];
        const startTime = current.time;
        const endTime = getNextTimeSlot(next.time);
        const isTaken = current.isTaken || next.isTaken;
        availableTimes.push({
          time: `${startTime}-${endTime}`,
          isTaken
        });
      }

      if (isWorkCheck && (isTuesday || isThursday)) {
        const extraSlots = isTuesday
          ? [
              ...getAvailableWorkCheckTimesOnTuesday(selectedDay.fullDate).map(slot => {
                const [startH, startM] = slot.start.split(':').map(Number);
                const appointmentTime = new Date(selectedDay.fullDate);
                appointmentTime.setHours(startH, startM);
                const isPast = appointmentTime < now;

                let isTaken = false;
                const booking = existingBookings.find(
                  b =>
                    b.appointment_date === `${selectedDay.fullDate.getFullYear()}-${String(selectedDay.fullDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.fullDate.getDate()).padStart(2, '0')}` &&
                    b.appointment_time === slot.start &&
                    b.reason === 'Pracovnělékařská prohlídka' &&
                    b.cancelled_at === null
                );
                isTaken = !!booking;

                return {
                  time: `${slot.start}-${slot.end}`,
                  isTaken: isTaken || isPast,
                  duration: 15
                };
              }),
              ...blockedWorkCheckTimesOnTuesday.map(time => ({ time, isTaken: true, duration: 15 }))
            ]
          : [
              { start: '10:30', end: '10:45' },
              { start: '10:45', end: '11:00' },
              { start: '11:00', end: '11:15' },
              { start: '11:15', end: '11:30' }
            ].map(slot => {
              const [startH, startM] = slot.start.split(':').map(Number);
              const appointmentTime = new Date(selectedDay.fullDate);
              appointmentTime.setHours(startH, startM);
              const isPast = appointmentTime < now;

              let isTaken = false;
              const booking = existingBookings.find(
                b =>
                  b.appointment_date === `${selectedDay.fullDate.getFullYear()}-${String(selectedDay.fullDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.fullDate.getDate()).padStart(2, '0')}` &&
                  b.appointment_time === slot.start &&
                  b.reason === 'Pracovnělékařská prohlídka' &&
                  b.cancelled_at === null
              );
              isTaken = !!booking;

              return {
                time: `${slot.start}-${slot.end}`,
                isTaken: isTaken || isPast,
                duration: 15
              };
            });

        availableTimes.push({ divider: true });
        availableTimes.push(...extraSlots);
      }
    }

    return availableTimes;
  };

  const availableTimes = generateAvailableTimes();

  const handleTimeSelect = time => setSelectedTime(time);

  const handleReasonSelect = r => {
    const reasonLabel = reasonOptions.find(opt => opt.id === r)?.label;
    setSelectedReason(r);
    setSelectedDuration(reasonDurations[reasonLabel]);
    setSelectedTime('');
    setIsNoteRequired(r === 'other');
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'birthyear') {
      setFormData(fd => ({ ...fd, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(fd => ({ ...fd, [name]: value }));
    }
  };

  const goToNextStep = () => {
    if (step === 1 && selectedDay && selectedTime && selectedReason) {
      setStep(2);
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (step === 2) {
      submitBooking();
    }
  };

  const goToPrevStep = () => setStep(1);

  const validateFormData = () => {
    const errs = [];
    if (!formData.name.trim()) errs.push('Vyplňte prosím jméno a příjmení');
    if (!selectedDay) errs.push('Vyberte prosím datum návštěvy');
    if (!selectedTime) errs.push('Vyberte prosím čas návštěvy');
    if (!selectedReason) errs.push('Vyberte prosím důvod návštěvy');
    if (isNoteRequired && !formData.note.trim()) errs.push('Vyplňte prosím poznámku (povinná pro důvod "Jiné")');
    if (!isAdminMode && !formData.email) errs.push('Vyplňte prosím emailovou adresu');
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.push('Zadejte platnou emailovou adresu');
    if (formData.phone && !/^\+?420?\s?\d{3}\s?\d{3}\s?\d{3}$/.test(formData.phone)) {
      errs.push('Telefonní číslo musí být ve formátu +420 XXX XXX XXX nebo XXX XXX XXX');
    }
    return errs;
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    setError('');
    setEmailSendingError(null);
    try {
      const errs = validateFormData();
      if (errs.length) {
        setError(errs.join('\n'));
        setIsSubmitting(false);
        return;
      }

      const apptDate = selectedDay.fullDate;
      const apptDateString = `${apptDate.getFullYear()}-${String(apptDate.getMonth() + 1).padStart(2, '0')}-${String(apptDate.getDate()).padStart(2, '0')}`;

      const dayName = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][apptDate.getDay()];
      const validSlots = generateTimeSlotsForDay(apptDate);
      const allAvailableTimes = generateAvailableTimes();
      const selectedTimeIsValid = allAvailableTimes.some(slot => !slot.divider && slot.time === selectedTime);

      if (!selectedTimeIsValid) {
        setError(`Vybraný čas ${selectedTime} není platný pro ${dayName} ${apptDateString}. Prosím vyberte jiný čas.`);
        setIsSubmitting(false);
        return;
      }

      let startTime;
      let timesToBook;
      if (selectedDuration === 20) {
        startTime = selectedTime.split('-')[0];
        timesToBook = availableTimes.find(t => t.time === selectedTime)?.duration === 15
          ? [startTime]
          : [startTime, getNextTimeSlot(startTime)];
      } else {
        startTime = selectedTime;
        timesToBook = [startTime];
      }

      const { data: existing, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('appointment_date', apptDateString)
        .in('appointment_time', timesToBook)
        .is('cancelled_at', null);

      if (checkError) throw checkError;

      if (existing.length > 0) {
        setError('Zvolený termín je již obsazený. Zvolte prosím jiný čas.');
        setIsSubmitting(false);
        return;
      }

      const reasonLabel = reasonOptions.find(r => r.id === selectedReason)?.label;
      const cancellationToken = generateCancellationToken();
      const bookingData = timesToBook.map(time => ({
        name: formData.name.trim(),
        birthyear: formData.birthyear,
        phone: formData.phone.trim() || null,
        email: formData.email ? formData.email.trim() : null,
        insurance: formData.insurance || null,
        note: formData.note || null,
        appointment_date: apptDateString,
        appointment_time: time,
        reason: reasonLabel,
        cancellation_token: cancellationToken
      }));

      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (insertError) {
        console.error('Insert error:', insertError);

        // Check for duplicate booking constraint violation
        if (insertError.code === '23505' && insertError.message.includes('unique_active_booking_slot')) {
          setError('Tento termín byl právě obsazen jiným uživatelem. Prosím vyberte jiný čas.');
          setIsSubmitting(false);
          await fetchBookings(true); // Refresh available slots
          return;
        }

        throw new Error(`Chyba při vytváření rezervace: ${insertError.message}`);
      }

      setFormData(prev => ({ ...prev, cancellationToken }));

      // Email odesílání na pozadí - NEČEKAT na výsledek
      if (formData.email) {
        fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-cancellation-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            appointment_date: apptDateString,
            appointment_time: startTime,
            reason: reasonLabel,
            cancellation_token: cancellationToken
          }),
        })
        .then(response => response.json())
        .then(result => {
          if (!result.success) {
            console.error('Nepodařilo se odeslat email:', result);
            setEmailSendingError(result);
          }
        })
        .catch(err => {
          console.error('Chyba při odesílání emailu:', err);
          setEmailSendingError({ error: 'Failed to send email', details: err.message });
        });
      }

      // Refresh bookings PŘED zobrazením úspěchu - FORCE refresh
      await fetchBookings(true);

      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        if (summaryRef.current) {
          summaryRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Nastala chyba při vytváření rezervace. Zkuste to prosím znovu.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Online objednání | MUDr. Ludvík Štorek</title>
        <meta
          name="description"
          content="Jednoduché online objednání k praktickému lékaři MUDr. Ludvíku Štorkovi. Rezervujte si termín."
        />
      </Helmet>

      {isSuccess ? (
        <>
          <section className="bg-primary-500 text-white py-12 mb-8">
            <div className="container">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                Rezervace dokončena
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl font-light"
              >
                Vaše objednání bylo úspěšně vytvořeno
              </motion.p>
            </div>
          </section>

          <section className="section bg-white">
            <div className="container max-w-3xl">
              <motion.div
                ref={summaryRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card text-center"
              >
                <div className="card-body py-12">
                  <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">Děkujeme za vaši rezervaci</h2>
                  <p className="text-gray-600 mb-6">
                    {formData.email ? (
                      <>
                        Na váš email <span className="font-medium">{formData.email}</span> jsme odeslali potvrzení rezervace.{' '}
                        {emailSendingError ? (
                          <span className="text-red-600">
                            Email se nepodařilo odeslat, prosím kontaktujte nás.
                          </span>
                        ) : (
                          <span>
                            Najdete v něm odkaz pro případné zrušení rezervace (nejpozději 24 hodin před termínem).
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        Vaše objednání bylo úspěšně vytvořeno. Níže naleznete kód pro zrušení rezervace, protože jste nezadali email.
                      </>
                    )}
                  </p>

                  {emailSendingError && formData.email && (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-6 max-w-md mx-auto">
                      <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Email s potvrzením se nepodařilo odeslat</p>
                          <p className="text-sm mt-1">
                            Důvod: {emailSendingError.details && emailSendingError.details.includes("Username and Password not accepted") 
                              ? "Nesprávné přihlašovací údaje k emailovému účtu. Kontaktujte prosím správce systému."
                              : emailSendingError.details || "Neznámá chyba"
                            }
                          </p>
                          <p className="text-sm mt-2">
                            Uschovejte si prosím váš kód pro zrušení uvedený níže.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="card bg-gray-50 mb-8 max-w-md mx-auto">
                    <div className="card-body text-left">
                      <h3 className="font-semibold mb-4">Shrnutí rezervace:</h3>
                      <dl className="space-y-4">
                        <div className="flex items-start">
                          <Calendar className="w-5 h-5 text-primary-500 mt-1" />
                          <div className="ml-3">
                            <dt className="text-sm font-medium text-gray-700">Datum</dt>
                            <dd className="text-gray-600">
                              {new Intl.DateTimeFormat('cs-CZ', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }).format(selectedDay?.fullDate)}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="w-5 h-5 text-primary-500 mt-1" />
                          <div className="ml-3">
                            <dt className="text-sm font-medium text-gray-700">Čas</dt>
                            <dd className="text-gray-600">{selectedTime}</dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FileText className="w-5 h-5 text-primary-500 mt-1" />
                          <div className="ml-3">
                            <dt className="text-sm font-medium text-gray-700">Důvod návštěvy</dt>
                            <dd className="text-gray-600">
                              {reasonOptions.find(r => r.id === selectedReason)?.label}
                            </dd>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Info className="w-5 h-5 text-primary-500 mt-1" />
                          <div className="ml-3">
                            <dt className="text-sm font-medium text-gray-700">Kód pro zrušení</dt>
                            <dd className="text-gray-600 font-mono">{formData.cancellationToken}</dd>
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6">
                    {formData.email ? (
                      'Pokud potřebujete rezervaci zrušit, použijte odkaz v potvrzovacím emailu.'
                    ) : (
                      'Pro zrušení rezervace použijte kód výše na stránce „Zrušit rezervaci".'
                    )}{' '}
                    Zrušení je možné nejpozději 24 hodin před termínem.
                  </p>

                  <div className="flex justify-center space-x-4">
                    <a href={`/zrusit?token=${formData.cancellationToken}`} className="btn btn-outline">
                      Zrušit rezervaci
                    </a>
                    <a href="/objednani" className="btn btn-primary">
                      Zpět na online objednání
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="bg-primary-500 text-white py-12">
            <div className="container">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2 mt-2 text-2xl md:text-4xl"
              >
                Online objednání na vyšetření
              </motion.h1>
            </div>
          </section>

          <section className="section bg-white">
            <div className="container max-w-6xl">
              {!isSupabaseConnected && (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-md flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <p>
                    <strong>Poznámka:</strong> Aplikace není připojena k databázi Supabase.
                    Rezervace budou pouze simulovány a nebudou uloženy. Pro ukládání rezervací
                    prosím nakonfigurujte připojení k Supabase.
                  </p>
                </div>
              )}

              <div className="mb-10">
                <div className="flex items-center justify-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    step === 1 ? 'bg-primary-500 text-white' : 'bg-primary-500 text-white'
                  } font-semibold`}>
                    1
                  </div>
                  <div className={`w-16 h-1 ${
                    step === 2 ? 'bg-primary-500' : 'bg-gray-300'
                  }`}></div>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    step === 2 ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
                  } font-semibold`}>
                    2
                  </div>
                </div>
                <div className="flex justify-center mt-2">
                  <div className={`text-center w-32 ${step === 1 ? 'text-primary-500 font-medium' : ''}`}>
                    Termín
                  </div>
                  <div className={`text-center w-32 ${step === 2 ? 'text-primary-500 font-medium' : ''}`}>
                    Údaje
                  </div>
                </div>
              </div>

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isVacationDatesLoaded ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader className="w-6 h-6 animate-spin text-primary-500 mr-2" />
                      <p>Načítání kalendáře...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        <div className="card">
                          <div className="card-body">
                            <div className="flex items-center justify-between mb-6">
                              <button
                                onClick={handlePrevMonth}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                disabled={
                                  selectedMonth.getFullYear() === new Date().getFullYear() &&
                                  selectedMonth.getMonth() === new Date().getMonth()
                                }
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <h2 className="text-xl font-semibold">
                                {new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric' }).format(selectedMonth)}
                              </h2>
                              <button
                                onClick={handleNextMonth}
                                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                                disabled={
                                  selectedMonth.getFullYear() === availableMonths[availableMonths.length - 1]?.year &&
                                  selectedMonth.getMonth() === availableMonths[availableMonths.length - 1]?.month
                                }
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                              {availableMonths.map((month, index) => (
                                <button
                                  key={index}
                                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                    selectedMonth.getMonth() === month.month && selectedMonth.getFullYear() === month.year
                                      ? 'bg-primary-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                  onClick={() => handleMonthChange(month)}
                                >
                                  {month.monthName}
                                </button>
                              ))}
                            </div>

                            <div className="space-y-6">
                              {groupDaysByWeek(
                                availableDays.map(day => day.fullDate)
                              ).map((week, weekIndex) => (
                                <div key={weekIndex} className="space-y-2">
                                  <h3 className="text-sm font-medium text-gray-500">
                                    Týden {weekIndex + 1}
                                  </h3>
                                  <div className="grid grid-cols-7 gap-1">
                                    {week.map((date, idx) => {
                                      const day = availableDays.find(d =>
                                        d.fullDate.getFullYear() === date.getFullYear() &&
                                        d.fullDate.getMonth() === date.getMonth() &&
                                        d.fullDate.getDate() === date.getDate()
                                      );
                                      if (!day) return null;

                                      const isSelected = selectedDay?.fullDate.getTime() === day.fullDate.getTime();

                                      let bgColor = 'bg-white hover:bg-gray-50';
                                      let textColor = 'text-gray-700';
                                      let border = 'border-gray-200';
                                      let special = '';
                                      let cursor = 'cursor-pointer';
                                      let title = '';

                                      if (!day.isAvailable) {
                                        bgColor = 'bg-gray-50';
                                        textColor = 'text-gray-400';
                                        border = 'border-gray-200';
                                        cursor = 'cursor-not-allowed';
                                        special = day.isHoliday ? 'bg-red-50 border border-red-200' : day.isVacation ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50';
                                        title = day.isHoliday
                                          ? `${day.holidayInfo.name} – ${day.holidayInfo.reason}`
                                          : day.isVacation
                                            ? 'Dovolená'
                                            : day.isWeekend
                                              ? 'Víkend'
                                              : 'Žádné dostupné termíny';
                                      } else if (isSelected) {
                                        bgColor = 'bg-primary-50';
                                        textColor = 'text-primary-700';
                                        special = 'bg-primary-50';
                                        border = 'border-primary-300';
                                      }

                                      return (
                                        <button
                                          key={idx}
                                          className={`h-14 border rounded-lg flex flex-col items-center justify-center
                                            ${bgColor} ${textColor} ${border} ${cursor} ${special}`}
                                          disabled={!day.isAvailable}
                                          onClick={() => handleDaySelect(day)}
                                          title={title}
                                        >
                                          <span className="text-xs font-medium">{day.day}</span>
                                          <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                            {day.fullDate.getDate()}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h3 className="text-sm font-medium text-gray-500 mb-2">Vysvětlivky</h3>
                              <div className="flex flex-wrap gap-4 text-xs">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-white border border-gray-200 rounded-sm mr-1"></div>
                                  <span>Dostupné</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded-sm mr-1"></div>
                                  <span>Nedostupné</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded-sm mr-1"></div>
                                  <span>Svátek</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-orange-50 border border-orange-200 rounded-sm mr-1"></div>
                                  <span>Dovolená</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-8">
                        {selectedDay && (
                          <div className="card">
                            <div className="card-body">
                              <h2 className="text-xl font-semibold mb-4">Důvod návštěvy</h2>
                              <div className="space-y-2">
                                {reasonOptions.map(option => (
                                  <button
                                    key={option.id}
                                    className={`w-full p-3 border rounded-lg text-left flex items-center justify-between ${
                                      selectedReason === option.id
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleReasonSelect(option.id)}
                                  >
                                    <span>{option.label}</span>
                                    {selectedReason === option.id && <Check className="w-5 h-5" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="card">
                          <div className="card-body">
                            <h2 className="text-xl font-semibold mb-4">Vyberte čas</h2>
                            {selectedDay && selectedReason && selectedDuration ? (
                              availableTimes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                  {availableTimes.map((slot, index) => {
                                    if (slot.divider) {
                                      return <div key={`divider-${index}`} className="my-4 col-span-full" />;
                                    }
                                    const { time, isTaken } = slot;
                                    return (
                                      <button
                                        key={time}
                                        className={`
                                          p-3 border rounded-lg flex items-center justify-center transition-all
                                          ${selectedTime === time ? 'border-primary-500 bg-primary-50 text-primary-500' : 
                                            isTaken ? 'border-gray-300 bg-gray-100 text-gray-400 opacity-70 cursor-not-allowed' :
                                            'border-gray-200 hover:bg-gray-50 text-gray-700'}
                                        `}
                                        onClick={() => !isTaken && handleTimeSelect(time)}
                                        disabled={isTaken}
                                      >
                                        {time}
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="mt-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg flex items-center">
                                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                                  <p>
                                    {selectedDuration === 20
                                      ? `Na tento den nejsou dostupné termíny pro 20minutové služby, pouze pro 10minutové. Zvolte jiný den.`
                                      : `Pro tento den nejsou dostupné žádné termíny pro ${reasonOptions.find(r => r.id === selectedReason)?.label}. Zvolte jiný den.`}
                                  </p>
                                </div>
                              )
                            ) : (
                              <p className="text-gray-500">{selectedDay ? 'Nejprve prosím vyberte důvod návštěvy.' : 'Nejprve prosím vyberte datum.'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isVacationDatesLoaded && (
                    <div className="mt-8 flex justify-end">
                      <button 
                        className={`btn btn-primary ${(!selectedDay || !selectedTime || !selectedReason) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!selectedDay || !selectedTime || !selectedReason}
                        onClick={goToNextStep}
                      >
                        Pokračovat
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={formRef}
                >
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                      <div className="card mb-8">
                        <div className="card-body">
                          <h2 className="text-xl font-semibold mb-4">Osobní údaje</h2>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="name" className="form-label">Jméno a příjmení *</label>
                              <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                className="form-input" 
                                value={formData.name}
                                onChange={handleInputChange}
                                required 
                              />
                            </div>
                            <div>
                              <label htmlFor="birthyear" className="form-label">Rok narození</label>
                              <input
                                type="number"
                                id="birthyear"
                                name="birthyear"
                                className="form-input"
                                value={formData.birthyear || ''}
                                onChange={handleInputChange}
                                min="1900"
                                max={new Date().getFullYear()}
                              />
                            </div>
                            <div>
                              <label htmlFor="insurance" className="form-label">Zdravotní pojišťovna</label>
                              <select 
                                id="insurance" 
                                name="insurance" 
                                className="form-input" 
                                value={formData.insurance}
                                onChange={handleInputChange}
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
                          </div>
                        </div>
                      </div>
                      <div className="card">
                        <div className="card-body">
                          <h2 className="text-xl font-semibold mb-4">Kontaktní údaje</h2>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="phone" className="form-label">Telefon</label>
                              <div className="flex items-center">
                                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                                <input 
                                  type="tel" 
                                  id="phone" 
                                  name="phone" 
                                  className="form-input" 
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  placeholder="XXX XXX XXX"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Formát: +420 XXX XXX XXX nebo XXX XXX XXX
                              </p>
                            </div>
                            <div>
                              <label htmlFor="email" className="form-label">
                                E-mail {isAdminMode ? '(volitelné)' : '*'}
                              </label>
                              <div className="flex items-center">
                                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                                <input 
                                  type="email" 
                                  id="email" 
                                  name="email" 
                                  className="form-input" 
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required={!isAdminMode}
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="note" className="form-label">
                                Poznámka {isNoteRequired && <span className="text-red-500">*</span>}
                              </label>
                              <textarea 
                                id="note" 
                                name="note" 
                                rows={2}
                                maxLength={80}
                                className="form-input" 
                                value={formData.note}
                                onChange={e => {
                                  const value = e.target.value;
                                  const lineCount = (value.match(/\n/g) || []).length + 1;
                                  if (lineCount <= 2) setFormData({ ...formData, note: value });
                                }}
                                placeholder="Zde můžete uvést další informace k vaší návštěvě"
                                required={isNoteRequired}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="card">
                        <div className="card-body">
                          <h2 className="text-xl font-semibold mb-4">Shrnutí rezervace</h2>
                          <dl className="space-y-4">
                            <div className="flex items-start">
                              <Calendar className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">Datum</dt>
                                <dd className="text-gray-600">
                                  {selectedDay ? new Intl.DateTimeFormat('cs-CZ', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  }).format(selectedDay.fullDate) : 'Není vybráno'}
                                </dd>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Clock className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">Čas</dt>
                                <dd className="text-gray-600">{selectedTime || 'Není vybráno'}</dd>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <FileText className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">Důvod návštěvy</dt>
                                <dd className="text-gray-600">
                                  {selectedReason ? reasonOptions.find(r => r.id === selectedReason)?.label : 'Není vybráno'}
                                </dd>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <User className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">Jméno</dt>
                                <dd className="text-gray-600">{formData.name || 'Není vyplněno'}</dd>
                                <dt className="text-sm font-medium text-gray-700 mt-2">Rok narození</dt>
                                <dd className="text-gray-600">{formData.birthyear || '-'}</dd>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Phone className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">Telefon</dt>
                                <dd className="text-gray-600">{formData.phone || '-'}</dd>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Mail className="w-6 h-6 text-primary-500 mt-1" />
                              <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-700">E-mail</dt>
                                <dd className="text-gray-600">{formData.email || 'Není vyplněno'}</dd>
                              </div>
                            </div>
                          </dl>
                          <hr className="my-6 border-gray-200" />
                          <h3 className="text-sm font-semibold mb-2">Důležité informace</h3>
                          <ul className="text-gray-600 space-y-2 mb-4">
                            <li>• Dostavte se prosím 5–10 minut před plánovaným termínem.</li>
                            <li>• Nezapomeňte si kartičku pojištěnce.</li>
                            <li className="flex items-start">
                              <XCircle className="w-4 h-4 text-gray-600 mt-1 mr-2 flex-shrink-0" />
                              Rezervaci můžete zrušit nejpozději 24 hodin před návštěvou – přes odkaz v potvrzovacím emailu nebo pomocí kódu na stránce „Zrušit rezervaci".
                            </li>
                          </ul>
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <div className="flex items-start">
                              <Info className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                              <p className="text-sm text-blue-800">
                                Vyplněním a odesláním tohoto formuláře souhlasíte se zpracováním osobních údajů v souladu s našimi
                                <a href="/ochrana-osobnich-udaju" className="underline ml-1">zásadami ochrany osobních údajů</a>.
                              </p>
                            </div>
                          </div>
                          {error && (
                            <div className="bg-red-50 p-4 rounded-lg">
                              <div className="flex items-start">
                                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                <p className="text-sm text-red-800 whitespace-pre-line">{error}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button 
                      className="btn btn-outline"
                      onClick={goToPrevStep}
                    >
                      Zpět
                    </button>
                    <button 
                      className={`btn btn-primary ${
                        (!formData.name || isSubmitting || !selectedDay || !selectedTime || !selectedReason || (isNoteRequired && !formData.note.trim()) || (!isAdminMode && !formData.email)) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                      disabled={
                        !formData.name || 
                        isSubmitting || 
                        !selectedDay || 
                        !selectedTime || 
                        !selectedReason || 
                        (isNoteRequired && !formData.note.trim()) || 
                        (!isAdminMode && !formData.email)
                      }
                      onClick={goToNextStep}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Odesílání...
                        </>
                      ) : (
                        'Odeslat rezervaci'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {isAdminMode && (
            <section className="section">
              <div className="container">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Správa rezervací</h2>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Odhlásit se
                  </button>
                </div>
                <BookingList
                  isAdminMode={isAdminMode}
                  onBookingDelete={fetchBookings}
                />
              </div>
            </section>
          )}

          {!isAdminMode && (
            <section className="section">
              <div className="container">
                {!showLoginForm ? (
                  <div className="text-center">
                    <button
                      onClick={() => setShowLoginForm(true)}
                      className="text-gray-500 hover:text-gray-700 flex items-center mx-auto text-sm underline"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Přihlásit se jako admin
                    </button>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto card">
                    <div className="card-body">
                      <h2 className="text-xl font-semibold mb-4">Přihlášení pro admina</h2>
                      <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="username" className="form-label">Uživatelské jméno</label>
                            <input
                              type="text"
                              id="username"
                              className="form-input"
                              value={loginCredentials.username}
                              onChange={e => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="form-label">Heslo</label>
                            <input
                              type="password"
                              id="password"
                              className="form-input"
                              value={loginCredentials.password}
                              onChange={e => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                              required
                            />
                          </div>
                          {loginError && (
                            <div className="text-red-600 text-sm">{loginError}</div>
                          )}
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={() => setShowLoginForm(false)}
                              className="btn btn-outline"
                            >
                              Zrušit
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Přihlásit se
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default AppointmentPage;