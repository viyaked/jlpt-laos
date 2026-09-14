import { useState, useEffect, useRef, type FC, type FormEvent, type ChangeEvent } from 'react';
import type { Announcement, Language } from '../types';
import { translations } from '../i18n';
import { X, Megaphone, Save, Image as ImageIcon, Upload, Trash2, Loader2, Pin } from 'lucide-react';
import { compressImage } from '../utils/image';

interface AddEditAnnouncementModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; title: string; content?: string; imageUrl?: string; isPinned: boolean }) => Promise<void>;
  lang: Language;
}

export const AddEditAnnouncementModal: FC<AddEditAnnouncementModalProps> = ({
  announcement,
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [title, setTitle] = useState(announcement ? announcement.title : '');
  const [content, setContent] = useState(announcement ? announcement.content : '');
  const [imageUrl, setImageUrl] = useState<string>(announcement?.imageUrl || '');
  const [isPinned, setIsPinned] = useState<boolean>(announcement ? announcement.isPinned : false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content || '');
      setImageUrl(announcement.imageUrl || '');
      setIsPinned(announcement.isPinned);
    } else {
      setTitle('');
      setContent('');
      setImageUrl('');
      setIsPinned(false);
    }
  }, [announcement, isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImage(true);
      const compressed = await compressImage(file, 1600, 1600, 0.88);
      setImageUrl(compressed);
    } catch (err) {
      console.error('Failed to process poster image:', err);
      alert(lang === 'lo' ? 'ບໍ່ສາມາດອັບໂຫຼດຮູບພາບໄດ້' : 'Failed to upload image');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;

    try {
      setIsSaving(true);
      await onSave({
        id: announcement ? announcement.id : undefined,
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl.trim(),
        isPinned,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save announcement');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-base text-white">
              {announcement ? t.modalEditAnnouncementTitle : t.modalAddAnnouncementTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.announcementTitleLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.announcementTitlePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-white outline-hidden transition-all text-slate-900 font-semibold"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.announcementContentLabel}
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.announcementContentPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:bg-white outline-hidden transition-all text-slate-900 leading-relaxed"
              style={{ lineHeight: '1.8' }}
            />
          </div>

          {/* Poster Image Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                {t.posterImageLabel}
              </span>
            </label>

            {imageUrl ? (
              <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 p-2">
                <div className="max-h-56 overflow-hidden rounded-lg flex items-center justify-center bg-black/5">
                  <img
                    src={imageUrl}
                    alt="Poster preview"
                    className="w-full max-h-52 object-contain"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    {t.changePosterBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.removePosterBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => !isProcessingImage && fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-red-50/20 rounded-xl p-6 text-center cursor-pointer transition-all group"
              >
                {isProcessingImage ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-red-700">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-semibold">Processing image...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-red-100 flex items-center justify-center text-slate-500 group-hover:text-red-700 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-red-700 block">
                        {t.uploadPosterBtn}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        PNG, JPG, WebP (auto-optimized)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Pin toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <Pin className={`w-4 h-4 ${isPinned ? 'text-red-600 fill-red-600' : 'text-slate-400'}`} />
                {t.pinToTopLabel}
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isProcessingImage}
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-red-700 hover:bg-red-800 disabled:bg-slate-400 rounded-xl shadow-sm hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{t.saveAnnouncementBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
