export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vacations: {
        Row: {
          id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          name: string
          birth_year: string
          phone: string
          email: string
          insurance: string
          note: string | null
          appointment_date: string
          appointment_time: string
          reason: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          birth_year: string
          phone: string
          email: string
          insurance: string
          note?: string | null
          appointment_date: string
          appointment_time: string
          reason: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          birth_year?: string
          phone?: string
          email?: string
          insurance?: string
          note?: string | null
          appointment_date?: string
          appointment_time?: string
          reason?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}