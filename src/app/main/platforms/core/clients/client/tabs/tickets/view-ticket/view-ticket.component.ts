import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonDataService, LocalStorageService} from "../../../../../../../../core/services";
import {CoreSignalRService} from "../../../../../services/core-signal-r.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Methods} from "../../../../../../../../core/enums";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {
  public ticketId;
  public status: number;
  public messages: any = [];
  public signalRSubscription: any;
  public messageText = '';
  public clientId: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private commonDataService: CommonDataService,
    private _signalR: CoreSignalRService,
    private localStorage: LocalStorageService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.ticketId = this.activateRoute.snapshot.queryParams.ticketId;
    this.status = +this.activateRoute.snapshot.queryParams.status;
    this.clientId = +this.activateRoute.snapshot.queryParams.clientId;

    this._signalR.init();
    this.signalRSubscription = this._signalR.connectionEmitter
      .subscribe(connected => {
        if (connected === true) {
          this.getTicketMessages();
        }
      });
  }

  closeTicket() {
    const request = {
      TicketId: this.ticketId,
      Token: this.localStorage.get('token')
    }

    this._signalR.connection.invoke(Methods.CLOSE_TICKET, request).then(data => {
      if (data.ResponseCode === 0) {
        this.status = 2;
        const queryParams = {ticketId: this.ticketId, status: this.status};

        this.router.navigate([], {
          relativeTo: this.activateRoute,
          queryParams: queryParams,
          queryParamsHandling: 'merge',
        }).then(() => {});

        SnackBarHelper.show(this._snackBar, {Description : 'Ticket successfully closed', Type : "success"});

      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  sendMessage() {
    const request = {
      TicketId: this.ticketId,
      Token: this.localStorage.get('token'),
      Message: this.messageText
    }

    this._signalR.connection.invoke(Methods.CREATE_MESSAGE, request).then(data => {
      if (data.ResponseCode === 0) {
        if (data.ResponseObject.Message != '') {
          this.messages.push(data.ResponseObject);
          this.messageText = '';
        }
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  refreshTicket() {
    this.getTicketMessages();
  }

  getTicketMessages() {
    const request = {
      TicketId: this.ticketId,
      Token: this.localStorage.get('token')
    }

    this._signalR.connection.invoke(Methods.GET_TICKET_MESSAGES, request).then(data => {
      if (data.ResponseCode === 0) {
        this.messages = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  ngOnDestroy(): void {
    this.signalRSubscription.unsubscribe();
    this._signalR.stop();
  }

}
