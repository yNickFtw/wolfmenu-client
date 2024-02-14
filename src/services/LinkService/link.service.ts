import { api } from "../../api";
import { IApiResponse } from "../../helpers/interfaces/IApiResponse";
import AppError from "../../helpers/AppError";
import { ILink } from "../../helpers/interfaces/ILink";

export default class LinkService extends AppError {
    appError: AppError

    constructor() {
        super()
        this.appError = new AppError()
    }

    public async create(link: Partial<ILink>, unitId: string, token: string): Promise<IApiResponse> {
        try {
            const response = await api.post(`/links/create/${unitId}`, link, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data }
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async findAllLinksByUnitId(token: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.get(`/links/find/all/${unitId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async updatePositions(token: string, unitId: string, links: any[]): Promise<IApiResponse> {
        try {
            const response = await api.put(`/links/update/positions/${unitId}`, links, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return { statusCode: response.status, data: response.data };
        } catch (error: any) {
            return this.appError.handleErrorResponse(error);
        }
    }

    public async deleteLink(token: string, linkId: string, unitId: string): Promise<IApiResponse> {
        try {
            const response = await api.delete(`/links/delete/${linkId}/${unitId}`, {
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