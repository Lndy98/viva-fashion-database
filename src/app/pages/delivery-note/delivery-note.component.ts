import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';
import { Item } from 'src/app/shared/models/Item';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';

@Component({
  selector: 'app-delivery-note',
  templateUrl: './delivery-note.component.html',
  styleUrls: ['./delivery-note.component.scss']
})
export class DeliveryNoteComponent implements OnInit {

  isCallculated: boolean = false;
  sumAmount: number = 0;
  sumPrice: number = 0;
  products!: Item[];

  deliveryNote !: DeliveryNote;
  displayedColumns: string[] = ['productNumber', 'amount', 'price', 'payable'];

  constructor(private route: ActivatedRoute, private deliveryNoteService: DeliveryNotesService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getDeliveryNote(params['id']);
   });
  }

  getDeliveryNote(id: string){
    this.deliveryNoteService.getById(id).subscribe(data =>{
      if(data){
        this.deliveryNote = data;
      }
      this.calculateSumValues();
    })
  }

  printThisPage() {
    window.print();
  }
  getTax() : number{
    switch(this.deliveryNote.tax){
      case 'zero': 
        return 0;
      case 'half':
        return 13.5;
    }
    return 27;
  
  }
  getPayable(price: string, amount: string): any{
    let tax = (this.getTax()/100)+1
    return this.formatNumber((+amount)*(+price)*tax);
  }
  getSumPayable(): any{
    let tax = (this.getTax()/100)+1
    return this.formatNumber(this.sumPrice*tax);
  }
  formatNumber(number: number): string{
    return ((Math.round(number * 100) / 100).toFixed(2)).toString();
  }
  calculateSumValues(){
    if(!this.isCallculated){
      this.isCallculated = true;
        this.deliveryNote.products.forEach((value, key) => {
        this.sumAmount = this.sumAmount + (+value.amount);
        this.sumPrice = this.sumPrice + (+value.amount)*(+value.price);
      });
   }
  }

}
