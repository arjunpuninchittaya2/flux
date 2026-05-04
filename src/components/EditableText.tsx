import { useState, useRef, useEffect } from 'react';

export function EditableText({ value, onChange, className = '', style = {}, placeholder = 'Empty' }: { value: string, onChange: (v: string) => void, className?: string, style?: any, placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`editable-text ${className}`}
        style={style}
        value={tempVal}
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onChange(tempVal);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false);
            onChange(tempVal);
          }
        }}
      />
    );
  }

  return (
    <span
      className={className}
      style={{ ...style, cursor: 'text', userSelect: 'none', minHeight: '20px', display: 'inline-block' }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setTempVal(value);
        setEditing(true);
      }}
    >
      {value || <span style={{color: 'var(--text-muted)'}}>{placeholder}</span>}
    </span>
  );
}

export function LinkText({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`editable-text`}
        value={tempVal}
        onChange={(e) => setTempVal(e.target.value)}
        onBlur={() => {
          setEditing(false);
          onChange(tempVal);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setEditing(false);
            onChange(tempVal);
          }
        }}
      />
    );
  }

  return (
    <span
      className="prop-link"
      style={{ cursor: 'pointer', userSelect: 'none', pointerEvents: 'auto', display: 'inline-block', minHeight: '20px' }}
      onClick={(e) => {
        if ((e.ctrlKey || e.metaKey) && value) {
           e.stopPropagation();
           let url = value;
           if (!url.startsWith('http')) url = 'https://' + url;
           window.open(url, '_blank');
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setTempVal(value);
        setEditing(true);
      }}
    >
      {value || <span style={{color: 'var(--text-muted)'}}>Empty</span>}
    </span>
  );
}
