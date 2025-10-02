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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          created_at: string
          email: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          email: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      birthdays: {
        Row: {
          birthday: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          birthday: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          birthday?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      church_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      daily_hymns: {
        Row: {
          closing_hymn_number: number | null
          created_at: string
          hymn_date: string
          id: string
          opening_hymn_number: number | null
          updated_at: string
        }
        Insert: {
          closing_hymn_number?: number | null
          created_at?: string
          hymn_date?: string
          id?: string
          opening_hymn_number?: number | null
          updated_at?: string
        }
        Update: {
          closing_hymn_number?: number | null
          created_at?: string
          hymn_date?: string
          id?: string
          opening_hymn_number?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hymn_lines: {
        Row: {
          chorus: boolean
          created_at: string
          hymn_number: number
          id: number
          line_number: number
          text: string
          updated_at: string
          verse_number: number
        }
        Insert: {
          chorus?: boolean
          created_at?: string
          hymn_number: number
          id?: number
          line_number: number
          text: string
          updated_at?: string
          verse_number: number
        }
        Update: {
          chorus?: boolean
          created_at?: string
          hymn_number?: number
          id?: number
          line_number?: number
          text?: string
          updated_at?: string
          verse_number?: number
        }
        Relationships: []
      }
      pingdata: {
        Row: {
          created_at: string
          data: string | null
          id: number
        }
        Insert: {
          created_at?: string
          data?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          data?: string | null
          id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string
          id: string
          scriptures: string
          topic: string
          topic_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          scriptures: string
          topic: string
          topic_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          scriptures?: string
          topic?: string
          topic_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      wedding_anniversaries: {
        Row: {
          anniversary_date: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          anniversary_date: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          anniversary_date?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_email: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      cleanup_old_records: {
        Args: Record<PropertyKey, never>
        Returns: {
          deleted_events: number
          deleted_topics: number
        }[]
      }
      delete_all_events: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      delete_all_topics: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      ensure_profile_exists: {
        Args: Record<PropertyKey, never>
        Returns: {
          role: string
          user_id: string
        }[]
      }
      get_current_month_anniversaries: {
        Args: Record<PropertyKey, never>
        Returns: {
          anniversary_date: string
          id: string
          name: string
        }[]
      }
      get_current_month_birthdays: {
        Args: Record<PropertyKey, never>
        Returns: {
          birthday: string
          id: string
          name: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_own_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_own_profile_basic: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          role: string
          updated_at: string
          user_id: string
        }[]
      }
      get_secure_email: {
        Args: { target_user_id?: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_user_profile: {
        Args: { p_email?: string }
        Returns: boolean
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
