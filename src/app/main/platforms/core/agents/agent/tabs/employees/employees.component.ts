import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {Controllers, Methods} from "../../../../../../../core/enums";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {AgDropdownFilter} from "../../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {syncColumnReset, syncColumnSelectPanel} from "../../../../../../../core/helpers/ag-grid.helper";
import {ActivatedRoute} from "@angular/router";
import {Paging} from "../../../../../../../core/models";
import {OpenerComponent} from "../../../../../../components/grid-common/opener/opener.component";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent extends BasePaginatedGridComponent implements OnInit {
  private partnerId;
  public partners: any[] = [];
  public genders: any[] = [];
  public userStates: any[] = [];
  public userTypes: any[] = [];
  public filteredData;
  userId: any;
  // agentLevelId;
  agentIds;

  public rowData = [];
  public frameworkComponents;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
  ) {
    super(injector);
    this.initialTypes();
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.agentIds = this.activateRoute.snapshot.queryParams.agentIds;
    // this.agentLevelId = +this.activateRoute.snapshot.queryParams.levelId;
    this.gridStateName = 'agents-grid-state';
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
      }

    ];
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.Type = 6;
        paging.WithClients = false;
        paging.WithDownlines = false;
        paging.partnerId = this.partnerId;
        if (this.agentIds) {
          let agentIdArray = this.agentIds.split(',');
          let lastAgentId = agentIdArray[agentIdArray.length - 1];
          paging.ParentId = +lastAgentId;
        } else {
          paging.ParentId = +this.userId;
        }
        // paging.ParentId = +this.userId;
        this.changeFilerName(params.request.filterModel,
          ['Type'], ['UserType']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;

        this.apiService.apiPost(this.configService.getApiUrl, paging,
          true, Controllers.USER, Methods.GET_AGENTS).pipe(take(1)).subscribe(data => {
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
}
