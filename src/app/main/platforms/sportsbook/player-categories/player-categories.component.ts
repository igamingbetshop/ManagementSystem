import {Component, OnInit, Injector, ViewChild} from '@angular/core';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {SportsbookApiService} from '../services/sportsbook-api.service';
import {CommonDataService} from "../../../../core/services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AgGridAngular} from "ag-grid-angular";
import 'ag-grid-enterprise';
import {take} from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {GridMenuIds, GridRowModelTypes, ModalSizes} from 'src/app/core/enums';
import {ColorEditorComponent} from 'src/app/main/components/grid-common/color-editor.component';
import {ButtonRendererComponent} from 'src/app/main/components/grid-common/button-renderer.component';
import {NumericEditorComponent} from 'src/app/main/components/grid-common/numeric-editor.component';
import {PlayerCategories} from "../models/spotsbook.model";
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import {IRowNode} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-teams',
  templateUrl: './player-categories.component.html',
  styleUrls: ['./player-categories.component.scss']
})
export class PlayerCategoriesComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public rowData: PlayerCategories[] = [];
  public categories = [];
  public path: string = 'players/categories';
  public updatePath: string = 'players/updatecategory';
  public removePath: string = 'players/removecategory';
  public frameworkComponents;
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  isSendingReqest = false;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_PLAYER_CATEGORIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        tooltipField: 'Id',
        filter: 'agNumberColumnFilter',

        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {
              color: 'black',
              'font-size': '14px',
              'font-weight': '500',
              backgroundColor: params.data.Color,
              height: '52px'
            };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',

        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.Color',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Color',
        sortable: false,
        resizable: true,
        editable: true,
        filter: false,
        cellRenderer: function (params) {
          let color = params.data.Color;
          return `
          <div class="label" style="display: flex; justify-content: space-between; width: 117px">
          <label for="head" style="color: ${color === '#000000' ? '#FFFFFF' : '#000000'}; padding-right: 4px">${color}</label>
          <input type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px',justifyContent: 'center'};
          } else {
            // return null;
            return {justifyContent: 'center',backgroundColor: params.data.Color,height: '52px'}
          }
        },
        cellEditor: 'colorEditor',
      },
      {
        headerName: 'Sport.LimitPercent',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LimitPercent',
        editable: true,
        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.DelayPercentPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayPercentPrematch',
        editable: true,
        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.DelayPercentLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayPercentLive',
        editable: true,
        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.DelayBetweenBetsPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayBetweenBetsPrematch',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.DelayBetweenBetsLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'DelayBetweenBetsLive',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
        editable: true,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },

      {
        headerName: 'Sport.MaxOddPrematch',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxOddPrematch',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        },
        cellEditor: NumericEditorComponent,
      },
      {
        headerName: 'Sport.MaxOddLive',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxOddLive',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',

        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.RepeatBetMaxCount',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RepeatBetMaxCount',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: NumericEditorComponent,
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color,height: '52px'};
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveCategorySettings['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF',
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return {color: 'black', backgroundColor: params.data.Color};
          } else {
            return null;
          }
        }
      }
    ]

    this.frameworkComponents = {
      colorEditor: ColorEditorComponent,
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'player-categories-grid-state';
    super.ngOnInit();
    this.getPage()
  }

  async addCategory() {
    const {AddPlayerCategoriesComponent} = await import('../player-categories/add-player-categoryies/add-player-categories.component');
    const dialogRef = this.dialog.open(AddPlayerCategoriesComponent, {width: ModalSizes.LARGE});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.rowData.push(data);
        this.gridApi.setRowData(this.rowData);
      }

    })
  }

  deleteCategory() {
    const row = this.gridApi.getSelectedRows()[0];
    this.isSendingReqest = true;
    this.apiService.apiPost(this.removePath, {Id: row.Id})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const index = this.rowData.findIndex(el => el.Id == data.ResponseObject.Id);
          if (index > -1) {
            this.rowData.splice(index, 1);
            this.gridApi.setRowData(this.rowData);
          }
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        this.isSendingReqest = false;
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
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({rowNodes: [findedNode]});
    }
  }

  saveCategorySettings(params) {
    const requestBody = params.data;
    this.apiService.apiPost(this.updatePath, requestBody)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.Categories;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }
}
