import { Image as ImageIcon, UserCheck, Edit2, Trash2, Plus } from "lucide-react";
import type { ExamRoom, Language } from '../../types';
import { translations, formatRoomName } from '../../i18n';
import { Card, Badge, Button, Table } from '../ui';

interface RoomTableProps {
  rooms: ExamRoom[];
  lang: Language;
  onEdit: (room: ExamRoom) => void;
  onDelete: (roomId: string) => void;
  onManageExaminees: (room: ExamRoom) => void;
  onPhotoClick: (room: ExamRoom, e: React.MouseEvent) => void;
  confirmDeleteMessage: string;
}

const columns = [
  { key: 'name', header: 'Room Name', align: 'left' as const },
  { key: 'level', header: 'Level', align: 'center' as const },
  { key: 'building', header: 'Building', align: 'left' as const },
  { key: 'floor', header: 'Floor', align: 'left' as const },
  { key: 'capacity', header: 'Examinees / Capacity', align: 'center' as const },
  { key: 'actions', header: 'Actions', align: 'right' as const },
];

export function RoomTable({
  rooms,
  lang,
  onEdit,
  onDelete,
  onManageExaminees,
  onPhotoClick,
  confirmDeleteMessage,
}: RoomTableProps) {
  const t = translations[lang];

  const tableData = rooms.map((room) => ({
    id: room.id,
    name: (
      <div className="flex items-center gap-2.5">
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.code}
            onClick={(e) => onPhotoClick(room, e)}
            className="w-10 h-8 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity shadow-xs shrink-0"
            title={t.clickToEnlarge}
          />
        ) : (
          <div className="w-10 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
            <ImageIcon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
        <div>
          <span className="font-bold text-slate-900 block">
            {formatRoomName(room.code, lang)}
          </span>
          {room.imageUrl && (
            <button
              type="button"
              onClick={(e) => onPhotoClick(room, e)}
              className="text-[10px] text-red-700 hover:underline flex items-center gap-0.5"
            >
              <span>{t.viewRoomPhotoBtn}</span>
            </button>
          )}
        </div>
      </div>
    ),
    level: (
      <Badge variant="outline" size="sm" className="bg-slate-100 text-slate-800 border-slate-200">
        JLPT {room.level}
      </Badge>
    ),
    building: <span className="text-slate-700 text-xs">{room.building}</span>,
    floor: <span className="text-slate-700 text-xs">{room.floor}</span>,
    capacity: (
      <span className="font-mono text-xs font-semibold text-slate-800">
        {room.examineeCount ?? room.examinees.length} / {room.capacity}
      </span>
    ),
    actions: (
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="outline"
          size="xs"
          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
          onClick={() => onManageExaminees(room)}
          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
        >
          {t.manageExamineesBtn}
        </Button>

        <Button variant="ghost" size="xs" leftIcon={<Edit2 className="w-3.5 h-3.5" />} onClick={() => onEdit(room)}>
          <span className="sr-only">{t.editRoomBtn}</span>
        </Button>

        <Button
          variant="ghost"
          size="xs"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={() => {
            if (window.confirm(confirmDeleteMessage)) {
              onDelete(room.id);
            }
          }}
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <span className="sr-only">{t.deleteRoomBtn}</span>
        </Button>
      </div>
    ),
  }));

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      <Table
        columns={columns}
        data={tableData}
        keyExtractor={(row) => row.id}
        striped
        hoverable
        bordered
        emptyMessage={lang === 'lo' ? 'ຍັງບໍ່ທັນມີຫ້ອງສອບເສັງໃນລະບົບ' : 'No examination rooms in the system'}
      />
    </Card>
  );
}

interface AddRoomButtonProps {
  onClick: () => void;
  lang: Language;
}

export function AddRoomButton({ onClick, lang }: AddRoomButtonProps) {
  const t = translations[lang];

  return (
    <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={onClick} className="self-start sm:self-auto">
      {t.addNewRoomBtn}
    </Button>
  );
}