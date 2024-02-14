import { create } from "zustand";
import { IUser } from "./user.state";

export interface IUnit {
    id: string;
    name: string;
    slug: string;
    cnpj: string;
    address: string;
    district: string;
    city: string;
    state: string;
    zip_code: string;
    userId: string;
    avatarImage: string;
    avatarImageFilename: string;
    user: Partial<IUser>;
}

type IUnitUseStore = {
    isUnitSelected: boolean;
    unitSelectedId: string | null;
    unitSelected: IUnit | null;
    setSelectedUnit: (unit: IUnit) => void;
    setSelectedUnitId: (unitId: string) => void;
    deleteSelectedUnit: () => void;
}

const unitUseStore = create<IUnitUseStore>((set) => ({
    isUnitSelected: !!localStorage.getItem("unitSelectedId"),
    unitSelectedId: null,
    unitSelected: null,
    setSelectedUnit: (unit: IUnit) => {
        localStorage.setItem("unitSelectedId", unit.id)
        set({ isUnitSelected: true, unitSelectedId: unit.id, unitSelected: unit });
    },
    setSelectedUnitId: (unitId: string) => {
        set({ unitSelectedId: unitId })
    },
    deleteSelectedUnit: () => {
        localStorage.removeItem("unitSelectedId");
        set({ isUnitSelected: false, unitSelected: null, unitSelectedId: null });
    }
}))

export { unitUseStore };
