import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class MenuService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async findMenuByUnitId(token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/menu/find/${unitId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async create(formData: FormData, token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/menu/create/${unitId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async editBannerImage(formData: FormData, token: string, menuId: string): Promise<IApiResponse> {
        try {
            const response = await api.put(`/menu/change/banner/image/${menuId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async userIsOwnerOfMenu(token: string, menuId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/menu/user/is/owner/${menuId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}