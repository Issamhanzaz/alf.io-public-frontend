import { HttpClient, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faApplePay, faIdeal, faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import { faBuilding, faCalendarAlt, faCalendarPlus, faCheckCircle, faClock, faClone, faCompass, faEdit, faEnvelope, faHandshake } from '@fortawesome/free-regular-svg-icons';
import { faAddressCard, faAngleDown, faAngleUp, faCheck, faCircle, faCog, faCreditCard, faDownload, faEraser, faExchangeAlt, faExclamationTriangle, faFileAlt, faFileInvoice, faGift, faGlobe, faInfoCircle, faMoneyBill, faMoneyCheckAlt, faSearchPlus, faThumbsUp, faTicketAlt, faTimes, faWifi } from '@fortawesome/free-solid-svg-icons';
import { NgbAlertModule, NgbDropdownModule, NgbModalModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AdditionalFieldComponent } from './additional-field/additional-field.component';
import { AdditionalServiceQuantitySelectorComponent } from './additional-service-quantity-selector/additional-service-quantity-selector.component';
import { AdditionalServiceComponent } from './additional-service/additional-service.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerCheckComponent } from './banner-check/banner-check.component';
import { ItemSalePeriodComponent } from './category-sale-period/item-sale-period.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { CountdownComponent } from './countdown/countdown.component';
import { EventDatesComponent } from './event-dates/event-dates.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { EventFooterLinksComponent } from './event-footer-links/event-footer-links.component';
import { EventHeaderComponent } from './event-header/event-header.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { MolliePaymentProxyComponent } from './payment/mollie-payment-proxy/mollie-payment-proxy.component';
import { OfflinePaymentProxyComponent } from './payment/offline-payment-proxy/offline-payment-proxy.component';
import { OnsitePaymentProxyComponent } from './payment/onsite-payment-proxy/onsite-payment-proxy.component';
import { PaypalPaymentProxyComponent } from './payment/paypal-payment-proxy/paypal-payment-proxy.component';
import { StripePaymentProxyComponent } from './payment/stripe-payment-proxy/stripe-payment-proxy.component';
import { PriceTagComponent } from './price-tag/price-tag.component';
import { RecaptchaComponent } from './recaptcha/recaptcha.component';
import { AnimatedDotsComponent } from './reservation/animated-dots/animated-dots.component';
import { BookingComponent } from './reservation/booking/booking.component';
import { CancelReservationComponent } from './reservation/cancel-reservation/cancel-reservation.component';
import { DeferredOfflinePaymentComponent } from './reservation/deferred-offline-payment/deferred-offline-payment.component';
import { ErrorComponent } from './reservation/error/error.component';
import { ReservationExpiredComponent } from './reservation/expired-notification/reservation-expired.component';
import { InvoiceFormComponent } from './reservation/invoice-form/invoice-form.component';
import { NotFoundComponent } from './reservation/not-found/not-found.component';
import { OfflinePaymentComponent } from './reservation/offline-payment/offline-payment.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { PaymentMethodSelectorComponent } from './reservation/payment-method-selector/payment-method-selector.component';
import { ProcessingPaymentComponent } from './reservation/processing-payment/processing-payment.component';
import { ReleaseTicketComponent } from './reservation/release-ticket/release-ticket.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SuccessComponent } from './reservation/success/success.component';
import { SummaryTableComponent } from './reservation/summary-table/summary-table.component';
import { TicketFormComponent } from './reservation/ticket-form/ticket-form.component';
import { CustomLoader } from './shared/i18n.service';
import { InvalidFeedbackDirective } from './shared/invalid-feedback.directive';
import { StepperComponent } from './stepper/stepper.component';
import { TicketQuantitySelectorComponent } from './ticket-quantity-selector/ticket-quantity-selector.component';
import { UpdateTicketComponent } from './update-ticket/update-ticket.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';







// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDisplayComponent,
    BookingComponent,
    OverviewComponent,
    SuccessComponent,
    ReservationComponent,
    EventHeaderComponent,
    StepperComponent,
    AdditionalFieldComponent,
    ViewTicketComponent,
    UpdateTicketComponent,
    EventSummaryComponent,
    TicketFormComponent,
    LanguageSelectorComponent,
    CountdownComponent,
    BannerCheckComponent,
    OfflinePaymentComponent,
    OfflinePaymentProxyComponent,
    OnsitePaymentProxyComponent,
    PaypalPaymentProxyComponent,
    StripePaymentProxyComponent,
    ProcessingPaymentComponent,
    SummaryTableComponent,
    InvoiceFormComponent,
    InvalidFeedbackDirective,
    AdditionalServiceComponent,
    RecaptchaComponent,
    PriceTagComponent,
    NotFoundComponent,
    TicketQuantitySelectorComponent,
    ItemSalePeriodComponent,
    ItemCardComponent,
    AdditionalServiceQuantitySelectorComponent,
    ReservationExpiredComponent,
    ReleaseTicketComponent,
    CancelReservationComponent,
    EventFooterLinksComponent,
    ErrorComponent,
    DeferredOfflinePaymentComponent,
    MolliePaymentProxyComponent,
    PaymentMethodSelectorComponent,
    AnimatedDotsComponent,
    EventDatesComponent,
    CompanyInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN',
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    NgbTooltipModule,
    NgSelectModule,
    NgbModalModule,
    NgbDropdownModule,
    NoopAnimationsModule,
    NgbModule,
    NgbPaginationModule, 
    NgbAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ReservationExpiredComponent, ReleaseTicketComponent, CancelReservationComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill,
      faDownload, faSearchPlus, faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes, faFileInvoice, faGlobe,
      faAngleDown, faAngleUp, faCircle, faCheckCircle, faMoneyCheckAlt, faWifi);
    library.addIcons(faCalendarAlt, faCalendarPlus, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake, faBuilding);
    library.addIcons(faPaypal, faStripe, faIdeal, faApplePay);
  }
}
