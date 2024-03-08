import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {VirtualGamesApiService} from "../../../../services/virtual-games-api.service";
import {GridRowModelTypes} from "../../../../../../../core/enums";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {AgGridAngular} from "ag-grid-angular";
import {take} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {AgBooleanFilterComponent} from "../../../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import {ButtonRendererComponent} from "../../../../../../components/grid-common/button-renderer.component";
import {NumericEditorComponent} from "../../../../../../components/grid-common/numeric-editor.component";
import {CheckboxRendererComponent} from "../../../../../../components/grid-common/checkbox-renderer.component";
import {TextEditorComponent} from "../../../../../../components/grid-common/text-editor.component";
import {SelectRendererComponent} from "../../../../../../components/grid-common/select-renderer.component";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid', {static: false}) agGrid: AgGridAngular;
  @ViewChild('agGrid1', {static: false}) agGrid1: AgGridAngular;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public userId:any;
  public path = 'user/markettypes';
  public path2 = 'markettypes/categoryprofitvalues';
  public path3 = 'markettypes/saveprofitvalue';
  public rowData1 = [];
  public columnDefs2;
  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    textEditor: TextEditorComponent,
    selectRenderer: SelectRendererComponent,
  };
  public marketTypeId;

  constructor(protected injector: Injector, private _snackBar: MatSnackBar,
              private apiService: VirtualGamesApiService, private activateRoute: ActivatedRoute,) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'SkillGames.GameId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'GameId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.MarketTypeId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketTypeId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Clients.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.SelectionsCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionsCount',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        }
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Profit',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
    ]
    this.columnDefs2 = [
      {
        headerName: 'Products.CategoryId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryId',
        sortable: true,
        resizable: true,
        minWidth: 100,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
      },
      {
        headerName: 'Clients.CategoryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Sport.Profit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProfitValue',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'numericEditor',
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveFinishes['bind'](this),
          Label: 'Save',
          isDisabled: true
        }
      }
    ]
  }

  ngOnInit(): void {
    this.userId = +this.activateRoute.snapshot.queryParams.userId;
    this.getMarketTypes();
    this.getSecondGridData();
  }

  getMarketTypes() {
    this.apiService.apiPost(this.path, {Id: this.userId})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject.MarketTypes;
          setTimeout(() => {
            this.agGrid.api.getRenderedNodes()[0]?.setSelected(true);
          }, 0)
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  onRowSelected(params) {

    if (params.node.selected) {
      this.getSecondGridData(params);
    } else {
      return;
    }
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }


  getSecondGridData(params?) {
    const row = params?.data;
    let countRows = this.agGrid?.api.getSelectedRows().length;
    if (countRows) {
      let data = {
        MarketTypeId: row.MarketTypeId,
        Id: this.userId
      };
      this.marketTypeId = row.MarketTypeId;
      this.apiService.apiPost(this.path2, data)
        .pipe(take(1))
        .subscribe(data => {
          if (data.ResponseCode === 0) {
            this.rowData1 = data.ResponseObject;
          } else {
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
    }
  }

  onCellValueChanged(event){
    if(event.oldValue !== event.value){
      let findedNode: IRowNode;
      let node = event.node.rowIndex;
      this.agGrid1.api.forEachNode(nod => {
        if(nod.rowIndex == node){
          findedNode = nod;
        }
      })
      this.agGrid1.api.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.agGrid1.api.redrawRows({rowNodes: [findedNode]});
    }
  }

  saveFinishes(params) {
    const row = params.data;
    let data = {
      ProfitValue: row.ProfitValue,
      MarketTypeId: this.marketTypeId,
      CategoryId: row.CategoryId,
      Id: this.userId
    };
    this.apiService.apiPost(this.path3, data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.agGrid1.api.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getSecondGridData()
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

}
