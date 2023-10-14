import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Custamer } from 'src/app/shared/models/Custamer';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';
import { Product } from 'src/app/shared/models/Product';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { ProductService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-db-loader',
  templateUrl: './db-loader.component.html',
  styleUrls: ['./db-loader.component.scss']
})
export class DbLoaderComponent implements OnInit {

  products: Product[] =[];
  productsLength: number = this.products.length;
  custamers: Custamer[] = [];
  custamersLength: number = this.custamers.length;

  elementCounter: number = 0;
  successCounter: number = 0;
  unSuccessCounter: number = 0;

  deliverNotes: DeliveryNote[] = [];

  constructor( private productService: ProductService, private customerService: CustomersService, private deliveryNoteService: DeliveryNotesService) { }

  ngOnInit(): void {
  }

  getProduct(){

  }

  loadProducts(){
    console.log("Loading has started!")
    this.products.forEach((product, index) =>{
      this.productService.create(product).then(_=>{
        this.productsLength -= 1;
        console.log(this.productsLength);
      })
    });
  }
  loadCustomer(){
    console.log("Loading has started!")
    this.custamers.forEach((custamer, index) =>{
      this.customerService.create(custamer).then(_=>{
        this.custamersLength -= 1;
        console.log(this.custamersLength);
      })
    });
  }

  getStatus(){
    const isCorrectDate = (date: Date | string): boolean => {
      return isFinite(+(date instanceof Date ? date : new Date(date)));
    };
    console.log("A migráció megkezdősik!");
    console.log("Adatbetöltés...");
    this.elementCounter = 0;
    this.successCounter = 0;
    this.unSuccessCounter = 0;
    
    this.deliveryNoteService.loadDeliveryNotes().subscribe(data=>{
      if(data){
        
        data.forEach(deliveryNote=>{
          
            let datum = new Date(deliveryNote.date.toString());
            if(isCorrectDate(datum)){
                
                deliveryNote.date = Timestamp.fromDate(datum);
                this.deliverNotes.push(deliveryNote);
                
                this.unSuccessCounter +=1;
            } else {
              this.successCounter +=1;
            }        
            
            this.elementCounter += 1;
          
        })
      }
    })
    
  }

  loadDeliveryNotes(){
    console.log("Loading has started!")
    this.deliverNotes.forEach((deliverNote, index) =>{
      this.deliveryNoteService.create(deliverNote).then(_=>{
        this.unSuccessCounter -= 1;
      })
    });
  }

  modifyThatDelivaryNotes(){
    let datum  = Timestamp.fromDate(new Date);
    console.log("modification is started!");
    this.deliveryNoteService.getById("2ffbe3b8-df42-434b-851a-5c3164587d13").subscribe(data=>{
      if(data){
        let date = new Date(2023, 9, 10);
        data.date = Timestamp.fromDate(date);
        this.deliveryNoteService.create(data);
      }
    })
    
    console.log("modification is ended!");
  }

  checkDateIsEqualTest(){
        let date = Timestamp.fromDate(new Date(2023, 9, 12));

        console.log("Kézzel megadva: "+date);
        console.log("DB-ben szereplő: " + Timestamp.fromDate(new Date(new Date().toDateString())));

        console.log(date.isEqual( Timestamp.fromDate(new Date(new Date().toDateString()))));
    
  }


}
