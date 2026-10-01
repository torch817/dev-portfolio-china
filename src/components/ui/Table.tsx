import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ children, className, ...props }) => (
  <div className="w-full overflow-x-auto rounded-lg border border-default bg-surface shadow-card">
    <table className={`w-full text-left text-sm ${className || ''}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ children, className, ...props }) => (
  <thead className={`border-b border-default bg-raised text-xs uppercase tracking-wider text-content-muted ${className || ''}`} {...props}>
    {children}
  </thead>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
  <tr className={`border-b border-default/60 hover:bg-hover/40 transition-colors duration-160 ${className || ''}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <th className={`px-4 py-3.5 font-medium text-content-muted ${className || ''}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td className={`px-4 py-3.5 text-content-secondary ${className || ''}`} {...props}>
    {children}
  </td>
);