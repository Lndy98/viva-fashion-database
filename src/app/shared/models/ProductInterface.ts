export interface ProductInterface {
    id: string;
    number: string;
    name: string;
    stock: string;
    unit: string;
    price: string;  //brutto
    materialComposition: string;
    grammWeight: string;
    origin: string;
    vtsz: string;
    incomingPrice: string;
}
export type ProductKeys = keyof ProductInterface;
