import { useState, useRef, useEffect, type FC } from 'react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  if (!isOpen || !imageUrl) return null;
  const t = translations[lang];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const pan = (dx: number, dy: number) => {
    setPosition((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  // Mouse Drag Handlers: preventDefault() stops native browser image drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Window listeners for mouse drag so panning is ultra-smooth and doesn't drop when cursor leaves container
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const handleWindowMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: false });
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - touchStartRef.current.x,
        y: e.touches[0].clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartRef.current.dist;
      setZoom((prev) => Math.max(0.6, Math.min(prev * factor, 4)));
      touchStartRef.current.dist = dist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((prev) => Math.max(0.6, Math.min(prev + delta, 4)));
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoom > 1.2) {
      handleResetZoom();
    } else {
      setZoom(2.2);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-white py-2.5 px-4 mb-2 bg-slate-900/90 rounded-xl border border-slate-800 backdrop-blur-sm shadow-xl"
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

      {/* Image Container with Pan & Zoom */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onDragStart={(e) => e.preventDefault()}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        className={`relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden rounded-2xl p-2 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative flex items-center justify-center ${
            isDragging ? '' : 'transition-transform duration-100 ease-out'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          onDoubleClick={handleDoubleClick}
          onDragStart={(e) => e.preventDefault()}
        >
          <img
            src={imageUrl}
            alt={title}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            style={{
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitUserDrag: 'none',
              pointerEvents: 'none',
            } as React.CSSProperties}
            className="max-w-[85vw] max-h-[78vh] object-contain rounded-xl shadow-2xl pointer-events-none select-none"
          />
        </div>

        {/* Floating Pan Navigation Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 text-xs z-10">
          <button
            type="button"
            onClick={() => pan(0, 70)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
            title="Pan Up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => pan(0, -70)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
            title="Pan Down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => pan(70, 0)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
            title="Pan Left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => pan(-70, 0)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
            title="Pan Right"
          >
            →
          </button>
          <span className="h-3 w-px bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={handleResetZoom}
            className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-medium"
          >
            100%
          </button>
          <span className="text-[11px] text-slate-400 pl-1 hidden sm:inline">
            {lang === 'lo' ? '🖐️ ຄລິກຄ້າງແລ້ວລາກເພື່ອເລື່ອນ' : '🖐️ Drag to pan'}
          </span>
        </div>
      </div>
    </div>
  );
};
