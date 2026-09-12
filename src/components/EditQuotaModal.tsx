import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { LevelStat, Language } from '../types';
import { translations } from '../i18n';
import { X, AlertCircle, Save } from 'lucide-react';

interface EditQuotaModalProps {
  stat: LevelStat | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (level: string, registered: number) => void;
  lang: Language;
}

export const EditQuotaModal: FC<EditQuotaModalProps> = ({
  stat,
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [registered, setRegistered] = useState(stat ? stat.registered : 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (stat) {
      setRegistered(stat.registered);
      setError('');
    }
  }, [stat]);

  if (!isOpen || !stat) return null;
  const t = translations[lang];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (registered < 0) {
      setError('Number cannot be negative');
      return;
    }
    onSave(stat.level, registered);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
              {stat.level}
            </span>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.editLevelRegisteredTitle} (JLPT {stat.level})
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registered Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.registeredInLevel} ({t.personUnit})
            </label>
            <input
              type="number"
              min="0"
              value={registered}
              onChange={(e) => setRegistered(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-base font-bold text-blue-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <span className="font-semibold block mb-1">JLPT {stat.level} Information</span>
            <div className="flex justify-between">
              <span>Time: {stat.testTime}</span>
              <span>Fee: {stat.fee.toLocaleString()} LAK</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
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
