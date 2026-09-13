import { useState, useRef, useEffect, type FC, type ChangeEvent } from 'react';
import {
  X,
  MapPin,
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Loader2,
  Building2,
  DoorClosed,
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n';
import { compressImage } from '../utils/image';

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusMap?: string;
  isAdmin?: boolean;
  onSaveMap?: (mapUrl: string) => Promise<void>;
  lang: Language;
}

export const CampusMapModal: FC<CampusMapModalProps> = ({
  isOpen,
  onClose,
  campusMap = '',
  isAdmin = false,
  onSaveMap,
  lang,
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  // Window listeners for mouse drag – must be declared before any early return (Rules of Hooks)
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: false });
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSaveMap) return;

    try {
      setIsUploading(true);
      const compressedDataUrl = await compressImage(file, 2000, 2000, 0.88);
      await onSaveMap(compressedDataUrl);
    } catch (err) {
      console.error('Failed to compress or upload campus map:', err);
      alert(lang === 'lo' ? 'ບໍ່ສາມາດອັບໂຫຼດຮູບພາບໄດ້' : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteMap = async () => {
    if (!onSaveMap) return;
    const confirmMsg =
      lang === 'lo'
        ? 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບແຜນຜັງລວມນີ້?'
        : 'Are you sure you want to remove the campus map?';
    if (window.confirm(confirmMsg)) {
      try {
        setIsUploading(true);
        await onSaveMap('');
      } catch (err) {
        console.error('Failed to remove map:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 border-b-2 border-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">
                {t.campusMapTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.campusMapSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Admin Upload / Delete Buttons */}
            {isAdmin && onSaveMap && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  title={t.uploadCampusMapBtn}
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{campusMap ? t.editCampusMapBtn : t.uploadCampusMapBtn}</span>
                </button>

                {campusMap && (
                  <button
                    onClick={handleDeleteMap}
                    disabled={isUploading}
                    className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 rounded-lg text-xs transition-colors border border-slate-700"
                    title={t.deleteCampusMapBtn}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            {/* Controls */}
            {campusMap && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                <button
                  onClick={handleZoomOut}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-slate-300 px-1">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1 text-slate-300 hover:text-white"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              title={t.closeBtn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Viewer with Pan & Zoom */}
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
          className={`flex-1 bg-slate-950/95 overflow-hidden p-4 sm:p-6 flex items-center justify-center min-h-[400px] relative select-none ${
            campusMap ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
          }`}
        >
          {campusMap ? (
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
                src={campusMap}
                alt={t.campusMapTitle}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitUserDrag: 'none',
                  pointerEvents: 'none',
                } as React.CSSProperties}
                className="max-w-[85vw] max-h-[72vh] object-contain rounded-xl shadow-2xl border border-slate-700 pointer-events-none select-none"
              />
            </div>
          ) : (
            /* Default Campus Floor Plan Schematic when no image is uploaded */
            <div className="max-w-xl w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
                <Building2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">
                {t.campusMapTitle}
              </h4>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {lang === 'lo'
                  ? 'ແຜນຜັງສະແດງຕຳແໜ່ງອາຄານສອບເສັງ ແລະ ຫ້ອງສອບເສັງ'
                  : 'Map displaying exam buildings and room layout for examinees'}
              </p>

              {/* Schematic Map Layout Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
                <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-blue-950 text-xs mb-1">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>Building A (ອາຄານ ອາ)</span>
                  </div>
                  <p className="text-[11px] text-blue-800/80">
                    Floor 1 - 2: ຫ້ອງ A-101, A-102, A-201 (JLPT N5 & N4)
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs mb-1">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Building B (ອາຄານ ບີ)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80">
                    Floor 2 - 3: ຫ້ອງ B-201, B-301 (JLPT N3, N2, N1)
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-amber-950 text-xs mb-1">
                    <DoorClosed className="w-4 h-4 text-amber-700" />
                    <span>{lang === 'lo' ? 'ຈຸດລົງທະບຽນ ແລະ ຕິດຕໍ່ສອບຖາມ' : 'Registration & Info Desk'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80">
                    {lang === 'lo' ? 'ຊັ້ນ 1 ອາຄານໃຫຍ່ (Main Hall)' : 'Ground Floor, Main Entrance Hall'}
                  </p>
                </div>

                <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-2 font-bold text-purple-950 text-xs mb-1">
                    <MapPin className="w-4 h-4 text-purple-700" />
                    <span>{lang === 'lo' ? 'ປ້າຍປະກາດລາຍຊື່' : 'Candidate Notice Board'}</span>
                  </div>
                  <p className="text-[11px] text-purple-800/80">
                    {lang === 'lo' ? 'ໜ້າອາຄານ A ແລະ B' : 'In front of Building A & B'}
                  </p>
                </div>
              </div>

              {isAdmin && onSaveMap && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:shadow-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.uploadCampusMapBtn}</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {t.roomPhotoInstruction}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Floating Pan & Zoom Controls */}
          {campusMap && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 text-xs z-10">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); pan(0, 70); }}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                title="Pan Up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); pan(0, -70); }}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                title="Pan Down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); pan(70, 0); }}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                title="Pan Left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); pan(-70, 0); }}
                className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-300 hover:text-white"
                title="Pan Right"
              >
                →
              </button>
              <span className="h-3 w-px bg-slate-700 mx-1" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-medium"
              >
                100%
              </button>
              <span className="text-[11px] text-slate-400 pl-1 hidden sm:inline">
                {lang === 'lo' ? '🖐️ ຄລິກຄ້າງແລ້ວລາກເພື່ອເລື່ອນ' : '🖐️ Drag to pan'}
              </span>
            </div>
          )}
        </div>

        {/* Footer info */}
        {campusMap && (
          <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>{t.clickToEnlarge}</span>
            <a
              href={campusMap}
              download="campus-master-plan.jpg"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-red-700 hover:text-red-800 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Map</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
