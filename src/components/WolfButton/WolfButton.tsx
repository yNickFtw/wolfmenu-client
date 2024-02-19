import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./WolfButton.module.css";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const WolfButton = ({ ...rest }: IProps) => {
  return <button {...rest} className={styles.button}></button>;
};
