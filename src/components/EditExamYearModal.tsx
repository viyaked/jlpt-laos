import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { Language } from '../types';
import { translations, getAnnualExamTitle, getAnnualExamShort, formatExamDate } from '../i18n';
import { X, AlertCircle, Save, Calendar, Sparkles, Clock } from 'lucide-react';

interface EditExamYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: string;
  currentDate?: string;
  onSave: (newYear: string, newDate: string) => void;
  lang: Language;
}

export const EditExamYearModal: FC<EditExamYearModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  currentDate = '2026-07-05',
  onSave,
  lang,
}) => {
  const [year, setYear] = useState(currentYear || '2026');
  const [date, setDate] = useState(currentDate || '2026-07-05');
  const [error, setError] = useState('');

  useEffect(() => {
    setYear(currentYear || '2026');
    setDate(currentDate || '2026-07-05');
    setError('');
  }, [currentYear, currentDate, isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  // Quick preset exam dates (1st Sunday of July & December)
  const quickPresets = [
    { label: '05/07/2026 (JLPT ຮອບ 1)', date: '2026-07-05', year: '2026' },
    { label: '06/12/2026 (JLPT ຮອບ 2)', date: '2026-12-06', year: '2026' },
    { label: '04/07/2027 (JLPT ຮອບ 1)', date: '2027-07-04', year: '2027' },
  ];

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setError('');
    // Auto-sync year with chosen date
    if (newDate && newDate.includes('-')) {
      const parsedYear = newDate.split('-')[0];
      if (parsedYear && parsedYear.length === 4) {
        setYear(parsedYear);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanYear = year.trim();
    const cleanDate = date.trim();

    if (!cleanDate) {
      setError(lang === 'lo' ? 'ກະລຸນາເລືອກວັນທີສອບເສັງ' : 'Please select an exam date');
      return;
    }
    if (!cleanYear || cleanYear.length < 4 || isNaN(Number(cleanYear))) {
      setError(lang === 'lo' ? 'ກະລຸນາໃສ່ຕົວເລກປີ ຄ.ສ. ທີ່ຖືກຕ້ອງ (ຕົວຢ່າງ: 2026)' : 'Please enter a valid 4-digit year (e.g. 2026)');
      return;
    }

    onSave(cleanYear, cleanDate);
    onClose();
  };

  const formattedDate = formatExamDate(date, lang);
  const previewTitle = getAnnualExamTitle(lang, year || '2026');
  const previewShort = getAnnualExamShort(lang, year || '2026');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.editExamScheduleModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.examYearCardDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exam Date Picker Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>{t.examDateInputLabel} *</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none cursor-pointer"
              required
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.examDateInputHelp}
            </span>
          </div>

          {/* Exam Year Input Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{t.examYearLabel} *</span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setError('');
                }}
                placeholder={t.examYearPlaceholder}
                className="w-full px-3.5 py-2.5 text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none tracking-wider"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                A.D.
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.examYearHelp}
            </span>
          </div>

          {/* Quick Select Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              {lang === 'lo' ? 'ເລືອກກຳນົດການໄວ:' : 'Quick Select Presets:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset.date}
                  type="button"
                  onClick={() => {
                    setDate(preset.date);
                    setYear(preset.year);
                    setError('');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    date === preset.date
                      ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Dynamic Preview Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.examYearPreviewLabel}</span>
            </div>

            <div className="space-y-2">
              {/* Notice Bar Preview */}
              <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="font-medium truncate">
                  {previewShort} &bull; {t.examDateLabel}: <strong className="text-emerald-300">{formattedDate.longDate}</strong>
                </span>
              </div>

              {/* Title & Card Preview */}
              <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                  {t.examDateLabel} (Display in Portal):
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {formattedDate.longDate} <span className="text-xs font-semibold text-red-700 ml-1">({formattedDate.shortDate})</span>
                </div>
                <div className="text-xs text-slate-600 mt-1.5 font-medium border-t border-slate-100 pt-1.5">
                  {previewTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
