import {
  IconCaretLeft,
  IconCaretRight,
  IconEdit,
  IconEyeFilled,
  IconPlus,
  IconVersions,
} from "@tabler/icons-react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import styles from "./Products.module.css";
import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService/product.service";
import { unitUseStore } from "../../states/unit.states";
import { IProduct } from "../../helpers/interfaces/IProduct";
import { Loader } from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [qtdProducts, setQtdProducts] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { unitSelectedId } = unitUseStore();

  const navigate = useNavigate();

  let totalRows = 10;

  async function fetchProducts() {
    const token = localStorage.getItem("token") as string;
    setLoading(true);

    const response = await new ProductService().findAndCountAll(
      token,
      unitSelectedId!,
      currentPage,
      totalRows
    );

    if (response.statusCode === 200) {
      setProducts(response.data.products);
      setPageCount(Math.ceil(response.data.totalCount / totalRows));
      setQtdProducts(response.data.totalCount);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

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
            <h2 className="pageTitle">Produtos</h2>
            <h3 className="pageSubTitle">Todos os produtos cadastrados</h3>
          </div>

          <button onClick={() => navigate("/create/product")}>
            Criar produto <IconPlus />
          </button>
        </header>

        <section className={styles.main_content}>
          {!loading &&
            products &&
            products.map((product: IProduct) => (
              <div className={styles.product_card}>
                <div
                  className={styles.product_image}
                  style={{ backgroundImage: `url(${product.productImage})` }}
                ></div>
                <div className={styles.side_area}>
                  <div className={styles.info_product}>
                    <h3>{product.name}</h3>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.edit_product_button}>
                      <IconEyeFilled /> Visualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {loading && <Loader />}

          {products.length > 0 && (
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
        </section>
      </LayoutWithSidebar>
    </>
  );
};
