import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/Item';
import { Order } from 'src/app/models/Order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.css']
})
export class FormOrderComponent implements OnInit {

  orderForm: FormGroup;
  order: Order;
  categories: string[] = [];
  categoryItems: Item[][] = [];
  selectedItem: Item;
  formType: string;

  constructor(
    private dialogRef: MatDialogRef<FormOrderComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private orderService: OrderService) {
      this.order = data.order;
      this.formType = data.formType
  }

  ngOnInit(): void {
    this.categories = this.orderService.getCategories();

    if (this.formType === 'update') {
      this.order.items.map((item, index) => {
        const category = item.category.toLowerCase().split(' ').join('');
        switch (category) {
          case 'cpu':
            this.categoryItems[index] = this.orderService.getCpuList();
            break;
          case 'motherboard':
            this.categoryItems[index] = this.orderService.getMotherboardList();
            break;
          case 'videocard':
            this.categoryItems[index] = this.orderService.getVideocardList();
            break;
          case 'memory':
            this.categoryItems[index] = this.orderService.getMemoryList();
            break;
          default:
            break;
        }
      });
    }

    this.orderForm = new FormGroup({
      id: new FormControl(this.order?.id || null),
      customerName: new FormControl(this.order?.customerName || null, Validators.required),
      email: new FormControl(this.order?.email || null, [Validators.required, Validators.email]),
      items: new FormArray( this.formType === 'add' ? this.itemInputNewOrder() : this.itemInputUpdateOrder() )
    });
  }

  itemInputNewOrder(): FormGroup[] {
    return [
      new FormGroup({
        category: new FormControl(null, Validators.required),
        name: new FormControl({value: null, disabled: true}, Validators.required),
        price: new FormControl(null, Validators.required)
      })
    ]
  }

  itemInputUpdateOrder(): FormGroup[] {
    return this.order.items.map(item => {
      return new FormGroup({
        category: new FormControl(item.category, Validators.required),
        name: new FormControl({value: item.name, disabled: false}, Validators.required),
        price: new FormControl(item.price, Validators.required)
      });
    });
  }

  onClickCancel(): void {
    this.resetForm();
    this.dialogRef.close();
  }

  changeCategory(value: string, index: number) {
    
    const selectedCategory = value.toLowerCase().split(' ').join('');
    switch (selectedCategory) {
      case 'cpu':
        this.categoryItems[index] = this.orderService.getCpuList();
        break;
      case 'motherboard':
        this.categoryItems[index] = this.orderService.getMotherboardList();
        break;
      case 'videocard':
        this.categoryItems[index] = this.orderService.getVideocardList();
        break;
      case 'memory':
        this.categoryItems[index] = this.orderService.getMemoryList();
        break;
      default:
        break;
    }

    // enable the select option
    const itemsArray = this.orderForm.get('items') as FormArray;
    itemsArray.at(index).get('name').enable();
  }

  getCategoryItems(index: number): Item[] {
    return this.categoryItems[index];
  }

  // changeItem event will set the value for the item price
  changeItem(itemName: string, index: number) {
    const itemsArray = this.orderForm.get('items') as FormArray;
    const item: Item = this.categoryItems[index].find((item) => item.name === itemName);
    itemsArray.at(index).get('price').patchValue(item.price);
  }

  addItem(): void {
    const newInput = new FormGroup({
      category: new FormControl(null, Validators.required),
      name: new FormControl({value: null, disabled: true}, Validators.required),
      price: new FormControl(null, Validators.required)
    });
    (this.orderForm.get('items') as FormArray).push(newInput);
  }

  removeItem(index: number): void {
    (this.orderForm.get('items') as FormArray).removeAt(index);
    this.categoryItems.splice(index, 1);
  }

  getButtonName(): string {
    return this.formType === 'add' ? 'ADD' : 'UPDATE';
  }

  onSubmit() {
    const theOrder: Order = this.constructOrder(this.orderForm.value);
    if(this.formType === 'add') {
      this.orderService.addNewOrder(theOrder);
    } else {
      this.orderService.updateOrder(theOrder);
    }
    this.resetForm();
  }
  
  resetForm() {
    this.categories = [];
    this.categoryItems = [];
    this.orderForm.reset();
  }

  constructOrder(data: any): Order {
    const orderId = data.id || new Date().getTime().toString(); // dummy id
    return {
      id: orderId,
      customerName: data.customerName,
      email: data.email,
      items: data.items,
      totalPrice: data.items.reduce((total, item) => total + item.price, 0)
    }
  }


}
