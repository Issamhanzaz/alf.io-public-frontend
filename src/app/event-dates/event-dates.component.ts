import { Component, Input } from '@angular/core';
import { DateValidity } from '../model/date-validity';
import { shouldDisplayTimeZoneInfo } from '../shared/event.service';
import { TranslateService } from '@ngx-translate/core';


// // object which holds the order value of the month
// var monthNames = {
//   "Januari": 1,
//   "Februari": 2,
//   "Maart": 3,
//   "April": 4,
//   "Mei": 5,
//   "Juni": 6,
//   "Juli": 7,
//   "Augustus": 8,
//   "September": 9,
//   "Oktober": 10,
//   "November": 11,
//   "December": 12
// };

// // sort the data array
// this.data.sort(function(a, b) {
//   // sort based on the value in the monthNames object
//   return monthNames[a[0]] - monthNames[b[0]];
// });

@Component({
  selector: 'app-event-dates',
  templateUrl: './event-dates.component.html'
})
export class EventDatesComponent {
  @Input()
  dateValidityProvider: DateValidity;
  @Input()
  displayIcon: boolean;

  
  constructor(public translate: TranslateService) { 
  }

  get displayTimeZoneInfo(): boolean {
    return shouldDisplayTimeZoneInfo(this.dateValidityProvider);
  }

  get localizedStartDateForMultiDay(): string {
    return this.translate.instant('event-days.not-same-day', {
      '0': this.dateValidityProvider.formattedBeginDate[this.translate.currentLang],
      '1': this.dateValidityProvider.formattedBeginTime[this.translate.currentLang]
    });
  }

  get localizedEndDateForMultiDay(): string {
    return this.translate.instant('event-days.not-same-day', {
      '0': this.dateValidityProvider.formattedEndDate[this.translate.currentLang],
      '1': this.dateValidityProvider.formattedEndTime[this.translate.currentLang]
    });
  }

  
}
