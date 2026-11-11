// Generated from the National Pulse Supabase schema. Regenerate after migrations.
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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          id: string
          request_id: string | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          request_id?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: string
          request_id?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      data_sources: {
        Row: {
          agency: string | null
          attribution_text: string | null
          code: string
          created_at: string
          id: string
          is_active: boolean
          license_notes: string | null
          name: string
          source_type: string
          source_url: string
          update_frequency: string | null
          updated_at: string
        }
        Insert: {
          agency?: string | null
          attribution_text?: string | null
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          license_notes?: string | null
          name: string
          source_type: string
          source_url: string
          update_frequency?: string | null
          updated_at?: string
        }
        Update: {
          agency?: string | null
          attribution_text?: string | null
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          license_notes?: string | null
          name?: string
          source_type?: string
          source_url?: string
          update_frequency?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      event_evidence: {
        Row: {
          captured_at: string
          created_at: string
          document_id: string | null
          event_id: string
          evidence_type: string
          excerpt: string | null
          id: string
          news_article_id: string | null
          publication_status: string
          source_id: string | null
          source_published_at: string | null
          source_url: string
        }
        Insert: {
          captured_at?: string
          created_at?: string
          document_id?: string | null
          event_id: string
          evidence_type: string
          excerpt?: string | null
          id?: string
          news_article_id?: string | null
          publication_status?: string
          source_id?: string | null
          source_published_at?: string | null
          source_url: string
        }
        Update: {
          captured_at?: string
          created_at?: string
          document_id?: string | null
          event_id?: string
          evidence_type?: string
          excerpt?: string | null
          id?: string
          news_article_id?: string | null
          publication_status?: string
          source_id?: string | null
          source_published_at?: string | null
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_evidence_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "raw_source_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_evidence_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_evidence_news_article_id_fkey"
            columns: ["news_article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_evidence_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          ended_at: string | null
          event_type: string
          evidence_status: string
          id: string
          location_name: string | null
          publication_status: string
          region_code: string | null
          started_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          event_type: string
          evidence_status: string
          id?: string
          location_name?: string | null
          publication_status?: string
          region_code?: string | null
          started_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          ended_at?: string | null
          event_type?: string
          evidence_status?: string
          id?: string
          location_name?: string | null
          publication_status?: string
          region_code?: string | null
          started_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      indicator_observations: {
        Row: {
          created_at: string
          evidence_status: string
          fetched_at: string
          geography_code: string
          geography_name: string
          id: string
          indicator_id: string
          metadata: Json
          observed_at: string | null
          period_end: string
          period_start: string
          publication_status: string
          revision: number
          source_id: string | null
          source_published_at: string | null
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          evidence_status: string
          fetched_at?: string
          geography_code?: string
          geography_name?: string
          id?: string
          indicator_id: string
          metadata?: Json
          observed_at?: string | null
          period_end: string
          period_start: string
          publication_status?: string
          revision?: number
          source_id?: string | null
          source_published_at?: string | null
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          evidence_status?: string
          fetched_at?: string
          geography_code?: string
          geography_name?: string
          id?: string
          indicator_id?: string
          metadata?: Json
          observed_at?: string | null
          period_end?: string
          period_start?: string
          publication_status?: string
          revision?: number
          source_id?: string | null
          source_published_at?: string | null
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicator_observations_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_observations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      indicators: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          geography_level: string
          id: string
          methodology: string | null
          name: string
          publication_status: string
          source_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          geography_level?: string
          id?: string
          methodology?: string | null
          name: string
          publication_status?: string
          source_id?: string | null
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          geography_level?: string
          id?: string
          methodology?: string | null
          name?: string
          publication_status?: string
          source_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicators_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_jobs: {
        Row: {
          created_at: string
          error_summary: string | null
          finished_at: string | null
          id: string
          job_type: string
          metadata: Json
          records_inserted: number
          records_rejected: number
          records_seen: number
          source_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_summary?: string | null
          finished_at?: string | null
          id?: string
          job_type: string
          metadata?: Json
          records_inserted?: number
          records_rejected?: number
          records_seen?: number
          source_id?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_summary?: string | null
          finished_at?: string | null
          id?: string
          job_type?: string
          metadata?: Json
          records_inserted?: number
          records_rejected?: number
          records_seen?: number
          source_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          article_published_at: string | null
          canonical_url: string
          content_excerpt: string | null
          created_at: string
          evidence_status: string
          fetched_at: string
          id: string
          publication_status: string
          publisher: string
          source_id: string | null
          title: string
        }
        Insert: {
          article_published_at?: string | null
          canonical_url: string
          content_excerpt?: string | null
          created_at?: string
          evidence_status?: string
          fetched_at?: string
          id?: string
          publication_status?: string
          publisher: string
          source_id?: string | null
          title: string
        }
        Update: {
          article_published_at?: string | null
          canonical_url?: string
          content_excerpt?: string | null
          created_at?: string
          evidence_status?: string
          fetched_at?: string
          id?: string
          publication_status?: string
          publisher?: string
          source_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      observation_revisions: {
        Row: {
          change_reason: string
          changed_at: string
          changed_by: string | null
          id: string
          next_value: number
          observation_id: string
          previous_value: number | null
          source_document_id: string | null
        }
        Insert: {
          change_reason: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          next_value: number
          observation_id: string
          previous_value?: number | null
          source_document_id?: string | null
        }
        Update: {
          change_reason?: string
          changed_at?: string
          changed_by?: string | null
          id?: string
          next_value?: number
          observation_id?: string
          previous_value?: number | null
          source_document_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observation_revisions_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "indicator_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "observation_revisions_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "raw_source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_source_documents: {
        Row: {
          content_hash: string | null
          content_text: string | null
          created_at: string
          external_id: string | null
          fetched_at: string
          id: string
          media_type: string | null
          metadata: Json
          observed_at: string | null
          source_id: string
          source_published_at: string | null
          source_url: string
          title: string | null
        }
        Insert: {
          content_hash?: string | null
          content_text?: string | null
          created_at?: string
          external_id?: string | null
          fetched_at?: string
          id?: string
          media_type?: string | null
          metadata?: Json
          observed_at?: string | null
          source_id: string
          source_published_at?: string | null
          source_url: string
          title?: string | null
        }
        Update: {
          content_hash?: string | null
          content_text?: string | null
          created_at?: string
          external_id?: string | null
          fetched_at?: string
          id?: string
          media_type?: string | null
          metadata?: Json
          observed_at?: string | null
          source_id?: string
          source_published_at?: string | null
          source_url?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "raw_source_documents_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
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
