import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class CategoryService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async findAndCountAll(token: string, unitId: string, page: number, totalRows: number): Promise<IApiResponse> {
        try {
            const response = await api.get(`/categories/find/all/${unitId}/${page}/${totalRows}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async create(token: string, name: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/categories/create/${unitId}`, { name }, {
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