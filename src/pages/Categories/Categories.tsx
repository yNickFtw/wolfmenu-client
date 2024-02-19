import { IconEyeFilled, IconPlus } from "@tabler/icons-react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import styles from "./Categories.module.css";
import { FormEvent, useEffect, useState } from "react";
import { ICategory } from "../../helpers/interfaces/ICategory";
import CategoryService from "../../services/CategoryService/category.service";
import { unitUseStore } from "../../states/unit.states";
import CustomModal from "../../components/Modal/CustomModal";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useUserStore } from "../../states/user.state";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Loader } from "../../components/Loader/Loader";
import { CreateCategorieModal } from "../../components/CreateCategorieModal/CreateCategorieModal";
import { NoCategoriesFoundCard } from "../../components/NoCategoriesFoundCard/NoCategoriesFoundCard";

export const Categories = () => {
  const [categories, setCategories] = useState<ICategory[] | []>([]);
  const [qtdCategories, setQtdCategories] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const { unitSelectedId, deleteSelectedUnit } = unitUseStore();
  const { logout } = useUserStore();
  const navigate = useNavigate();

  let totalRows = 12;

  async function fetchCategories() {
    const token = localStorage.getItem("token") as string;
    setLoading(true);

    const response = await new CategoryService().findAndCountAll(
      token,
      unitSelectedId!,
      currentPage,
      totalRows
    );

    if (response.statusCode === 200) {
      setCategories(response.data.categories);
      setPageCount(Math.ceil(response.data.totalCount / totalRows));
      setQtdCategories(response.data.totalCount);
    }

    if (response.statusCode === 401) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      logout();
      deleteSelectedUnit();
      navigate("/login");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const handleModalCreate = () => {
    setModalCreate(!modalCreate);
  };

  const handlePageClick = (data: any) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  return (
    <>
      <PrivateWithUnit />
      <LayoutWithSidebar>
        <header className="header-page">
          <div className="info-page">
            <h2 className="pageTitle">
              Categorias ({qtdCategories !== null && qtdCategories})
            </h2>
            <h3 className="pageSubTitle">Todas as categorias</h3>
          </div>

          <button onClick={handleModalCreate}>
            Criar categoria <IconPlus />
          </button>
        </header>

        <main className={styles.main_content}>
          {categories.length < 1 && (
            <div className={styles.warning_no_categories}>
              <NoCategoriesFoundCard
                handleModalCreateCategory={() => handleModalCreate()}
              />
            </div>
          )}

          <div className={styles.category_container}>
            {!loading &&
              categories.map((category: ICategory) => (
                <div className={styles.category_card} key={category.id}>
                  <section className={styles.info_category}>
                    <span>{category.name}</span>
                  </section>
                  <section className={styles.category_details}>
                    <p>{category.countProducts} produtos cadastrados</p>
                  </section>
                  <div className={styles.actions}>
                    <button>
                      <IconEyeFilled /> Visualizar
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {loading && <Loader />}

          {categories.length > 0 && (
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Próximo"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"fixed-pagination"}
              activeClassName={"active-page"}
            />
          )}
        </main>
      </LayoutWithSidebar>
      {modalCreate && (
        <CreateCategorieModal
          handleModal={() => setModalCreate(!modalCreate)}
          notifyFetchCategories={() => fetchCategories()}
        />
      )}
    </>
  );
};
