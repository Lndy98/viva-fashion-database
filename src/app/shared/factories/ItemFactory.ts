import { ProductInterface } from "../models/ProductInterface";
import {Item} from "../classes/Item";

export class ItemFactory {
  static createProductItem(num: string, product: ProductInterface, amount: string): Item{
    return new Item(
      num,
      product.number,
      product.name ?? "", // Ha null vagy undefined, akkor üres string
      amount ?? "0",
      product.price ?? "",
      product.incomingPrice ?? ""
    );
  }
}
