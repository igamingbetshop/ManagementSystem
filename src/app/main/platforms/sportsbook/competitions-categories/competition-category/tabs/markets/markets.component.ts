import { Component, OnInit, Injector, ViewContainerRef, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";
import { GridMenuIds, GridRowModelTypes, ModalSizes } from "src/app/core/enums";
import { AgBooleanFilterComponent } from "src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { ButtonRendererComponent } from "src/app/main/components/grid-common/button-renderer.component";
import { CheckboxRendererComponent } from "src/app/main/components/grid-common/checkbox-renderer.component";
import { NumericEditorComponent } from "src/app/main/components/grid-common/numeric-editor.component";
import { SportsbookApiService } from "../../../../services/sportsbook-api.service";
import { MatDialog } from "@angular/material/dialog";
import "ag-grid-enterprise";
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { BaseGridComponent } from "src/app/main/components/classes/base-grid-component";
import {
  syncColumnNestedSelectPanel,
  syncNestedColumnReset,
} from "src/app/core/helpers/ag-grid.helper";
import { SelectStateRendererComponent } from "src/app/main/components/grid-common/select-state-renderer.component";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-markets",
  templateUrl: "./markets.component.html",
  styleUrls: ["./markets.component.scss"],
})
export class MarketsComponent extends BaseGridComponent implements OnInit {
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', {read: ViewContainerRef}) bulkEditorRef!: ViewContainerRef;
  categoryId: number;
  rowData = [];
  cacheBlockSize = 5000;
  name: string = "";
  path: string = "competitions/markettypeprofits";
  updatePath: string = "competitions/updatemarkettypeprofit";
  deletePath: string = "competitions/deletemarkettypeprofit";

  private multipleBetsStates = [
    {Id: null,  Name: this.translate.instant('Sport.None')},
    {Id: true, Name: this.translate.instant('Common.Yes')},
    {Id: false, Name: this.translate.instant('Common.No')},
  ]

  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectStateRenderer: SelectStateRendererComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  private marketTypeIds: number[];

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_COMPETITON_TEMPLATES_MARKETS;
    this.columnDefs = [
      {
        headerName: "Sport.MarketTypeId",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "MarketTypeId",
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        cellStyle: {
          color: "#076192",
          "font-size": "12px",
          "font-weight": "500",
        },
        floatingFilter: true,
      },
      {
        headerName: "Common.Name",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "Name",
        sortable: true,
        resizable: true,
        floatingFilter: true,
      },
      {
        headerName: "Sport.Till48HoursAP",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AbsoluteProfitRange1",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.48_24HoursAP",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AbsoluteProfitRange2",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.Last24HoursAP",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AbsoluteProfitRange3",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.LiveAP",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AbsoluteProfitLive",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.Till48HoursRL",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "RelativeLimitRange1",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.48_24HoursRL",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "RelativeLimitRange2",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.Last24HoursRL",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "RelativeLimitRange3",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.LiveRL",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "RelativeLimitLive",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: 'Sport.AllowCashout',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowCashout',
        resizable: true,
        sortable: true,
        editable: true,
        cellRenderer: 'selectStateRenderer',
        cellRendererParams: {
          onchange: this.onSelectCashOut['bind'](this),
          Selections: this.multipleBetsStates,
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color, height: '52px'};
          } else {
            return null;
          }
        }
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
        headerName: "Sport.Last24HoursAP",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "AbsoluteProfitRange3",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.CountLimitPrematch",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "CountLimitPrematch",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
      {
        headerName: "Sport.CountLimitLive",
        headerValueGetter: this.localizeHeader.bind(this),
        field: "CountLimitLive",
        resizable: true,
        sortable: true,
        editable: true,
        floatingFilter: true,
        cellEditor: "numericEditor",
      },
    ];
  }

  ngOnInit() {
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.categoryId = +this.activateRoute.snapshot.queryParams.categoryId;
    this.gridStateName = "competition-catagories-markets-grid-state";
    this.getPage();
  }

  isRowSelected() {
    return this.gridApi?.getSelectedRows().length;
  }

  onCellValueChanged(event) {
    if (event.oldValue !== event.value) {
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.gridApi.forEachNode((nod) => {
        if (nod.rowIndex == node) {
          findedNode = nod;
        }
      });
      // this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      // this.gridApi.redrawRows({rowNodes: [findedNode]});
      this.saveProfitSettings(event);
    }
  }

  async addSettings() {
    const { CreateMarketComponent } = await import(
      "../../tabs/markets/create-market/create-market.component"
    );
    const dialogRef = this.dialog.open(CreateMarketComponent, {
      width: ModalSizes.LARGE,
      data: { marketTypeIds: this.marketTypeIds },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) this.rowData.unshift(data);
        this.gridApi.setRowData(this.rowData);
      });
  }

  onAllowMultipleBetsChange(params, value: number, event) {
    params.AllowMultipleBets = value;
    this.onCellValueChanged(event);
  }

  saveProfitSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row).subscribe((data) => {
      if (data.Code === 0) {
      } else {
        SnackBarHelper.show(this._snackBar, {
          Description: data.Description,
          Type: "error",
        });
      }
    });
  }

  delete() {
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService
      .apiPost(this.deletePath, { Id: row.Id })
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, {
            Description: data.Description,
            Type: "error",
          });
        }
      });
  }

  onGridReady(params) {
    syncColumnNestedSelectPanel();
    syncNestedColumnReset();
    super.onGridReady(params);
  }

  getPage() {
    let data = {
      PartnerId: null,
      CompetitionCategoryId: String(this.categoryId),
      LanguageId: null,
    };
    this.apiService
      .apiPost(this.path, data)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          this.marketTypeIds = this.rowData.map((data) => data.MarketTypeId);
        } else {
          SnackBarHelper.show(this._snackBar, {
            Description: data.Description,
            Type: "error",
          });
        }
      });
  }

  onSelectCashOut(params, value: number, event) {
    params.AllowCashout = value;
      this.onCellValueChanged(event);
  }

  exportToCsv() {
    const filter = {
      PartnerId: null,
      CompetitionCategoryId: String(this.categoryId),
      LanguageId: null,
    }
    this.apiService.apiPost('/competitions/exportmarkettypeprofits', filter).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
        this.gridApi.closeToolPanel();
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

    const componentInstance = await import('./competition-bulk-editor/competition-bulk-editor.component').then(c => c.CompetitionBulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.ids =  this.gridApi.getSelectedRows();
    componentRef.instance.competitionCategoryId =  this.categoryId;
    componentRef.instance.path = 'competitions/bulkupdatemarkettypeprofit';
    componentRef.instance.afterClosed.subscribe(() => {
      this.getPage();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }
}
