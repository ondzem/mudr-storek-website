// src/lib/holidays.ts
import { supabase } from './supabase';

// Helper function to fetch vacation dates from the database
export const fetchVacationDates = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('vacation_start, vacation_end')
      .eq('type', 'vacation');

    if (error) {
      console.error("Error fetching vacation dates:", error);
      return [];
    }

    let vacationDates: string[] = [];

    data.forEach(item => {
      if (item.vacation_start && item.vacation_end) {
        const startDate = new Date(item.vacation_start);
        const endDate = new Date(item.vacation_end);
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          vacationDates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    return vacationDates;
  } catch (err) {
    console.error("Failed to fetch vacation dates:", err);
    return [];
  }
};

// Helper function to check if a date is a vacation date
export const isVacationDate = (date: Date, vacationDates: string[]): boolean => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  console.log('Kontroluji datum:', dateStr, 'v seznamu:', vacationDates);
  // Přidáme ochranu proti undefined
  return vacationDates ? vacationDates.includes(dateStr) : false;
};

// Helper to add a new vacation date
export const addVacationDate = async (startDate: string, endDate: string): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .insert([{ 
        title: `Dovolená ${startDate} - ${endDate}`,
        content: 'Dovolená',
        type: 'vacation',
        vacation_start: startDate,
        vacation_end: endDate,
        date: new Date().toLocaleDateString('cs-CZ')
      }]);

    if (error) {
      console.error("Error adding vacation date:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to add vacation date:", err);
    return { success: false, error: err };
  }
};

// Helper to remove a vacation date
export const removeVacationDate = async (id: string): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error removing vacation date:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to remove vacation date:", err);
    return { success: false, error: err };
  }
};