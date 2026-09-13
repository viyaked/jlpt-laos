import { useState, useRef, type FC, type ChangeEvent } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  const t = translations[lang];

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.6));
  const handleResetZoom = () => setZoom(1);

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

        {/* Body Viewer */}
        <div className="flex-1 bg-slate-100 overflow-auto p-4 sm:p-6 flex items-center justify-center min-h-[350px]">
          {campusMap ? (
            <div className="relative overflow-hidden flex items-center justify-center max-w-full">
              <img
                src={campusMap}
                alt={t.campusMapTitle}
                style={{
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-slate-300 select-none"
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
