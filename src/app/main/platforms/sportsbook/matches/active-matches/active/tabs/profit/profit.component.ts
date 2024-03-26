import { Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SportsbookApiService } from "../../../../../services/sportsbook-api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { BasePaginatedGridComponent } from "../../../../../../../components/classes/base-paginated-grid-component";
import { AgGridAngular } from "ag-grid-angular";
import { AgBooleanFilterComponent } from "../../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "../../../../../../../components/grid-common/button-renderer.component";
import { NumericEditorComponent } from "../../../../../../../components/grid-common/numeric-editor.component";
import { CheckboxRendererComponent } from "../../../../../../../components/grid-common/checkbox-renderer.component";
import { GridRowModelTypes, ModalSizes } from "../../../../../../../../core/enums";
import { take } from "rxjs/operators";
import 'ag-grid-enterprise';
import { ViewProfitInfoComponent } from "./view-profit-info/view-profit-info.component";
import { SnackBarHelper } from "../../../../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectStateRendererComponent } from 'src/app/main/components/grid-common/select-state-renderer.component';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', { read: ViewContainerRef }) bulkEditorRef!: ViewContainerRef;
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public path: string = 'matches/markettypeprofits';
  public name: string = '';
  public partnerId: number;
  public sportId: number;
  public matchId;
  public pageConfig;
  public filteredData;
  public rowData;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectStateRenderer: SelectStateRendererComponent,
  };
  public selectedData;
  public selected = false;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  private multipleBetsStates = [
    { Id: null, Name: this.translate.instant('Sport.None') },
    { Id: true, Name: this.translate.instant('Common.Yes') },
    { Id: false, Name: this.translate.instant('Common.No') },
  ];

  constructor(protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        sortable: true,
        resizable: true,
        minWidth: 120,
        checkboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Till48HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange1',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.48_24HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange2',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Last24HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange3',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.LiveAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLive',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Till48HoursRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitRange1',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.48_24HoursRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitRange2',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.Last24HoursRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitRange3',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.LiveRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitLive',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.AllowCashout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowCashout',
        resizable: true,
        sortable: false,
        filter: false,
        editable: true,
        cellRenderer: 'selectStateRenderer',
        cellRendererParams: {
          onchange: this.onSelectCashOut['bind'](this),
          Selections: this.multipleBetsStates,
        },
      },
      {
        headerName: "Sport.AllowMultipleBets",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AllowMultipleBets",
        resizable: true,
        sortable: true,
        filter: false,
        floatingFilter: false,
        cellRenderer: 'selectStateRenderer',
        cellRendererParams: {
          onchange: this.onAllowMultipleBetsChange["bind"](this),
          Selections: this.multipleBetsStates,
        },
      },
      {
        headerName: 'Sport.CountLimitPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountLimitPrematch',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Sport.CountLimitLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CountLimitLive',
        sortable: true,
        resizable: true,
        editable: true,
        floatingFilter: true,
        suppressMenu: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
      },
      {
        headerName: 'Common.Open',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: () => `<i class="material-icons">open_in_new</i>`,
        valueGetter: params => {
          let data = {};
          data['MatchId'] = params.data.MatchId;
          data['PartnerId'] = params.data.PartnerId;
          data['MarketTypeId'] = params.data.MarketTypeId;
          return data;
        },
        sortable: false,
        filter: false,
        onCellClicked: this.viewProfit['bind'](this)
      },
      // {
      //   headerName: 'Common.Save',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'save',
      //   resizable: true,
      //   minWidth: 150,
      //   sortable: false,
      //   filter: false,
      //   cellRenderer: 'buttonRenderer',
      //   cellRendererParams: {
      //     onClick: this.saveFinishes['bind'](this),
      //     Label: 'Save',
      //     isDisabled: true
      //   }
      // }
    ]
  }

  onCheckBoxChange(params, val, event) {
    params.AllowMultipleBets = val;
    this.onCellValueChanged(event);
  }

  ngOnInit() {
    this.matchId = this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.pageConfig = {
      MatchId: this.matchId,
      PartnerId: this.partnerId ? this.partnerId : null,
    };
    this.getPartners();
    this.getProfits();
  }

  saveFinishes(params) {
    const row = params.data;
    row.PartnerId = this.pageConfig.PartnerId;
    this.apiService.apiPost('matches/updatemarkettypeprofit', row)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getProfits();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode(nod => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      })
      // this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      // this.gridApi.redrawRows({ rowNodes: [findedNode] });
      this.saveFinishes(event);

    }
  }

  viewProfit(data) {
    const dialogRef = this.dialog.open(ViewProfitInfoComponent, {
      width: ModalSizes.XXL, data: {
        MatchId: data.value.MatchId, PartnerId: this.partnerId, MarketTypeId: data.value.MarketTypeId
      }
    });
  }

  onRowSelected(params) {
    if (params.node.selected) {
      this.selectedData = params;
    }
  }

  isRowSelected() {
    return this.gridApi?.getSelectedRows().length;
  }

  deleteSetting() {
    let row = this.gridApi?.getSelectedRows()[0];
    this.apiService.apiPost('matches/deletemarkettypeprofit', row)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getProfits();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  async addSetting() {
    const { AddSettingComponent } = await import('../profit/add-setting/add-setting.component');
    const dialogRef = this.dialog.open(AddSettingComponent, {
      width: ModalSizes.MEDIUM,
      data: { PartnerId: this.pageConfig.PartnerId, MatchId: this.pageConfig.MatchId }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getProfits();
      }
    });
  }

  getProfits() {
    this.apiService.apiPost(this.path, this.pageConfig)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onPartnerChange(val) {
    this.partnerId = undefined;
    this.partnerId = val;
    this.pageConfig.PartnerId = val;
    this.getProfits();
  }

  onAllowMultipleBetsChange(params, val, event) {
    params.AllowMultipleBets = val;
    this.onCellValueChanged(event);
  }

  onSelectCashOut(params, value: number, event) {
    params.AllowCashout = value;
    this.onCellValueChanged(event);
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  async onBulkEditorOpen() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }

    if (!this.isRowSelected()) {
      return
    }

    const componentInstance = await import('../../../../../competitions-categories/competition-category/tabs/markets/competition-bulk-editor/competition-bulk-editor.component').then(c => c.CompetitionBulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.ids = this.gridApi.getSelectedRows();
    componentRef.instance.matchId = this.matchId;
    componentRef.instance.partnerId = this.partnerId || null;
    componentRef.instance.path = 'matches/bulkupdatemarkettypeprofit';
    componentRef.instance.afterClosed.subscribe(() => {
      this.getProfits();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }

}
