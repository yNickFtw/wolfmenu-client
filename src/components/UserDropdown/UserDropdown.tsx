import {
  IconLogout,
  IconSettings,
  IconUser,
  IconUserDollar,
} from "@tabler/icons-react";
import styles from "./UserDropdown.module.css";
import { useUserStore } from "../../states/user.state";
import { toast } from "react-toastify";
import CustomModal from "../Modal/CustomModal";
import { useState } from "react";

export const UserDropdown = () => {
  const { logout } = useUserStore();
  const [modal, setModal] = useState<boolean>(false);

  const handleModal = () => {
    setModal(!modal);
  }

  const handleLogout = () => {
    toast.info("Deslogado com sucesso", {
      theme: "dark",
    });

    logout();
  };

  return (
    <>
      <div className={styles.dropdown}>
        <ul>
          <li>
            <IconUser /> Conta
          </li>
          <li>
            <IconUserDollar /> Financeiro
          </li>
          <li onClick={handleLogout}>
            <IconLogout /> Logout
          </li>
        </ul>
      </div>

    </>
  );
};
