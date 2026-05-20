import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Kontrola, zda jsou proměnné prostředí nastaveny
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Chybí Supabase proměnné prostředí:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
}

// Vytvoření klienta pro Supabase s rozšířenými možnostmi
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      },
      fetch: (url, options) => {
        // Vlastní fetch s timeoutem a lepším ošetřením chyb
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 sekund timeout
        
        return fetch(url, {
          ...options,
          signal: controller.signal,
        })
          .then(response => {
            clearTimeout(timeoutId);
            return response;
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Chyba při komunikaci se Supabase:', error);
            
            // Log detailnější informace o chybě
            if (error.name === 'AbortError') {
              console.error('Požadavek na Supabase vypršel (timeout 30s)');
            } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
              console.error('Nelze se připojit k Supabase. Zkontrolujte připojení k internetu a Supabase URL:', supabaseUrl);
            }
            
            throw error;
          });
      }
    }
  }
);

// Test připojení k Supabase při inicializaci
console.log('Inicializuji připojení k Supabase...');

const testConnection = async () => {
  try {
    const { count, error } = await supabase.from('bookings')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Chyba připojení k Supabase:', error);
      
      // Log specifický pro různé typy chyb
      if (error.code === 'PGRST301') {
        console.error('Neplatný API klíč nebo nedostatečná oprávnění');
      } else if (error.code?.startsWith('PGRST')) {
        console.error('Chyba na straně Supabase PostgREST:', error.message);
      } else if (error.code === '23505') {
        console.error('Porušení unikátního omezení v databázi');
      }
    } else {
      console.log('Připojení k Supabase úspěšné, počet rezervací:', count);
    }
  } catch (err) {
    console.error('Neočekávaná chyba při testu připojení k Supabase:', err);
    console.info('Tip: Zkontrolujte, zda jsou správné přístupové údaje v souboru .env a zda je Supabase projekt aktivní');
  }
};

// Spustit test připojení
testConnection();