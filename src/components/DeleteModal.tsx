'use client';

import styles from '@/app/delete.module.css';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  fileName: string;
}

export default function DeleteModal({ 
  isOpen, 
  onClose, 
  onDelete,
  fileName
}: DeleteModalProps) {

  const handleDelete = () => {
    onDelete();
    onClose();
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
          <h2>Delete file</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            type='button'
          >
          </button>
        </div>
        
        <div className={styles.modalContent}>
          <p>Are you sure you want to delete <strong>{fileName}</strong>?</p>
          <p className={styles.warningText}>This action cannot be undone.</p>
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
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
