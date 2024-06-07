import {Component, Injector, OnInit} from '@angular/core';
import {BasePaginatedGridComponent} from "../../../../components/classes/base-paginated-grid-component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoreApiService} from "../../services/core-api.service";
import {CommonDataService} from "../../../../../core/services";
import {MatDialog} from "@angular/material/dialog";
import {Controllers, GridMenuIds, Methods, ModalSizes} from "../../../../../core/enums";
import {AgBooleanFilterComponent} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {AgDropdownFilter} from "../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {syncColumnReset, syncColumnSelectPanel} from "../../../../../core/helpers/ag-grid.helper";
import {Paging} from "../../../../../core/models";
import {OpenerComponent} from "../../../../components/grid-common/opener/opener.component";
import {GetServerSideGroupKey, ICellRendererParams, IsServerSideGroup} from "ag-grid-community";

@Component({
  selector: 'app-all-agents',
  templateUrl: './all-agents.component.html',
  styleUrl: './all-agents.component.scss'
})
export class AllAgentsComponent extends BasePaginatedGridComponent implements OnInit {
  private partnerId;
  public partners: any[] = [];
  public genders: any[] = [];
  public userStates: any[] = [];
  public userTypes: any[] = [];
  public agentsLevelsEnums: any[] = [];
  public filteredData;

  public rowData = [];
  public frameworkComponents;


  autoGroupColumnDef = {
    headerName: 'Id',
    field: 'Id',
    filter: 'agNumberColumnFilter',
    filterParams: {
      buttons: ['apply', 'reset'],
      closeOnApply: true,
      filterOptions: this.filterService.numberOptions
    },
    checkboxSelection: false,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
    minWidth: 90,

  };

  isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.AGENTS;
    this.initialTypes();
    this.getAgentLevelsEnum();

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
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
        suppressColumnsToolPanel: false,
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
        headerName: 'Common.Level',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Level',
        sortable: true,
        resizable: true,
        filter: 'agDropdownFilter',
        filterParams: {
          filterOptions: this.filterService.stateOptions,
          filterData: this.agentsLevelsEnums,
        },
      },
      {
        headerName: 'View',
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          if (params.data.UserId) {
            let data = { path: '', queryParams: null };
            data.path = '/main/platform/clients/all-clients/client/main';
            data.queryParams = {clientId: params.data.Id};
            return data;
          } else {
            let data = { path: '', queryParams: null };
            let replacedPart = this.route.parent.snapshot.url[this.route.parent.snapshot.url.length - 1].path;
            data.path = this.router.url.replace(replacedPart, 'agent');
            // data.queryParams = { userId: params.data.Id, partnerId: params.data.PartnerId, levelId: params.data.Level };
            data.queryParams = { agentIds: params.data.Id };
            return data;
          }
        },
        sortable: false
      },

    ];
  }

  onPartnerChange(val: number) {
    this.partnerId = val;
    this.getCurrentPage()
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
        paging.Type = 4;
        paging.WithClients = false;
        paging.WithDownlines = false;
        paging.partnerId = this.partnerId;
        this.changeFilerName(params.request.filterModel,
          ['Type'], ['UserType']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);

        if(!!paging['ag-Grid-AutoColumns']) {
          paging['Ids'] = paging['ag-Grid-AutoColumns'];
          delete paging['ag-Grid-AutoColumns'];          
        }

        this.filteredData = paging;
        if (params.parentNode.data) {
          if (params.parentNode.data?.LevelId === 6) {
            paging['AgentId'] = params.parentNode.data.Id;
            let dateString = "2015-04-01T00:00:00.000Z";
            paging.CreatedFrom = new Date(dateString);
            delete paging.Type;
            this.getClients(paging, params);
          } else {
            paging['ParentId'] = params.parentNode.data.Id;
            delete paging.Type;
            this.getAgents(paging, params);
          }
        } else {
          this.getAgents(paging, params);
        }
      },
    };
  }

  getClients(paging, params) {
    this.apiService.apiPost(this.configService.getApiUrl, paging,
      true, Controllers.CLIENT, Methods.GET_CLIENTS).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          const mappedRows = data.ResponseObject.Entities;
          mappedRows.forEach((entity) => {
            entity.group = false;
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
            let levelId1 = this.agentsLevelsEnums.find((level) => {
              return level.Id == entity.Level
            })
            if (levelId1) {
              entity['LevelId'] = levelId1.Id;
            }
            let levelId = this.agentsLevelsEnums.find((level) => {
              return level.Id == entity.Level
            })
            if (levelId) {
              entity['Level'] = levelId.Name;
            }
          });
          params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      },
    );
  }

  getAgents(paging, params) {
    this.apiService.apiPost(this.configService.getApiUrl, paging,
      true, Controllers.USER, Methods.GET_AGENTS).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const mappedRows = data.ResponseObject.Entities;
        mappedRows.forEach((entity) => {
          entity.group = true;
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
          let levelId1 = this.agentsLevelsEnums.find((level) => {
            return level.Id == entity.Level
          })
          if (levelId1) {
            entity['LevelId'] = levelId1.Id;
          }
          let levelId = this.agentsLevelsEnums.find((level) => {
            return level.Id == entity.Level
          })
          if (levelId) {
            entity['Level'] = levelId.Name;
          }
        })
        params.success({ rowData: mappedRows, rowCount: data.ResponseObject.Count });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
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

  async createAgent() {
    const {CreateAgentComponent} = await import('../../agents/create-agent/create-agent.component');
    const dialogRef = this.dialog.open(CreateAgentComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getCurrentPage();
    })
  }

  private getAgentLevelsEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_AGENT_LEVELS_ENUM)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsLevelsEnums = data.ResponseObject;
        this.setColDefs();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }
}
