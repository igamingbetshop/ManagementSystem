import {Component, Injector, OnInit} from '@angular/core';
import {BaseGridComponent} from "../../../../../../components/classes/base-grid-component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CoreApiService} from "../../../../services/core-api.service";
import {CommonDataService, ConfigService} from "../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {AgDropdownFilter} from "../../../../../../components/grid-common/ag-dropdown-filter/ag-dropdown-filter.component";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent extends BaseGridComponent implements OnInit {
  public rowData = [];
  public frameworkComponents;
  public rowModelType = GridRowModelTypes.CLIENT_SIDE;
  public userId: number;
  public agentIds;
  public genders: any[] = [];
  public partners: any[] = [];
  public userStates: any[] = [];

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService
  ) {
    super(injector);
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      agDropdownFilter: AgDropdownFilter,
    }
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.agentIds = this.activateRoute.snapshot.queryParams.agentIds;
    this.columnDefs = [];
    this.setColumnDefs();
  }
  ngOnInit(): void {
    this.partners = this.commonDataService.partners;
    this.genders = this.commonDataService.genders;
    this.initialStates();
    this.gridStateName = 'agents-grid-state';
    this.getClients();
  }

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
      },
      {
        headerName: 'Clients.Email',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Email',
        sortable: true,
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
      },
      {
        headerName: 'Clients.UserName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'UserName',
        sortable: true,
      },
      {
        headerName: 'Common.Gender',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Gender',
        sortable: true
      },
      {
        headerName: 'Clients.BirthDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BirthDate',
        sortable: true,
        cellRenderer: function (params: { data: { BirthDate: any; }; }) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.BirthDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Clients.FirstName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FirstName',
        sortable: true,
      },
      {
        headerName: 'Clients.LastName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LastName',
        sortable: true,
      },
      {
        headerName: 'Clients.Country',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Country',
        sortable: true,
        hide: true,
      },
      {
        headerName: 'Clients.MobileNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MobileNumber',
        sortable: true,
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LanguageId',
        sortable: true,
      },
      {
        headerName: 'Clients.DocumentType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DocumentType',
        sortable: true,
        hide: true,
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        sortable: true,
        cellRenderer: function (params: { data: { CreationTime: any; }; }) {
          let datePipe = new DatePipe('en-US');
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Common.BonusBalance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusBalance',
        sortable: false,
      },
    ];
  }

  getClients() {
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, {AgentId: +requestObject},
      true, Controllers.CLIENT, Methods.GET_CLIENTS).pipe(take(1)).subscribe(data => {
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
          });
          this.rowData = mappedRows;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
        }
      },
    );
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
}
