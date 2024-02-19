import styles from './NoMenuCategoriesFoundCard.module.css'
import NoDataImage from '../../assets/nodata.png'
import { IconPlus } from '@tabler/icons-react';

interface IProps {
    handleModalAddMenuCategory(): void;
}

export const NoMenuCategoriesFoundCard = ({ handleModalAddMenuCategory }: IProps) => {
  return (
    <div className={styles.card}>
        <h3>Você ainda não tem categorias neste menu</h3>
        <p>Comece adicionando agora</p>
        <img src={NoDataImage} alt="Você não tem categorias cadastradas neste menu, cadastre agora." />
        <button onClick={handleModalAddMenuCategory}>
            Adicionar categoria <IconPlus />
        </button>
    </div>
  )
}
