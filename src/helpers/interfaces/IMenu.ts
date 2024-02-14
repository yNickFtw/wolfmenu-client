export interface IMenu {
    id: string;
    description: string;
    banner: string | undefined | null;
    bannerFilename: string | undefined | null;
    bannerColor: string;
    userId: string;
    unitId: string;
}