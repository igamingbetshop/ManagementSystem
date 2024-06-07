import { Component, Injector, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, Methods, ModalSizes, ObjectTypes } from '../../../../../core/enums';
import { BasePaginatedGridComponent } from '../../../../components/classes/base-paginated-grid-component';
import { OpenerComponent } from '../../../../components/grid-common/opener/opener.component';
import { Paging } from '../../../../../core/models';
import { CommonDataService } from '../../../../../core/services';
import { AgBooleanFilterComponent } from '../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from '../../../../../core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { syncColumnReset, syncColumnSelectPanel, syncPaginationWithBtn, } from "../../../../../core/helpers/ag-grid.helper";
import { AgDropdownFilter } from "../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { ServerCommonModel } from 'src/app/core/models/server-common-model';
import { GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-enterprise';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';
import { ExportService } from "../../services/export.service";

@Component({
  selector: 'all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.scss']
})
export class AllClientsComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  rowData = [];
  countries: ServerCommonModel[] = [];
  frameworkComponents;
  partners = [];
  genders = [];
  underMonitoringTypes = [];
  categories = [];
  clientStates;
  languages = [];
  partnerId;
  fromDate = new Date();
  toDate = new Date();
  clientData = {};
  selectedItem = 'today';
  paginationPage = 1;
  currencies = [];
  genderFilters = [];
  countriesEnum;

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    public activateRoute: ActivatedRoute,
    private exportService: ExportService,
    private commonDataService: CommonDataService) {
    super(injector);
    this.getCountry();
    this.adminMenuId = GridMenuIds.ALL_CLIENTS;
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
      agDateTimeFilter: AgDateTimeFilter
    };
  }

  ngOnInit() {
    this.setTime();
    this.gridStateName = 'clients-grid-state';
    this.currencies = this.commonDataService.currencyNames.map(data => { return { Id: data, Name: data }; });
    this.partners = this.commonDataService.partners;
    this.genders = this.commonDataService.genders;
    this.languages = this.commonDataService.languages;
    this.getUnderMonitoringTypes();
    this.getClientStates();
    this.getCategories();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  getCountry() {
    this.apiService.apiPost(this.configService.getApiUrl, { TypeId: 5 }, true,
      Controllers.REGION, Methods.GET_REGIONS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.countries = data.ResponseObject;
          this.countriesEnum = this.setEnum(data.ResponseObject);
        }
      });
  }

  getCategories() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_CLIENT_CATEGORIES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.categories = data.ResponseObject;
        }
      });
  }

  getUnderMonitoringTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_UNDER_MONITORING_TYPES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.underMonitoringTypes = data.ResponseObject;
        }
      });
  }

  getClientStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_CLIENT_STATES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.clientStates = data.ResponseObject;
        }
        this.setColumnDefs();
      });
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        minWidth: 90,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressToolPanel: false,
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        headerTooltip: 'CurrencyId',
        resizable: true,
        sortable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.currencies,
          filterType: 'text'
        }
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },

        cellRenderer: (params) => {

          const note = `<mat-icon data-action-type="view-note" class="mat-icon material-icons" style="font-size: 18px; width: 18px; height: 20px; vertical-align: middle"> ${params.data.HasNote ? 'folder' : 'folder_open'}</mat-icon>`;
          const names = `<span data-action-type="view-name">${params.data.UserName}</span>`;
          return `${note} ${names}`;
        },
        cellStyle: { cursor: 'pointer', 'text-decoration': 'underline' },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.genders,
        },
      },
      {
        headerName: 'Common.Age',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Age',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.BirthDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BirthDate',
        resizable: true,
        sortable: true,
        filter: 'agDateColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions,
        },

        cellRenderer: function (params) {
          if (params.data.BirthDate) {
            const dateString = params.data.BirthDate;
            const [month, day, year] = dateString.split(/\D/);

            const formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric"
            });

            return formattedDate;
          } else {
            return "";
          }
        },
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.DocumentNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentNumber',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.IssuedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentIssuedBy',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        sortable: true,
        resizable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountryId',
        resizable: true,
        sortable: false,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.countries,
        },
      },
      {
        headerName: 'Clients.City',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'City',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.AffiliateReferralId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliateReferralId',
        resizable: true,
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Clients.Address',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Address',
        resizable: true,
        sortable: true,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Clients.MobileNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileNumber',
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
        headerName: 'Clients.PhoneNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PhoneNumber',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.stateOptions
        },
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.stateOptions
        },
      },
      {
        headerName: 'Clients.DocumentVerified',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsDocumentVerified',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Clients.AffiliateId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliateId',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Clients.AffiliatePlatformId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AffiliatePlatformId',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.ZipCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ZipCode',
        resizable: true,
        sortable: true,
        hide: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.clientStates
        },
      },
      {
        headerName: 'Common.LastUpdateTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastUpdateTime',
        sortable: false,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        hide: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastUpdateTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.RealBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RealBalance',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.BonusBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusBalance',
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Clients.SendPromotions',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SendPromotions',
        sortable: true,
        filter: 'agBooleanColumnFilter',
      },
      {
        headerName: 'Payments.LastDepositDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastDepositDate',
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastDepositDate, 'medium') || "";
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.LastSessionDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastSessionDate',
        sortable: true,
        filter: 'agDateTimeFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        cellRenderer: function (params) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.LastSessionDate, 'medium') || "";
          return `${dat}`;
        },
      },
      {
        headerName: 'Clients.UnderMonitoringTypes',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UnderMonitoringTypes',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.underMonitoringTypes,
        },
      },
      {
        headerName: 'Common.RegionIsoCode',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionIsoCode',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions,
        }
      },
      {
        headerName: 'Clients.HasNote',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'HasNote',
        sortable: false,
        filter: false,
        suppressMenu: true,
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        minWidth: 60,
        filter: false,
        valueGetter: params => {
          let data = { path: 'client', queryParams: null };
          data.queryParams = { clientId: params.data.Id };
          return data;
        },
        sortable: false
      },
    ];
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

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncPaginationWithBtn();
    syncColumnReset();

    if (window['searchData']) {
      this.gridApi.setServerSideDatasource(this.createServerSideDatasourceManual());
    } else {
      this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
    }

  }

  createServerSideDatasourceManual = () => {
    return {
      getRows: (params) => {
        const mappedRows = window['searchData'];
        this.mapData(mappedRows);
        params.success({ rowData: mappedRows, rowCount: mappedRows.length })
      },
    };
  };

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        let paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.CreatedFrom = this.fromDate;
        paging.CreatedBefore = this.toDate;
        if (this.partnerId) {
          paging.PartnerId = this.partnerId;
        }
        this.changeFilerName(params.request.filterModel,
          ['CurrencyId', 'City'], ['Currencie', 'Citie']);
        this.setSort(params.request.sortModel, paging);
        this.setFilter(params.request.filterModel, paging);
        if (paging.UnderMonitoringTypess) {
          paging.UnderMonitoringTypes = paging.UnderMonitoringTypess.ApiOperationTypeList[0].IntValue;
          delete paging.UnderMonitoringTypess;
        }
        if (paging.IsDocumentVerifieds) {
          paging.IsDocumentVerified = paging.IsDocumentVerifieds.ApiOperationTypeList[0].BooleanValue;
          delete paging.IsDocumentVerifieds;
        }

        this.clientData = paging;
        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.CLIENT, Methods.GET_CLIENTS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((items) => {
                if (this.countriesEnum?.[items.CountryId]) {
                  items.CountryId = this.countriesEnum[items.CountryId];
                }
              });
              this.mapData(mappedRows);
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
            }
          },
          );
      },
    };
  };

  mapData(mappedRows) {
    mappedRows.map((payment) => {
      payment.PartnerId = this.partners.find((partner) => partner.Id === payment.PartnerId)?.Name;
      payment.Gender = this.genders.find((gender) => gender.Id === payment.Gender)?.Name;
      payment.LanguageId = this.languages.find((language) => language.Id === payment.LanguageId)?.Name;
      payment.CategoryId = this.categories.find((category) => category.Id === payment.CategoryId)?.Name;
      payment.State = this.clientStates?.find((state) => state.Id === payment.State)?.Name;
      payment.HasNote = payment.HasNote ? 'Yes' : 'No';
      if (payment.UnderMonitoringTypes) {
        let underMonitoringTypesNames = '';
        payment.UnderMonitoringTypes.forEach(element => {
          underMonitoringTypesNames += this.underMonitoringTypes.find((category) => category.Id === element)?.Name + " ";
          payment.UnderMonitoringTypes = underMonitoringTypesNames
        });
      }
      return payment;
    });
  }

  async createClient() {
    const { CreateClientComponent } = await import('../../clients/create-client/create-client.component');
    const dialogRef = this.dialog.open(CreateClientComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getCurrentPage();
      }
    });
  }

  getQuickFindObject(value: string) {
    return {
      IsAnd: true,
      ApiOperationTypeList: [{
        OperationTypeId: 7,
        StringValue: value
      }]
    };
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e;
      let actionType = e.event.target.getAttribute('data-action-type');

      switch (actionType) {
        case 'view-name':
          return this.goToClient(data);
        case 'view-note':
          return this.openNotes(data);
      }
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  async openNotes(params) {
    const { ViewNoteComponent } = await import('../../../../components/view-note/view-note.component');
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      width: ModalSizes.EXTRA_LARGE,
      data: { ObjectId: params.data.Id, ObjectTypeId: ObjectTypes.Client, Type: 1 }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

  goToClient(event) {
    const row = event.data;
    this.router.navigate(['main/platform/clients/all-clients/client/main'], { queryParams: { 'clientId': row.Id } });
  }

  getContextMenuItems(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    return [
      {
        name: `Open  ${params.node.data.UserName}`,
        action: () => {
          const url = `main/platform/clients/all-clients/client/main?clientId=${params.node.data.Id}`;
          window.open(url, '_blank');
        },
      },
      'copy'
    ];
  }

  exportToCsv() {
    this.exportService.exportToCsv(Controllers.CLIENT, Methods.EXPORT_CLIENTS, { ...this.clientData, adminMenuId: this.adminMenuId });
  }

  async sendMailToPlayer() {
    const _filterClient = [];
    this.agGrid.api.forEachNode((node) => {
      _filterClient.push(node.data.Id)
    });
    if (_filterClient.length == 0) {
      return
    }
    const { SendMailToPlayerComponent } = await import('../client/tabs/main/send-mail-to-player/send-mail-to-player.component');
    const dialogRef = this.dialog.open(SendMailToPlayerComponent, {
      width: ModalSizes.MEDIUM,
      data: {
        method: "SEND_EMAIL_TO_CLIENTS",
        filterClient: this.clientData,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    });
  }

}
