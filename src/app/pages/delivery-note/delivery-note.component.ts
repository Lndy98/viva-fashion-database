import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from 'src/app/shared/interfaces/Util';
import { DeliveryNoteInterface } from 'src/app/shared/models/DeliveryNoteInterface';
import { ItemInterface } from 'src/app/shared/models/ItemInterface';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';

@Component({
  selector: 'app-delivery-note',
  templateUrl: './delivery-note.component.html',
  styleUrls: ['./delivery-note.component.scss'],
  providers: [Util]
})
export class DeliveryNoteComponent implements OnInit {

  isIncoming: boolean = false;

  isCallculated: boolean = false;
  sumAmount: number = 0;
  sumPrice: number = 0;
  products!: ItemInterface[];


  deliveryNote !: DeliveryNoteInterface;
  displayedColumns: string[] = ['productNumber','name', 'amount', 'price','brutto', 'payable'];

  constructor(private readonly activatedRoute: ActivatedRoute,private readonly router: Router, private readonly deliveryNoteService: DeliveryNotesService, public util: Util) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.getDeliveryNote(params['id']);
   });
  }

  getDeliveryNote(id: string){
    this.deliveryNoteService.getById(id).subscribe(data =>{
      if(data){
        this.deliveryNote = data;
        this.calculateSumValues();
        if(this.deliveryNote.type == 'incoming'){
          this.isIncoming = true;
        }
      }
    })
  }

  printThisPage() {
    window.print();
  }

  edit(){
    if(this.isIncoming){
      this.router.navigate(['create/incoming', this.deliveryNote.id]);
    }else{
      this.router.navigate(['create/outgoing', this.deliveryNote.id]);
    }
  }

  calculateSumValues(){
    if(!this.isCallculated){
      this.isCallculated = true;
        this.deliveryNote.products.forEach((value) => {
        this.sumAmount = this.sumAmount + (+value.amount);
        this.sumPrice = this.sumPrice + (+value.amount)*(+value.price);
      });
   }
  }


}
