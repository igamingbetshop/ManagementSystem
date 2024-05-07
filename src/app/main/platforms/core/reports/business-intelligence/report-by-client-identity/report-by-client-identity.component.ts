import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";

import { AgGridAngular } from "ag-grid-angular";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';

import { CommonDataService, ConfigService } from "../../../../../../core/services";
import { Controllers, GridMenuIds, Methods, ModalSizes } from "../../../../../../core/enums";
import { CoreApiService } from "../../../services/core-api.service";
import { Paging } from "../../../../../../core/models";
import { BasePaginatedGridComponent } from "../../../../../components/classes/base-paginated-grid-component";
import { AgBooleanFilterComponent } from "../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../components/grid-common/button-renderer.component";
import { TextEditorComponent } from "../../../../../components/grid-common/text-editor.component";
import { SelectRendererComponent } from "../../../../../components/grid-common/select-renderer.component";
import { NumericEditorComponent } from "../../../../../components/grid-common/numeric-editor.component";
import { ImageRendererComponent } from "../../../../../components/grid-common/image-renderer.component";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { DateTimeHelper } from 'src/app/core/helpers/datetime.helper';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import {ExportService} from "../../../services/export.service";

@Component({
  selector: 'app-report-by-client-identity',
  templateUrl: './report-by-client-identity.component.html',
  styleUrls: ['./report-by-client-identity.component.scss']
})

export class ReportByClientIdentityComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public rowData = [];
  public documentStateName = [];
  public documentTypeName = [];
  public fromDate = new Date();
  public toDate = new Date();
  public clientData = {};
  private stateFilters = [];
  public documentStates = [];
  public filteredData;
  public rowClassRules;
  public partnerId;
  public partners = [];
  public selectedItem = 'today';
  clientId: number | string
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
    numericEditor: NumericEditorComponent,
    imageRenderer: ImageRendererComponent,
    agDropdownFilter: AgDropdownFilter,
    agDateTimeFilter: AgDateTimeFilter
  };

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
    private exportService:ExportService,
    protected injector: Injector) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_REPORT_BY_CLIENT_IDENTITY;

    this.rowClassRules = {
      'kyc-status-2': (params) => {
        let numSickDays = params.data?.State;
        return numSickDays === 2;
      },
      'kyc-status-1': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 1;
      },
      'kyc-status-3': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 3;
      },
      'kyc-status-4': function (params) {
        let numSickDays = params.data?.State;
        return numSickDays === 4;
      },
    };
  }

  ngOnInit(): void {
    this.setTime();
    this.getDocumentType();
    this.getStates();
    this.partners = this.commonDataService.partners;
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

  setColumns() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.ClientId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ClientId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.ClientId) {
            a.innerHTML = `<a href="main/platform/clients/all-clients/client/main?clientId=${params.data.ClientId}">${params.data.ClientId}</a>`;
            return a;
          }
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.NameSurname',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserFirstName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.node.rowPinned) {
            return ''
          } else if (params.data.UserFirstName !== null || params.data.UserLastName !== null) {
            a.innerHTML = `<a href="main/platform/clients/client/kyc?clientId=${params.data.ClientId}">${params.data.UserFirstName + ' ' + params.data.UserLastName}</a>`;
            return a;
          }
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.DocumentType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentTypeId',
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.documentTypeName,
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        resizable: true,
        filter: 'agTextColumnFilter',
        sortable: true,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.UserId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.stateFilters,
          suppressAndOrCondition: true,
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        resizable: true,
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Payments.ExpirationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ExpirationTime',
        resizable: true,
        sortable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ExpirationTime, 'medium');
          if (!!dat) {
            return `${dat}`;
          }
          return '';
        },
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.LastUpdate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        resizable: true,
        sortable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ImagePath',
        resizable: true,
        cellRenderer: 'imageRenderer',
        cellRendererParams: {
          onClick: this.viewPic.bind(this)
        },
        cellStyle: function (params) {
          if (params.data.State == 1) {
            return { color: 'white' };
          } else {
            return null;
          }
        }
      },
    ];
  }

  async viewPic(params) {
    const { ViewImageComponent } = await import('../../../clients/client/tabs/kyc/view-image/view-image.component');
    const dialogRef = this.dialog.open(ViewImageComponent, { width: ModalSizes.MEDIUM, data: { value: params.value, clientId: this.clientId } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  getDocumentType() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.documentTypeName = data.ResponseObject;
          this.setColumns();
        }
      });
  }

  getStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.documentStates = data.ResponseObject;
          this.mapStateFilters();
        }
      });
  }

  onRowClicked(event) {
    this.clientId = event.data.ClientId;
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncColumnReset();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.FromDate = this.fromDate;
        paging.ToDate = this.toDate;

        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        };
        this.changeFilerName(params.request.filterModel, ['ReasonName'], ['OperationTypeId']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, this.filteredData, true,
          Controllers.REPORT, Methods.GET_REPORT_BY_CLIENT_IDENTITY).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities.map((items) => {
                items.DocumentTypeId = this.documentTypeName.find((item => item.Id === items.DocumentTypeId))?.Name;
                items.State = this.documentStates.find((item => item.Id === items.State))?.Name;
                return items;
              });
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.REPORT, Methods.EXPORT_CLIENT_IDENTITIES, { ...this.filteredData, adminMenuId: this.adminMenuId });
  }

  mapStateFilters(): void {
    this.stateFilters.push("empty");
    this.documentStates.forEach(field => {
      this.stateFilters.push({
        displayKey: field.Id,
        displayName: field.Name,
        predicate: (_,) => false,
        numberOfInputs: 0,
      });
    })
  }

  setFilterDropdown(params) {
    const filterModel = params.request.filterModel;

    if (filterModel.State && !filterModel.State.filter) {
      filterModel.State.filter = filterModel.State.type;
      filterModel.State.type = 1;
    }
  }

}
