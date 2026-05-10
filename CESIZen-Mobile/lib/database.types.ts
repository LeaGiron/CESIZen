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
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      acces_ressource: {
        Row: {
          date_acc: string
          id_acc: string
          id_ress: string | null
          id_util: string | null
        }
        Insert: {
          date_acc?: string
          id_acc?: string
          id_ress?: string | null
          id_util?: string | null
        }
        Update: {
          date_acc?: string
          id_acc?: string
          id_ress?: string | null
          id_util?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acces_ressource_id_ress_fkey"
            columns: ["id_ress"]
            isOneToOne: false
            referencedRelation: "ressource"
            referencedColumns: ["id_ress"]
          },
          {
            foreignKeyName: "acces_ressource_id_util_fkey"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      configuration_exercice: {
        Row: {
          date_configuration_config: string | null
          duree_apnee_config: number
          duree_expiration_config: number
          duree_inspiration_config: number
          id_config: string
          id_exer: string | null
          id_util: string | null
        }
        Insert: {
          date_configuration_config?: string | null
          duree_apnee_config: number
          duree_expiration_config: number
          duree_inspiration_config: number
          id_config?: string
          id_exer?: string | null
          id_util?: string | null
        }
        Update: {
          date_configuration_config?: string | null
          duree_apnee_config?: number
          duree_expiration_config?: number
          duree_inspiration_config?: number
          id_config?: string
          id_exer?: string | null
          id_util?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuration_exercice_id_exer_fkey"
            columns: ["id_exer"]
            isOneToOne: false
            referencedRelation: "exercice_respiration"
            referencedColumns: ["id_exer"]
          },
          {
            foreignKeyName: "configuration_exercice_id_util_fkey"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      exercice_respiration: {
        Row: {
          description_exer: string
          duree_apnee_defaut_exer: number
          duree_expiration_defaut_exer: number
          duree_inspiration_defaut_exer: number
          id_exer: string
          nom_exer: string
        }
        Insert: {
          description_exer: string
          duree_apnee_defaut_exer: number
          duree_expiration_defaut_exer: number
          duree_inspiration_defaut_exer: number
          id_exer?: string
          nom_exer: string
        }
        Update: {
          description_exer?: string
          duree_apnee_defaut_exer?: number
          duree_expiration_defaut_exer?: number
          duree_inspiration_defaut_exer?: number
          id_exer?: string
          nom_exer?: string
        }
        Relationships: []
      }
      log_activite: {
        Row: {
          date_action_log: string
          id_log: string
          id_util: string | null
          statut_log: string
          type_action_log: string
        }
        Insert: {
          date_action_log?: string
          id_log?: string
          id_util?: string | null
          statut_log?: string
          type_action_log: string
        }
        Update: {
          date_action_log?: string
          id_log?: string
          id_util?: string | null
          statut_log?: string
          type_action_log?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_utilisateur"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
          {
            foreignKeyName: "log_activite_id_util_fkey"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      reinitialisation_mot_de_passe: {
        Row: {
          date_demande_reinit: string
          id_reinit: string
          id_util: string | null
          token_reinit: string
        }
        Insert: {
          date_demande_reinit?: string
          id_reinit?: string
          id_util?: string | null
          token_reinit: string
        }
        Update: {
          date_demande_reinit?: string
          id_reinit?: string
          id_util?: string | null
          token_reinit?: string
        }
        Relationships: [
          {
            foreignKeyName: "reinitialisation_mot_de_passe_id_util_fkey"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      ressource: {
        Row: {
          categorie_ress: string
          contenu_ress: string
          date_creation_ress: string
          date_modification_ress: string
          id_ress: string
          id_util_auteur: string | null
          statut_ress: string
          titre_ress: string
        }
        Insert: {
          categorie_ress: string
          contenu_ress: string
          date_creation_ress?: string
          date_modification_ress?: string
          id_ress?: string
          id_util_auteur?: string | null
          statut_ress?: string
          titre_ress: string
        }
        Update: {
          categorie_ress?: string
          contenu_ress?: string
          date_creation_ress?: string
          date_modification_ress?: string
          id_ress?: string
          id_util_auteur?: string | null
          statut_ress?: string
          titre_ress?: string
        }
        Relationships: [
          {
            foreignKeyName: "ressource_id_util_auteur_fkey"
            columns: ["id_util_auteur"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      token_connexion: {
        Row: {
          date_creation_token: string
          date_expiration_token: string
          est_actif_token: boolean
          id_token: string
          id_util: string | null
          ip_adresse_token: string | null
          token_token: string
        }
        Insert: {
          date_creation_token?: string
          date_expiration_token: string
          est_actif_token?: boolean
          id_token?: string
          id_util?: string | null
          ip_adresse_token?: string | null
          token_token: string
        }
        Update: {
          date_creation_token?: string
          date_expiration_token?: string
          est_actif_token?: boolean
          id_token?: string
          id_util?: string | null
          ip_adresse_token?: string | null
          token_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_connexion_id_util_fkey"
            columns: ["id_util"]
            isOneToOne: false
            referencedRelation: "utilisateur"
            referencedColumns: ["id_util"]
          },
        ]
      }
      utilisateur: {
        Row: {
          date_creation_util: string | null
          date_verrouillage_util: string | null
          derniere_connexion_util: string | null
          email_util: string
          id_util: string
          nom_util: string
          prenom_util: string
          statut_compte_util: string | null
          tentatives_connexion_util: number | null
          type_util: string | null
        }
        Insert: {
          date_creation_util?: string | null
          date_verrouillage_util?: string | null
          derniere_connexion_util?: string | null
          email_util: string
          id_util?: string
          nom_util: string
          prenom_util: string
          statut_compte_util?: string | null
          tentatives_connexion_util?: number | null
          type_util?: string | null
        }
        Update: {
          date_creation_util?: string | null
          date_verrouillage_util?: string | null
          derniere_connexion_util?: string | null
          email_util?: string
          id_util?: string
          nom_util?: string
          prenom_util?: string
          statut_compte_util?: string | null
          tentatives_connexion_util?: number | null
          type_util?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      attempt_login: {
        Args: { p_email: string; p_success: boolean }
        Returns: string
      }
      est_administrateur: { Args: never; Returns: boolean }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
