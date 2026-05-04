import { useState, useEffect } from 'react';
import './styles.css';
import { Block, Column, MenuState, COLORS } from './types';
import { EditableText } from './components/EditableText';
import { SidePanel } from './components/SidePanel';
import { MoreHorizontalIcon, PlusIcon, MenuIcon, ArrowUpRightIcon, Link2Icon, TrashIcon, ChevronRightIcon } from './components/Icons';

const DEFAULT_COLUMNS: Column[] = [
  { id: 'math', title: 'Mathematics', count: 2, color: '#4a2c2a', textColor: '#ffb3b3' },
  { id: 'science', title: 'Science', count: 2, color: '#2c4234', textColor: '#b1e5c4' },
];

const DEFAULT_CARDS: Block[] = [
  { id: '1', colId: 'math', title: 'Algebra Worksheet', deadline: '2026-05-05', description: 'Complete questions 1-20', link: 'classroom.google.com', done: false },
  { id: '2', colId: 'math', title: 'Geometry Quiz Prep', deadline: '2026-05-10', description: 'Review Chapter 5 formulas', link: '', done: false },
  { id: '3', colId: 'science', title: 'Biology Lab Report', deadline: '2026-05-06', description: 'Write up photosynthesis lab', link: 'docs.google.com', done: true },
  { id: '4', colId: 'science', title: 'Chemistry Reading', deadline: '2026-05-12', description: 'Read pages 140-155', link: '', done: false },
];

function App() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<MenuState | null>(null);

  const params = new URLSearchParams(window.location.search);
  const fullScreenCardId = params.get('card');

  useEffect(() => {
    if (fullScreenCardId) setActiveCardId(fullScreenCardId);
  }, [fullScreenCardId]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!fullScreenCardId && activeCardId && !target.closest('.side-panel') && !target.closest('.card') && !target.closest('.context-menu-wrapper')) {
        setActiveCardId(null);
      }
      if (!target.closest('.context-menu-wrapper')) {
        setMenuState(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuState(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeCardId, fullScreenCardId]);

  const handleCardContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const x = Math.min(e.clientX, window.innerWidth - 270);
    const y = Math.min(e.clientY, window.innerHeight - 300);
    setMenuState({ type: 'card', id, x, y });
  };

  const handleColumnContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuState({ type: 'column', id, x: e.clientX, y: e.clientY });
  };

  const updateCardField = (id: string, field: keyof Block, value: any) => {
    setCards(cards.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateColumnColor = (id: string, color: string, textColor: string) => {
    setColumns(columns.map(c => c.id === id ? { ...c, color, textColor } : c));
    setMenuState(null);
  };

  if (fullScreenCardId) {
    const card = cards.find(c => c.id === fullScreenCardId);
    if (!card) return <div>Card not found</div>;
    return (
      <div className="app-container" style={{ background: 'var(--bg)', minHeight: '100vh', flexDirection: 'column' }}>
        <header className="header"><button className="header-icon-btn" onClick={() => window.close()}>Back</button></header>
        <SidePanel activeCard={card} columns={columns} updateCardField={updateCardField} isFullScreen={true} />
      </div>
    );
  }

  const activeCard = cards.find(c => c.id === activeCardId);

  return (
    <div className="app-container">
      <main className="main-content" onContextMenu={(e) => e.preventDefault()}>
        <header className="header"><h1>Dashboard</h1></header>
        <div className="board-container">
          {columns.map((col) => (
            <div key={col.id} className="column" onContextMenu={(e) => handleColumnContextMenu(e, col.id)}>
              <div className="column-header">
                <span className="pill" style={{ backgroundColor: col.color, color: col.textColor }}>
                  <EditableText value={col.title} onChange={(v) => setColumns(columns.map(c => c.id === col.id ? { ...c, title: v } : c))} />
                </span>
                <span className="count">{cards.filter(c => c.colId === col.id).length}</span>
                <div className="column-header-actions">
                  <button onClick={(e) => handleColumnContextMenu(e, col.id)}><MoreHorizontalIcon /></button>
                </div>
              </div>
              {cards.filter(c => c.colId === col.id).map(card => (
                <div 
                  key={card.id} 
                  className={`card ${activeCardId === card.id ? 'active' : ''}`}
                  onClick={() => setActiveCardId(card.id)}
                  onContextMenu={(e) => handleCardContextMenu(e, card.id)}
                  style={{ backgroundColor: col.color === '#2b2b2b' ? 'var(--card-bg)' : col.color }}
                >
                  <EditableText value={card.title} onChange={(v) => updateCardField(card.id, 'title', v)} style={{ width: '100%' }} />
                </div>
              ))}
              <button className="new-page-btn" onClick={() => setCards([...cards, { id: Date.now().toString(), colId: col.id, title: 'New Item' }])}>
                <PlusIcon /> New page
              </button>
            </div>
          ))}
          <div className="column" style={{ width: '200px' }}>
            <button className="new-page-btn" style={{ paddingLeft: '16px', marginTop: '16px' }}><PlusIcon /> New group</button>
          </div>
        </div>
      </main>

      {activeCard && (
        <SidePanel 
          activeCard={activeCard} 
          columns={columns} 
          updateCardField={updateCardField} 
          onClose={() => setActiveCardId(null)}
          onExpand={() => { setActiveCardId(null); window.open(`/?card=${activeCard.id}`, '_blank'); }}
        />
      )}

      {menuState?.type === 'card' && (
        <div className="context-menu-wrapper" style={{ top: menuState.y, left: menuState.x }}>
          <div className="menu-search"><input type="text" placeholder="Search actions..." autoFocus /></div>
          <div className="menu-group-label" style={{ paddingTop: '2px' }}>Page</div>
          <div className="menu-item" onMouseEnter={() => setMenuState({ ...menuState, hoveredSubmenu: 'openIn'})}>
            <div className="menu-item-icon"><ArrowUpRightIcon /></div> Open in <span className="menu-item-shortcut"><ChevronRightIcon /></span>
             {menuState.hoveredSubmenu === 'openIn' && (
              <div className="submenu-wrapper">
                <div className="menu-item" onClick={() => { setActiveCardId(menuState.id); setMenuState(null); }}>Open in side panel</div>
                <div className="menu-item" onClick={() => { window.open(`/?card=${menuState.id}`, '_blank'); setMenuState(null); }}>Open in new tab</div>
              </div>
            )}
          </div>
          <div className="menu-divider"></div>
          <div className="menu-item"><div className="menu-item-icon"><Link2Icon /></div> Copy link</div>
          <div className="menu-item" onClick={() => { setCards(cards.filter(c => c.id !== menuState.id)); setMenuState(null); }} style={{ color: '#ff6b6b' }}>
            <div className="menu-item-icon"><TrashIcon /></div> Move to Trash <span className="menu-item-shortcut">Del</span>
          </div>
        </div>
      )}

      {menuState?.type === 'column' && (
        <div className="context-menu-wrapper" style={{ top: menuState.y, left: menuState.x, width: '220px' }}>
          <div className="menu-group-label" style={{ paddingTop: '2px', paddingBottom: '4px' }}>Colors</div>
          <div className="color-picker-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {COLORS.map(color => (
              <div key={color.name} className="color-item" onClick={() => updateColumnColor(menuState.id, color.hex, color.text)}>
                <div className="color-circle" style={{ backgroundColor: color.hex }} />
                <span>{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
