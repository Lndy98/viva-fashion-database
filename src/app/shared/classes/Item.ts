import {ItemInterface} from "../models/ItemInterface";

export class Item implements ItemInterface {
  constructor(
    public number: string,
    public productNumber: string,
    public productName: string = "",
    public amount: string = "",
    public price: string = "",
    public incomingPrice: string = ""
  ) {}

  // Ide jöhetnek további metódusok a logikai kezeléshez
}
