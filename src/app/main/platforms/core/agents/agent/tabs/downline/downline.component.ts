import {Component, Injector, OnInit} from '@angular/core';
import {Controllers, Methods} from "../../../../../../../core/enums";
import {ActivatedRoute, NavigationEnd} from "@angular/router";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {filter, take} from "rxjs";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {Paging} from "../../../../../../../core/models";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {AgDropdownFilter} from "../../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {CellClickedEvent, GetServerSideGroupKey, ICellRendererParams, IsServerSideGroup} from "ag-grid-community";

@Component({
  selector: 'app-downline',
  templateUrl: './downline.component.html',
  styleUrl: './downline.component.scss'
})
export class DownlineComponent extends BasePaginatedGridComponent implements OnInit {
  userId: any;
  partnerId: any;
  agentId: any;
  agentIds: string[] = [];
  userData: any;
  agentsEnums: any;
  agentsLevelsEnums: any;
  // levelTypes = [1];
  levelTypes = [];
  levelTypeNames = [];
  public userNames: any[] = [];
  selectedAgentId;
  lastSelectedItem;
  selectedTabIndex: number = 0;
  public rowData = [];
  public frameworkComponents;
  public partners: any[] = [];
  public genders: any[] = [];
  public userStates: any[] = [];
  public userTypes: any[] = [];
  public filteredData;
  defaultColDef = {
    width: 240,
    editable: false,
    flex: 1,
    sortable: false,
    resizable: true,
    filter: false,
    suppressMenu: true,
    minWidth: 50,
  };

