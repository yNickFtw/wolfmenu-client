import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class StripeService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async createSession(token: string, planId: string): Promise<IApiResponse> {
        try {
            const response = await api.post('/stripe/create/session/checkout', { planId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data }
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}