import { InputHTMLAttributes, ReactNode } from 'react'
import styles from './WolfInput.module.css'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
}

export const WolfInput = ({ ...rest }: IProps) => {
  return (
    <input {...rest} className={`${styles.input}`} />
  )
}
