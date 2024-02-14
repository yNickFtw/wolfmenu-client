import { ReactNode, useEffect } from "react";
import styles from "./CustomModal.module.css";
import { IconX } from "@tabler/icons-react";

interface IProps {
  children: ReactNode;
  onClose: Function;
  subject: string;
}

const CustomModal = ({ children, onClose, subject }: IProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>{subject}</h3>
          <button onClick={() => onClose()}><IconX /></button>
        </header>
        {children}
      </div>
    </>
  );
};

export default CustomModal;
