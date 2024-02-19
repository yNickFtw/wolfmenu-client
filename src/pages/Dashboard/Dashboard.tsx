import styles from "./Dashboard.module.css";
import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { unitUseStore } from "../../states/unit.states";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import { IconCategory, IconLink, IconShoppingBag } from "@tabler/icons-react";
import CategoryService from "../../services/CategoryService/category.service";
import { useUserStore } from "../../states/user.state";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import UnitService from "../../services/UnitService/unit.service";
import { DashboardInfoDTO } from "../../helpers/interfaces/DashboardInfoDTO";
import { Tab } from "../../components/Tabs/Tab";
import { Tabs } from "../../components/Tabs/Tabs";
import { TabTrigger } from "../../components/Tabs/TabTrigger";
import { TabContent } from "../../components/Tabs/TabContent";

export const Dashboard = () => {
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfoDTO | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const [activeValue, setActiveValue] = useState<string>("overview");

  const { unitSelected, unitSelectedId, deleteSelectedUnit } = unitUseStore();
  const { logout } = useUserStore();

  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  const unitService = new UnitService();

  useEffect(() => {
    async function fetchDashboardInfo() {
      const response = await unitService.dashboardData(token, unitSelectedId!);

      if (response.statusCode === 401) {
        toast.error(response.data.message, {
          theme: "dark",
        });
        logout();
        deleteSelectedUnit();
        navigate("/login");
      }

      if (response.statusCode === 403) {
        toast.error(response.data.message, {
          theme: "dark",
        });
        deleteSelectedUnit();
        navigate("/unities");
      }

      if (response.statusCode === 200) {
        setDashboardInfo(response.data);
      }

      setLoading(false);
    }

    fetchDashboardInfo();
  }, []);

  const handleSelectTab = (value: string) => {
    setActiveValue(value);
  };

  return (
    <LayoutWithSidebar>
      <>
        <PrivateWithUnit />
        <header className={styles.header}>
          <h2 className="pageTitle">Dashboard de {unitSelected?.name}</h2>
        </header>

        <section className={styles.main_content}>
          <div className={styles.tab_section}>
            <Tab>
              <Tabs>
                <TabTrigger
                  value="overview"
                  activeValue={activeValue}
                  onClick={() => handleSelectTab("overview")}
                  placeholder="Visão geral"
                />
                <TabTrigger
                  value="links_analytics"
                  activeValue={activeValue}
                  onClick={() => handleSelectTab("links_analytics")}
                  placeholder="Análise de links"
                />
              </Tabs>

              <TabContent value="overview" activeValue={activeValue}>
                <h3>Visão geral</h3>
                <p>Aqui está a visão geral</p>
                <div className={styles.container_cards}>
                  <section className={styles.card_dashboard}>
                    <div className={styles.header_card}>
                      <h3>
                        <IconCategory /> Categorias
                      </h3>
                    </div>
                    <div className={styles.separator}></div>
                    <div className={styles.info_card}>
                      <p>
                        {dashboardInfo !== null &&
                          `${dashboardInfo.categories} categorias registrados`}
                      </p>
                      <Link to={"/categories"}>Detalhes</Link>
                    </div>
                  </section>
                  <section className={styles.card_dashboard}>
                    <div className={styles.header_card}>
                      <h3>
                        <IconShoppingBag /> Produtos
                      </h3>
                    </div>
                    <div className={styles.separator}></div>
                    <div className={styles.info_card}>
                      <p>
                        {dashboardInfo !== null &&
                          `${dashboardInfo.products} produtos registrados`}
                      </p>
                      <Link to={"/products"}>Detalhes</Link>
                    </div>
                  </section>
                  <section className={styles.card_dashboard}>
                    <div className={styles.header_card}>
                      <h3>
                        <IconLink /> Links
                      </h3>
                    </div>
                    <div className={styles.separator}></div>
                    <div className={styles.info_card}>
                      <p>{dashboardInfo !== null && `5 Links registrados`}</p>
                      <Link to={"/links"}>Detalhes</Link>
                    </div>
                  </section>
                </div>
              </TabContent>

              <TabContent value="links_analytics" activeValue={activeValue}>
                <h3>Análise de links</h3>
                <p>Aqui está a análise de links</p>
              </TabContent>

              <TabContent value="more" activeValue={activeValue}>
                <h3>Mias um teste</h3>
                <p>TEste</p>
              </TabContent>
            </Tab>
          </div>
        </section>
      </>
    </LayoutWithSidebar>
  );
};
