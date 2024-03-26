import {Component, OnInit} from '@angular/core';
import {
  CellValueChangedEvent,
  ColDef, GetServerSideGroupKey,
  GridApi, GridReadyEvent,
  ICellRendererParams,
  IsServerSideGroup,
  ServerSideStoreType
} from "ag-grid-community";
import {Controllers, GridRowModelTypes, Methods} from "../../../../../../../core/enums";
import {CoreApiService} from "../../../../services/core-api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfigService} from "../../../../../../../core/services";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-commission-plan',
  templateUrl: './commission-plan.component.html',
  styleUrl: './commission-plan.component.scss'
})
export class CommissionPlanComponent implements OnInit {
  public userId;
  public agentIds;
  // agentLevelId;
  public gridApi: GridApi;
  public rowData: any[];
  public rowData1;
  public columnDefs: ColDef[] = [
    {

      field: 'Id',
      hide: true},
    {field: 'Name',},
    {field: 'ParentId'},
    {
      field: 'Percent',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      cellEditor: 'numericEditor'
    },
    {
      field: 'TurnoverPercent',
      editable: true,
      onCellValueChanged: (event: CellValueChangedEvent) => this.onCellValueChanged(event),
      cellEditor: 'textEditor'
    },
  ];
  public defaultColDef: ColDef = {
    width: 240,
    editable: false,
    filter: 'agTextColumnFilter',
    flex: 1,
    minWidth: 50,
  };
  public autoGroupColumnDef: ColDef = {
    headerName: 'Group Id',
    field: 'Id',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        return params.data.Id;
      },
    },
  };
  public rowModelType: string = GridRowModelTypes.SERVER_SIDE;
  public serverSideStoreType: ServerSideStoreType = 'partial';

  public isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    return dataItem.group;
  };
  public getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    return dataItem.Id;
  };

  constructor(
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    public configService: ConfigService,
    public translate: TranslateService,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.userId = this.activateRoute.snapshot.queryParams.userId;
    this.agentIds = this.activateRoute.snapshot.queryParams.agentIds;
    // this.agentLevelId = +this.activateRoute.snapshot.queryParams.levelId;
    this.getCommissionPlan();
  }

  onCellValueChanged(params) {
    const product = params.data.Settings;
    product.Percent = params.data.Percent;
    product.TurnoverPercent = params.data.TurnoverPercent;
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    const req = {
      Id: product.Id,
      Percent: Number(product.Percent),
      TurnoverPercent: product.TurnoverPercent,
      ProductId: product.ProductId,
      AgentID: requestObject
    }
    this.apiService.apiPost(this.configService.getApiUrl, req,
      true, Controllers.USER, Methods.UPDATE_COMMISSION_PLAN).pipe(take(1)).subscribe(data => {
      if (data.ResponseCode === 0) {
        const products = data.ResponseObject;

        for (let i = 0; i < products.length; i++) {
          if (products[i].ProductId == params.data.Id) {
            params.data.Percent = products[i];
            params.data.TurnoverPercent = products[i];
            break;
          }
        }

      } else {
        params.data.Percent = params.oldValue;
        params.data.PercentTurnoverPercent = params.oldValue;
      }
    });
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {

        const filter: any = {};
        filter.SkipCount = 0;
        filter.TakeCount = -1;

        if (params.parentNode.level == -1) {
          filter.ProductId = 1;
        } else {
          filter.ParentId = params.parentNode.data.Id;
        }


        this.apiService.apiPost(this.configService.getApiUrl, filter,
          true, Controllers.PRODUCT, Methods.GET_PRODUCTS).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.mapProducts(data.ResponseObject.Entities);
            params.success({rowData: data.ResponseObject.Entities, rowCount: data.ResponseObject.Count});
          }
        });
      },
    };
  }

  mapProducts = (products) => {
    products.forEach(product => {
      let settings = this.rowData1.find(p => p.ProductId == product.Id);
      if (!settings) {
        settings = {Id: 0, ProductId: product.Id, Percent: null};
      }

      product.Settings = settings;
      product.Percent = settings.Percent;
      product.TurnoverPercent = settings.TurnoverPercent;
      product.group = !product.IsLeaf;
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  getCommissionPlan() {
    let requestObject;
    if (this.agentIds) {
      let agentIdArray = this.agentIds.split(',');
      let lastAgentId = agentIdArray[agentIdArray.length - 1];
      requestObject = lastAgentId;
    } else {
      requestObject = this.userId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, {AgentId: requestObject}, true,
      Controllers.USER, Methods.GET_COMMISSION_PLAN).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.rowData1 = data.ResponseObject
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }


  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }

}
