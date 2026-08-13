export type UserRole = "user" | "admin";
export type ProfileType = "usuario" | "terapeuta";
export type AccessLevel = "all" | "terapeuta";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          nombre: string;
          apellido: string;
          role: UserRole;
          perfil_tipo: ProfileType;
          aprobado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nombre: string;
          apellido: string;
          role?: UserRole;
          perfil_tipo?: ProfileType;
          aprobado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nombre?: string;
          apellido?: string;
          role?: UserRole;
          perfil_tipo?: ProfileType;
          aprobado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      retiros: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          descripcion_detallada: string | null;
          fecha_inicio: string | null;
          fecha_fin: string | null;
          lugar: string | null;
          precio: number | null;
          moneda: string;
          imagen_portada: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          descripcion_detallada?: string | null;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          lugar?: string | null;
          precio?: number | null;
          moneda?: string;
          imagen_portada?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          descripcion_detallada?: string | null;
          fecha_inicio?: string | null;
          fecha_fin?: string | null;
          lugar?: string | null;
          precio?: number | null;
          moneda?: string;
          imagen_portada?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inscripciones: {
        Row: {
          id: string;
          user_id: string;
          retiro_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          retiro_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          retiro_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inscripciones_retiro_id_fkey";
            columns: ["retiro_id"];
            referencedRelation: "retiros";
            referencedColumns: ["id"];
          }
        ];
      };
      retiro_access: {
        Row: {
          id: string;
          user_id: string;
          retiro_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          retiro_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          retiro_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "retiro_access_retiro_id_fkey";
            columns: ["retiro_id"];
            referencedRelation: "retiros";
            referencedColumns: ["id"];
          }
        ];
      };
      content: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string | null;
          file_url: string;
          file_name: string;
          file_size: number;
          file_type: string;
          nivel_acceso: AccessLevel;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descripcion?: string | null;
          file_url: string;
          file_name: string;
          file_size?: number;
          file_type: string;
          nivel_acceso?: AccessLevel;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descripcion?: string | null;
          file_url?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          nivel_acceso?: AccessLevel;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      content_retiros: {
        Row: {
          content_id: string;
          retiro_id: string;
        };
        Insert: {
          content_id: string;
          retiro_id: string;
        };
        Update: {
          content_id?: string;
          retiro_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_retiros_content_id_fkey";
            columns: ["content_id"];
            referencedRelation: "content";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_retiros_retiro_id_fkey";
            columns: ["retiro_id"];
            referencedRelation: "retiros";
            referencedColumns: ["id"];
          }
        ];
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      email_logs: {
        Row: {
          id: string;
          asunto: string;
          cuerpo: string;
          destinatarios: string;
          enviado_at: string;
        };
        Insert: {
          id?: string;
          asunto: string;
          cuerpo: string;
          destinatarios: string;
          enviado_at?: string;
        };
        Update: {
          id?: string;
          asunto?: string;
          cuerpo?: string;
          destinatarios?: string;
          enviado_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      profile_type: ProfileType;
      access_level: AccessLevel;
    };
    CompositeTypes: Record<string, never>;
  };
};
