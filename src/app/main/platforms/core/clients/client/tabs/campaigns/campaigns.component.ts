import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from "../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes } from "../../../../../../../core/enums";
import { CoreApiService } from "../../../../services/core-api.service";
import { ActivatedRoute } from "@angular/router";
import { ConfigService } from "../../../../../../../core/services";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgBooleanFilterComponent } from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../components/grid-common/checkbox-renderer.component";
import { TextEditorComponent } from "../../../../../../components/grid-common/text-editor.component";
import { AddCampaignComponent } from "./add-campaign/add-campaign.component";
import { MatDialog } from "@angular/material/dialog";
import { OpenerComponent } from "../../../../../../components/grid-common/opener/opener.component";
import { DatePipe } from "@angular/common";
import { SelectRendererComponent } from "../../../../../../components/grid-common/select-renderer.component";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CLIENT_BOUNUS_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @ViewChild('agGrid2') agGrid2: AgGridAngular;
  public clientId: number;
  public rowModelType: GridRowModelTypes = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public rowData2 = [];
  public columnDefs = [];
  public columnDefs2 = [];
  public clientBonusStatuses = CLIENT_BOUNUS_STATUSES;
  public campaignTypes = [
    { Id: 1, Name: "CashBack" },
    { Id: 2, Name: "Free Spin Bonus" },
    { Id: 3, Name: "Affiliate Bonus" },
    { Id: 5, Name: "Signup Real Bonus" },
    { Id: 10, Name: "Campaign Wager Casino" },
    { Id: 11, Name: "Campaign Cash" },
    { Id: 12, Name: "Campaign Free Bet" },
    { Id: 13, Name: "Campaign Wager Sport" },
    { Id: 14, Name: "Campaign Free Spin" },
  ];
  public clientTriggerStatuses = [
    { Id: 1, Name: 'NotRealised' },
    { Id: 2, Name: 'Realised' }
  ];
  public masterDetail;
  public frameworkComponents;
  public nestedFrameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectRenderer: SelectRendererComponent,
  };
  public blockedData;
  public bonusSettingId;
  public selected = false;
  public clientBonusId: string;
  public detailCellRendererParams: any = {
    detailGridOptions: {
      rowHeight: 47,
      defaultColDef: {
        sortable: true,
        filter: true,
        flex: 1,
      },
      components: this.nestedFrameworkComponents,
      columnDefs: [
        {
          headerName: 'Clients.TriggerId',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Id',
          resizable: true,
          tooltipField: 'Id',
          cellStyle: { color: '#076192' },
          sortable: false,
          filter: false,
          suppressMenu: true,

        },
        {
          headerName: 'Common.Name',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Name',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Bonuses.Description',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Description',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Bonuses.StartTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'StartTime',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.StartTime, 'medium');
            if (params.node.rowPinned) {
              return ''
            } else {
              return `${dat}`;
            }
          },
        },
        {
          headerName: 'Bonuses.FinishTime',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'FinishTime',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
          cellRenderer: function (params) {
            let datePipe = new DatePipe("en-US");
            let dat = datePipe.transform(params.data.FinishTime, 'medium');
            if (params.node.rowPinned) {
              return ''
            } else {
              return `${dat}`;
            }
          },
        },
        {
          headerName: 'Clients.Amount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'SourceAmount',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
          editable: true,
          cellEditor: 'numericEditor',
        },
        {
          headerName: 'Bonuses.MinAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MinAmount',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Bonuses.MaxAmount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'MaxAmount',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Order.Order',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Order',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Bonuses.Percent',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Percent',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Common.TypeName',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'TypeName',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Segments.BetsCount',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'BetsCount',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
        },
        {
          headerName: 'Common.Status',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'Status',
          resizable: true,
          sortable: false,
          filter: false,
          suppressMenu: true,
          editable: true,
          cellRenderer: 'selectRenderer',
          cellRendererParams: {
            onchange: this.onSelectStatusChange['bind'](this),
            Selections: this.clientTriggerStatuses,
          },
        },
        {
          headerName: 'Common.Save',
          headerValueGetter: this.localizeHeader.bind(this),
          field: 'save',
          resizable: true,
          minWidth: 150,
          sortable: false,
          filter: false,
          suppressMenu: true,
          cellRenderer: 'buttonRenderer',
          cellRendererParams: {
            onClick: this.saveFinishes['bind'](this),
            Label: 'Save',
            bgColor: '#3E4D66',
            textColor: 'white'
          }
        }

      ],
      onGridReady: params => {
      },
    },
    getDetailRowData: params => {
      if (params) {
        this.clientBonusId = params.data.Id
        let addedData = {
          BonusSettingId: params.data.BonusId,
          ClientId: params.data.ClientId,
          ReuseNumber: params.data.ReuseNumber,
        }
        this.bonusSettingId = addedData.BonusSettingId;
        this.apiService.apiPost(this.configService.getApiUrl, addedData, true,
          Controllers.CLIENT, Methods.GET_CLIENT_TRIGGERS).pipe(take(1)).subscribe(data => {

            const nestedRowData = data.ResponseObject.Triggers.map((items) => {
              if (items.MinBetCount) {
                items.BetsCount = items.BetCount + "/" + items.MinBetCount;
              } else {
                items.BetsCount = "";
              }
              if (items.WageringAmount || items.WageringAmount == 0) {
                items.MinAmount = items.WageringAmount + "/" + items.MinAmount;
              }
              return items;
            });
            nestedRowData.forEach((entity) => {
              let selectionStatusName = this.clientTriggerStatuses.find((stat) => {
                return stat.Id == entity.Status;
              })
              if (selectionStatusName) {
                entity['StatusName'] = selectionStatusName.Name;
              }
            })
            params.successCallback(nestedRowData);
          })
      }
    },
  }

  constructor(private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    protected injector: Injector,
    public configService: ConfigService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: 'agGroupCellRenderer',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Partners.CampaignId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusId',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusName',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.BonusPrize',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.TurnoverAmountLeft',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TurnoverAmountLeft',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.RemainingCredit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RemainingCredit',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TypeName',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Clients.CreationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CreationTime',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CreationTime, 'medium');
          if (dat) {
            return `${dat}`;
          } else {
            return ''
          }
        },
      },
      {
        headerName: 'Clients.AwardingTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AwardingTime',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.AwardingTime, 'medium');
          if (dat) {
            return `${dat}`;
          } else {
            return ''
          }
        },
      },
      {
        headerName: 'Clients.CalculationTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CalculationTime',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.CalculationTime, 'medium');
          if (dat) {
            return `${dat}`;
          } else {
            return ''
          }
        },
      },
      {
        headerName: 'Clients.FinalAmount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'FinalAmount',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      }
    ]
    this.columnDefs2 = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true
      },
      {
        headerName: 'Change Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.CreatedBy',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'BonusPrize',
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.FirstName !== null || params.data.LastName !== null) {
            a.innerHTML = params.data.FirstName + ' ' + params.data.LastName;
          }
          return a;
        },
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        resizable: true,
        sortable: false,
        filter: false,
        suppressMenu: true,
        valueGetter: params => {
          let data = { path: '', queryParams: null };
          data.path = this.router.url.split('?')[0] + '/' + params.data.Id;
          return data;
        },
      }
    ];
    this.masterDetail = true;
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
      textEditor: TextEditorComponent,
      selectRenderer: SelectRendererComponent,
    }
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getCampaigns();
    this.adminMenuId = GridMenuIds.CLIENTS_CAMPAGINS;

  }

  onSelectStatusChange(params, val) {
    params.Status = val;
  }

  getCampaigns() {
    this.apiService.apiPost(this.configService.getApiUrl, { ClientId: this.clientId, IsCampaign: true }, true,
      Controllers.CLIENT, Methods.GET_CLIENT_BONUSES).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.Entities.map((items) => {
            items.StatusName = this.clientBonusStatuses.find((item => item.Id === items.Status)).Name;
            items.TypeName = this.campaignTypes.find((item => item.Id === items.BonusType))?.Name;
            return items;
          })

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    syncNestedColumnReset();
    this.gridApi = params.api;
    super.onGridReady(params);
  }

  onNestedGridReady(params) {
  }

  onRowGroupOpened(params) {
    if (params.node.expanded) {
      this.gridApi.forEachNode(function (node) {
        if (
          node.expanded &&
          node.id !== params.node.id &&
          node.uiLevel === params.node.uiLevel
        ) {
          node.setExpanded(false);
        }
      });
    }
  }

  async addCampaign() {
    const { AddCampaignComponent } = await import('../campaigns/add-campaign/add-campaign.component');
    const dialogRef = this.dialog.open(AddCampaignComponent, { width: ModalSizes.MEDIUM });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.rowData.push(data);
        this.gridApi.setRowData(this.rowData);
        this.rowData2 = [];
      }
      this.getCampaigns();
    });
  }

  deleteCampaign() {
    if (!this.blockedData) {
      this.selected = false;
      return
    }
    let method = '';
    if (this.blockedData.data.BonusType === 14) {
      method = Methods.CANCEL_FREE_SPIN
    } else {
      method = Methods.CANCEL_CLIENT_BONUS
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.blockedData.data.Id, true,
      Controllers.CLIENT, method).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData.splice(this.blockedData.rowIndex, 1);
          this.gridApi.setRowData(this.rowData);
          this.selected = false;
          this.rowData2 = [];
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  isRowSelected() {
    return this.gridApi && this.gridApi?.getSelectedRows().length !== 0;
  };

  saveFinishes(params) {
    const row = params.data;
    let sData = {
      Status: row.Status,
      SourceAmount: row.SourceAmount,
      TriggerId: row.Id,
      ClientId: String(row.ClientId),
      BonusId: this.bonusSettingId,
      ClientBonusId: this.clientBonusId,
    };
    this.apiService.apiPost(this.configService.getApiUrl, sData, true,
      Controllers.CLIENT, Methods.CHANGE_CLIENT_BONUS_TRIGGER).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.getCampaigns()
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onRowSelected(params) {

    if (params.node.selected) {
      this.selected = true;
      this.blockedData = params;
      this.apiService.apiPost(this.configService.getApiUrl, { ObjectId: params.data.Id, ObjectTypeId: 80 }, true,
        Controllers.REPORT, Methods.GET_OBJECT_CHANGE_HISTORY).pipe(take(1)).subscribe((data) => {
          if (data.ResponseCode === 0) {
            this.rowData2 = data.ResponseObject;
          } else {
            this.rowData2 = [];
          }
        });
    }
  }
}