  autoGroupColumnDef = {
    headerName: 'Id',
    field: 'Id',
    checkboxSelection: false,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: CoreApiService,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public commonDataService: CommonDataService,
    protected injector: Injector,
  ) {
    super(injector);
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
    this.userId = this.activateRoute.snapshot.queryParams.agentIds;
    // this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    // this.agentLevelId = +this.activateRoute.snapshot.queryParams.levelId;
    this.gridStateName = 'agents-grid-state';
    this.getAgentLevelsEnum();
    this.initialTypes();
    this.initialStates();
    this.setColDefs();
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.genders = this.commonDataService.genders;
    this.setColDefs();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.route.queryParams.subscribe(params => {
        this.agentId = params.agentIds;
        this.agentIds = [params.agentIds];
        if (this.agentIds[0].length > 1) {
          this.agentIds = params.agentIds.split(',');
          this.userId = this.agentIds[0];
          this.selectedTabIndex = 0;
          this.getAgentChildLevels(this.agentId);
          this.getCurrentPage();
          if (this.agentIds.length === 1) {
            this.getAgent();
          }
        } else if (this.agentIds[0].length === 1) {
          this.userId = this.agentIds[0];
          this.getAgentLevels(this.userId);
          this.getCurrentPage();
          if (this.agentIds.length === 1) {
            this.getAgent();
          }
        }
      });
    });
    this.route.queryParams.subscribe(params => {
      this.agentId = params.agentIds;
      this.agentIds = [params.agentIds];
      if (this.agentIds[0].length > 1) {
        this.agentIds = params.agentIds.split(',');
        this.userId = this.agentIds[0];
        this.selectedTabIndex = 0;
        this.getAgentChildLevels(this.agentId);
        this.getCurrentPage();
        if (this.agentIds.length === 1) {
          this.getAgent();
        }
      } else if (this.agentIds[0].length === 1) {
        this.userId = this.agentIds[0];
        this.getAgentLevels(this.userId);
        this.getCurrentPage();
        if (this.agentIds.length === 1) {
          this.getAgent();
        }
      }
    });
  }

  isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };

  getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  private getAgentLevels(userId) {
    this.apiService.apiPost(this.configService.getApiUrl, +userId, true, Controllers.USER, Methods.GET_EXISTING_LEVELS)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsEnums = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  private getAgentLevelsEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId, true, Controllers.ENUMERATION, Methods.GET_AGENT_LEVELS_ENUM)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsLevelsEnums = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  setColDefs() {
    this.columnDefs = [
      // {
      //   headerName: 'Common.Id',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'Id',
      //   sortable: true,
      //   resizable: true,
      //   tooltipField: 'Id',
      //   minWidth: 90,
      //   cellRendererParams: {suppressPadding: false},
      //   filter: 'agNumberColumnFilter',
      //   filterParams: {
      //     buttons: ['apply', 'reset'],
      //     closeOnApply: true,
      //     filterOptions: this.filterService.numberOptions
      //   },
      //   suppressColumnsToolPanel: false,
      //
      // },
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
      },
      {
        headerName: 'Common.Level',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LevelName',
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
        field: 'View',
        filter: false,
        sortable: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
        </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => {
          if (event.data.UserId) {
            this.toRedirectToClient(event)
          } else {
            this.onViewIconClicked(event)
          }
        },
      },
    ];
  }

  toRedirectToClient(ev: { data: any; }) {
    const id = ev.data.Id;
    this.router.navigate([`/main/platform/clients/all-clients/client/main`], {
      queryParams: {"clientId": id}
    });
  }

  onViewIconClicked(params) {
    const agentId = params.data.Id;
    const level = params.data.Level;
    const userName = params.data.UserName;
    const index = this.agentIds.indexOf(agentId);
    if (index !== -1) {
      this.agentIds.splice(index, 1);
    }
    this.agentIds.push(agentId);
    this.levelTypes.push(level);
    this.levelTypes.forEach(level => {
      const levelName = `(${this.agentsLevelsEnums.find(agent => agent.Id === level)?.Name})`;
      if (levelName && !this.levelTypeNames.includes(levelName)) {
        this.levelTypeNames.push(levelName);
      }
      if (userName && !this.userNames.includes(userName)) {
        this.userNames.push(userName);
      }
    });
    const dataToStore = this.agentIds.map((id, index) => ({
      Id: String(id),
      LevelName: this.levelTypeNames[index],
      UserName: this.userNames[index]
    }));
    localStorage.setItem('agentData', JSON.stringify(dataToStore));
    const queryParams1 = {
      agentIds: this.agentIds.join(',')
    };
    this.router.navigate(['/main/platform/agents/agent/downline'], {queryParams: queryParams1});
  }

  createServerSideDatasource() {
    return {
      getRows: (params) => {
        const paging = new Paging();
        paging.SkipCount = this.paginationPage - 1;
        paging.TakeCount = Number(this.cacheBlockSize);
        paging.Level = this.selectedAgentId;
        // paging.ParentId = +this.userId;
        // let responseMethod;
        // let responseController;
        // if (this.selectedAgentId === 7) {
        //   responseController = Controllers.CLIENT;
        //   responseMethod = Methods.GET_CLIENTS;
        //   let dateString = "2015-04-01T00:00:00.000Z";
        //   paging.CreatedFrom = new Date(dateString);
        // } else {
        //   responseController = Controllers.USER;
        //   responseMethod = Methods.GET_AGENTS;
        //   paging.Level = this.selectedAgentId;
        // }
        if (this.agentIds[0].length > 1) {
          if (this.selectedAgentId === 7) {
            paging.AgentId = +this.lastSelectedItem;
          } else {
            paging.ParentId = +this.lastSelectedItem;
          }
          // paging.ParentId = +this.lastSelectedItem;
        } else if (this.agentIds[0].length === 1) {
          if (this.selectedAgentId === 7) {
            paging.AgentId = +this.userId;
          } else {
            paging.ParentId = +this.userId;
          }
          // paging.ParentId = +this.userId;
        }
        paging.WithClients = false;
        paging.WithDownlines = false;
        this.changeFilerName(params.request.filterModel,
          ['Type'], ['UserType']);
        this.setSort(params.request.sortModel, paging);
        this.setFilterDropdown(params);
        this.setFilter(params.request.filterModel, paging);
        this.filteredData = paging;
        if (params.parentNode.data) {
          if (params.parentNode.data?.Level === 6) {
            paging['AgentId'] = params.parentNode.data.Id;
            delete paging.ParentId;
            delete paging.Level;
            this.getClients(paging, params);
          } else {
            paging['ParentId'] = params.parentNode.data.Id;
            delete paging['Level'];
            this.getAgents(paging, params);
          }
        } else {
          if (this.selectedAgentId === 7) {
            this.getClients(paging, params)
          } else {
            this.getAgents(paging, params);
          }
        }
      },
    };
  }

  getAgents(paging, params) {
    // paging.Level = this.selectedAgentId;
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
            entity['LevelName'] = levelId.Name;
          }
        })
        params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  getClients(paging, params) {
    let dateString = "2015-04-01T00:00:00.000Z";
    paging.CreatedFrom = new Date(dateString);
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
            entity['LevelName'] = levelId.Name;
          }
        })
        params.success({rowData: mappedRows, rowCount: data.ResponseObject.Count});
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  initialStates() {
    this.apiService.apiPost(this.configService.getApiUrl, {}, true, Controllers.ENUMERATION, Methods.GET_USER_STATES_ENUM)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.userStates = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
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

  onTabSelectionChange(event: MatTabChangeEvent): void {
    const selectedAgent = this.agentsEnums[event.index];
    this.selectedAgentId = selectedAgent.Id;
    // if (this.selectedAgentId === 7) {
    //   const index = this.columnDefs.findIndex(col => col.field === "View");
    //   if (index > -1) {
    //     this.columnDefs.splice(index, 1);
    //     this.gridApi.setColumnDefs(this.columnDefs);
    //   }
    // } else {
    //   const viewColumnIndex = this.columnDefs.findIndex(col => col.field === "View");
    //   if (viewColumnIndex === -1) {
    //     this.setColDefs();
    //     this.gridApi.setColumnDefs(this.columnDefs);
    //   }
    // }
    this.getCurrentPage();
  }

  private getAgentChildLevels(param) {
    if (param.includes(',')) {
      this.lastSelectedItem = param.split(',').pop();
    } else {
      this.lastSelectedItem = param;
    }
    this.apiService.apiPost(this.configService.getApiUrl, +this.lastSelectedItem, true, Controllers.USER, Methods.GET_EXISTING_LEVELS)
      .pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.agentsEnums = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  getAgent() {
    this.apiService.apiPost(this.configService.getApiUrl, this.userId,
      true, Controllers.USER, Methods.GET_USER_BY_ID).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const agent = data.ResponseObject;
        this.levelTypes.push(agent['Level']);
        const levelName = `(${this.agentsLevelsEnums.find(ag => ag.Id === agent['Level'])?.Name})`;
        if (levelName && !this.levelTypeNames.includes(levelName)) {
          this.levelTypeNames.push(levelName);
        }
        if (agent['UserName'] && !this.userNames.includes(agent['UserName'])) {
          this.userNames.push(agent['UserName']);
        }
        const dataToStore = this.agentIds.map((id, index) => ({
          Id: String(id),
          LevelName: this.levelTypeNames[index],
          UserName: this.userNames[index]
        }));
        localStorage.setItem('agentData', JSON.stringify(dataToStore));
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }
}
