import styles from "./Menu.module.css";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IMenu } from "../../helpers/interfaces/IMenu";
import MenuService from "../../services/MenuService/menu.service";
import { unitUseStore } from "../../states/unit.states";
import { toast } from "react-toastify";
import { useUserStore } from "../../states/user.state";
import { Link, useNavigate } from "react-router-dom";
import emptyImage from "../../assets/empty.png";
import {
  IconAlignJustified,
  IconArrowDown,
  IconArrowUp,
  IconDots,
  IconEdit,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import storeBuildingSvg from "../../assets/storebuilding.svg";
import UnitService from "../../services/UnitService/unit.service";
import CustomModal from "../../components/Modal/CustomModal";
import { Loader2 } from "lucide-react";
import MenuCategoryService from "../../services/MenuCategoryService/menu-category.service";
import CategoryService from "../../services/CategoryService/category.service";
import { ICategory } from "../../helpers/interfaces/ICategory";
import { Loader } from "../../components/Loader/Loader";
import ReactPaginate from "react-paginate";
import ProductService from "../../services/ProductService/product.service";
import { IProduct } from "../../helpers/interfaces/IProduct";
import { NoCategoriesFoundCard } from "../../components/NoCategoriesFoundCard/NoCategoriesFoundCard";
import { CreateCategorieModal } from "../../components/CreateCategorieModal/CreateCategorieModal";
import { NoMenuCategoriesFoundCard } from "../../components/NoMenuCategoriesFoundCard/NoMenuCategoriesFoundCard";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { IconGripVertical } from "@tabler/icons-react";

interface IItemDTO {
  menu_category_id: string;
  status: boolean;
  categoryId: string;
}

interface IProductsByCategoryDTO {
  categoryId: string;
  status: boolean;
}

interface ILoaderPositionDTO extends IItemDTO {
  arrow: string; // "up" or "down"
}

interface IReorderMenuCategories {
  position: number;
  id: string;
}

export const Menu = () => {
  const [menu, setMenu] = useState<IMenu | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAvatarHovered, setIsAvatarHovered] = useState<boolean>(false);
  const [itemButtonHovered, setItemButtonHovered] = useState<IItemDTO>({
    menu_category_id: "",
    status: false,
    categoryId: "",
  });
  const [bannerColor, setBannerColor] = useState<string>("");
  const [isBannerHovered, setIsBannerHovered] = useState<boolean>(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState<boolean>(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const [modalCreateCategory, setModalCreateCategory] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<ICategory[] | []>([]);
  const [modalCategories, setModalCategories] = useState<boolean>(false);
  const [modalAddProductToMenuCategory, setModalAddProductToMenuCategory] =
    useState<IProductsByCategoryDTO>({ categoryId: "", status: false });
  const [productsCategory, setProductsCategory] = useState<any[]>([]);
  const [currentPageProducts, setCurrentPageProducts] = useState<number>(1);
  const [pageCountProducts, setPageCountProducts] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loadingProductsCategory, setLoadingProductsCategory] =
    useState<boolean>(false);
  const [modalActionsMenuCategory, setModalActionsMenuCategory] =
    useState<IItemDTO>({ menu_category_id: "", status: false, categoryId: "" });
  const [currentPageCategories, setCurrentPageCategories] = useState<number>(1);
  const [pageCountCategories, setPageCountCategories] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
  const [loaderPosition, setLoaderPosition] = useState<ILoaderPositionDTO>({
    menu_category_id: "",
    status: false,
    categoryId: "",
    arrow: "",
  });
  const [savingMenuCategories, setSavingMenuCategories] =
    useState<boolean>(false);
  const [savingMenuProducts, setSavingMenuProducts] = useState<boolean>(false);
  let totalRowsCategories = 3;
  let totalRowsProducts = 3;

  const [selectedBannerPreview, setSelectedBannerPreview] = useState<any>(null);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const { unitSelected, setSelectedUnit, unitSelectedId, deleteSelectedUnit } =
    unitUseStore();
  const { logout } = useUserStore();

  const navigate = useNavigate();
  const menuService = new MenuService();
  const unitService = new UnitService();
  const menuCategoryService = new MenuCategoryService();
  const productService = new ProductService();
  const token = localStorage.getItem("token") as string;

  const handleLogout = () => {
    toast.error("Sessão expirada, faça login novamente!", {
      theme: "dark",
    });
    logout();
    deleteSelectedUnit();
    navigate("/login");
  };

  async function fetchMenu() {
    const response = await menuService.findMenuByUnitId(
      token,
      unitSelected!.id
    );

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 401) {
      handleLogout();
    }

    if (response.statusCode === 403) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 200) {
      setMenu(response.data);
      if (response.data !== null) await fetchMenuCategories(response.data.id);

      setLoading(false);
    }
  }

  async function fetchMenuCategories(menuId: string) {
    const response = await menuCategoryService.findAllMenuCategories(
      token,
      menuId
    );

    if (response.statusCode === 401) {
      handleLogout();
    }

    if (response.statusCode === 200) {
      setMenuCategories(response.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  async function fetchUnitById() {
    const response = await unitService.fetchUnitById(token, unitSelected?.id!);

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

  async function changeBannerImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadingBanner(true);

    let formData: FormData = new FormData();

    formData.append("file", selectedFile!);
    formData.append("bannerColor", bannerColor);

    const response = await menuService.editBannerImage(
      formData,
      token,
      menu?.id!
    );

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 403) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 401) {
      handleLogout();
    }

    if (response.statusCode === 200) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      await fetchMenu();
      setSelectedFile(null);
      setSelectedBannerPreview(null);
      setModalEdit(false);
    }

    setIsLoadingBanner(false);
  }

  async function changeAvatarImageUnit(file: File) {
    setIsLoadingAvatar(true);

    let formData: FormData = new FormData();

    formData.append("file", file);

    const response = await unitService.changeAvatarImage(
      formData,
      token,
      unitSelected?.id!
    );

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 401) {
      handleLogout();
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      deleteSelectedUnit();
      navigate("/unities");
    }

    if (response.statusCode === 200) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      await fetchUnitById();
    }

    setIsLoadingAvatar(false);
  }

  const handleFileChangeBanner = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChangeAvatar = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files![0];
    if (file) {
      changeAvatarImageUnit(file);
    }
  };

  const handleModalEditBanner = () => {
    setModalEdit(!modalEdit);
  };

  async function fetchCategories() {
    const token = localStorage.getItem("token") as string;

    const response = await new CategoryService().findAndCountAll(
      token,
      unitSelectedId!,
      currentPageCategories,
      totalRowsCategories
    );

    if (response.statusCode === 200) {
      setCategories(response.data.categories);
      setPageCountCategories(
        Math.ceil(response.data.totalCount / totalRowsCategories)
      );
    }

    if (response.statusCode === 401) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      logout();
      deleteSelectedUnit();
      navigate("/login");
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [currentPageCategories]);

  const handleModalCategories = async () => {
    setLoadingCategories(true);
    setModalCategories(true);
    await fetchCategories();
    setLoadingCategories(false);
  };

  const handlePageClick = (data: any) => {
    const selectedPage = data.selected + 1;

    setCurrentPageCategories(selectedPage);
  };

  const handlePageClickProducts = (data: any) => {
    const selectedPage = data.selected + 1;

    setCurrentPageProducts(selectedPage);

    fetchProducstByCategoryId(modalAddProductToMenuCategory.categoryId);
  };

  const handleSelectCategory = (id: string) => {
    if (selectedCategory === id) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(id);
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProduct === id) {
      setSelectedProduct("");
    } else {
      setSelectedProduct(id);
    }
  };

  const handleSubmitMenuCategory = async () => {
    setSavingMenuCategories(true);

    if (!selectedCategory) {
      toast.error("Selecione uma categoria para continuar", {
        theme: "dark",
      });

      setSavingMenuCategories(false);
      return;
    }

    const response = await menuCategoryService.createMenuCategory(
      token,
      menu?.id!,
      selectedCategory
    );

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      navigate("/unities");
    }

    if (response.statusCode === 201) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      setSelectedCategory("");
      setModalCategories(false);
      fetchMenuCategories(menu?.id!);
    }

    setSavingMenuCategories(false);
  };

  const handleSubmitMenuProducts = async () => {
    setSavingMenuProducts(true);

    setSavingMenuProducts(false);
  };

  async function changePositionMenuCategory(
    arrow: string,
    menuCategoryId: string,
    index: number
  ) {
    let menuCategoryToChange: any;

    if (arrow === "up") {
      menuCategoryToChange = menuCategories[index - 1];
    }

    if (arrow === "down") {
      menuCategoryToChange = menuCategories[index + 1];
    }

    if (!menuCategoryToChange) {
      return;
    }

    if (menuCategoryToChange) {
      const response = await menuCategoryService.changePositionMenuCategory(
        token,
        menuCategoryId,
        menuCategoryToChange.id,
        menu?.id!,
        arrow
      );

      const updatedMenuCategories = [...menuCategories];

      const currentIndex = updatedMenuCategories.findIndex(
        (item) => item.id === menuCategoryId
      );

      const menuCategoryToMove = updatedMenuCategories.splice(
        currentIndex,
        1
      )[0];

      let newIndex = updatedMenuCategories.findIndex(
        (item) => item.id === menuCategoryToChange.id
      );

      if (arrow === "down") {
        newIndex++;
      }

      updatedMenuCategories.splice(newIndex, 0, menuCategoryToMove); // Insira o menuCategory na nova posição
      setMenuCategories(updatedMenuCategories);

      if (response.statusCode !== 200) {
        toast.error("Ocorreu um problema, tente novamente", {
          theme: "dark",
        });
      }
    }
  }

  const reorderList = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEndCategories = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    console.log(result);

    const items = reorderList(
      menuCategories,
      result.source.index,
      result.destination.index
    );

    setMenuCategories(items);

    let orderArrayToApi: IReorderMenuCategories[] = [];

    for (let i = 0; i < items.length; i++) {
      orderArrayToApi.push({
        id: items[i].id,
        position: i + 1,
      });
    }

    await callApiToChangePositions(orderArrayToApi);
  };

  const callApiToChangePositions = async (
    menuCategories: IReorderMenuCategories[]
  ) => {
    const response = await menuCategoryService.reorderMenuCategories(
      token,
      menuCategories,
      unitSelectedId!
    );

    if (response.statusCode !== 200) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }
  };

  async function fetchProducstByCategoryId(categoryId: string) {
    setLoadingProductsCategory(true);

    const response = await productService.findAllByCategoryId(
      token,
      categoryId,
      currentPageProducts,
      totalRowsProducts
    );

    if (response.statusCode === 401) {
      handleLogout();
    }

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      navigate("/categories");
    }

    if (response.statusCode === 200) {
      setProductsCategory(response.data.products);
      setPageCountProducts(
        Math.ceil(response.data.totalCount / totalRowsProducts)
      );
    }

    setLoadingProductsCategory(false);
  }

  const handleModalProductsByCategoryId = async (categoryId: string) => {
    setModalAddProductToMenuCategory({ categoryId: categoryId, status: true });

    await fetchProducstByCategoryId(categoryId);
  };

  const handleModalCreateCategory = () => {
    setModalCategories(!modalCategories);
    setModalCreateCategory(!modalCreateCategory);
  };

  const handleFetchCategoriesAfterCreateOne = async () => {
    await fetchCategories();
    setModalCategories(true);
  };

  function truncate(source: string, size: number): string {
    if (source.length < size) {
      return source;
    }

    let newName = source.substring(0, size) + "...";

    return newName;
  }

  return (
    <>
      <PrivateWithUnit />
      <LayoutWithSidebar>
        <header className="header-page">
          <div className="info-page">
            <h2 className="pageTitle">Cardápio</h2>
            <p className="pageSubTitle">Gerencie seu cardápio por aqui</p>
          </div>
        </header>

        <div className={styles.main_content}>
          {!loading && menu === null && (
            <div className={styles.card_empty}>
              <h3>Você ainda não criou um menu...</h3>
              <p>Crie seu menu agora mesmo</p>
              <img src={emptyImage} alt="Tudo vazio por aqui" />
              <button
                className={styles.create_button}
                onClick={() => navigate("/create/menu")}
              >
                Criar cardápio
              </button>
            </div>
          )}

          {menu !== null && (
            <header className={styles.header_menu_card}>
              <div
                className={`${styles.banner_image}`}
                style={{
                  backgroundImage: `url(${menu?.banner})`,
                  backgroundColor: menu?.bannerColor,
                }}
                onMouseEnter={() => setIsBannerHovered(true)}
                onMouseLeave={() => setIsBannerHovered(false)}
              >
                {isBannerHovered && (
                  <div
                    className={styles.upload_file_banner}
                    onClick={handleModalEditBanner}
                  >
                    <label className={styles.custom_file_input_banner}>
                      <IconEdit /> Edite o banner
                    </label>
                  </div>
                )}
              </div>
              <div className={styles.info_unit}>
                {!unitSelected?.avatarImage && (
                  <div
                    className={styles.avatar_image_icon}
                    style={{
                      backgroundImage: `url(${storeBuildingSvg})`,
                    }}
                    onMouseEnter={() => setIsAvatarHovered(true)}
                    onMouseLeave={() => setIsAvatarHovered(false)}
                  >
                    {isAvatarHovered && (
                      <div className={styles.upload_file}>
                        <label className={styles.custom_file_input}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChangeAvatar}
                          />
                          <IconUpload />
                        </label>
                      </div>
                    )}
                  </div>
                )}
                {unitSelected?.avatarImage && (
                  <div
                    className={styles.avatar_image_icon}
                    style={{
                      backgroundImage: `url(${unitSelected.avatarImage})`,
                    }}
                    onMouseEnter={() => setIsAvatarHovered(true)}
                    onMouseLeave={() => setIsAvatarHovered(false)}
                  >
                    {isAvatarHovered && (
                      <div className={styles.upload_file}>
                        <label className={styles.custom_file_input}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChangeAvatar}
                          />
                          <IconUpload />
                        </label>
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.text_unit}>
                  <h2>{unitSelected?.name}</h2>
                  <p>{truncate(menu.description, 40)}</p>
                </div>
              </div>
            </header>
          )}
          {!loading && menu && (
            <section className={styles.header_menu_categories}>
              <div className="header_info">
                <h2 className="pageTitle">Categorias</h2>
                <p className="pageSubTitle">Clique e segure para trocar as posições das categorias</p>
              </div>
              <div className={styles.header_actions}>
                <button
                  className={styles.button_create}
                  onClick={handleModalCategories}
                >
                  <span className={styles.desktop_text}>
                    Adicionar categoria
                  </span>
                  <IconPlus />
                </button>
              </div>
            </section>
          )}

          <div className={styles.container_menu_categories}>
            {menuCategories.length < 1 && (
              <div className={styles.warning_menu_categories}>
                <NoMenuCategoriesFoundCard
                  handleModalAddMenuCategory={handleModalCategories}
                />
              </div>
            )}

            <DragDropContext onDragEnd={onDragEndCategories}>
              <Droppable
                droppableId="menu_categories"
                type="list"
                direction="vertical"
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {menuCategories &&
                      menuCategories.map(
                        (menu_category: any, index: number) => (
                          <>
                            <Draggable
                              draggableId={menu_category.id}
                              index={index}
                              key={menu_category.id}
                            >
                              {(provided) => (
                                <div
                                  className={styles.menu_category_card}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <section
                                    className={styles.drag_and_drop_icon}
                                  >
                                    <IconGripVertical className={styles.icon_grab} />
                                  </section>
                                  <div
                                    className={styles.separator_actions}
                                  ></div>

                                  <div className={styles.main_menu_category}>
                                    <header
                                      className={styles.header_menu_category}
                                    >
                                      <div
                                        className={styles.menu_category_info}
                                      >
                                        <h2>{menu_category.category.name}</h2>

                                        <h4>
                                          {menu_category.menuProductsCount ===
                                          0 ? (
                                            "Categoria vazia"
                                          ) : (
                                            <>
                                              {menu_category.menuProductsCount}{" "}
                                              produtos
                                            </>
                                          )}
                                        </h4>
                                      </div>

                                      <IconDots
                                        className={styles.button_dots}
                                        onClick={() =>
                                          setModalActionsMenuCategory({
                                            menu_category_id: menu_category.id,
                                            status: true,
                                            categoryId:
                                              menu_category.categoryId,
                                          })
                                        }
                                      />
                                    </header>

                                    <div className={styles.separator}></div>

                                    <div
                                      className={styles.actions_menu_category}
                                    >
                                      <button
                                        onMouseEnter={() =>
                                          setItemButtonHovered({
                                            menu_category_id: menu_category.id,
                                            status: true,
                                            categoryId: "",
                                          })
                                        }
                                        onMouseLeave={() =>
                                          setItemButtonHovered({
                                            menu_category_id: "",
                                            status: false,
                                            categoryId: "",
                                          })
                                        }
                                        onClick={() =>
                                          handleModalProductsByCategoryId(
                                            menu_category.categoryId
                                          )
                                        }
                                      >
                                        <IconPlus
                                          className="transition-icon"
                                          color={
                                            itemButtonHovered.menu_category_id ===
                                            menu_category.id
                                              ? "#fff"
                                              : "#dc143c"
                                          }
                                        />{" "}
                                        Adicionar item
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          </>
                        )
                      )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </LayoutWithSidebar>

      {modalActionsMenuCategory.status && (
        <CustomModal
          subject="Ações"
          onClose={() =>
            setModalActionsMenuCategory({
              menu_category_id: "",
              status: false,
              categoryId: "",
            })
          }
        >
          <section className={styles.container_actions}>
            <button>Editar</button>

            <button
              onClick={() =>
                handleModalProductsByCategoryId(
                  modalActionsMenuCategory.categoryId
                )
              }
            >
              Ver produtos
            </button>
          </section>
        </CustomModal>
      )}

      {modalAddProductToMenuCategory.status && (
        <CustomModal
          subject="Produtos"
          onClose={() =>
            setModalAddProductToMenuCategory({ categoryId: "", status: false })
          }
        >
          <h3>Escolha um item para adicionar: </h3>

          {loadingProductsCategory && <Loader />}

          <div className={styles.container_categories}>
            {!loadingProductsCategory &&
              productsCategory &&
              productsCategory.map((product: IProduct) => (
                <div
                  className={`${styles.category_card} ${
                    selectedProduct === product.id && styles.active_category
                  }`}
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                >
                  <h3>{product.name}</h3>
                </div>
              ))}
            {!loadingProductsCategory && productsCategory.length < 1 && (
              <p className={styles.zinc_h3}>
                Esta categoria não tem nenhum produto cadastrado
              </p>
            )}
          </div>
          {productsCategory.length > 0 && (
            <div style={{ marginTop: "2em" }}>
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Próximo"}
                breakLabel={"..."}
                pageCount={pageCountProducts}
                marginPagesDisplayed={3}
                pageRangeDisplayed={3}
                onPageChange={handlePageClickProducts}
                containerClassName={"pagination-create-product"}
                activeClassName={"active-page"}
              />
            </div>
          )}
          <div className={styles.actions_categories}>
            <button
              disabled={savingMenuCategories}
              onClick={handleSubmitMenuProducts}
            >
              Adicionar
            </button>
          </div>
        </CustomModal>
      )}

      {modalCategories && (
        <CustomModal
          subject="Categorias"
          onClose={() => setModalCategories(false)}
        >
          <h3>Escolha uma categoria para adicionar: </h3>

          {loadingCategories && <Loader />}

          <div className={styles.container_categories}>
            {!loadingCategories &&
              categories &&
              categories.map((category: ICategory) => (
                <div
                  className={`${styles.category_card} ${
                    selectedCategory === category.id && styles.active_category
                  }`}
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                >
                  <h3>{category.name}</h3>
                </div>
              ))}
          </div>

          {categories.length < 1 && (
            <NoCategoriesFoundCard
              handleModalCreateCategory={() => handleModalCreateCategory()}
            />
          )}

          <div style={{ marginTop: "2em" }}>
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Próximo"}
              breakLabel={"..."}
              pageCount={pageCountCategories}
              marginPagesDisplayed={3}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination-create-product"}
              activeClassName={"active-page"}
            />
          </div>

          <div className={styles.actions_categories}>
            <button
              disabled={savingMenuCategories}
              onClick={handleSubmitMenuCategory}
            >
              Adicionar
            </button>
          </div>
        </CustomModal>
      )}

      {modalCreateCategory && (
        <CreateCategorieModal
          handleModal={() => setModalCreateCategory(!modalCreateCategory)}
          notifyFetchCategories={() => handleFetchCategoriesAfterCreateOne()}
        />
      )}

      {modalEdit && (
        <CustomModal subject="Editar o banner" onClose={handleModalEditBanner}>
          <form
            onSubmit={changeBannerImage}
            className={styles.container_form_edit}
          >
            <h3>Image do banner</h3>
            <div className={styles.upload_file_banner_edit}>
              <label className={styles.custom_file_input_edit}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeBanner}
                />
                <IconUpload />
              </label>
            </div>
            {selectedBannerPreview !== null && (
              <div
                className={styles.banner_preview}
                style={{ backgroundImage: `url(${selectedBannerPreview})` }}
              ></div>
            )}
            <div className={styles.form_group}>
              <h3>Cor do banner</h3>
              <input
                type="color"
                value={bannerColor ? bannerColor : menu?.bannerColor}
                onChange={(e) => setBannerColor(e.target.value)}
              />
            </div>
            <button disabled={isLoadingBanner} className={styles.button_submit}>
              {isLoadingBanner && <Loader2 className="animate-spin" />}
              {!isLoadingBanner && <>Editar menu</>}
            </button>
          </form>
        </CustomModal>
      )}
    </>
  );
};
