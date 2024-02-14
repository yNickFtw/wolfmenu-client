import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class UnitService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async create(body: {}, token: string): Promise<IApiResponse> {
        try {
            const response = await api.post('/unities/create', body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async fetchAllUnitiesOfUser(token: string): Promise<IApiResponse> {
        try {
            const response = await api.get('/unities/find/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async dashboardData(token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/unities/dashboard/infos/${unitId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async fetchUnitById(token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/unities/find/${unitId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async changeAvatarImage(formData: FormData, token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.put(`/unities/change/image/${unitId}`, formData, {
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