import { ReactNode } from 'react'
import styles from './Tab.module.css'

interface IProps {
    children: ReactNode
}

export const Tab = ({ children }: IProps) => {
  return (
    <div className={styles.tab}>
        {children}
    </div>
  )
}
