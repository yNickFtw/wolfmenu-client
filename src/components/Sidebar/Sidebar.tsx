// Sidebar.tsx
import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IconMenu2,
  IconUser,
  IconLogout2,
  IconCategory,
  IconBuildingStore,
  IconDashboard,
  IconLink,
  IconToolsKitchen2,
  IconShoppingBag,
} from "@tabler/icons-react";
import styles from "./Sidebar.module.css";
import { useUserStore } from "../../states/user.state";
import defaultProfileImage from "../../assets/defaultprofile.png";
import { toast } from "react-toastify";
import CustomModal from "../Modal/CustomModal";
import { IUnit, unitUseStore } from "../../states/unit.states";
import UnitService from "../../services/UnitService/unit.service";
import { IconCrown } from "@tabler/icons-react";
import LogoSvg from "../../assets/Vector.svg";

export interface IProps {
  children: ReactNode;
}

export const Sidebar = ({ children }: IProps) => {
  const [isSidebarVisible, setSidebarVisibility] = useState(
    isDesktopFunction()
  );
  const [isDesktop, setDesktopValue] = useState<boolean>(isDesktopFunction());
  const [modal, setModal] = useState<boolean>(false);
  const { setSelectedUnit, unitSelected, deleteSelectedUnit } = unitUseStore();

  const { loggedUser, logout } = useUserStore();

  const unitService = new UnitService();
  const navigate = useNavigate();

  function isDesktopFunction(): boolean {
    return window.innerWidth >= 768;
  }

  async function fetchUnitById() {
    const unitId = localStorage.getItem("unitSelectedId") as string;
    const token = localStorage.getItem("token") as string;

    const response = await unitService.fetchUnitById(token, unitId);

    if (response.statusCode === 404) {
      toast.info(response.data.message, {
        theme: "dark",
      });

      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 403) {
      toast.info("Selecione uma unidade antes de acessar a dashboard", {
        theme: "dark",
      });
      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 200) {
      setSelectedUnit(response.data);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setDesktopValue(isDesktopFunction());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("unitSelectedId") && unitSelected === null) {
      fetchUnitById();
    }
  }, []);

  const handleModal = () => {
    setModal(!modal);
  };

  const handleLogout = () => {
    toast.info("Deslogado com sucesso.", {
      theme: "dark",
    });
    logout();
    deleteSelectedUnit();
  };

  const toggleSidebar = () => {
    setSidebarVisibility(!isSidebarVisible);
    const body = document.querySelector("body");
    body!.classList.toggle("sidebar-visible", !isSidebarVisible);
  };

  return (
    <>
      <div className={styles.container}>
        <aside
          className={`${styles.aside} ${
            isSidebarVisible || isDesktop ? styles.visible : ""
          }`}
        >
          <NavLink to={"/unities"} className={styles.itemBox}>
            <IconBuildingStore />
            <span className={styles.itemName}>Unidades</span>
          </NavLink>
          {unitSelected !== null && (
            <>
              <NavLink to={"/"} className={styles.itemBox}>
                <IconDashboard />
                <span className={styles.itemName}>Dashboard</span>
              </NavLink>
              <NavLink to={"/categories"} className={styles.itemBox}>
                <IconCategory />
                <span className={styles.itemName}>Categorias</span>
              </NavLink>
              <NavLink to={"/products"} className={styles.itemBox}>
                <IconShoppingBag />
                <span className={styles.itemName}>Produtos</span>
              </NavLink>
              <NavLink to={"/menu"} className={styles.itemBox}>
                <IconToolsKitchen2 />
                <span className={styles.itemName}>Cardápio</span>
              </NavLink>
              <NavLink to={"/links"} className={styles.itemBox}>
                <IconLink />
                <span className={styles.itemName}>Links</span>
              </NavLink>
            </>
          )}
          <NavLink to={"/plans"} className={styles.itemBox}>
            <IconCrown />
            <span className={styles.itemName}>Planos</span>
          </NavLink>
          <NavLink to={"/account"} className={styles.itemBox}>
            <IconUser />
            <span className={styles.itemName}>Conta</span>
          </NavLink>

          <div className={styles.itemBox} onClick={handleModal}>
            <IconLogout2 />
            <span className={styles.itemName}>Sair</span>
          </div>
        </aside>
        <header className={styles.header}>
          <div className={styles.leftHeader}>
            {!isDesktop ? (
              <button className={styles.toggleButton} onClick={toggleSidebar}>
                <IconMenu2 />
              </button>
            ) : (
              <></>
            )}
            <img src={LogoSvg} className={styles.logo} alt="" />
          </div>
          <div
            className={styles.rightHeader}
            onClick={() => navigate("/account")}
          >
            <div className={styles.userInfos}>
              <span className={styles.userName}>{loggedUser.firstName}</span>
              <span className={styles.userTag}>{loggedUser.lastName}</span>
            </div>
            <img
              src={
                loggedUser.profileImage
                  ? loggedUser.profileImage
                  : defaultProfileImage
              }
              className={styles.pic}
            />
          </div>
        </header>
        <main
          className={`${styles.main} ${
            isSidebarVisible && !isDesktop ? styles.blur : ""
          }`}
          style={isDesktop ? { margin: "0 0 0 15em" } : { margin: "0 0 0 0" }}
        >
          {children}
        </main>
      </div>
      {modal && (
        <CustomModal
          onClose={handleModal}
          subject="Tem certeza que deseja fazer isso?"
        >
          <p>Você irá precisar fazer login de novo caso deseje prosseguir!</p>

          <div className={styles.actions}>
            <button onClick={handleLogout} className={styles.confirm_button}>
              Confirmar
            </button>
          </div>
        </CustomModal>
      )}
    </>
  );
};
