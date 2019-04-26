import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TicketInfo } from '../model/ticket-info';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ticket, AdditionalField } from '../model/ticket';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder) { }


    getTicketInfo(eventName: string, ticketIdentifier: string): Observable<TicketInfo> {
        return this.http.get<TicketInfo>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`);
    }

    sendTicketByEmail(eventName: string, ticketIdentifier: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}/send-ticket-by-email`, {});
    }

    buildFormGroupForTicket(ticket: Ticket) : FormGroup {
        return this.formBuilder.group(this.buildTicket(ticket));
    }


    updateTicket(eventName: string, ticketIdentifier: string, ticket) : Observable<any> {
      return this.http.post(`/api/v2/public/tmp/event/${eventName}/ticket/${ticketIdentifier}/assign`, ticket);
    }

    private buildTicket(ticket: Ticket): {firstName: string, lastName: string, email: string, additional: FormGroup} {
        return {
            firstName: ticket.firstName,
            lastName: ticket.lastName,
            email: ticket.email,
            additional: this.buildAdditionalFields(ticket.ticketFieldConfigurationBeforeStandard, ticket.ticketFieldConfigurationAfterStandard)
        }
    }

    private buildAdditionalFields(before: AdditionalField[], after: AdditionalField[]) : FormGroup {
        let additional = {};
        if (before) {
          this.buildSingleAdditionalField(before, additional);
        }
        if (after) {
          this.buildSingleAdditionalField(after, additional);
        }
        return this.formBuilder.group(additional);
      }
    
      private buildSingleAdditionalField(a: AdditionalField[], additional: {}): void {
        a.forEach(f => {
          const arr = [];
          f.fields.forEach(field => {
            arr.push(this.formBuilder.control(field.fieldValue));
          });
          additional[f.name] = this.formBuilder.array(arr)
        })
      }
}