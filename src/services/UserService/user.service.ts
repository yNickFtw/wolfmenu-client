import { api } from "../../api";
import AppError from "../../helpers/AppError";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";

export default class UserService extends AppError {
    private appError: AppError

    constructor() {
        super()
        this.appError = new AppError();
    }

    public async login(body: {}): Promise<IApiResponse> {
        try {
            const response = await api.post('/users/authenticate', body)

            return { statusCode: response.status, data: response.data } as IApiResponse
        } catch (error: any) {
            return this.appError.handleErrorResponse(error)
        }
    }

    public async register(body: {}): Promise<IApiResponse> {
        try {
            const response = await api.post('/users/create', body)

            return { statusCode: response.status, data: response.data } as IApiResponse;
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async fetchLoggedUser(token: string): Promise<IApiResponse> {
        try {
            const response = await api.get('/users/fetch/logged/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data } as IApiResponse;
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async verifyUserEmail(token: string): Promise<IApiResponse> {
        try {
            const response = await api.put(`/users/verify/email/${token}`, null)

            return { statusCode: response.status, data: response.data } as IApiResponse;
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

}