import {ProductInterface} from "../models/ProductInterface";
import {Product} from "../classes/Product";
import {v4 as uuidv4} from "uuid";

export class ProductFactory {
  static updateProductFromExcel(price: string, incomingPrice: string, stock: string, originProduct: ProductInterface): ProductInterface {
    originProduct.price = price ?? originProduct.price;
    originProduct.incomingPrice = incomingPrice ?? originProduct.incomingPrice;
    originProduct.stock = stock;
    return originProduct;
  }

  static createProduct(number: string, name: string, stock: string, unit: string, price: string, incomingPrice: string, materialComposition: any, grammWeight: string, vtsz: string, origin: string): ProductInterface {
    return new Product(
      uuidv4().toString(),
      name.toUpperCase(),
      number.toUpperCase(),
      stock,
      price,
      unit,
      incomingPrice,
      materialComposition ?? "",
      grammWeight ?? "",
      vtsz ?? "",
      origin ?? "",
    );
  }
}
