import { FileText, Headphones, Newspaper, PlayCircle, ExternalLink, Download } from "lucide-react";
import type { StudioContentType } from "@/lib/types/database";

interface StudioItem {
  id: string;
  titulo: string;
  descripcion: string | null;
  content_type: StudioContentType;
  external_url: string | null;
  file_url: string | null;
}

const TYPE_ICON: Record<StudioContentType, typeof FileText> = {
  documento: FileText,
  podcast: Headphones,
  publicacion: Newspaper,
  video: PlayCircle,
};

const TYPE_LABEL: Record<StudioContentType, string> = {
  documento: "Documento",
  podcast: "Podcast",
  publicacion: "Publicación",
  video: "Video",
};

export function StudioContentCard({ item }: { item: StudioItem }) {
  const Icon = TYPE_ICON[item.content_type];
  const isFile = item.content_type === "documento" && item.file_url;
  const href = isFile
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/studio-files/${item.file_url}`
    : item.external_url;
  const external = !isFile;

  return (
    <a
      href={href ?? "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={external ? undefined : true}
      className="group rounded-[12px] border border-[#e5e0da] bg-white p-6 flex flex-col gap-4 hover:border-zentir/40 transition-colors"
    >
      <div className="p-2.5 bg-zentir/15 text-zentir rounded-lg w-fit">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-zentir font-medium mb-1.5">
          {TYPE_LABEL[item.content_type]}
        </p>
        <h3 className="font-semibold text-black leading-snug">{item.titulo}</h3>
        {item.descripcion && (
          <p className="text-sm text-[#737373] mt-1 line-clamp-2">{item.descripcion}</p>
        )}
      </div>
      <div className="mt-auto pt-2 text-sm font-medium text-black flex items-center gap-1.5 group-hover:text-zentir transition-colors">
        {external ? (
          <>
            <ExternalLink className="w-3.5 h-3.5" /> Ver
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" /> Descargar
          </>
        )}
      </div>
    </a>
  );
}
