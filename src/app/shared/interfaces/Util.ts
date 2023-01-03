import { Custamer } from "../models/Custamer";
import { Product } from "../models/Product";
import { CustomersService } from "../services/customers.service";
import { ProductService } from "../services/products.service";
import { Injectable } from "@angular/core";
import { Item } from "../models/Item";
import { Observable } from "rxjs";

@Injectable()
export class Util{
    products: Array<Product> = [];
    customers: Array<Custamer> = [];
    constructor(private productService: ProductService, private customerService: CustomersService){}
    getPayable(taxString: any, price: string, amount: string): any{
        let tax = (this.getTaxFromStrign(taxString)/100)+1
        return this.formatNumber(((+amount)*(+price)*tax).toString());
      }
    getSumPayable(taxString: any, sumPrice: number): any{
        let tax = (this.getTaxFromStrign(taxString)/100)+1
        return this.formatNumber((sumPrice*tax).toString());
      }
    getTaxFromStrign(tax: any): number{
        switch(tax){
          case 'zero': 
            return 0;
          case 'half':
            return 13.5;
          case '0': 
              return 0;
          case '13.5':
              return 13.5;
        }
        return 27;
      }
      getTaxToString(tax: string): string{
        switch(tax){
            case '0': 
              return 'zero';
            case '13.5':
              return 'half';
          }
          return 'all';
      }
      formatNumber(number: string): string{
        let num = +number.replace(",",".");
        return ((Math.round(num * 100) / 100).toFixed(2)).toString();
    }

    endPartOfSearch(start: string){
        start = start.toUpperCase();
        let end = start.slice(0,start.length-1);
        let lastChar = start.slice(start.length-1);
        let charCode = lastChar.charCodeAt(0);
        if (charCode<89 && charCode != 57){
        charCode +=  1;
        lastChar = String.fromCharCode(charCode);
        end += lastChar;
        return end;
        }
        return '';
    }

    addItemAmountToStock(product: Product, items: Item[]){
      items.forEach(item =>{
          if(product.number == item.productNumber){
            product.stock = (+product.stock + +item.amount).toString();
          } 
        })
        return Promise.resolve('done');
    }

    takeItemAmountFromStock(product: Product, items: Item[]){
      items.forEach(item =>{
        if(product.number == item.productNumber){
          product.stock = (+product.stock - +item.amount).toString();
        } 
      })
      return Promise.resolve('done');
    }

    modifyProductsPrice(product: Product, items: Item[]){
      items.forEach(async item =>{
          if(product.number == item.productNumber){
            product.price = item.price;
            product.incomingPrice = item.incomingPrice;
            await this.productService.setProduct(product);
          }
      })
      return Promise.resolve('done');
    }
    
  
}