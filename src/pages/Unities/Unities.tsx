import { FormEvent, useEffect, useState } from "react";
import styles from "./Unities.module.css";
import UnitService from "../../services/UnitService/unit.service";
import { toast } from "react-toastify";
import { useUserStore } from "../../states/user.state";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconEdit, IconPlus } from "@tabler/icons-react";
import CustomModal from "../../components/Modal/CustomModal";
import { IUnit, unitUseStore } from "../../states/unit.states";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { Loader2 } from "lucide-react";

export const Unities = () => {
  const [unities, setUnities] = useState<[]>([]);
  const [qtdUnities, setQtdUnities] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUnit, setUnitToSelect] = useState<IUnit>({} as IUnit);
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setSelectedUnit, unitSelected, deleteSelectedUnit } = unitUseStore();

  const { logout } = useUserStore();

  const unitService = new UnitService();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;

  async function fetchAllUnities() {
    const response = await unitService.fetchAllUnitiesOfUser(token);

    if (response.statusCode === 401) {
      toast.error(response.data.message, {
        theme: "dark",
      });
      logout();
      navigate("/login");
    }

    if (response.statusCode === 200) {
      setUnities(response.data.rows);
      setQtdUnities(response.data.count);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchAllUnities();
  }, []);

  const handleModalCreate = () => {
    setModalCreate(!modalCreate);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await unitService.create({ name, slug }, token);

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

      navigate("/login");
    }

    if (response.statusCode === 201) {
      toast.info(response.data.message, {
        theme: "dark",
      });

      await fetchAllUnities();
      setModalCreate(false);
    }

    setName("");
    setSlug("");
    setIsLoading(false);
  };

  const handleSelecteUnit = (unit: IUnit) => {
    if (selectedUnit?.id === unit.id) {
      setUnitToSelect({} as IUnit);
      deleteSelectedUnit();
      return;
    }

    setUnitToSelect(unit);
    setSelectedUnit(unit);
  };

  return (
    <>
      <LayoutWithSidebar>
        <header className={styles.header_unities}>
          <div className={styles.page_info}>
            <h2 className="pageTitle">
              Unidades {qtdUnities !== null && <>({qtdUnities})</>}
            </h2>
            <h3 className="pageSubTitle">Todas as suas unidades cadastradas</h3>
          </div>
          <button onClick={handleModalCreate}>
            Criar unidade <IconPlus />
          </button>
        </header>
        <div className={styles.alert_unit}>
          <p>
            {unitSelected === null && (
              <>Selecione uma unidade para usar a WolfMenu</>
            )}
          </p>
        </div>
        <main className={styles.main_content}>
          {unities &&
            unities.map((unit: IUnit) => (
              <section className={styles.card_unit} key={unit.id}>
                <div className={styles.info_unit}>
                  <span
                    className={`${styles.check_unit} ${
                      selectedUnit!.id === unit.id ||
                      unitSelected?.id === unit.id
                        ? styles.check_unit_selected
                        : ""
                    }`}
                    onClick={() => handleSelecteUnit(unit)}
                  >
                    <IconCheck />
                  </span>

                  {unit.avatarImage && (
                    <img
                      src={unit.avatarImage}
                      className={styles.avatar_image}
                      alt={unit.name}
                    />
                  )}
                  <div className={styles.info_text}>
                    <h3>{unit.name}</h3>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button>
                    <IconEdit />
                  </button>
                </div>
              </section>
            ))}
        </main>
      </LayoutWithSidebar>

      {modalCreate && (
        <CustomModal subject="Criar unidade" onClose={handleModalCreate}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <h3>Nome da unidade:</h3>
              <input
                type="text"
                placeholder="Digite o nome da unidade:"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.form_group}>
              <h3>URL</h3>
              <div className={styles.slug_section}>
                <h3>wolfmenu.com.br/</h3>
                <input
                  type="text"
                  placeholder="sua-unidade"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase() // Converte para minúsculas
                        .replace(/[^a-zA-Z0-9-]+/g, "-") // Remove caracteres especiais, exceto letras, números e hífens
                    )
                  }
                />
              </div>
            </div>
            <button
              className={styles.button_submit}
              disabled={!name || !slug || isLoading ? true : false}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                <>Criar unidade</>
              )}
            </button>
          </form>
        </CustomModal>
      )}
    </>
  );
};
