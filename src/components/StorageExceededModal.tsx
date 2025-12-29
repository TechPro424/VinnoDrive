'use client';

import styles from '@/app/delete.module.css';
import type FileObj from "@/util/FileObj";
import {createPortal} from "react-dom";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  respomse: {
      files: FileObj[];
      udata: {initialSize: number, actualSize: number};
      status: number
  }
}

export default function StorageExceededModal({
  isOpen, 
  onClose, 
  respomse,
}: DeleteModalProps) {



  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;
  const flag = !!respomse.files.length

  return createPortal(
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Storage Limit Exceeded</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            type='button'
          >
          </button>
        </div>
        
        <div className={styles.modalContent}>

          {flag ? <><p>Some of your files could not be uploaded as they exceed your storage limit.</p><p>The following files were uploaded:</p>
            <p> {[...(respomse.files.map(file => {
              return file.name;
            }))].join(", ")}</p></> : <p>No files were uploaded.</p>}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            type="button"
            className={styles.okButton}
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  , document.body);
}
