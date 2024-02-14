import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class MenuCategoryService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async findAllMenuCategories(token: string, menuId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/menu-categories/find/all/${menuId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async createMenuCategory(token: string, menuId: string, categoryId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/menu-categories/add/category/to/${menuId}`, { categoryId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async changePositionMenuCategory(token: string, menuCategoryId: string, menuCategoryIdToChange: string, menuId: string, arrow: string): Promise<IApiResponse> {
        try {
            const response = await api.put(`/menu-categories/change/position/${menuCategoryId}/to/${menuCategoryIdToChange}/${menuId}`, { arrow }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }
}