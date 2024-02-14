import { create } from "zustand";

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    phone: string;
    isVerified: boolean;
    planUser: string;
    planStatus: string;
    createdAt: Date, 
    updatedAt: Date
}

type IUserStore = {
    isLoggedIn: boolean;
    loggedUser: IUser;
    authenticate: (token: string, userId: number) => void;
    setLoggedUser: (user: IUser) => void;
    logout: () => void;
}

const useUserStore = create<IUserStore>((set) => ({
    isLoggedIn: !!localStorage.getItem("token"),
    loggedUser: {} as IUser,

    authenticate: (token: string, userId: number) => {
        localStorage.setItem("token", token),
        localStorage.setItem("userId", userId.toString())
        set({ isLoggedIn: true, })
    },

    setLoggedUser: (user: IUser) => {
        set({ loggedUser: user });
    },

    logout: () => {
        localStorage.removeItem("token"),
        localStorage.removeItem("userId")
        localStorage.removeItem("unitSelectedId")
        set({ isLoggedIn: false, })
    }
}));

export { useUserStore };