export type MemberRole = "pending" | "member" | "mentor" | "leader" | "admin";

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
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: MemberRole;
          group_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: MemberRole;
          group_id?: string | null;
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
    };
    Views: { [_ in never]: never };
    Functions: {
      my_role: { Args: never; Returns: MemberRole };
      is_my_mentee: { Args: { p_profile_id: string }; Returns: boolean };
      is_my_mentor: { Args: { p_profile_id: string }; Returns: boolean };
      admin_update_member: {
        Args: { p_member_id: string; p_role: MemberRole; p_group_id: string | null };
        Returns: undefined;
      };
      admin_save_group: {
        Args: { p_group_id: string | null; p_name: string; p_mentor_id: string | null };
        Returns: string;
      };
      admin_delete_group: { Args: { p_group_id: string }; Returns: undefined };
    };
    Enums: { member_role: MemberRole };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Group = Database["public"]["Tables"]["groups"]["Row"];
