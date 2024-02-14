export interface IPlan {
    id: string;
    name: string;
    price: string;
    stripeId: string;
    quantityLimitUnities: number;
    quantityLimitCategory: number;
    quantityLimitProduct: number;
    quantityLimitLinks: number;
    createdAt: Date;
    updatedAt: Date;
  }