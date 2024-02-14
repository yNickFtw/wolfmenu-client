import React from 'react'
import styles from './Logo.module.css'

interface IProps {
    size: string

}

export const Logo = ({size} : IProps) => {
  return (
    <h1 style={{fontSize:size}} className={styles.Logo}>Wolf<span style={{ color: "#EC0D35" }}>Menu</span></h1>
  )
}
