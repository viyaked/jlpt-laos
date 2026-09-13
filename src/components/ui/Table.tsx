import { type ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  rowClassName?: (row: T, index: number) => string;
}

function TableHeader<T>({
  columns,
  sortBy,
  sortOrder,
  onSort,
}: {
  columns: Column<T>[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}) {
  return (
    <thead className="bg-slate-900 text-white font-semibold text-xs border-b border-slate-800">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={`
              py-3 px-4 text-left
              ${col.align === 'center' ? 'text-center' : ''}
              ${col.align === 'right' ? 'text-right' : ''}
              ${col.headerClassName || ''}
              ${col.sortable ? 'cursor-pointer hover:bg-slate-800 select-none' : ''}
            `}
            style={{ width: col.width }}
            onClick={() => col.sortable && onSort?.(col.key)}
            aria-sort={sortBy === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
          >
            <div className="flex items-center justify-center gap-1">
              {col.header}
              {col.sortable && (
                <span className="flex flex-col -space-y-1">
                  <ChevronUp className={`w-3 h-3 ${sortBy === col.key && sortOrder === 'asc' ? 'text-white' : 'text-slate-500'}`} />
                  <ChevronDown className={`w-3 h-3 ${sortBy === col.key && sortOrder === 'desc' ? 'text-white' : 'text-slate-500'}`} />
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableBody<T>({
  columns,
  data,
  keyExtractor,
  striped,
  hoverable,
  bordered,
  compact,
  rowClassName,
}: {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  rowClassName?: (row: T, index: number) => string;
}) {
  if (data.length === 0) return null;

  return (
    <tbody className={`divide-y divide-slate-100 ${bordered ? 'divide-slate-200' : ''}`}>
      {data.map((row, rowIndex) => (
        <tr
          key={keyExtractor(row)}
          className={`
            ${hoverable ? 'hover:bg-slate-50 transition-colors' : ''}
            ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}
            ${rowClassName ? rowClassName(row, rowIndex) : ''}
          `}
        >
          {columns.map((col) => (
            <td
              key={col.key}
              className={`
                ${compact ? 'py-2' : 'py-3'} px-4 text-sm text-slate-700
                ${col.align === 'center' ? 'text-center' : ''}
                ${col.align === 'right' ? 'text-right' : ''}
                ${col.className || ''}
              `}
            >
              {col.render ? col.render(row, rowIndex) : (row as any)[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

function TableEmpty<T>({
  columns,
  emptyMessage = 'No data available',
}: {
  columns: Column<T>[];
  emptyMessage: string;
}) {
  return (
    <tbody>
      <tr>
        <td colSpan={columns.length} className="py-12 text-center">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">{emptyMessage}</p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function TableLoading({ columns }: { columns: Column<any>[] }) {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {columns.map((col) => (
            <td key={col.key} className="py-3 px-4">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  emptyMessage = 'No data available',
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  rowClassName,
  className = '',
  ...props
}: TableProps<T>) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 ${className}`} {...props}>
      <table className="w-full text-left" role="grid">
        <TableHeader columns={columns} sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        {loading ? (
          <TableLoading columns={columns} />
        ) : data.length === 0 ? (
          <TableEmpty columns={columns} emptyMessage={emptyMessage} />
        ) : (
          <TableBody
            columns={columns}
            data={data}
            keyExtractor={keyExtractor}
            striped={striped}
            hoverable={hoverable}
            bordered={bordered}
            compact={compact}
            rowClassName={rowClassName}
          />
        )}
      </table>
    </div>
  );
}

export interface SimpleTableProps {
  headers: string[];
  rows: (string | ReactNode)[][];
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

export function SimpleTable({ headers, rows, striped = true, hoverable = true, className = '' }: SimpleTableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 ${className}`}>
      <table className="w-full text-left">
        <thead className="bg-slate-900 text-white font-semibold text-xs">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="py-3 px-4 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${hoverable ? 'hover:bg-slate-50 transition-colors' : ''} ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3 px-4 text-sm text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}