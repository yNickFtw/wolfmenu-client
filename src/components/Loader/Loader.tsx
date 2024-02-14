import { IconLoader2 } from "@tabler/icons-react";
import styles from "./Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <IconLoader2 color="#dc143c" size={"5em"} className="animate-spin" />
    </div>
  );
};
