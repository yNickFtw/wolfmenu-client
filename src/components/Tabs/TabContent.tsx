import { ReactNode, useState, useEffect } from 'react'
import styles from './Tab.module.css'

interface IProps {
    children: ReactNode
    value: string;
    activeValue: string;
}

export const TabContent = ({ children, value, activeValue }: IProps) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(value === activeValue);
    }, [value, activeValue]);

    const animationClass = isActive ? styles.fadeIn : styles.fadeOut;

    return (
        <div className={`${styles.tab_content} ${isActive ? '' : styles.noActive} ${animationClass}`}>
            {children}
        </div>
    );
}
