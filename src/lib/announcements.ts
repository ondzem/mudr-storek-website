import { supabase } from './supabase';

export const fetchAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return [];
  }
};