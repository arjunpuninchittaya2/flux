import { useState, useRef, useEffect } from 'react';
import { Column } from '../types';

export function CourseSelect({ valueId, columns, onChange }: { valueId?: string, columns: Column[], onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCol = columns.find(c => c.id === valueId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <span 
        className="prop-pill" 
        style={{ 
          backgroundColor: activeCol?.color || 'transparent', 
          color: activeCol?.textColor || 'var(--text-muted)',
          cursor: 'pointer',
          padding: activeCol ? '2px 8px' : '0'
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {activeCol ? activeCol.title : 'Empty'}
      </span>
      {open && (
        <div ref={ref} className="custom-popover" style={{ top: '100%', left: 0, marginTop: '4px' }}>
          <div className="menu-search" style={{ padding: '0 0 12px 0' }}>
            <input type="text" placeholder="Select an option or create one" autoFocus />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {columns.map(c => (
              <div 
                key={c.id} 
                className="course-option"
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                }}
              >
                <div style={{ color: 'var(--text-muted)', marginRight: '4px' }}>::</div>
                <span className="prop-pill" style={{ backgroundColor: c.color, color: c.textColor }}>{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
