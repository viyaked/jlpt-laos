import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { LevelStat, Language } from '../types';
import { translations } from '../i18n';
import { X, AlertCircle, Save, Clock, Banknote, Users } from 'lucide-react';

interface EditQuotaModalProps {
  stat: LevelStat | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    level: string,
    data: { registered: number; fee: number; testTime: string }
  ) => void;
  lang: Language;
}

const COMMON_TIME_PRESETS = [
  '09:00 - 11:30',
  '09:00 - 11:45',
  '13:30 - 16:30',
  '13:30 - 16:45',
  '13:30 - 17:00',
];

export const EditQuotaModal: FC<EditQuotaModalProps> = ({
  stat,
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  const [registered, setRegistered] = useState(stat ? stat.registered : 0);
  const [fee, setFee] = useState(stat ? stat.fee : 350000);
  const [testTime, setTestTime] = useState(stat ? stat.testTime : '09:00 - 11:30');
  const [error, setError] = useState('');

  useEffect(() => {
    if (stat) {
      setRegistered(stat.registered);
      setFee(stat.fee);
      setTestTime(stat.testTime);
      setError('');
    }
  }, [stat]);

  if (!isOpen || !stat) return null;
  const t = translations[lang];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (registered < 0) {
      setError(lang === 'lo' ? 'ຈຳນວນຜູ້ສະໝັກບໍ່ສາມາດຕິດລົບໄດ້' : 'Registered count cannot be negative');
      return;
    }
    if (fee < 0) {
      setError(lang === 'lo' ? 'ຄ່າສະໝັກບໍ່ສາມາດຕິດລົບໄດ້' : 'Fee cannot be negative');
      return;
    }
    if (!testTime.trim()) {
      setError(lang === 'lo' ? 'ກະລຸນາລະບຸເວລາສອບເສັງ' : 'Please enter exam time');
      return;
    }

    onSave(stat.level, {
      registered,
      fee,
      testTime: testTime.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-base shadow-sm">
              {stat.level}
            </span>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.editLevelModalTitle} (JLPT {stat.level})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.editLevelModalDesc} JLPT {stat.level}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Exam Time Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>{t.examTimeField}</span>
            </label>
            <input
              type="text"
              value={testTime}
              onChange={(e) => setTestTime(e.target.value)}
              placeholder="09:00 - 11:30"
              className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              {t.timeFormatHint}
            </p>

            {/* Quick Preset Buttons */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-slate-500 font-medium mr-1">
                {t.quickTimePresets}
              </span>
              {COMMON_TIME_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTestTime(preset)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                    testTime === preset
                      ? 'bg-red-700 text-white border-red-700 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Registration Fee Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Banknote className="w-3.5 h-3.5 text-red-600" />
                <span>{t.examFeeField} ({t.lakUnit})</span>
              </label>
              <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                {Number(fee || 0).toLocaleString()} {t.lakUnit}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10000"
                value={fee}
                onChange={(e) => setFee(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>
            {/* Quick Fee Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[350000, 380000, 420000, 480000, 550000].map((presetFee) => (
                <button
                  key={presetFee}
                  type="button"
                  onClick={() => setFee(presetFee)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                    fee === presetFee
                      ? 'bg-red-700 text-white border-red-700 font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {presetFee.toLocaleString()} LAK
                </button>
              ))}
            </div>
          </div>

          {/* 3. Registered Applicants Count Field */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <Users className="w-3.5 h-3.5 text-red-600" />
              <span>{t.registeredInLevel} ({t.personUnit})</span>
            </label>
            <input
              type="number"
              min="0"
              value={registered}
              onChange={(e) => setRegistered(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold text-blue-700 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
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
              <Save className="w-4 h-4" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
