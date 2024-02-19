import { ReactNode } from 'react';
import styles from './Tab.module.css'

interface IProps {
    children: ReactNode;
}

export const Tabs = ({ children}: IProps) => {
  return (
    <div className={styles.tabs_container}>
        {children}
    </div>
  )
}
