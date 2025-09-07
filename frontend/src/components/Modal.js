
import React from 'react';


export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>{title || 'Details'}</h3>
          <button onClick={onClose} style={styles.close}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: 12, width: 'min(900px, 100%)',
    maxHeight: '85vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' },
  body: { padding: 16 },
  close: { border: 'none', background: '#eee', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }
};
