import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {FormControl, FormGroup} from '@angular/forms'
import {Product, ProductKeys} from 'src/app/shared/models/Product';
import {ProductService} from 'src/app/shared/services/products.service';
import {ItemInterface} from 'src/app/shared/models/ItemInterface';
import {MatTable} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';

import {DeliveryNote} from 'src/app/shared/models/DeliveryNote';
import {DeliveryNotesService} from 'src/app/shared/services/delivery-notes.service';
import {Custamer} from 'src/app/shared/models/Custamer';
import {Util} from 'src/app/shared/interfaces/Util';


import {v4 as uuidv4} from 'uuid';
import {Timestamp} from '@firebase/firestore';
import {LocalStorageServiceService} from 'src/app/shared/services/local-storage-service.service';
import {FileReaderUtil} from 'src/app/shared/interfaces/FileReader';
import {ItemFactory} from "../../shared/factories/ItemFactory";

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss'],
  providers: [Util, FileReaderUtil]
})
export class IncomingComponent implements OnInit {
  @ViewChild(MatTable) table !: MatTable<ItemInterface>;

  //TODO: itemNumber elvileg már nem kell
  itemNumber: number = 1;

  isNew: boolean = false;

  products !: Array<Product>;
  customers !: Array<Custamer>;
  filteredProducts !: Observable<Product[]>;
  filteredCustomer !: Observable<Custamer[]>;

  items: ItemInterface[] = []
  datasource: [ItemInterface, boolean][] = [];

  incomingProduct: Array<Product> = [];
  displayedColumns: string[] = ['number', 'amount', 'incomingPrice', 'price', 'action'];

  detailsForm = new FormGroup({
    customer: new FormControl(''),
    date: new FormControl()
  });

  itemForm = new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNote!: DeliveryNote;

  fileInput: any;


  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly productService: ProductService, private readonly deliveryNoteService: DeliveryNotesService,
              private readonly localStorageServiceService: LocalStorageServiceService, public util: Util, public fileReader: FileReaderUtil) {
  }

  ngOnInit(): void {
    if (!this.deliveryNote) {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.getDeliveryNote(params['id']);
        } else {
          this.isNew = true;
          this.setDeliveryNote();
        }
      });
    }

    this.setCustomer();
    this.setProduct();
  }

  getDeliveryNote(id: string) {
    this.deliveryNoteService.getById(id).subscribe(data => {
      if (data) {
        this.deliveryNote = data;
        //TODO: itt még nem a boolean,Itemet töltjük
        this.items = this.deliveryNote.products;
        this.itemNumber = this.items.length;

        this.items.forEach(item => {
          this.productService.getByNumber(item.productNumber).subscribe(product => {
            if (product) {
              let pr = product[0];
              pr.stock = (+pr.stock - +item.amount).toString()
              this.incomingProduct.push(pr);
            }
          })
        })
        this.deliveryNote.searchArray = [];
        this.detailsForm.get('customer')?.setValue(this.deliveryNote.customerId);
        this.detailsForm.get('date')?.setValue(this.deliveryNote.date);
      }
    })
  }

  setCustomer() {
    // Az aszinkron adatbetöltést a subscribe-al végezzük el
    this.localStorageServiceService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomer = this.detailsForm.controls['customer'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCustomer(value ?? '')),
      );
    });
  }

  setProduct() {
    this.localStorageServiceService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterProduct(value ?? '')),
      );
    });
  }

  _filterProduct(value: string) {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.number.toLowerCase().includes(filterValue));
  }

  _filterCustomer(value: string) {
    // A szűrési logika
    const filterValue = value.toLowerCase();
    return this.customers.filter(customer => customer.companyName.toLowerCase().includes(filterValue));
  }

//TODO: kiemelés-> illetve valami memória barátabb megoldás
  setDeliveryNote() {
    let now = new Date();
    let date = new Date(now.getFullYear().toString() + "-" + (now.getMonth() + 1).toString());

    this.deliveryNoteService.getByMonth(date).subscribe((data: Array<DeliveryNote>) => {
      if (data) {
        this.deliveryNote = {
          id: uuidv4(),
          number: this.generateDeliveryNoteNumber((data.length + 3).toString()),
          customerId: "",
          products: [],
          type: "incoming",
          tax: "",
          date: Timestamp.fromDate(new Date(new Date().toDateString())),
          searchArray: []
        }
      }
    })
  }

