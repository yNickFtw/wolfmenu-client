import { useEffect } from "react";
import { unitUseStore } from "../../states/unit.states";
import { useNavigate } from "react-router-dom";

export const PrivateWithUnit = () => {
  const { setSelectedUnit, setSelectedUnitId, unitSelected, unitSelectedId } = unitUseStore();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUnitId = localStorage.getItem("unitSelectedId") ?? null;

    if (!storedUnitId || unitSelected === null) {
      navigate("/unities");
    }

    if (!unitSelectedId) {
      setSelectedUnitId(storedUnitId!);
    }
  }, []);

  return <></>;
};
