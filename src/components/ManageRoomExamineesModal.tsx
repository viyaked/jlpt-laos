import { useState, type FC, type FormEvent } from 'react';
import type { ExamRoom, Language } from '../types';
import { translations, formatRoomName } from '../i18n';
import * as XLSX from 'xlsx';
import {
  X,
  UserPlus,
  Trash2,
  Users,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Plus,
  Upload,
} from 'lucide-react';


interface ManageRoomExamineesModalProps {
  room: ExamRoom | null;
  isOpen: boolean;
  onClose: () => void;
  onAddExaminee: (roomId: string, fullName: string) => Promise<void> | void;
  onBatchAddExaminees: (roomId: string, examinees: { fullName: string }[]) => Promise<void> | void;
  onRemoveExaminee: (roomId: string, examineeId: string) => Promise<void> | void;
  lang: Language;
}

export const ManageRoomExamineesModal: FC<ManageRoomExamineesModalProps> = ({
  room,
  isOpen,
  onClose,
  onAddExaminee,
  onBatchAddExaminees,
  onRemoveExaminee,
  lang,
}) => {
  // Tab mode: 'single' | 'batch' | 'list'
  const [activeTab, setActiveTab] = useState<'list' | 'single' | 'batch'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single add form
  const [fullName, setFullName] = useState('');
  const [singleError, setSingleError] = useState('');

  // Batch add form
  const [batchText, setBatchText] = useState('');
  const [batchError, setBatchError] = useState('');
  const [batchSuccess, setBatchSuccess] = useState('');

  if (!isOpen || !room) return null;
  const t = translations[lang];

  const handleSingleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSingleError(t.fullNameRequiredError);
      return;
    }
    if (!room) return;

    try {
      setIsSubmitting(true);
      setSingleError('');
      await onAddExaminee(room.id, fullName.trim());
      setFullName('');
      setActiveTab('list');
    } catch (err: any) {
      setSingleError(err.message || 'Failed to add examinee');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchAdd = async (e: FormEvent) => {
    e.preventDefault();
    const rawLines = batchText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      setBatchError(t.batchAddError);
      return;
    }

    const headerKeywords = [
      'name', 'fullname', 'full_name', 'first_name', 'firstname', 'lastname', 'surname',
      'ຊື່', 'ຊື່ເຕັມ', 'ຊື່ ແລະ ນາມສະກຸນ', 'ຊື່ແລະນາມສະກຸນ', 'ນາມສະກຸນ', 'ລ/ດ', 'no', '#'
    ];

    const newExaminees: { fullName: string }[] = [];
    for (const rawLine of rawLines) {
      let line = rawLine;
      // Strip leading numbering like "1.", "1)", "1,"
      line = line.replace(/^\d+[\.\),\-]\s*/, '').trim();

      // Check if this line looks like a CSV / table header
      const lower = line.toLowerCase().replace(/[\s,_\-]+/g, '');
      if (headerKeywords.some((k) => lower === k.replace(/[\s,_\-]+/g, ''))) {
        continue; // Skip header row
      }

      // Replace commas, semicolons, or tabs with single spaces
      const cleanName = line.replace(/[,;\t]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanName && cleanName.length >= 2) {
        newExaminees.push({ fullName: cleanName });
      }
    }

    if (newExaminees.length === 0) {
      setBatchError(t.batchAddError);
      return;
    }

    if (!room) return;

    try {
      setIsSubmitting(true);
      setBatchError('');
      await onBatchAddExaminees(room.id, newExaminees);
      setBatchText('');
      setBatchSuccess(t.batchAddSuccess.replace('{count}', newExaminees.length.toString()));
      setTimeout(() => {
        setBatchSuccess('');
        setActiveTab('list');
      }, 1200);
    } catch (err: any) {
      setBatchError(err.message || 'Failed to batch add examinees');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'xls') {
      // Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csv = XLSX.utils.sheet_to_csv(firstSheet);
          setBatchText(csv);
          setBatchSuccess(t.csvUploadSuccess);
        } catch {
          setBatchError('Failed to parse Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setBatchText(text);
        setBatchSuccess(t.csvUploadSuccess);
      };
      reader.readAsText(file, 'utf-8');
    }
  };

  return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
              {room.level}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {t.manageRoomsTitle} - {formatRoomName(room.code, lang)}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {room.building} &bull; {room.floor}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.examineeCount}: <span className="text-white font-bold">{room.examinees.length}</span> / {room.capacity} ({t.roomCapacity})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.rosterModalTitle} ({room.examinees.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.addExamineeBtn}</span>
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.batchAddExamineeBtn}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Tab 1: Current Examinee List */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{t.privacyNoticeDesc}</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-xs">
                    <tr>
                      <th className="py-2.5 px-4 w-14 text-center">{t.orderCol}</th>
                      <th className="py-2.5 px-4">{t.candidateNameCol}</th>
                      <th className="py-2.5 px-4 w-20 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {room.examinees.length > 0 ? (
                      room.examinees.map((ex, index) => (
                        <tr key={ex.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 text-center text-xs text-slate-500 font-mono">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-900">
                            {ex.fullName || `${ex.firstName} ${ex.lastName}`}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              onClick={() => {
                                if (window.confirm(t.removeCandidateConfirm)) {
                                  onRemoveExaminee(room.id, ex.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                              title={t.removeCandidateBtn}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-500 text-sm">
                          {t.emptyRoster}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Single Add Examinee */}
          {activeTab === 'single' && (
            <form onSubmit={handleSingleAdd} className="space-y-4 max-w-md mx-auto py-2">
              <div className="text-center mb-4">
                <h4 className="font-bold text-base text-slate-900">
                  {t.addExamineeTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  {formatRoomName(room.code, lang)} &bull; JLPT {room.level}
                </p>
              </div>

              {singleError && (
                <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{singleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.fullNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (lang === 'lo' ? 'ກຳລັງບັນທຶກ...' : 'Saving...') : t.saveBtn}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 3: Batch Add Examinees */}
          {activeTab === 'batch' && (
            <form onSubmit={handleBatchAdd} className="space-y-4 py-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  {t.batchAddTitle}
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  {t.batchAddInstruction}
                </p>
              </div>

              {batchError && (
                <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{batchError}</span>
                </div>
              )}

              {batchSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{batchSuccess}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold block text-slate-800">{t.uploadCsvBtn}</span>
                  <span className="text-[11px] text-slate-500">{t.csvFormatHint}</span>
                </div>
                <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5 text-red-600" />
                  <span>{t.uploadCsvBtn}</span>
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <textarea
                  rows={5}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={t.batchAddPlaceholder}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                />
              </div>


              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2 px-5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-sm flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (lang === 'lo' ? 'ກຳລັງນຳເຂົ້າ...' : 'Importing...') : t.processBatchBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
