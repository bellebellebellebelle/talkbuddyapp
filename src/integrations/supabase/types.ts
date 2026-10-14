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
      agent_actions_log: {
        Row: {
          args: Json | null
          attempt: number
          created_at: string
          error_detail: string | null
          id: string
          plan: Json | null
          result: Json | null
          source: string
          stage: string
          status: string
          task_id: string | null
          tool_name: string
          user_id: string
          verification_url: string | null
        }
        Insert: {
          args?: Json | null
          attempt?: number
          created_at?: string
          error_detail?: string | null
          id?: string
          plan?: Json | null
          result?: Json | null
          source?: string
          stage?: string
          status?: string
          task_id?: string | null
          tool_name: string
          user_id: string
          verification_url?: string | null
        }
        Update: {
          args?: Json | null
          attempt?: number
          created_at?: string
          error_detail?: string | null
          id?: string
          plan?: Json | null
          result?: Json | null
          source?: string
          stage?: string
          status?: string
          task_id?: string | null
          tool_name?: string
          user_id?: string
          verification_url?: string | null
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          parts: Json
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          parts: Json
          role: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      chat_link_codes: {
        Row: {
          code: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          user_id: string
        }
        Insert: {
          code: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          user_id: string
        }
        Update: {
          code?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          parts: Json
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parts: Json
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
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
      gmail_credentials: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          google_email: string | null
          refresh_token: string
          scopes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          google_email?: string | null
          refresh_token: string
          scopes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          google_email?: string | null
          refresh_token?: string
          scopes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      google_chat_links: {
        Row: {
          display_name: string | null
          linked_at: string
          space_id: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          linked_at?: string
          space_id: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          linked_at?: string
          space_id?: string
          user_id?: string
        }
        Relationships: []
      }
      google_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          space_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          space_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          space_id?: string
          user_id?: string
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
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
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
      user_settings: {
        Row: {
          ai_model: string
          chat_memory_size: number
          created_at: string
          email_greeting: string
          email_signature: string
          email_tone: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_model?: string
          chat_memory_size?: number
          created_at?: string
          email_greeting?: string
          email_signature?: string
          email_tone?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_model?: string
          chat_memory_size?: number
          created_at?: string
          email_greeting?: string
          email_signature?: string
          email_tone?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      gmail_connection_status: {
        Row: {
          expires_at: string | null
          google_email: string | null
          scopes: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          google_email?: string | null
          scopes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          google_email?: string | null
          scopes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
