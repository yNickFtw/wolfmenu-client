import { ChangeEvent, FormEvent, useState } from "react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import styles from "./CreateMenu.module.css";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import { unitUseStore } from "../../states/unit.states";
import { IconBuildingStore, IconUpload } from "@tabler/icons-react";
import MenuService from "../../services/MenuService/menu.service";
import { toast } from "react-toastify";
import { useUserStore } from "../../states/user.state";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { Loader2 } from "lucide-react";

export const CreateMenu = () => {
  const [description, setDescription] = useState<string>("");
  const [bannerColor, setBannerColor] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { unitSelected, deleteSelectedUnit } = unitUseStore();
  const { logout } = useUserStore();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token") as string;

    let formData = new FormData();

    formData.append("description", description);
    formData.append("bannerColor", bannerColor);
    formData.append("file", selectedFile);

    const response = await new MenuService().create(
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

    if (response.statusCode === 201) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      navigate("/menu");
    }

    setIsLoading(false);
  };

  return (
    <>
      <PrivateWithUnit />
      <LayoutWithSidebar>
        <header className="header-page">
          <div className="info-page">
            <h2 className="pageTitle">Criar menu</h2>
            <h3 className="pageSubTitle">Adicione as informações</h3>
          </div>
        </header>

        <main className={styles.main_content}>
          <section className={styles.form_section}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.form_group}>
                <h3>Cor do banner (caso não queira colocar uma imagem):</h3>
                <p>Escolha a cor do banner</p>
                <input
                  type="color"
                  placeholder="Digite uma descrição para seu cardápio:"
                  value={bannerColor}
                  onChange={(e) => setBannerColor(e.target.value)}
                />
              </div>
              <div className={styles.form_group}>
                <h3>Banner:</h3>
                <p>Escolha a imagem do banner:</p>
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
              </div>
              <div className={styles.form_group}>
                <h3>Descrição do cardápio</h3>
                <input
                  type="text"
                  placeholder="Digite uma descrição para seu cardápio:"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                className={styles.button_submit}
                type="submit"
                disabled={isLoading}
              >
                {!isLoading && <>Criar Menu</>}
                {isLoading && (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                )}
              </button>
            </form>
          </section>

          <div className={styles.separator}></div>

          <section className={styles.preview_section}>
            <h2>Resultado:</h2>

            <section className={styles.preview_result}>
              <header className={styles.header_preview}>
                <div
                  className={styles.preview_banner}
                  style={{
                    backgroundImage: `url(${selectedFilePreview})`,
                    backgroundColor: bannerColor,
                  }}
                ></div>
                {!unitSelected?.avatarImage && (
                  <div className={styles.avatar_image_icon}>
                    <IconBuildingStore size={"4em"} />
                  </div>
                )}
              </header>
              <div className={styles.unit_info}>
                <h2>{unitSelected?.name}</h2>
                <p>{description}</p>
              </div>
            </section>
          </section>
        </main>
      </LayoutWithSidebar>
    </>
  );
};
