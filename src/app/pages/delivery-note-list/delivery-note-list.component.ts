import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-delivery-note-list',
  templateUrl: './delivery-note-list.component.html',
  styleUrls: ['./delivery-note-list.component.scss']
})
export class DeliveryNoteListComponent implements OnInit {
  deliveryNotes:Array<DeliveryNote> = [];
  displayedColumns: string[] = ['number', 'date', 'custamer'];

  detailsForm = new FormGroup({
    productNumber: new FormControl(''),
    customer: new FormControl(''),
    date: new FormControl('')
  });

  constructor(private router: Router, private deliveryNotesService: DeliveryNotesService) { }
  ngOnInit(): void {
    this.setDeliveryNotes();
  }

  setDeliveryNotes(){
    this.deliveryNotesService.loadDeliveryNotes().subscribe((data: Array<DeliveryNote>) => {
      console.log(data);
      this.deliveryNotes = data;
    })
  }
  goToProductDetails(id: string) {
    this.router.navigate(['home/deliveryNote', id]);
  }
  search(){
    if(this.detailsForm.value.date && !this.detailsForm.value.customer && !this.detailsForm.value.productNumber){
      this.deliveryNotesService.getByDate(new Date(this.detailsForm.value.date)).subscribe(data =>{
        if(data){
          this.deliveryNotes = data;
        }
      });
    }
    if(this.detailsForm.value.productNumber){
      this.deliveryNotesService.getByProduct(this.detailsForm.value.productNumber).subscribe(data =>{
        this.deliveryNotes = data;
      })
    }
  }
}
