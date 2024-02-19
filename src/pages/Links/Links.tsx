import { IconDotsVertical, IconPlus, IconTrash } from "@tabler/icons-react";
import LayoutWithSidebar from "../../components/LayoutWithSidebar/LayoutWithSidebar";
import { PrivateWithUnit } from "../../components/PrivateWithUnit/PrivateWithUnit";
import styles from "./Links.module.css";
import LinkService from "../../services/LinkService/link.service";
import { FormEvent, useEffect, useState } from "react";
import { unitUseStore } from "../../states/unit.states";
import { ILink } from "../../helpers/interfaces/ILink";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/Modal/CustomModal";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { WolfInput } from "../../components/WolfInput/WolfInput";
import { WolfButton } from "../../components/WolfButton/WolfButton";

export const Links = () => {
  const { unitSelectedId, deleteSelectedUnit } = unitUseStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [modalActions, setModalActions] = useState<boolean>(false);
  const [selectedLink, setSelectedLink] = useState<ILink | null>(null);
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [links, setLinks] = useState<ILink[] | []>([]);

  const linkService = new LinkService();

  const token = localStorage.getItem("token") as string;

  const navigate = useNavigate();

  async function fetchLinks(): Promise<void> {
    const response = await linkService.findAllLinksByUnitId(
      token,
      unitSelectedId!
    );

    if (response.statusCode === 200) {
      setLinks(response.data);
    }

    if (response.statusCode === 403 || response.statusCode === 404) {
      navigate("/unities");
      deleteSelectedUnit();
    }
  }

  useEffect(() => {
    fetchLinks();
  }, [unitSelectedId]);

  const handleModalActions = (link: ILink) => {
    setSelectedLink(link);
    setModalActions(true);
  };

  const handleCloseModalActions = () => {
    setModalActions(false);
    setSelectedLink(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title,
      url,
    };

    const response = await linkService.create(data, unitSelectedId!, token);

    if (response.statusCode === 201) {
      toast.success(response.data.message, {
        theme: "dark",
      });
      await fetchLinks();
      setModalCreate(false);
      resetForm();
    }

    if (response.statusCode === 400) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }

    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
  };

  const reorderList = (list: ILink[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = reorderList(
      links,
      result.source.index,
      result.destination.index
    );

    setLinks(items);

    let orderArrayToApi = [];

    for (let i = 0; i < items.length; i++) {
      orderArrayToApi.push({
        id: items[i].id,
        position: i + 1,
      });
    }

    await callApiToChangePositions(orderArrayToApi);
  };

  const callApiToChangePositions = async (links: any[]) => {
    const response = await linkService.updatePositions(
      token,
      unitSelectedId!,
      links
    );

    if (response.statusCode !== 200) {
      toast.error(response.data.message, {
        theme: "dark",
      });
    }
  };

  return (
    <>
      <PrivateWithUnit />
      <LayoutWithSidebar>
        <header className="header-page">
          <div className="info_page">
            <h2 className="pageTitle">Links</h2>
            <p className="pageSubTitle">
              Gerencie todos os seus links por aqui
            </p>
          </div>

          <button onClick={() => setModalCreate(true)}>
            Criar Link <IconPlus />
          </button>
        </header>

        <div className={styles.main_content}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="links" type="list" direction="vertical">
              {(provided) => (
                <div
                  className={styles.container_links}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {links.map((link: ILink, index) => (
                    <Draggable
                      draggableId={link.id}
                      index={index}
                      key={link.id}
                    >
                      {(provided) => (
                        <div
                          className={styles.link_card}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <div className="info_link">
                            <h3>{link.title}</h3>
                          </div>

                          <div className={styles.actions_link}>
                            <IconDotsVertical
                              className={styles.icon_dots}
                              onClick={() => setModalActions(true)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </LayoutWithSidebar>

      {modalCreate && (
        <CustomModal
          subject="Adicionar link"
          onClose={() => setModalCreate(false)}
        >
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.form_group}>
              <h3>Título do link:</h3>
              <WolfInput
                type="text"
                placeholder="Título do link:"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.form_group}>
              <h3>URL:</h3>
              <WolfInput
                type="text"
                placeholder="Exemplo: https://instagram.com/nomedorestaurante"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <WolfButton disabled={loading}>
              {!loading && <>Criar link</>}
              {loading && <Loader2 className="animate-spin" />}
            </WolfButton>
          </form>
        </CustomModal>
      )}

      {modalActions && (
        <CustomModal subject="Ações" onClose={() => setModalActions(false)}>
          <div className={styles.container_modal_actions}>
            <button>
              Deletar <IconTrash />
            </button>
          </div>
        </CustomModal>
      )}
    </>
  );
};
