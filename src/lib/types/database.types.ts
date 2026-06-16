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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      decisions: {
        Row: {
          choice: string
          created_at: string | null
          decision_time_ms: number
          deliberation_switches: number | null
          id: string
          participant_id: string | null
        }
        Insert: {
          choice: string
          created_at?: string | null
          decision_time_ms: number
          deliberation_switches?: number | null
          id?: string
          participant_id?: string | null
        }
        Update: {
          choice?: string
          created_at?: string | null
          decision_time_ms?: number
          deliberation_switches?: number | null
          id?: string
          participant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decisions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      log_events: {
        Row: {
          duration_ms: number | null
          event_type: string
          id: string
          participant_id: string | null
          target: string | null
          timestamp_ms: number
        }
        Insert: {
          duration_ms?: number | null
          event_type: string
          id?: string
          participant_id?: string | null
          target?: string | null
          timestamp_ms: number
        }
        Update: {
          duration_ms?: number | null
          event_type?: string
          id?: string
          participant_id?: string | null
          target?: string | null
          timestamp_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "log_events_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          completed: boolean | null
          condition: number
          created_at: string | null
          id: string
          screen_width: number | null
          user_agent: string | null
        }
        Insert: {
          completed?: boolean | null
          condition: number
          created_at?: string | null
          id?: string
          screen_width?: number | null
          user_agent?: string | null
        }
        Update: {
          completed?: boolean | null
          condition?: number
          created_at?: string | null
          id?: string
          screen_width?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      scale_scores: {
        Row: {
          age: number | null
          bongard_mean: number | null
          created_at: string | null
          education: string | null
          education_other: string | null
          employment_other: string | null
          employment_status: string | null
          gender: string | null
          grassl_mean: number | null
          id: string
          internet_usage: string | null
          iuipc_awareness_mean: number | null
          iuipc_collection_mean: number | null
          iuipc_control_mean: number | null
          iuipc_total_mean: number | null
          participant_id: string | null
        }
        Insert: {
          age?: number | null
          bongard_mean?: number | null
          created_at?: string | null
          education?: string | null
          education_other?: string | null
          employment_other?: string | null
          employment_status?: string | null
          gender?: string | null
          grassl_mean?: number | null
          id?: string
          internet_usage?: string | null
          iuipc_awareness_mean?: number | null
          iuipc_collection_mean?: number | null
          iuipc_control_mean?: number | null
          iuipc_total_mean?: number | null
          participant_id?: string | null
        }
        Update: {
          age?: number | null
          bongard_mean?: number | null
          created_at?: string | null
          education?: string | null
          education_other?: string | null
          employment_other?: string | null
          employment_status?: string | null
          gender?: string | null
          grassl_mean?: number | null
          id?: string
          internet_usage?: string | null
          iuipc_awareness_mean?: number | null
          iuipc_collection_mean?: number | null
          iuipc_control_mean?: number | null
          iuipc_total_mean?: number | null
          participant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scale_scores_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string | null
          id: string
          item_key: string
          participant_id: string | null
          scale: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_key: string
          participant_id?: string | null
          scale: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_key?: string
          participant_id?: string | null
          scale?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
