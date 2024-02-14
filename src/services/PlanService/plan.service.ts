import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class PlanService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async fetchAllPlans(): Promise<IApiResponse> {
        try {
            const response = await api.get('/plans/find/all')

            return { statusCode: response.status, data: response.data }
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}