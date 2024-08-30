import { Component, OnInit, Injector, ViewContainerRef, ViewChild, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { CommonDataService } from "../../../../../../../core/services";
import { SelectStateRendererComponent } from 'src/app/main/components/grid-common/select-state-renderer.component';
import { MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('bulkMenuTrigger') bulkMenuTrigger: MatMenuTrigger;
  @ViewChild('bulkEditorRef', { read: ViewContainerRef }) bulkEditorRef!: ViewContainerRef;
  competitionId: number;
  partnerId: number | null;
  selectedMarket = signal<any>({});
  rowData = signal<any>([]);
  mappedRowData = signal<any>([]);
  name: string = '';
  path: string = 'competitions/markettypeprofits';
  updatePath: string = 'competitions/updatemarkettypeprofit';
  deletePath: string = 'competitions/deletemarkettypeprofit';
  sportId: number;
  matchId;

  private multipleBetsStates = [
    { Id: null, Name: this.translate.instant('Sport.None') },
    { Id: true, Name: this.translate.instant('Common.Yes') },
    { Id: false, Name: this.translate.instant('Common.No') },
  ];

  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    selectStateRenderer: SelectStateRendererComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  partnerName: string = '';
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private commonDataService: CommonDataService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        checkboxSelection: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Sport.Till48HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange1',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.48_24HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange2',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.Last24HoursAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitRange3',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.AbsoluteProfitLiveRange1',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange1',
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
        headerName: 'Sport.AbsoluteProfitLiveRange2',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange2',
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
        headerName: 'Sport.AbsoluteProfitLiveRange3',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange3',
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
        headerName: 'Sport.AbsoluteProfitLiveRange4',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange4',
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
        headerName: 'Sport.AbsoluteProfitLiveRange5',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange5',
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
        headerName: 'Sport.AbsoluteProfitLiveRange6',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLiveRange6',
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
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.48_24HoursRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitRange2',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.Last24HoursRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitRange3',
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Sport.LiveRL',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RelativeLimitLive',
        editable: true,
        cellEditor: 'numericEditor',
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
      // {
      //   headerName: 'Common.Save',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'save',
      //   resizable: true,
      //   minWidth: 140,
      //   sortable: false,
      //   filter: false,
      //   cellRenderer: 'buttonRenderer',
      //   cellRendererParams: {
      //     onClick: this.saveProfitSettings['bind'](this),
      //     Label: this.translate.instant('Common.Save'),
      //     isDisabled: true
      //   }
      // },
    ];
  }

  ngOnInit() {
    this.sportId = +this.activateRoute.snapshot.queryParams.sportId;
    this.matchId = this.activateRoute.snapshot.queryParams.MatchId;
    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.gridStateName = 'competitions-markets-grid-state';
    this.handlePartner();
    this.getPage();
  }

  handlePartner() {
    this.partnerId = +this.activateRoute.snapshot.queryParams.partnerId;
    const partners = this.commonDataService.partners;
    this.partnerName = partners.find(field => field.Id === this.partnerId)?.Name;
  }

  isRowSelected() {
    return this.gridApi?.getSelectedRows().length;
  }

  async addSettings() {
    const { AddSettingComponent } = await import('../../../../matches/active-matches/active/tabs/profit/add-setting/add-setting.component');
    const dialogRef = this.dialog.open(AddSettingComponent, { width: ModalSizes.LARGE, 
      data: {
        PartnerId: this.partnerId,
        Method: "competitions/createmarkettypeprofit",
      }
     });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        const currentData = this.rowData();
        this.rowData.set([data, ...currentData]);
        this.mappedRowData.set([...currentData]);
        this.gridApi.setRowData(this.mappedRowData());

        const selectedMarket = this.selectedMarket();
        if (selectedMarket.Id) {
          this.filterRowData();
        }
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
      this.saveProfitSettings(event);
    }
  }

  onAllowMultipleBetsChange(params, val, event) {
    params.AllowMultipleBets = val;
    this.onCellValueChanged(event);
  }

  saveProfitSettings(params) {
    const row = params.data;
    row.CompetitionId = this.competitionId;
    row.partnerId = this.partnerId || null;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  delete() {
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost(this.deletePath, { "Id": row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const currentData = this.rowData();
          const index = currentData.findIndex(row => row.Id == data.Id);
          if (index > -1) {
            currentData.splice(index, 1);
            this.rowData.set([...currentData]);
            this.mappedRowData.set([...currentData]);
            this.gridApi.setRowData(this.mappedRowData());

            const selectedMarket = this.selectedMarket();
            if (selectedMarket.Id) {
              this.filterRowData();
            }
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
  }


  getPage() {
    let data = {
      PartnerId: this.partnerId || null,
      CompetitionId: String(this.competitionId),
      LanguageId: null
    }
    this.apiService.apiPost(this.path, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData.set(data.ResponseObject);
          this.mappedRowData.set(data.ResponseObject);

          const selectedMarket = this.selectedMarket();
          if (selectedMarket.Id) {
            this.filterRowData();
          }
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSelectCashOut(params, value: number, event) {
    params.AllowCashout = value;
    this.onCellValueChanged(event);
  }

  async onBulkEditorOpen() {
    if (this.bulkEditorRef) {
      this.bulkEditorRef.clear();
    }

    if (!this.isRowSelected()) {
      return
    }

    const componentInstance = await import('../../../../competitions-categories/competition-category/tabs/markets/competition-bulk-editor/competition-bulk-editor.component').then(c => c.CompetitionBulkEditorComponent);
    const componentRef = this.bulkEditorRef.createComponent(componentInstance);
    componentRef.instance.bulkMenuTrigger = this.bulkMenuTrigger;
    componentRef.instance.ids = this.gridApi.getSelectedRows();
    componentRef.instance.competitionId = this.competitionId;
    componentRef.instance.partnerId = this.partnerId || null;
    componentRef.instance.path = 'competitions/bulkupdatemarkettypeprofit';
    componentRef.instance.afterClosed.subscribe(() => {
      this.getPage();
      this.bulkEditorRef.clear();
      this.gridApi.deselectAll();
    });
  }

  filterRowData() {
    const selectedMarket = this.selectedMarket();
    if (selectedMarket.Id) {
      const data = this.rowData().filter(element => 
        element.GroupIds?.includes(selectedMarket.Id)
      );
      this.mappedRowData.set(data);

    } else {
      this.mappedRowData.set(this.rowData())
    }
  }

  onSetSelectedMarket(event) {
    this.selectedMarket.set(event);
    this.filterRowData();
  }

}
