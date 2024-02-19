import { ChangeEvent, useEffect, useState } from "react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import styles from "./CreateProduct.module.css";
import { unitUseStore } from "../../states/unit.states";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import { IconArrowBackUp, IconPlus, IconUpload } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../helpers/interfaces/ICategory";
import CategoryService from "../../services/CategoryService/category.service";
import { useUserStore } from "../../states/user.state";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ProductService from "../../services/ProductService/product.service";
import { Loader2 } from "lucide-react";
import { CreateCategorieModal } from "../../components/CreateCategorieModal/CreateCategorieModal";
import { NoCategoriesFoundCard } from "../../components/NoCategoriesFoundCard/NoCategoriesFoundCard";

export const CreateProduct = () => {
  const [step, setStep] = useState<number>(1);
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [selectedFilePreview, setSelectedFilePreview] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [categories, setCategories] = useState<ICategory[] | []>([]);
  const [qtdCategories, setQtdCategories] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { unitSelectedId, deleteSelectedUnit } = unitUseStore();
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const { logout } = useUserStore();

  const categoryService = new CategoryService();
  const productService = new ProductService();

  const navigate = useNavigate();
  let totalRows = 3;

  async function fetchCategories() {
    const token = localStorage.getItem("token") as string;
    setLoading(true);

    const response = await categoryService.findAndCountAll(
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

    if(modalCreate) {
      setModalCreate(false);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const previousStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token") as string;
    setIsLoading(true);

    let formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("categoryId", categorySelected);
    formData.append("file", selectedFile);

    const response = await productService.create(
      formData,
      token,
      unitSelectedId!
    );

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      setIsLoading(false);
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });

      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 401) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      logout();
      deleteSelectedUnit();
      navigate("/login");
    }

    if (response.statusCode === 201) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      navigate("/products");
    }

    setIsLoading(false);
  };

  const handlePageClick = (data: any) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const handleSelecteCategory = (categoryId: string): void => {
    if (categorySelected === categoryId) {
      setCategorySelected("");
      return;
    }

    setCategorySelected(categoryId);
  };

  const formatPrice = (inputValue: string) => {
    // Remove caracteres não numéricos
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    // Converte para número
    const floatValue = parseFloat(numericValue);

    // Formata para milhares separados por ponto e duas casas decimais
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(floatValue / 100);

    return formattedValue;
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const formattedValue = formatPrice(inputValue);

    setPrice(formattedValue);
  };

  return (
    <>
      <LayoutWithSidebar>
        <PrivateWithUnit />

        <header className="header-page">
          <div className="info-page">
            <h4
              onClick={() => navigate("/products")}
              style={{
                display: "flex",
                alignItems: "center",
                color: "crimson",
                cursor: "pointer",
              }}
            >
              <IconArrowBackUp color="crimson" /> Voltar
            </h4>
            <h2 className="pageTitle">Criar produto</h2>
          </div>
        </header>

        <section className={styles.main_content}>
          {step == 1 && (
            <div
              className={`${styles.step} ${
                step === 1 ? styles.fadeIn : styles.fadeOut
              }`}
            >
              <div className={styles.header_step}>
                <div
                  className={`${styles.step_info} ${
                    step === 1 && styles.step_active
                  }`}
                >
                  1
                </div>
                <div className={styles.line_step}></div>
                <div className={styles.step_info} onClick={() => setStep(2)}>
                  2
                </div>
                <div className={styles.line_step}></div>
                <div className={styles.step_info} onClick={() => setStep(3)}>
                  3
                </div>
              </div>
              <div className={styles.to_do_section}>
                <h3>Adicione informações sobre o produto:</h3>
              </div>

              <section className={styles.form}>
                <div className={styles.form_group}>
                  <h3>Nome do produto:</h3>
                  <input
                    type="text"
                    placeholder="Digite o nome do produto:"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <h3>Descrição do produto:</h3>
                  <input
                    type="text"
                    placeholder="Digite a descrição do produto:"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className={styles.form_group}>
                  <h3>Preço do produto:</h3>
                  <input
                    type="text"
                    placeholder="Digite o preço do produto:"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </div>
                <div className={styles.actions}>
                  <button onClick={nextStep} className={styles.next_button}>
                    Proximo
                  </button>
                </div>
              </section>
            </div>
          )}

          {step == 2 && (
            <div
              className={`${styles.step} ${
                step === 2 ? styles.fadeIn : styles.fadeOut
              }`}
            >
              <div className={styles.header_step}>
                <div
                  className={`${styles.step_info}`}
                  onClick={() => setStep(1)}
                >
                  1
                </div>
                <div className={styles.line_step}></div>
                <div
                  className={`${styles.step_info} ${
                    step === 2 && styles.step_active
                  }`}
                  onClick={() => setStep(2)}
                >
                  2
                </div>
                <div className={styles.line_step}></div>
                <div className={styles.step_info} onClick={() => setStep(3)}>
                  3
                </div>
              </div>
              <div className={styles.to_do_section}>
                <h3>Adicione uma imagem ao produto:</h3>

                <div className={styles.upload_file}>
                  <label className={styles.custom_file_input}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <IconUpload />
                    Escolha uma imagem
                  </label>
                </div>

                {selectedFilePreview && (
                  <div className={styles.preview_image_section}>
                    <img
                      src={selectedFilePreview}
                      alt="Preview"
                      className={styles.preview_image}
                    />
                  </div>
                )}
              </div>

              <section className={styles.form}>
                <div className={styles.actions}>
                  <button
                    onClick={previousStep}
                    className={styles.previous_button}
                  >
                    Anterior
                  </button>
                  <button onClick={nextStep} className={styles.next_button}>
                    Proximo
                  </button>
                </div>
              </section>
            </div>
          )}

          {step === 3 && (
            <div
              className={`${styles.step} ${
                step === 3 ? styles.fadeIn : styles.fadeOut
              }`}
            >
              <div className={styles.header_step}>
                <div
                  className={`${styles.step_info}`}
                  onClick={() => setStep(1)}
                >
                  1
                </div>
                <div className={styles.line_step}></div>
                <div
                  className={`${styles.step_info}`}
                  onClick={() => setStep(2)}
                >
                  2
                </div>
                <div className={styles.line_step}></div>
                <div
                  className={`${styles.step_info} ${
                    step === 3 && styles.step_active
                  }`}
                >
                  3
                </div>
              </div>
              {categories.length > 0 && (
                <div className={styles.to_do_section}>
                  <h3>Selecione a categoria deste produto:</h3>
                </div>
              )}

              <div className={styles.container_categories}>
                {categories.length < 1 && (
                  <NoCategoriesFoundCard handleModalCreateCategory={() => setModalCreate(!modalCreate)} />
                )}

                {categories &&
                  categories.map((category: ICategory) => (
                    <div
                      className={`${styles.category_card} ${
                        categorySelected === category.id &&
                        styles.active_category
                      }`}
                      key={category.id}
                      onClick={() => handleSelecteCategory(category.id)}
                    >
                      <h3>{category.name}</h3>
                    </div>
                  ))}
              </div>

              <div style={{ marginTop: "2em" }}>
                {categories.length > 0 && (
                  <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Próximo"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={3}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination-create-product"}
                    activeClassName={"active-page"}
                  />
                )}
              </div>

              <section className={styles.form}>
                <div className={styles.actions}>
                  <button
                    onClick={previousStep}
                    className={styles.previous_button}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={styles.next_button}
                    disabled={isLoading}
                  >
                    {!isLoading && <>Cadastrar</>}
                    {isLoading && (
                      <>
                        <Loader2 className="animate-spin" />
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          )}
        </section>
      </LayoutWithSidebar>

      {modalCreate && (
        <CreateCategorieModal handleModal={() => setModalCreate(!modalCreate)} notifyFetchCategories={() => fetchCategories()} />
      )}

    </>
  );
};
