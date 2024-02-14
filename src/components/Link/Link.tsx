import styles from './Link.module.css';
import { ILink } from "../../helpers/interfaces/ILink";

interface IProps {
    link: ILink,
    index: number
}

export const Link = ({ link, index }: IProps) => {
  return (
    <div className={styles.link_card} key={link.id}>
      
    </div>
  )
}
