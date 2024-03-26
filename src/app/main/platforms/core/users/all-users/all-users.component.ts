import { Component, OnInit, Injector } from '@angular/core';

import { take } from 'rxjs/operators';
import { MatSnackBar } from "@angular/material/snack-bar";
import 'ag-grid-enterprise';
import { MatDialog } from "@angular/material/dialog";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CommonDataService } from 'src/app/core/services';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { Paging } from 'src/app/core/models';
import { Controllers, GridMenuIds, Methods, ModalSizes } from 'src/app/core/enums';
import { CoreApiService } from "../../services/core-api.service";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset, syncColumnSelectPanel } from 'src/app/core/helpers/ag-grid.helper';
import { AgDropdownFilter } from 'src/app/main/components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component';
import {ExportService} from "../../services/export.service";


@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent extends BasePaginatedGridComponent implements OnInit {
  private partnerId;
  public partners: any[] = [];
  public genders: any[] = [];
  public userStates: any[] = [];
  public userTypes: any[] = [];
  public filteredData;

  public rowData = [];
  public frameworkComponents;
  private typeFilters = [];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private exportService:ExportService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.USERS;
    this.initialTypes();


    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.genders = this.commonDataService.genders;
    this.initialStates();
    this.gridStateName = 'users-grid-state';
  }

  initialStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM)
      .pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.userStates = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  initialTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.ENUMERATION, Methods.GET_USER_TYPES_ENUM).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.userTypes = data.ResponseObject;
          this.setColDefs();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  setColDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        tooltipField: 'Id',
        minWidth: 90,
        cellRendererParams: { suppressPadding: false },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressColumnsToolPanel: false,

      },
      {
        headerName: 'Currency.FirstName',
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
        headerName: 'Currency.LastName',
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
        headerName: 'Currency.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Currency.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
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
        headerName: 'Currency.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        headerTooltip: 'CurrencyId',
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
          values: this.commonDataService.currencyNames
        },
      },
      {
        headerName: 'Currency.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
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
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.userTypes,
        },
      },
      {
        headerName: 'Users.UserRoles',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserRoles',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'View',
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
          data.path = this.router.url.replace(replacedPart, 'user');
          data.queryParams = { userId: params.data.Id, partnerId: params.data.PartnerId };
          return data;
        },
        sortable: false
      },

    ];
  }

  // mapTypeFilters(): void {
  //   this.typeFilters.push("empty");
  //   this.userTypes.forEach(field => {
  //     this.typeFilters.push({
  //       displayKey: field.Id,
  //       displayName: field.Name,
  //       predicate: (_,) => false,
  //       numberOfInputs: 0,
  //     });
  //   })
  // }

  onPartnerChange(val: number) {
    this.partnerId = val;
    this.getCurrentPage()
  }

  async createUser() {
    const { CreateUserComponent } = await import('../../users/create-user/create-user.component');
    const dialogRef = this.dialog.open(CreateUserComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getCurrentPage();
    })
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
        paging.partnerId = this.partnerId;
        this.changeFilerName(params.request.filterModel,
          ['Type'], ['UserType']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.USER, Methods.GET_USERS).pipe(take(1)).subscribe(data => {
            if (data.ResponseCode === 0) {
              const mappedRows = data.ResponseObject.Entities;
              mappedRows.forEach((entity) => {
                let partnerName = this.partners.find((partner) => {
                  return partner.Id == entity.PartnerId;
                })
                if (partnerName) {
                  entity['PartnerName'] = partnerName.Name;
                }
                let genderName = this.genders.find((gender) => {
                  return gender.Id == entity.Gender;
                })
                if (genderName) {
                  entity['Gender'] = genderName.Name;
                } else (
                  entity['Gender'] = ''
                )

                let userState = this.userStates.find((state) => {
                  return state.Id == entity.State;
                })
                if (userState) {
                  entity['State'] = userState.Name;
                }

                let userType = this.userTypes.find((type) => {
                  return type.Id == entity.Type
                })
                if (userType) {
                  entity['Type'] = userType.Name;
                }
              })
              params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      },
    };
  }

  setFilterDropdown(params) {
    const filterModel = params.request.filterModel;

    if (filterModel.UserType && !filterModel.UserType.filter) {
      filterModel.UserType.filter = filterModel.UserType.type;
      filterModel.UserType.type = 1;
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  exportToCsv() {
    this.exportService.exportToCsv( Controllers.USER, Methods.EXPORT_USERS, {...this.filteredData, adminMenuId: this.adminMenuId});
  }

}
