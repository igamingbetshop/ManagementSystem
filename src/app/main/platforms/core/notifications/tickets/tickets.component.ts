import { DatePipe } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { Controllers, GridMenuIds, Methods, ModalSizes, StatusNames } from 'src/app/core/enums';
import 'ag-grid-enterprise';
import { CommonDataService, LocalStorageService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CoreSignalRService } from "../../services/core-signal-r.service";
import { MatDialog } from "@angular/material/dialog";
import { Paging } from 'src/app/core/models';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent extends BasePaginatedGridComponent implements OnInit, OnDestroy {

  public rowData = [];
  public partners: any[] = [];
  private partnerId = 1;
  public frameworkComponents;
  public unreadsOnly = false;
  public ticketsTypesEnum: any[] = [];
  public signalRSubscription: any;
  public partnersPlaceholder: string;
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();

  constructor(
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private localStorage: LocalStorageService,
    private _signalR: CoreSignalRService,
    private dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_TICKETS;
    this.columnDefs = [
      {
        field: 'Id',
        resizable: true,
        tooltipField: 'Id',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.Subject',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Subject',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserFirstName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserLastName',
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Common.LastMessageTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastMessageTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastMessageTime, 'medium');
          return `${dat}`;
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'ticket');
          data.queryParams = { ticketId: params.data.Id, status: params.data.Status };
          return data;
        },
        cellStyle: (params) => this.getCellStyle(params.data.UnreadMessagesCount),
      },
    ];
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
    }
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.getTicketTypes();
    this.setTime();
    this.gridStateName = 'tickets-grid-state';

    this._signalR.init();
    this.signalRSubscription = this._signalR.connectionEmitter
      .subscribe(connected => {
        if (connected === true) {
          this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
        }
      });

    this.setPartnersPlaysholder()
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    this.partnerId = event.partnerId;
    this.getCurrentPage();
  }

  getTicketTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_TICKETS_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.ticketsTypesEnum = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setPartnersPlaysholder() {
    this.partnersPlaceholder = this.partners.length > 1 ? this.translate.instant('Partners.SelectPartner') : this.partners[0].Name;
  }

  getCellStyle(unreadMessagesCount: number) {
    if (unreadMessagesCount === 0) {
      return { backgroundColor: '#BCE1BA' };
    }
    return { backgroundColor: '#DBB3B9' };
  }

  unreadChange(isRead: boolean) {
    this.unreadsOnly = isRead;
    this.gridApi.refreshServerSideStore({ purge: true });
  }

  async creteNewTicket() {
    const { AddTicketComponent } = await import('../tickets/add-ticket/add-ticket.component');
    const dialogRef = this.dialog.open(AddTicketComponent, {
      width: ModalSizes.MEDIUM,
      data: { partnerId: this.partnerId }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.gridApi.refreshServerSideStore({ purge: true });
      }
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.PartnerId = this.partnerId;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.SkipCount = params.request.startRow / this.cacheBlockSize;
        paging.CreatedFrom = this.fromDate;
        paging.LanguageId = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
        paging.Token = this.localStorage.get('token');
        paging.UnreadsOnly = this.unreadsOnly;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this._signalR.connection.invoke(Methods.GET_TICKETS, paging).then(data => {
          if (data.ResponseCode === 0) {
            this.rowData = data.ResponseObject.Tickets
              .map((question) => {
                question.PartnerName = this.partners.find((partner) => partner.Id === question.PartnerId)?.Name;
                question.StatusName = StatusNames[question.Status]
                return question;
              });

            params.success({ rowData: this.rowData, rowCount: data.ResponseObject.Count });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
          }
        });

      },
    };
  }

  ngOnDestroy(): void {
    this.signalRSubscription.unsubscribe();
    this._signalR.stop();
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => { this.gridApi.setServerSideDatasource(this.createServerSideDatasource()); }, 0);
  }

}
