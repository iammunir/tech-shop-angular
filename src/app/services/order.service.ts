import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Action } from '../models/Action';
import { Item } from '../models/Item';
import { Order } from '../models/Order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders: Order[] = [
    {
      id: 'ord01',
      totalPrice: 246,
      customerName: 'PewDiePie',
      email: 'PewDiePie@gmail.com',
      items: [
        {
          category: 'CPU',
          name: 'AMD Ryzen 5 2600',
          price: 117
        },
        {
          category: 'Motherboard',
          name: 'MSI PRO Z390-A',
          price: 129
        },
      ]
    },
    {
      id: 'ord02',
      totalPrice: 306,
      customerName: 'Filthy Frank',
      email: 'georgemiller@gmail.com',
      items: [
        {
          category: 'Video Card',
          name: 'ZOTAC GeForce GTX 1060',
          price: 209
        },
        {
          category: 'Memory',
          name: 'CORSAIR Vengeance RGB Pro 16GB',
          price: 97
        },
      ]
    },
  ];

  categories = ['CPU', 'Motherboard', 'Video Card', 'Memory'];

  cpuList: Item[] = [
    { category: 'CPU', name: 'AMD Ryzen 5 2600', price: 117 },
    { category: 'CPU', name: 'Intel Core i5-9600K', price: 229 },
    { category: 'CPU', name: 'AMD RYZEN 5 3600', price: 194 },
  ];

  motherBoardList: Item[] = [
    { category: 'Motherboard', name: 'MSI PRO Z390-A', price: 129 },
    { category: 'Motherboard', name: 'ASUS PRIME B360M-A', price: 84 },
    { category: 'Motherboard', name: 'ASRock B450M PRO4 AM4', price: 79 },
  ];

  videoCardList: Item[] = [
    { category: 'Video Card', name: 'ZOTAC GeForce GTX 1060', price: 209 },
    { category: 'Video Card', name: 'MSI Radeon RX 580', price: 189 },
    { category: 'Video Card', name: 'GIGABYTE GeForce RTX 2070', price: 499 },
  ];

  memoryList: Item[] = [
    { category: 'Memory', name: 'CORSAIR Vengeance RGB Pro 16GB', price: 97 },
    { category: 'Memory', name: 'G.SKILL TridentZ RGB Series 16GB', price: 86 },
    { category: 'Memory', name: 'G.SKILL Ripjaws Series 8GB', price: 42 },
  ];

  private orderSubject = new Subject<Order[]>();
  private actionUpdateSubject = new Subject<Action>();

  constructor() { }

  getExistingOrders(): Order[] {
    return [...this.orders];
  }

  getCategories(): string[] {
    return [...this.categories];
  }

  getCpuList(): Item[] {
    return [...this.cpuList];
  }

  getMotherboardList(): Item[] {
    return [...this.motherBoardList];
  }

  getVideocardList(): Item[] {
    return [...this.videoCardList];
  }

  getMemoryList(): Item[] {
    return [...this.memoryList];
  }

  addNewOrder(newOrder: Order): void {
    this.orders.push(newOrder);
    this.orderSubject.next([...this.orders]);
    this.actionUpdateSubject.next({name: newOrder.customerName, actionDone: 'added'});
  }

  deleteOrder(orderId: string): void {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      const customerName = this.orders[orderIndex].customerName;
      this.orders.splice(orderIndex, 1);
      this.orderSubject.next([...this.orders]);
      this.actionUpdateSubject.next({name: customerName, actionDone: 'deleted'});
    }
  }

  updateOrder(updatedOrder: Order): void {
    const orderIndex = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (orderIndex >= 0) {
      this.orders[orderIndex] = updatedOrder;
      this.orderSubject.next([...this.orders]);
      this.actionUpdateSubject.next({name: updatedOrder.customerName, actionDone: 'updated'});
    }
  }

  ordersListener(): Observable<Order[]> {
    return this.orderSubject.asObservable();
  }

  actionUpdateListener(): Observable<Action> {
    return this.actionUpdateSubject.asObservable();
  }

}
