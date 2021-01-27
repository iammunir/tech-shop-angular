import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormOrderComponent } from '../form-order/form-order.component';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  @Output() changeMode = new EventEmitter<boolean>();
  darkMode: boolean = false;

  ngOnInit(): void {
  }

  openFormDialog() {
    this.dialog.open(FormOrderComponent, {
      width: '65%',
      height: 'auto',
      data: {order: null, formType: 'add'},
      autoFocus: true
    });
  }

  onChangeMode({checked}: MatSlideToggleChange) {
    this.changeMode.emit(checked);
    this.darkMode = !this.darkMode;
  }

}
