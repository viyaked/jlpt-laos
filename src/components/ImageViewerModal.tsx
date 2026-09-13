import { useState, type FC } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
  lang: Language;
}

export const ImageViewerModal: FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle,
  lang,
}) => {
  const [zoom, setZoom] = useState(1);
  if (!isOpen || !imageUrl) return null;
  const t = translations[lang];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.6));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-white py-2 px-4 mb-2 bg-slate-900/80 rounded-xl border border-slate-800/80 backdrop-blur-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-sm sm:text-base text-white truncate">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <a
            href={imageUrl}
            download="facility-photo.jpg"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors ml-2"
            title={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div
        className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto rounded-2xl p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.15s ease-out',
            maxHeight: '80vh',
          }}
          className="max-w-full object-contain rounded-xl shadow-2xl select-none"
        />
      </div>
    </div>
  );
};
