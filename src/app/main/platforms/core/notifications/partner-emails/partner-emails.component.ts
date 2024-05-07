import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { Paging } from 'src/app/core/models';
import { CommonDataService } from 'src/app/core/services';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import 'ag-grid-enterprise';
import { SnackBarHelper } from '../../../../../core/helpers/snackbar.helper';
import { CellDoubleClickedEvent } from "ag-grid-community";
import { MatDialog } from "@angular/material/dialog";
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { TranslateService } from '@ngx-translate/core';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';



@Component({
  selector: 'app-emails',
  templateUrl: './partner-emails.component.html',
  styleUrls: ['./partner-emails.component.scss']
})
export class PartnerEmailsComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public partners: any[] = [];
  public selectedItem = 'today';
  public fromDate = new Date();
  public toDate = new Date();
  public partnerId;

  public states:any[] = [];

  constructor(
    protected injector: Injector,
    protected commonDataService: CommonDataService,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_PARTNER_EMAILES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.Subject',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Subject',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Clients.Message',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Message',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Clients.EMail',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Receiver',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        filter: false,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
    ];
    this.states = [
      {
        Id: 1,
        Name:  this.translate.instant('Bonuses.Active')
      },
      {
        Id: 2,
        Name:  this.translate.instant('Common.Sent')
      },
      {
        Id: 3,
        Name: this.translate.instant('Common.Failed')
      }
    ];
  }

  ngOnInit() {
    this.setTime(); 
    this.partners = this.commonDataService.partners;
    this.gridStateName = 'emails-grid-state';
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  onDateChange(event: any) {
    this.fromDate = event.fromDate;
    this.toDate = event.toDate;
    if (event.partnerId) {
      this.partnerId = event.partnerId;
    } else {
      this.partnerId = null;
    }
    this.getCurrentPage();
  }

  go() {
    this.getCurrentPage();
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        if(this.partnerId) {
          paging.PartnerIds = {
            "ApiOperationTypeList": [
                {
                    "OperationTypeId": 1,
                    "IntValue": this.partnerId
                }
            ],
            "IsAnd": true
        };
        }
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = this.cacheBlockSize;
        paging.CreatedFrom = this.fromDate;
        paging.CreatedBefore = this.toDate;
        paging.ObjectTypeId = 5;
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.PARTNER, Methods.GET_EMAILS)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.map((entity) => {
                entity.PartnerName = this.partners.find((partner) => partner.Id === entity.PartnerId)?.Name;
                entity.StatusName = this.states.find((state) => state.Id === entity.Status)?.Name;
                return entity;
              });
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          });
      },
    };
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const message = event.value;
    const { ViewHtmlComponent } = await import('../../../../components/view-html/view-html.component');
    const dialogRef = this.dialog.open(ViewHtmlComponent, {
      width: ModalSizes.MEDIUM, data: {
        message
      }
    });
    dialogRef.afterClosed().subscribe(data => { });
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    setTimeout(() => {this.gridApi.setServerSideDatasource(this.createServerSideDatasource());}, 0);
  }

}
