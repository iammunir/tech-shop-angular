import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/models/Order';
import { OrderService } from 'src/app/services/order.service';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { FormOrderComponent } from '../../form-order/form-order.component';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  @Input() order: Order;

  constructor(private dialog: MatDialog, private orderService: OrderService) { }

  ngOnInit(): void {
  }

  openFormDialog(): void {
    const dialogRef = this.dialog.open(FormOrderComponent, {
      width: '65%',
      height : 'auto',
      data: {order: this.order, formType: 'update'},
      autoFocus: false
    });
  }

  openConfirmationDialog(): void {
    const tobeDeleted = {
      id: this.order.id,
      title: this.order.customerName,
      confirmed: false
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '45%',
      height : 'auto',
      data: tobeDeleted
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        this.orderService.deleteOrder(result.id);
      }
    });
  }

}
