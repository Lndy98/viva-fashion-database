import { Product } from "../models/Product";
import {Item} from "../classes/Item";

export class ItemFactory {
  static createProductItem(num: string, product: Product): Item{
    return new Item(
      num,
      product.number,
      product.name ?? "", // Ha null vagy undefined, akkor üres string
      product.stock ?? "0",
      product.price ?? "",
      product.incomingPrice ?? ""
    );
  }
}
