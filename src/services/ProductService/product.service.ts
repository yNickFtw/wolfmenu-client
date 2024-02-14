import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class ProductService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async create(body: FormData, token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/products/create/${unitId}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAndCountAll(token: string, unitId: string, currentPage: number, totalRows: number): Promise<IApiResponse> {
        try {
            const response = await api.get(`/products/find/all/${unitId}/${currentPage}/${totalRows}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllByCategoryId(token: string, categoryId: string, page: number, totalRows: number): Promise<IApiResponse> {
        try {
         const response = await api.get(`/products/find/all/by/categoryId/${categoryId}/${page}/${totalRows}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
         });

         return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}