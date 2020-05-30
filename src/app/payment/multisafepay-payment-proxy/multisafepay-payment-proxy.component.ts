import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PaymentProvider } from '../payment-provider';
import { MultisafepayPaymentProvider } from './multisafepay-payment-provider';

@Component({
  selector: 'app-multisafepay-payment-proxy',
  templateUrl: './multisafepay-payment-proxy.component.html'
})
export class MultisafepayPaymentProxyComponent implements OnChanges {
  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  reservation: ReservationInfo;

  @Output()
  paymentProvider: EventEmitter<PaymentProvider> = new EventEmitter<PaymentProvider>();

  private compatibleMethods: PaymentMethod[] = ['IDEAL'];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.method) {
      this.paymentProvider.emit(new MultisafepayPaymentProvider());
    }
  }

  public get matchProxyAndMethod(): boolean {
    return (this.compatibleMethods.includes(this.method)) && this.proxy === 'MULTISAFEPAY';
  }
}
