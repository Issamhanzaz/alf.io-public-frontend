import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';
import { Event as AlfioEvent } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { TicketCategory } from '../model/ticket-category';
import { ReservationRequest } from '../model/reservation-request';
import { handleServerSideValidationError } from '../shared/validation-helper';
import { zip } from 'rxjs';
import { AdditionalService } from '../model/additional-service';
import { I18nService } from '../shared/i18n.service';
import { WaitingListSubscriptionRequest } from '../model/waiting-list-subscription-request';
import { ItemsByCategory, TicketCategoryForWaitingList } from '../model/items-by-category';
import { EventCode, DynamicDiscount } from '../model/event-code';
import { AnalyticsService } from '../shared/analytics.service';
import { ErrorDescriptor, ValidatedResponse } from '../model/validated-response';
import { Location } from '@angular/common';
import { TransactionInitializationToken } from '../model/payment';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.scss']
})
export class EventDisplayComponent implements OnInit {

  event: AlfioEvent;
  ticketCategories: TicketCategory[];
  expiredCategories: TicketCategory[];
  //
  supplementCategories: AdditionalService[];
  donationCategories: AdditionalService[];
  //
  reservationForm: FormGroup;
  globalErrors: ErrorDescriptor[] = [];
  //
  ticketCategoryAmount: { [key: number]: number[] };
  //

  //
  preSales: boolean;
  waitingList: boolean;
  ticketCategoriesForWaitingList: TicketCategoryForWaitingList[];
  waitingListForm: FormGroup;
  waitingListRequestSubmitted: boolean;
  waitingListRequestResult: boolean;
  //

  eventCode: EventCode;
  eventCodeError: boolean;
  aantal: number[] = [0, 1, 2];

  displayPromoCodeForm: boolean;
  promoCodeForm: FormGroup;
  @ViewChild('promoCode')
  promoCodeElement: ElementRef<HTMLInputElement>;
  @ViewChild('tickets')
  tickets: ElementRef<HTMLDivElement>;
  expiredCategoriesExpanded = false;

  private dynamicDiscount: DynamicDiscount;

