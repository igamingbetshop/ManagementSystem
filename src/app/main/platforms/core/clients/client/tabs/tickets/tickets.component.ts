import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { CommonDataService, ConfigService, LocalStorageService } from "../../../../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import 'ag-grid-enterprise';
import { take } from "rxjs/operators";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { DatePipe } from "@angular/common";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { CoreSignalRService } from "../../../../services/core-signal-r.service";
import { ExportService } from "../../../../services/export.service";


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public clientId: number;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowData;
  public signalRSubscription: any;
  public partners: any[] = [];
  private filteredClientId: { [key: string]: any };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private commonDataService: CommonDataService,
    private _signalR: CoreSignalRService,
    private exportService: ExportService,
    private localStorage: LocalStorageService) {
    super(injector);
    this.adminMenuId = GridMenuIds.CLIENTS_TICKETS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.Subject',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Subject',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      // {
      //   headerName: 'Clients.Message',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'Message',
      //   sortable: true,
      //   resizable: true,
      //   filter: false,
      //   suppressMenu: true
      // },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.TypeName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.UnreadMessagesCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnreadMessagesCount',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        resizable: true,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        suppressMenu: true,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          let url = this.router.url.replace(replacedPart, 'ticket') + '&';
          data.path = url.split('?')[0];
          // data.path = url;
          data.queryParams = { ticketId: params.data.Id, status: params.data.Status, clientId: this.clientId };

          return data;
        },
        sortable: false
      }
    ]
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.partners = this.commonDataService.partners;

    this._signalR.init();
    this.signalRSubscription = this._signalR.connectionEmitter.subscribe(connected => {
      if (connected === true) {
        this.getTickets();
      }
    });
  }

  getTickets() {
    const request = {
      TakeCount: Number(this.cacheBlockSize),
      SkipCount: 0,
      Token: this.localStorage.get('token'),
      UnreadsOnly: false,
      ClientIds: { IsAnd: true, ApiOperationTypeList: [{ IntValue: this.clientId, DecimalValue: this.clientId, OperationTypeId: 1 }] }
    };
    this._signalR.connection.invoke(Methods.GET_TICKETS, request).then(data => {
      if (data.ResponseCode === 0) {
        this.rowData = data.ResponseObject.Tickets.map((question) => {
          question.PartnerName = this.partners.find((partner) => partner.Id === question.PartnerId)?.Name;
          return question;
        });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async creteNewTicket() {
    const { CreateNewTicketComponent } = await import('./create-new-ticket/create-new-ticket.component');
    const dialogRef = this.dialog.open(CreateNewTicketComponent, {
      width: ModalSizes.MEDIUM,
      // data: {partnetId: this.,}
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getTickets()
      }
    })
  }


  exportToCsv() {
    this.exportService.exportToCsv(Controllers.CLIENT, Methods.EXPORT_CLIENT_MESSAGES, { TakeCount: 100, SkipCount: 0, ClientIds: this.filteredClientId });
  }

}
