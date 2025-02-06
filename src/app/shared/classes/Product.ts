import {ProductInterface} from "../models/ProductInterface";
import {v4 as uuidv4} from "uuid";

export class Product implements ProductInterface{
  constructor(
    public id:string =  uuidv4(),
    public name: string,
    public number: string,
    public stock: string = "0",
    public price: string = "",
    public unit: string = "",
    public productNumber: string= "",
    public materialComposition: string ="",
    public origin: string ="",
    public vtsz: string="",
    public incomingPrice: string ="",
    public grammWeight: string =""
  ) {
  }
}
