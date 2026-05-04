import { useState, useRef, useEffect } from 'react';

export function DatePicker({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const displayDate = value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : <span style={{color:'var(--text-muted)'}}>Empty</span>;

  // Simplified calendar rendering mock
  return (
    <div style={{ position: 'relative' }}>
      <span 
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {displayDate}
      </span>
      {open && (
        <div ref={ref} className="custom-popover" style={{ top: '100%', left: 0, marginTop: '4px', width: '260px' }}>
          <div className="menu-search" style={{ padding: '0 0 12px 0' }}>
            <input type="text" placeholder="Apr 13, 2026" defaultValue={displayDate !== 'Empty' ? displayDate.toString() : ''} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                 // rough parse mock
                 const d = new Date(e.currentTarget.value);
                 if (!isNaN(d.getTime())) {
                   onChange(d.toISOString().split('T')[0]);
                   setOpen(false);
                 }
              }
            }}/>
          </div>
          <div className="calendar-header">
            <span>{value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric'}) : 'Apr 2026'}</span>
            <div style={{display:'flex', gap: '8px', color: 'var(--text-muted)'}}>
              <span>Today</span>
              <span>{'<'}</span>
              <span>{'>'}</span>
            </div>
          </div>
          <div className="calendar-grid">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
            {Array.from({length: 31}, (_, i) => {
              const day = i + 1;
              const isSelected = value && new Date(value + 'T00:00:00').getDate() === day;
              return (
                <div 
                  key={day} 
                  className={`calendar-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    const d = new Date(`2026-04-${day.toString().padStart(2, '0')}T00:00:00`);
                    onChange(d.toISOString().split('T')[0]);
                    setOpen(false);
                  }}
                >{day}</div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
