export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      angelo_settings: {
        Row: {
          agent_name: string
          attach_pdf: boolean
          auto_send: boolean
          cc_emails: string
          company_name: string | null
          excluded_partners: string
          extra_instructions: string
          language: string
          legal_text: string
          min_amount: number
          min_days_between_reminders: number
          signature: string
          tone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_name?: string
          attach_pdf?: boolean
          auto_send?: boolean
          cc_emails?: string
          company_name?: string | null
          excluded_partners?: string
          extra_instructions?: string
          language?: string
          legal_text?: string
          min_amount?: number
          min_days_between_reminders?: number
          signature?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          agent_name?: string
          attach_pdf?: boolean
          auto_send?: boolean
          cc_emails?: string
          company_name?: string | null
          excluded_partners?: string
          extra_instructions?: string
          language?: string
          legal_text?: string
          min_amount?: number
          min_days_between_reminders?: number
          signature?: string
          tone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cron_logs: {
        Row: {
          created_at: string
          duration_ms: number
          frequency: string | null
          id: string
          invoices_found: number
          overdue_found: number
          reason: string | null
          reminders_sent: number
          status: string
          trigger: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          frequency?: string | null
          id?: string
          invoices_found?: number
          overdue_found?: number
          reason?: string | null
          reminders_sent?: number
          status?: string
          trigger?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          duration_ms?: number
          frequency?: string | null
          id?: string
          invoices_found?: number
          overdue_found?: number
          reason?: string | null
          reminders_sent?: number
          status?: string
          trigger?: string
          user_id?: string
        }
        Relationships: []
      }
      cron_tokens: {
        Row: {
          id: number
          token: string
        }
        Insert: {
          id?: number
          token: string
        }
        Update: {
          id?: number
          token?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          created_at: string
          description: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices_cache: {
        Row: {
          amount_residual: number
          amount_total: number
          currency: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          last_reminder_at: string | null
          last_reminder_level: number | null
          name: string
          odoo_id: number
          partner_email: string | null
          partner_id: number | null
          partner_name: string | null
          payment_state: string | null
          reminder_count: number
          sale_orders: string | null
          synced_at: string
          user_id: string
        }
        Insert: {
          amount_residual?: number
          amount_total?: number
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          last_reminder_at?: string | null
          last_reminder_level?: number | null
          name: string
          odoo_id: number
          partner_email?: string | null
          partner_id?: number | null
          partner_name?: string | null
          payment_state?: string | null
          reminder_count?: number
          sale_orders?: string | null
          synced_at?: string
          user_id?: string
        }
        Update: {
          amount_residual?: number
          amount_total?: number
          currency?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          last_reminder_at?: string | null
          last_reminder_level?: number | null
          name?: string
          odoo_id?: number
          partner_email?: string | null
          partner_id?: number | null
          partner_name?: string | null
          payment_state?: string | null
          reminder_count?: number
          sale_orders?: string | null
          synced_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lab_activity: {
        Row: {
          app_key: string | null
          created_at: string
          id: string
          kind: string
          seconds_saved: number
          user_id: string
        }
        Insert: {
          app_key?: string | null
          created_at?: string
          id?: string
          kind: string
          seconds_saved?: number
          user_id?: string
        }
        Update: {
          app_key?: string | null
          created_at?: string
          id?: string
          kind?: string
          seconds_saved?: number
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          actions: Json
          category: string
          created_at: string
          decisions: Json
          duration_min: number
          id: string
          meeting_date: string
          next_steps: Json
          participants: Json
          risks: Json
          score_clarity: number
          score_decision: number
          score_efficiency: number
          score_engagement: number
          score_global: number
          sentiment: string
          summary: string
          title: string
          topics: Json
          transcript: string
          user_id: string
        }
        Insert: {
          actions?: Json
          category?: string
          created_at?: string
          decisions?: Json
          duration_min?: number
          id?: string
          meeting_date?: string
          next_steps?: Json
          participants?: Json
          risks?: Json
          score_clarity?: number
          score_decision?: number
          score_efficiency?: number
          score_engagement?: number
          score_global?: number
          sentiment?: string
          summary?: string
          title?: string
          topics?: Json
          transcript?: string
          user_id?: string
        }
        Update: {
          actions?: Json
          category?: string
          created_at?: string
          decisions?: Json
          duration_min?: number
          id?: string
          meeting_date?: string
          next_steps?: Json
          participants?: Json
          risks?: Json
          score_clarity?: number
          score_decision?: number
          score_efficiency?: number
          score_engagement?: number
          score_global?: number
          sentiment?: string
          summary?: string
          title?: string
          topics?: Json
          transcript?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          board: Json | null
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          board?: Json | null
          content: string
          created_at?: string
          id?: string
          role: string
          user_id?: string
        }
        Update: {
          board?: Json | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      odoo_connections: {
        Row: {
          api_key: string
          db: string
          last_tested_at: string | null
          modules: Json
          status: string
          status_message: string | null
          uid: number | null
          updated_at: string
          url: string
          user_id: string
          username: string
        }
        Insert: {
          api_key: string
          db: string
          last_tested_at?: string | null
          modules?: Json
          status?: string
          status_message?: string | null
          uid?: number | null
          updated_at?: string
          url: string
          user_id: string
          username: string
        }
        Update: {
          api_key?: string
          db?: string
          last_tested_at?: string | null
          modules?: Json
          status?: string
          status_message?: string | null
          uid?: number | null
          updated_at?: string
          url?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          amount_residual: number | null
          body: string | null
          created_at: string
          days_overdue: number | null
          error: string | null
          id: string
          invoice_name: string | null
          invoice_odoo_id: number | null
          level: number | null
          partner_email: string | null
          partner_name: string | null
          status: string
          subject: string | null
          user_id: string
        }
        Insert: {
          amount_residual?: number | null
          body?: string | null
          created_at?: string
          days_overdue?: number | null
          error?: string | null
          id?: string
          invoice_name?: string | null
          invoice_odoo_id?: number | null
          level?: number | null
          partner_email?: string | null
          partner_name?: string | null
          status?: string
          subject?: string | null
          user_id?: string
        }
        Update: {
          amount_residual?: number | null
          body?: string | null
          created_at?: string
          days_overdue?: number | null
          error?: string | null
          id?: string
          invoice_name?: string | null
          invoice_odoo_id?: number | null
          level?: number | null
          partner_email?: string | null
          partner_name?: string | null
          status?: string
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reminder_rules: {
        Row: {
          active: boolean
          created_at: string
          days_overdue: number
          firmness: string
          id: string
          instructions: string
          level: number
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          days_overdue: number
          firmness?: string
          id?: string
          instructions?: string
          level: number
          user_id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          days_overdue?: number
          firmness?: string
          id?: string
          instructions?: string
          level?: number
          user_id?: string
        }
        Relationships: []
      }
      run_logs: {
        Row: {
          finished_at: string | null
          id: string
          invoices_found: number
          message: string | null
          overdue_found: number
          reminders_sent: number
          started_at: string
          status: string
          trigger: string
          user_id: string
        }
        Insert: {
          finished_at?: string | null
          id?: string
          invoices_found?: number
          message?: string | null
          overdue_found?: number
          reminders_sent?: number
          started_at?: string
          status?: string
          trigger?: string
          user_id?: string
        }
        Update: {
          finished_at?: string | null
          id?: string
          invoices_found?: number
          message?: string | null
          overdue_found?: number
          reminders_sent?: number
          started_at?: string
          status?: string
          trigger?: string
          user_id?: string
        }
        Relationships: []
      }
      schedules: {
        Row: {
          day_of_month: number
          enabled: boolean
          frequency: string
          hour_utc: number
          interval_minutes: number
          last_run_at: string | null
          minute_utc: number
          updated_at: string
          user_id: string
          weekday: number
        }
        Insert: {
          day_of_month?: number
          enabled?: boolean
          frequency?: string
          hour_utc?: number
          interval_minutes?: number
          last_run_at?: string | null
          minute_utc?: number
          updated_at?: string
          user_id?: string
          weekday?: number
        }
        Update: {
          day_of_month?: number
          enabled?: boolean
          frequency?: string
          hour_utc?: number
          interval_minutes?: number
          last_run_at?: string | null
          minute_utc?: number
          updated_at?: string
          user_id?: string
          weekday?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      angelo_init_user: { Args: { _uid: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