//TODO: kiemelés-> illetve valami memória barátabb megoldás
  generateDeliveryNoteNumber(number: string) {
    let now = new Date();
    if (number === "9999") {
      number = "0";
    }
    while (number.length < 4) {
      number = "0" + number;
    }
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + number;
  }

  addItem() {

    if (this.itemForm.value.productNumber && this.itemForm.value.amount && this.itemForm.value.productNumber) {
      this.localStorageServiceService.getProduct(this.itemForm.value.productNumber).subscribe(products => {
        if (products) {
          console.log("Itemnumber: " + this.itemNumber);
          this.loadToTable(products)
          this.itemForm.reset();
        }
      })

    }
  }

  loadToTable(product: Product) {
    let pr: Product;
    this.localStorageServiceService.getProduct(product.number).subscribe(product => {
      if (product) {
        pr = product;
      } else {
        console.log('Nem található a termék.');
      }
    });
    let item: ItemInterface;
    let isExisting = true;

    if (!pr) {
      console.log(product.number + " is not valid product number.")
      isExisting = false;
      pr = product;
    }
    item = this.getItem(product.number, pr);
    console.log(item);
    if (+item.amount === 0) {
      this.incomingProduct.push(pr);
      this.itemNumber += 1;
      this.datasource.push([item, isExisting]);
    }
    item.amount = (+item.amount + +product.stock).toString();


    this.updateDataSource();
  }

  updateDataSource() {
    if (this.table && this.datasource.length > 1) {
      this.datasource.sort((a, b) => {
        if (a[1] === b[1]) return 0;
        return a[1] ? -1 : 1;
      });
      this.table.renderRows();
    }
  }

  getItem(productNumber: string, pr: Product): ItemInterface {
    for (let value of this.datasource.values()) {
      if (value[0].productNumber === productNumber) {
        return value[0];
      }
    }
    return ItemFactory.createProductItem(this.itemNumber.toString(), pr);
  }

  removeElement(item: ItemInterface) {
    //TODO: datasource remoive item
  }


  cancel() {
    if (!this.isNew) {
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);
    } else {
      window.location.reload();
    }
  }

  async save() {
    if (this.detailsForm.value.date) {
      this.deliveryNote.date = Timestamp.fromDate(new Date(new Date().toDateString()));
      if (this.detailsForm.value.customer) {
        this.deliveryNote.customerId = this.detailsForm.value.customer;
      }
      this.deliveryNote.products = this.items;

      let modifyProductsList: Product[] = [];

      this.incomingProduct.forEach(async product => {
        this.deliveryNote.searchArray.push(product.number);
        await this.util.addItemAmountToStock(product, this.items);
        modifyProductsList.push(product);
      })

      console.log("Végeredményben a készlet és ár: ");
      console.log(modifyProductsList);

      await this.deliveryNoteService.create(this.deliveryNote);
      modifyProductsList.forEach(async product => {
        await this.productService.setProduct(product);
      })
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);

    }
  }


  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const jsonData = this.fileReader.readExcel(e);
        let keys: ProductKeys[] = ['number', 'stock', 'incomingPrice', 'price'];
        if (this.fileReader.validateHeader(jsonData[0], keys)) {
          console.log("Valid fejléc")
          keys = jsonData[0];
          let output = this.fileReader.transferJsonToObject(jsonData.slice(1), keys);
          console.log(output);
          output.forEach(element => {
            this.loadToTable(element)
          });
          console.log(this.datasource);
        } else {
          alert("Az excel fejléce nem megfelelő.")
        }
      };

      reader.readAsArrayBuffer(file);
    } else {
      alert('Kérlek válassz egy érvényes Excel fájlt (.xlsx)');
    }
  }

  createProduct(item: ItemInterface) {
    //TODO: felugró ablakban lehessen létrehozni a terméket.
  }

}
