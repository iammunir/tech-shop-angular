import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/Order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, OnDestroy {

  private orderSubs: Subscription;
  private actionUpdateSubs: Subscription;
  orders: Order[] = [];

  constructor(private orderService: OrderService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    this.orders = this.orderService.getExistingOrders();
    this.orderSubs = this.orderService.ordersListener().subscribe(orders => {
      this.orders = orders;
    });

    this.actionUpdateSubs = this.orderService.actionUpdateListener().subscribe(result => {
      const message = `Order from ${result.name} has been successfully ${result.actionDone}`;
      this.openSnackBar(message);
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  ngOnDestroy(): void {
    this.orderSubs.unsubscribe();
    this.actionUpdateSubs.unsubscribe();
  }

}