  dagdeel1: any[] = [];
  dagdeel2: any[] = [];
  dagdeel3: any[] = [];
  firstClicked: boolean = true;
  // https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private i18nService: I18nService,
    private analytics: AnalyticsService,
    private _location: Location) { }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParams['code'];
    const errors = this.route.snapshot.queryParams['errors'];
    if (errors) {
      this.globalErrors = errors.split(',').map(val => { const ed = new ErrorDescriptor(); ed.code = val; return ed; });
    }

    this.route.params.subscribe(params => {
      const eventShortName = params['eventShortName'];

      zip(this.eventService.getEvent(eventShortName), this.eventService.getEventTicketsInfo(eventShortName)).subscribe(([event, itemsByCat]) => {
        this.event = event;

        for (var i = 0; i < itemsByCat["ticketCategories"].length; i++) {
          if(!JSON.stringify(itemsByCat["ticketCategories"][i]["name"]).includes("Terras")){
            if (JSON.stringify(itemsByCat["ticketCategories"][i]["description"]).includes("Dagdeel 1:")) {
              this.dagdeel1.push(itemsByCat["ticketCategories"][i]);

            } else if (JSON.stringify(itemsByCat["ticketCategories"][i]["description"]).includes("Dagdeel 2:")) {
              this.dagdeel2.push(itemsByCat["ticketCategories"][i]);

            } else if (JSON.stringify(itemsByCat["ticketCategories"][i]["description"]).includes("Dagdeel 3:")) {
              this.dagdeel3.push(itemsByCat["ticketCategories"][i]);
            }
          }
        }

        this.i18nService.setPageTitle('show-event.header.title', event.displayName);
        var alle: any[] = [];
        alle = [...this.dagdeel1, ...this.dagdeel2, ...this.dagdeel3];
        this.reservationForm = this.formBuilder.group({
          // reservation: this.formBuilder.array(this.createItems(itemsByCat.ticketCategories)),
          reservation: this.formBuilder.array(this.createItems(alle)),
          additionalService: this.formBuilder.array([]),
          captcha: null,
          promoCode: null
        });

        this.promoCodeForm = this.formBuilder.group({
          promoCode: this.formBuilder.control(code)
        });

        this.applyItemsByCat(itemsByCat);
        this.analytics.pageView(event.analyticsConfiguration);

        if (code) {
          this.internalApplyPromoCode(code, err => this.globalErrors = err);
        }
      });
    });
  }

  backClicked() {
    this.router.navigate([`/`]);
  }

  private applyItemsByCat(itemsByCat: ItemsByCategory) {
    this.ticketCategories = itemsByCat.ticketCategories;
    this.expiredCategories = itemsByCat.expiredCategories || [];

    this.ticketCategoryAmount = {};
    this.ticketCategories.forEach(tc => {
      this.ticketCategoryAmount[tc.id] = [];
      for (let i = 0; i <= tc.maximumSaleableTickets; i++) {
        this.ticketCategoryAmount[tc.id].push(i);
      }
    });

    this.supplementCategories = itemsByCat.additionalServices.filter(e => e.type === 'SUPPLEMENT');
    this.donationCategories = itemsByCat.additionalServices.filter(e => e.type === 'DONATION');

    this.preSales = itemsByCat.preSales;
    this.waitingList = itemsByCat.waitingList;
    this.ticketCategoriesForWaitingList = itemsByCat.ticketCategoriesForWaitingList;

    this.createWaitingListFormIfNecessary();
  }

  private createWaitingListFormIfNecessary() {
    if (this.waitingList && !this.waitingListForm) {
      this.waitingListForm = this.formBuilder.group({
        firstName: null,
        lastName: null,
        email: null,
        selectedCategory: null,
        userLanguage: null,
        termAndConditionsAccepted: null,
        privacyPolicyAccepted: null
      });
    }
  }

  private createItems(ticketCategories: TicketCategory[]): FormGroup[] {
    return ticketCategories.map(category => this.formBuilder.group({ ticketCategoryId: category.id, amount: 0 }));
  }

  submitForm(eventShortName: string, reservation: ReservationRequest) {
    let volwassenSelected : Boolean = false;
    let kinderenSelected : Boolean = false;
    const request = reservation
    reservation.reservation.forEach(element => {
      if(volwassenSelected == false){
        if(this.ticketCategories.find(x => x.id === element.ticketCategoryId).name === "Volwassenen"){
          if(element.amount != 0){
            volwassenSelected = true;
          }
        }
      }
    });

    reservation.reservation.forEach(element => {
      if(kinderenSelected == false){
        if(this.ticketCategories.find(x => x.id === element.ticketCategoryId).name === "Kinderen"){
          if(element.amount != 0){
            kinderenSelected = true;
          }
        }
      }
    });
    
    if(volwassenSelected == true && kinderenSelected == true){
      if (reservation.additionalService != null && reservation.additionalService.length > 0) {
        request.additionalService = reservation.additionalService.filter(as => (as.amount != null && as.amount > 0) || (as.quantity != null && as.quantity > 0));
      }
      this.reservationService.reserveTickets(eventShortName, request, this.translate.currentLang).subscribe(res => {
        if (res.success) {
          this.router.navigate(['event', eventShortName, 'reservation', res.value, 'book']);
        }
      }, (err) => {
        this.globalErrors = handleServerSideValidationError(err, this.reservationForm);
        this.scrollToTickets();
      });
    }else{
      alert("Kies minstens 1 kind en 1 volwassenen");
    }
  }

  private scrollToTickets(): void {
    setTimeout(() => {
      if (this.tickets != null && this.tickets.nativeElement != null) {
        this.tickets.nativeElement.scrollIntoView(true);
      }
    }, 10);
  }

  submitWaitingListRequest(eventShortName: string, waitingListSubscriptionRequest: WaitingListSubscriptionRequest) {
    this.eventService.submitWaitingListSubscriptionRequest(eventShortName, waitingListSubscriptionRequest).subscribe(res => {
      this.waitingListRequestSubmitted = true;
      this.waitingListRequestResult = res.value;
    }, (err) => {
      this.globalErrors = handleServerSideValidationError(err, this.waitingListForm);
    });
  }

  handleRecaptchaResponse(recaptchaValue: string): void {
    this.reservationForm.get('captcha').setValue(recaptchaValue);
  }

  private internalApplyPromoCode(promoCode: string, errorHandler: ((errors: ErrorDescriptor[]) => void)): void {
    this.globalErrors = [];
    this.eventCodeError = false;

    if (promoCode === null || promoCode === undefined || promoCode.trim() === '') {
      return;
    }

    this.eventService.validateCode(this.event.shortName, promoCode).subscribe(res => {
      if (res.success) {
        // this.router.navigate([], {relativeTo: this.route, queryParams: {code: promoCode}, queryParamsHandling: "merge"})
        // TODO, set promo code in url, fetch ticket category, rebuild the reservationForm.reservation

        //
        this.reloadTicketsInfo(promoCode, res.value);
        this.displayPromoCodeForm = false;
        //
      } else {
        this.eventCode = null; // should never enter here
        this.reservationForm.get('promoCode').setValue(null);
      }
    }, (err) => {
      errorHandler(handleServerSideValidationError(err, this.promoCodeForm));
      this.eventCode = null;
      this.reloadTicketsInfo(null, null);
      this.eventCodeError = true;
    });
  }

  applyPromoCode(): void {
    const promoCode = this.promoCodeForm.get('promoCode').value;
    this.globalErrors = [];
    this.internalApplyPromoCode(promoCode, () => { });
  }

  removePromoCode(): void {
    this.reloadTicketsInfo(null, null);
  }

  togglePromoCodeVisible(): void {
    this.displayPromoCodeForm = !this.displayPromoCodeForm;
    if (this.displayPromoCodeForm) {
      setTimeout(() => this.promoCodeElement.nativeElement.focus(), 200);
    } else {
      this.promoCodeForm.get('promoCode').setValue(null);
    }
  }

  ticketsLeftCountVisible(): boolean {
    return this.event.availableTicketsCount != null
      && this.event.availableTicketsCount > 0
      && this.ticketCategories.every(tc => !tc.bounded);
  }

  reservationFormItem(parent: FormGroup, counter: number): FormGroup {

    // for(let i =0; i < parent.get('reservation') as FormArray).length)
    // parent.get('reservation') as FormArray).value[i].
    return (parent.get('reservation') as FormArray).at(counter) as FormGroup;
  }

  ticketsLeftCountVisibleForCategory(category: TicketCategory): boolean {
    return category.availableTickets != null && category.availableTickets > 0;
  }

  private reloadTicketsInfo(promoCode: string, eventCode: EventCode) {
    this.eventService.getEventTicketsInfo(this.event.shortName, promoCode).subscribe(itemsByCat => {
      this.reservationForm.get('promoCode').setValue(promoCode);
      this.reservationForm.setControl('reservation', this.formBuilder.array(this.createItems(itemsByCat.ticketCategories)));
      this.applyItemsByCat(itemsByCat);
      this.eventCode = eventCode;
      if (eventCode != null) {
        this.scrollToTickets();
      }
    });
  }

  promoCodeOnEnter(ev: Event) {
    ev.preventDefault();
    if (this.promoCodeForm.invalid) {
      return;
    }
    this.applyPromoCode();
  }

  selectionChange(): void {
    if (this.eventCode == null || this.eventCode.type == 'ACCESS') {
      this.reservationService.checkDynamicDiscountAvailability(this.event.shortName, this.reservationForm.value)
        .subscribe(d => {
          this.dynamicDiscount = d;
        });
    }
  }

  get dynamicDiscountMessage(): string {
    if (this.dynamicDiscount != null) {
      return this.dynamicDiscount.formattedMessage[this.translate.currentLang];
    }
    return null;
  }

  get isEventOnline(): boolean {
    return this.event.format == 'ONLINE';
  }

  get displayMap(): boolean {
    return (this.event.mapUrl && this.event.mapUrl.length > 0) && !this.isEventOnline;
  }

  // get dagdeel(): any[]{
  //   this.ticketCategories.map((s => {
  //     console.log(s.description);
  //     if(s.description["nl"] == "voormiddag"){

  //     }
  //     // if(s == ""){

  //     // }
  //   })
  //   // this.ticketCategories.map(s => s.description, {
  //   //   if(s == "dagdeel1"){

  //   //   }
  //   // })
  //   return;
  // }

  indexstring(string: TicketCategory): number {
    // console.log("Naam in: " + string.name)
    // console.log("Id in: " + string.id)
    // console.log("ID IN ARRAY: " + this.ticketCategories.find(x => x.id == string.id).id)
    // console.log("Naam IN ARRAY: " + this.ticketCategories.find(x => x.id == string.id).name)
    // console.log("INDEX: " + this.ticketCategories.findIndex(x => x.id == string.id))
    return this.ticketCategories.findIndex(x => x.id == string.id);
  }

  changeClicked(): boolean {
    this.firstClicked != this.firstClicked;
    return this.firstClicked;
  }

  checkQuantity(string): boolean {
    return string != "Kinderen";
  }

}
