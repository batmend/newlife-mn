export type MemberRole = "pending" | "member" | "mentor" | "leader" | "admin";
export type ReflectionVisibility = "members" | "leaders";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string;
          avatar_url: string | null;
          role: MemberRole;
          group_id: string | null;
          daily_email: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: MemberRole;
          group_id?: string | null;
          daily_email?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: MemberRole;
          group_id?: string | null;
          daily_email?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "groups";
            referencedColumns: ["id"];
          },
        ];
      };
      groups: {
        Row: {
          id: string;
          name: string;
          mentor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          mentor_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          mentor_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "groups_mentor_id_fkey";
            columns: ["mentor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_words: {
        Row: {
          id: string;
          publish_date: string;
          title: string;
          scripture_ref: string;
          scripture_text: string;
          body: string;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          publish_date: string;
          title: string;
          scripture_ref: string;
          scripture_text?: string;
          body: string;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          publish_date?: string;
          title?: string;
          scripture_ref?: string;
          scripture_text?: string;
          body?: string;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      devotion_reads: {
        Row: { member_id: string; word_id: string; read_at: string };
        Insert: { member_id?: string; word_id: string; read_at?: string };
        Update: { member_id?: string; word_id?: string; read_at?: string };
        Relationships: [];
      };
      reflections: {
        Row: {
          id: string;
          member_id: string;
          word_id: string;
          body: string;
          visibility: ReflectionVisibility;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id?: string;
          word_id: string;
          body: string;
          visibility?: ReflectionVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          word_id?: string;
          body?: string;
          visibility?: ReflectionVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_word_emails: {
        Row: { word_id: string; sent_at: string; recipients: number };
        Insert: { word_id: string; sent_at?: string; recipients?: number };
        Update: { word_id?: string; sent_at?: string; recipients?: number };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      my_role: { Args: never; Returns: MemberRole };
      is_my_mentee: { Args: { p_profile_id: string }; Returns: boolean };
      my_group_mentor: {
        Args: never;
        Returns: { id: string; full_name: string; avatar_url: string | null }[];
      };
      admin_update_member: {
        Args: { p_member_id: string; p_role: MemberRole; p_group_id: string | null };
        Returns: undefined;
      };
      admin_save_group: {
        Args: { p_group_id: string | null; p_name: string; p_mentor_id: string | null };
        Returns: string;
      };
      admin_delete_group: { Args: { p_group_id: string }; Returns: undefined };
      delete_my_account: { Args: never; Returns: undefined };
      today_ub: { Args: never; Returns: string };
      word_reflections: {
        Args: { p_word_id: string };
        Returns: {
          id: string;
          member_id: string;
          author_name: string;
          author_avatar: string | null;
          body: string;
          visibility: ReflectionVisibility;
          created_at: string;
          updated_at: string;
        }[];
      };
      quiet_time_overview: {
        Args: { p_days?: number };
        Returns: {
          member_id: string;
          full_name: string;
          avatar_url: string | null;
          group_id: string | null;
          group_name: string | null;
          read_dates: string[];
          reflection_dates: string[];
        }[];
      };
    };
    Enums: { member_role: MemberRole; reflection_visibility: ReflectionVisibility };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Group = Database["public"]["Tables"]["groups"]["Row"];
export type DailyWord = Database["public"]["Tables"]["daily_words"]["Row"];
export type Reflection = Database["public"]["Tables"]["reflections"]["Row"];
