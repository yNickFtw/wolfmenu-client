import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class DashboardService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async getDashboardInfo(token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/dashboard/get/info/${unitId}`, {
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