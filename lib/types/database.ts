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
          fecha: string | null;
          lugar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          fecha?: string | null;
          lugar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          fecha?: string | null;
          lugar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
      categories: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
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
          categoria_id: string | null;
          retiro_id: string | null;
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
          categoria_id?: string | null;
          retiro_id?: string | null;
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
          categoria_id?: string | null;
          retiro_id?: string | null;
          nivel_acceso?: AccessLevel;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "content_categoria_id_fkey";
            columns: ["categoria_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "content_retiro_id_fkey";
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
