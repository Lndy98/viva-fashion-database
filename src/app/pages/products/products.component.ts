import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/Product';
import { Unit } from "../../shared/models/Unit";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public Unit = Unit;

  poduct1: Product={
    number: "c03-111",
    name: "fehér vászon",
    price:"1200",
    stock:"100",
    unit: Unit.meter,
    materialComposition: "100% pamut"
  }
  poduct2: Product={
    number: "c03-105",
    name: "drapp vászon",
    price:"1200",
    stock:"50",
    unit: Unit.meter,
    materialComposition: "70% pamut, 15% valami, és még 15% ki tudja micsoda"
  }
  products:Array<Product> = [this.poduct1,this.poduct2];
  productsDisplayedColumns: string[] = ['number', 'name', 'materialComposition', 'stock', 'unit', 'price'];

  constructor() { }

  ngOnInit(): void {
  }

}
