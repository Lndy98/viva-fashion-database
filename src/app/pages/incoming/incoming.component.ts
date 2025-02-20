import {Component, OnInit, ViewChild} from '@angular/core';
import {firstValueFrom, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {FormControl, FormGroup} from '@angular/forms'
import {ProductInterface, ProductKeys} from 'src/app/shared/models/ProductInterface';
import {ProductService} from 'src/app/shared/services/products.service';
import {ItemInterface} from 'src/app/shared/models/ItemInterface';
import {MatTable} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';

import {DeliveryNoteInterface} from 'src/app/shared/models/DeliveryNoteInterface';
import {DeliveryNotesService} from 'src/app/shared/services/delivery-notes.service';
import {Custamer} from 'src/app/shared/models/Custamer';
import {Util} from 'src/app/shared/interfaces/Util';

import {Timestamp} from '@firebase/firestore';
import {LocalStorageServiceService} from 'src/app/shared/services/local-storage-service.service';
import {FileReaderUtil} from 'src/app/shared/interfaces/FileReader';
import {ItemFactory} from "../../shared/factories/ItemFactory";
import {ProductFactory} from "../../shared/factories/ProductFactory";
import {DeliveryNoteFactory} from "../../shared/factories/DeliveryNoteFactory";

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

  products !: Array<ProductInterface>;
  customers !: Array<Custamer>;
  filteredProducts !: Observable<ProductInterface[]>;
  filteredCustomer !: Observable<Custamer[]>;

  items: ItemInterface[] = []
  datasource: Map<ItemInterface, boolean> =new Map<ItemInterface, boolean>();

  incomingProduct: Array<ProductInterface> = [];
  displayedColumns: string[] = ['number', 'amount', 'incomingPrice', 'price', 'action'];

  detailsForm = new FormGroup({
    customer: new FormControl(''),
    date: new FormControl()
  });

  itemForm = new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNote!: DeliveryNoteInterface;

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
          this.deliveryNote = DeliveryNoteFactory.createEmpty("incoming");
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


  async addItem() {

    if (this.itemForm.value.productNumber && this.itemForm.value.amount && this.itemForm.value.productNumber) {
      let products = await firstValueFrom(this.localStorageServiceService.getProduct(this.itemForm.value.productNumber))
      if (products) {
        products.stock = this.itemForm.value.amount;
        this.loadToTable(products, true);
        this.itemForm.reset();
      }
    }
  }

  async loadToTable(product: ProductInterface, isExisting: boolean) {
    let item: ItemInterface | null;
    item = this.getItemFromDataSource(product.number);
    if (!item) {
      item = ItemFactory.createProductItem(this.itemNumber.toString(), product, product.stock);
      this.incomingProduct.push(product);
      this.itemNumber += 1;
      this.datasource.set(item, isExisting);
    } else {
      item.amount = (+item.amount + +product.stock).toString();
    }
    this.updateDataSource();
  }

  updateDataSource() {
    if (this.table && this.datasource.size > 1) {
      // this.datasource.((a, b) => {
      //   if (a[1] === b[1]) return 0;
      //   return a[1] ? -1 : 1;
      // });
      this.table.renderRows();
    }
  }

  getItemFromDataSource(productNumber: string): ItemInterface | null {
    for (let item of this.datasource.keys()) {
      if (item.productNumber === productNumber) {
        return item;
      }
    }
    return null;
  }

  removeElement(item: ItemInterface) {
    //TODO: teszt
    if(this.datasource.has(item)){
      this.itemNumber -= 1;
      this.datasource.delete(item);
    }
    this.updateDataSource();
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

      let modifyProductsList: ProductInterface[] = [];

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
            this.loadProduct(element)
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

  async loadProduct(element: ProductInterface) {
    let pr = await firstValueFrom(this.localStorageServiceService.getProduct(element.number));
    let isExisting = true;
    if (!pr) {
      isExisting = false;
      pr = element;
    } else {
      pr = ProductFactory.updateProductFromExcel(element.price, element.incomingPrice, element.stock, pr);
    }
    this.loadToTable(pr, isExisting)
  }

  createProduct(item: ItemInterface) {
    //TODO: felugró ablakban lehessen létrehozni a terméket.
  }

  protected readonly Array = Array;
}
