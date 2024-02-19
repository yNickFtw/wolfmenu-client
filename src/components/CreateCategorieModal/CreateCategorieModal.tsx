import { FormEvent, useState } from "react";
import CustomModal from "../Modal/CustomModal";
import styles from "./CreateCategorieModal.module.css";
import CategoryService from "../../services/CategoryService/category.service";
import { unitUseStore } from "../../states/unit.states";
import { toast } from "react-toastify";
import { useUserStore } from "../../states/user.state";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { WolfButton } from "../WolfButton/WolfButton";
import { WolfInput } from "../WolfInput/WolfInput";

interface IProps {
  handleModal(): void;
  notifyFetchCategories(): void;
}

export const CreateCategorieModal = ({
  handleModal,
  notifyFetchCategories,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const { unitSelectedId, deleteSelectedUnit } = unitUseStore();

  const { logout } = useUserStore();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token") as string;

    const response = await new CategoryService().create(
      token,
      name,
      unitSelectedId!
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

    if (response.statusCode === 404) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    if (response.statusCode === 201) {
      toast.success(response.data.message, {
        theme: "dark",
      });

      setName("");
      handleModal();
      notifyFetchCategories();
    }

    setIsLoading(false);
  };

  return (
    <CustomModal subject="Criar categoria" onClose={handleModal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <h3>Nome da categoria:</h3>
          <WolfInput
            type="text"
            placeholder="Digite o nome da categoria:"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <WolfButton
          disabled={!name || isLoading ? true : false}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
            </>
          ) : (
            <>Criar categoria</>
          )}
        </WolfButton>
      </form>
    </CustomModal>
  );
};
