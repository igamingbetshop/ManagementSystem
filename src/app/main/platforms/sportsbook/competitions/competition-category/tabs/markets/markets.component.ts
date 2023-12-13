import {Component, OnInit, Injector} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {GridRowModelTypes, ModalSizes} from 'src/app/core/enums';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {AgBooleanFilterComponent} from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import {ButtonRendererComponent} from 'src/app/main/components/grid-common/button-renderer.component';
import {CheckboxRendererComponent} from 'src/app/main/components/grid-common/checkbox-renderer.component';
import {NumericEditorComponent} from 'src/app/main/components/grid-common/numeric-editor.component';
import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {MatDialog} from "@angular/material/dialog";
import 'ag-grid-enterprise';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";
import {CommonDataService} from "../../../../../../../core/services";


@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {

  public competitionId: number;
  public partnerId: number | null;
  public rowData = [];

  public path: string = 'competitions/markettypeprofits';
  public updatePath: string = 'competitions/updatemarkettypeprofit';
  public deletePath: string = 'competitions/deletemarkettypeprofit';

  public frameworkComponents;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerName: string = '';
  public defaultColDef = {
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
        headerName: 'Sport.LiveAP',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteProfitLive',
        editable: true,
        cellEditor: 'numericEditor',
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
        headerName: 'Sport.AllowMultipleBets',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AllowMultipleBets',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange['bind'](this),

        }
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveProfitSettings['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true
        }
      },
    ];
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      numericEditor: NumericEditorComponent,
      checkBoxRenderer: CheckboxRendererComponent,
    }
  }

  ngOnInit() {
    this.competitionId = +this.activateRoute.snapshot.queryParams.competitionId;
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
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async addSettings() {
    const {CreateMarketComponent} = await import('../../tabs/markets/create-market/create-market.component');
    const dialogRef = this.dialog.open(CreateMarketComponent, {width: ModalSizes.LARGE});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
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
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  onCheckBoxChange(params, val, event) {
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
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  delete() {
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost(this.deletePath, {"Id": row.Id})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const index = this.rowData.findIndex(row => {
            return row.Id == data.Id;
          })
          this.rowData.splice(index, 1);
          this.gridApi.setRowData(this.rowData);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      })
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
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

}
