'use client';

import styles from '@/app/rename.module.css'
import { useState, useEffect, useRef } from 'react';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

export default function RenameModal({ 
  isOpen, 
  onClose, 
  onRename, 
  currentName 
}: RenameModalProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Derive extension from currentName
  const extension = currentName.includes('.')
    ? currentName.substring(currentName.lastIndexOf('.'))
    : '';

  useEffect(() => {
    // Extract name without extension
    const nameWithoutExt = extension
      ? currentName.substring(0, currentName.lastIndexOf('.'))
      : currentName;

    setName(nameWithoutExt);

    // Focus input when modal opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen, currentName, extension]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Reconstruct full filename with extension
      const fullName = name.trim() + extension;
      onRename(fullName);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Rename</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            type='button'
          >
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputRow}>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.renameInput}
              placeholder="Enter name"
            />
            {extension && (
              <span className={styles.extensionLabel}>{extension}</span>
            )}
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.okButton}
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
