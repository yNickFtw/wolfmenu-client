import { ReactNode } from 'react'
import styles from './Tab.module.css'

interface IProps {
    placeholder: string;
    value: string;
    activeValue: string;
    onClick(value: string): void;
}

export const TabTrigger = ({ placeholder, value, activeValue, onClick }: IProps) => {
  return (
    <div className={`${styles.tab_trigger} ${value === activeValue && styles.tab_active}`} onClick={() => onClick(value)}>
        <span>{placeholder}</span>
    </div>
  )
}
