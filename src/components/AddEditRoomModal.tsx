import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { ExamRoom, JLPTLevel, Language } from '../types';
import { translations } from '../i18n';
import { X, DoorOpen, Save } from 'lucide-react';

interface AddEditRoomModalProps {
  room: ExamRoom | null; // null means adding a new room
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: Omit<ExamRoom, 'id' | 'examinees'> & { id?: string }) => void;
  lang: Language;
}

export const AddEditRoomModal: FC<AddEditRoomModalProps> = ({

  room,
  isOpen,
  onClose,
  onSave,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [code, setCode] = useState(room ? room.code : '');
  const [building, setBuilding] = useState(room ? room.building : 'Building A (ອາຄານ ອາ)');
  const [floor, setFloor] = useState(room ? room.floor : 'Floor 1 (ຊັ້ນ 1)');
  const [level, setLevel] = useState<JLPTLevel>(room ? room.level : 'N5');
  const [capacity, setCapacity] = useState<number>(room ? room.capacity : 30);

  useEffect(() => {
    if (room) {
      setCode(room.code);
      setBuilding(room.building);
      setFloor(room.floor);
      setLevel(room.level);
      setCapacity(room.capacity);
    } else {
      setCode('');
      setBuilding('Building A (ອາຄານ ອາ)');
      setFloor('Floor 1 (ຊັ້ນ 1)');
      setLevel('N5');
      setCapacity(30);
    }
  }, [room]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSave({
      id: room ? room.id : undefined,
      code: code.trim(),
      building: building.trim(),
      floor: floor.trim(),
      level,
      capacity: Math.max(1, capacity),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <DoorOpen className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base text-white">
              {room ? t.editRoomBtn : t.addNewRoomBtn}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.roomNameField} *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. Room A-103 / ຫ້ອງ A-103"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.buildingField}
              </label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building A"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.floorField}
              </label>
              <input
                type="text"
                required
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Floor 1"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.levelField}
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as JLPTLevel)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 font-semibold"
              >
                <option value="N1">JLPT N1</option>
                <option value="N2">JLPT N2</option>
                <option value="N3">JLPT N3</option>
                <option value="N4">JLPT N4</option>
                <option value="N5">JLPT N5</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.capacityField}
              </label>
              <input
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none font-semibold"
              />
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
