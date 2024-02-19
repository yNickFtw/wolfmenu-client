import styles from "./NoCategoriesFoundCard.module.css";
import noDataImage from "../../assets/nodata.png";
import { IconPlus } from "@tabler/icons-react";

interface IProps {
  handleModalCreateCategory(): void;
}

export const NoCategoriesFoundCard = ({
  handleModalCreateCategory,
}: IProps) => {
  return (
    <section className={styles.warning_zero_categories}>
      <h3>Nenhuma categoria encontrada</h3>
      <img src={noDataImage} alt="Nenhuma categoria encontrada, crie agora" />
      <button
        className={styles.button_create_category}
        onClick={() => handleModalCreateCategory()}
      >
        Crie uma categoria agora <IconPlus />
      </button>
    </section>
  );
};
