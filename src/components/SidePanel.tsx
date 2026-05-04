import { useState, useEffect, useRef } from 'react';
import { Block, Column } from '../types';
import { EditableText, LinkText } from './EditableText';
import { DatePicker } from './DatePicker';
import { CourseSelect } from './CourseSelect';
import { CourseIcon, CalendarIcon, AlignLeftIcon, CheckSquareIcon, CheckIcon, LinkIcon, ChevronsRightSmallIcon, ExpandSmallIcon } from './Icons';

export function SidePanel({ 
  activeCard, 
  columns, 
  updateCardField, 
  onClose, 
  onExpand, 
  isFullScreen = false 
}: { 
  activeCard: Block, 
  columns: Column[], 
  updateCardField: (id: string, field: keyof Block, value: any) => void, 
  onClose?: () => void,
  onExpand?: () => void,
  isFullScreen?: boolean
}) {
  const [width, setWidth] = useState(450);
  const isResizing = useRef(false);

  useEffect(() => {
    if (isFullScreen) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 450 && newWidth <= window.innerWidth - 300) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isFullScreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  const content = (
    <div className={isFullScreen ? 'full-screen-container' : 'side-panel-content'} style={isFullScreen ? { maxWidth: '800px', margin: '40px auto', padding: '0 24px', width: '100%' } : {}}>
      <div className="panel-title" style={{ marginBottom: isFullScreen ? '40px' : '20px' }}>
        <EditableText 
          value={activeCard.title} 
          onChange={(v) => updateCardField(activeCard.id, 'title', v)} 
          style={{ fontSize: isFullScreen ? '48px' : '36px', fontWeight: 'bold' }} 
        />
      </div>
      
      <div className="properties">
        <div className="property-row">
          <div className="property-label"><CourseIcon /> Course</div>
          <div className="property-value">
            <CourseSelect 
              valueId={activeCard.colId} 
              columns={columns} 
              onChange={(id) => updateCardField(activeCard.id, 'colId', id)} 
            />
          </div>
        </div>
        
        <div className="property-row">
          <div className="property-label"><CalendarIcon /> Deadline</div>
          <div className="property-value">
            <DatePicker value={activeCard.deadline || ''} onChange={(v) => updateCardField(activeCard.id, 'deadline', v)} />
          </div>
        </div>
        
        <div className="property-row align-top">
          <div className="property-label"><AlignLeftIcon /> Description</div>
          <div className="property-value">
            <EditableText value={activeCard.description || ''} onChange={(v) => updateCardField(activeCard.id, 'description', v)} />
          </div>
        </div>
        
        <div className="property-row">
          <div className="property-label"><CheckSquareIcon /> Done</div>
          <div className="property-value" onClick={() => updateCardField(activeCard.id, 'done', !activeCard.done)} style={{ cursor: 'pointer' }}>
            <div className={`checkbox ${activeCard.done ? 'checked' : ''}`}>
              {activeCard.done && <CheckIcon />}
            </div>
          </div>
        </div>
        
        <div className="property-row">
          <div className="property-label"><LinkIcon /> Link</div>
          <div className="property-value">
            <LinkText value={activeCard.link || ''} onChange={(v) => updateCardField(activeCard.id, 'link', v)} />
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      <div className="page-content-prompt">Press 'enter' to continue with an empty page, or <span>create a template</span></div>
    </div>
  );

  if (isFullScreen) {
    return content;
  }

  return (
    <aside className="side-panel" style={{ width: width }} onContextMenu={(e) => e.stopPropagation()}>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
      <div className="side-panel-header">
        <div className="side-panel-header-left">
          <button className="header-icon-btn" onClick={onClose}><ChevronsRightSmallIcon /></button>
          <button className="header-icon-btn" onClick={onExpand}><ExpandSmallIcon /></button>
        </div>
      </div>
      {content}
    </aside>
  );
}
