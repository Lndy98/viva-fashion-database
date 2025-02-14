import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {ProductService} from 'src/app/shared/services/products.service';
import {ProductInterface} from '../../shared/models/ProductInterface';
import {DeliveryNoteInterface} from '../../shared/models/DeliveryNoteInterface';
import {Custamer} from '../../shared/models/Custamer';
import {ItemInterface} from 'src/app/shared/models/ItemInterface';
import {Util} from 'src/app/shared/interfaces/Util';

import {MatTable} from '@angular/material/table';
import {v4 as uuidv4} from 'uuid';
import {DeliveryNotesService} from 'src/app/shared/services/delivery-notes.service';
import {ActivatedRoute, Router} from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Timestamp} from '@firebase/firestore';
import {LocalStorageServiceService} from 'src/app/shared/services/local-storage-service.service';
import {Tax} from "../../shared/models/Tax";
import {ItemFactory} from "../../shared/factories/ItemFactory";

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss'],
  providers: [Util]
})
export class OutgoingComponent implements OnInit {

  isNew: boolean = false;
  isItem: boolean = false;
  itemNumber: number = 0;
  itemArray: ItemInterface [] = [];

  displayedColumns: string[] = ['id', 'productNumber', 'name', 'amount', 'price', 'brutto', 'payable', 'remove'];
  invalidStock: string[] = [];

  products !: Array<ProductInterface>;
  customers !: Array<Custamer>;
  filteredProducts !: Observable<ProductInterface[]>;
  filteredCustomer !: Observable<Custamer[]>;

  selectedProducts: ProductInterface [] = [];

  detailsForm = new FormGroup({
    customer: new FormControl(''),
    tax: new FormControl(''),
    date: new FormControl()
  });

  deliveryNote!: DeliveryNoteInterface;
  itemForm = new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNotes: DeliveryNoteInterface[] = [];

  @ViewChild(MatTable) table !: MatTable<ItemInterface>;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly productService: ProductService,
              private readonly deliveryNoteService: DeliveryNotesService, private readonly localStorageServiceService: LocalStorageServiceService, public util: Util) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.getDeliveryNote(params['id']);
      } else {
        this.isNew = true;
        this.setDeliveryNote();
      }
    });
    this.setCustomer();
    this.setProduct();
    console.log("A kezdo products: ")
    console.log(this.selectedProducts);
  }

  getDeliveryNote(id: string) {
    this.deliveryNoteService.getById(id).subscribe(data => {
      if (data) {
        this.deliveryNote = data;

        this.itemArray = this.deliveryNote.products;
        this.isItem = true;
        this.itemNumber = this.itemArray.length;

        this.itemArray.forEach(item => {
          this.productService.getByNumber(item.productNumber).subscribe(product => {
            if (product) {
              let pr = product[0];
              pr.stock = (+pr.stock + +item.amount).toString()
              this.selectedProducts.push(pr);
            }
          })
        })
        this.deliveryNote.searchArray = [];
        this.detailsForm.get('customer')?.setValue(this.deliveryNote.customerId);
        this.detailsForm.get('tax')?.setValue(this.deliveryNote.tax.toString());
        this.detailsForm.get('date')?.setValue(this.deliveryNote.date);
      }
    })

  }

  setDeliveryNote() {
    let now = new Date();
    let date = new Date(now.getFullYear().toString() + "-" + (now.getMonth() + 1).toString());

    this.deliveryNoteService.getByMonth(date).subscribe((data: Array<DeliveryNoteInterface>) => {
      if (data) {
        this.deliveryNote = {
          id: uuidv4(),
          number: this.generateDeliveryNoteNumber((data.length).toString()),
          date: Timestamp.fromDate(new Date(new Date().toDateString())),
          customerId: "",
          products: [],
          tax: Tax.full,
          type: 'outgoing',
          searchArray: []
        };
        this.detailsForm.get('tax')?.setValue(Tax.full.toString());
      }
    })
  }

  generateDeliveryNoteNumber(number: string) {
    let now = new Date();
    console.log(number);
    if (number === "9999") {
      number = "0";
    }
    while (number.length < 4) {
      number = "0" + number;
    }
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + number;
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

  addItem() {
    if (this.itemForm.value.productNumber && this.itemForm.value.amount) {
      let product = this.getProduct(this.itemForm.value.productNumber);
      let amount = this.itemForm.value.amount;
      if (product) {
        this.isItem = true;
        if (this.isInItemArray(this.itemForm.value.productNumber)) {
          this.itemArray.forEach(element => {
            console.log(element.number == this.itemForm.value.productNumber)
            if (element.productNumber == this.itemForm.value.productNumber) {
              console.log(element);
              element.amount = (+element.amount + amount).toString();
            }
          });
        } else {
          this.itemNumber += 1;
          let item = ItemFactory.createProductItem(this.itemNumber.toString(), product, amount);
          this.itemArray.push(item);
          this.selectedProducts.push(product);
        }
        this.itemForm.reset();
        if (this.itemNumber > 1) {
          this.table.renderRows();
        }
      }
    }
  }

  getProduct(productNumber: string): any {
    let product: ProductInterface | null = null;
    this.products.forEach(element => {
      if (element.number == productNumber) {
        product = element;
      }
    });
    return product;
  }

  isInItemArray(productNumber: string) {
    let isInArray = false;
    this.itemArray.forEach(element => {
      if (element.productNumber == productNumber) {
        isInArray = true;
      }
    })
    return isInArray;
  }

  checkStock(product: ProductInterface, amount: string) {
    product.stock = (+this.util.formatNumber(product.stock) - +amount).toString();
    if (+product.stock < 0) {
      this.invalidStock.push(product.number);
    }
  }

  removeElement(item: ItemInterface) {
    const index = this.itemArray.indexOf(item);
    if (index !== -1) {
      this.itemArray.splice(index, 1);
    }
    this.itemNumber -= 1;
    if (this.itemNumber >= 1) {
      this.table.renderRows();
    } else {
      this.isItem = false;
    }
  }

//TODO: sokszor fut le- lehet inkább a tax mező kalkulálásánál kéne egyszer újra számolni az item értékeket?

  calculateSumAmount(): number {
    let sum = 0;
    this.itemArray.forEach(item => {
      sum += +item.amount;
    })
    return sum;
  }

  calculateSumPrice(): number {
    let sum = 0;
    this.itemArray.forEach(item => {
      sum += +item.amount * +item.price;
    })
    return sum;
  }


  async save() {
    if (this.detailsForm.value.date && this.detailsForm.value.customer) {
      this.deliveryNote.tax = Tax.full;
      this.deliveryNote.customerId = this.detailsForm.value.customer;
      this.deliveryNote.date = Timestamp.fromDate(new Date(new Date().toDateString()));
      this.deliveryNote.products = this.itemArray;

      let modifyProductsList: ProductInterface[] = [];
      this.selectedProducts.forEach(async product => {
        this.deliveryNote.searchArray.push(product.number);
        await this.util.takeItemAmountFromStock(product, this.itemArray);
        modifyProductsList.push(product);
      })
      console.log("A kiválasztott termékek kódok listája:")
      console.log(this.deliveryNote.searchArray)

      this.deliveryNoteService.create(this.deliveryNote).then(_ => {
        modifyProductsList.forEach(async product => {
          await this.productService.setProduct(product);
        })

      })

      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);


    }
  }


  cancel() {
    if (!this.isNew) {
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);
    } else {
      window.location.reload();
    }
  }
}
