import {ProductInterface} from "../models/ProductInterface";

export class ProductFactory {
  static updateProductFromExcel(price: string, incomingPrice: string, stock: string, originProduct: ProductInterface): ProductInterface {
    originProduct.price = price ?? originProduct.price;
    originProduct.incomingPrice = incomingPrice ?? originProduct.incomingPrice;
    originProduct.stock = stock;
    return originProduct;
  }
}
