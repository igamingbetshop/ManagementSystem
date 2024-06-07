import { Component, OnInit, Injector } from '@angular/core';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { CheckboxRendererComponent } from 'src/app/main/components/grid-common/checkbox-renderer.component';
import { ColorEditorComponent } from 'src/app/main/components/grid-common/color-editor.component';
import { MatDialog } from "@angular/material/dialog";
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CellClickedEvent, IRowNode } from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { SelectStateRendererComponent } from 'src/app/main/components/grid-common/select-state-renderer.component';

@Component({
  selector: 'app-all-competitions-categories',
  templateUrl: './all-competitions-categories.component.html',
  styleUrls: ['./all-competitions-categories.component.scss']
})
export class AllCompetitionsCategoriesComponent extends BasePaginatedGridComponent implements OnInit {

  sports: any[] = [];
  sportsId: number;

  rowData = [];
  path: string = 'competitions/categories';
  updatePath: string = 'competitions/updatecategory';
  clonePath: string = 'competitions/clonecategory';
  deletePath: string = 'competitions/deletecategory';
  isSendingReqest = false;

  public frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    checkBoxRenderer: CheckboxRendererComponent,
    colorEditor: ColorEditorComponent,
    selectStateRenderer: SelectStateRendererComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  private multipleBetsStates = [
    { Id: null, Name: this.translate.instant('Sport.None') },
    { Id: true, Name: this.translate.instant('Common.Yes') },
    { Id: false, Name: this.translate.instant('Common.No') },
  ]

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    protected injector: Injector,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_COMPETITON_TEMPLATES;
    this.columnDefs = [
      {
        field: 'Id',
        sortable: true,
        resizable: true,
        checkboxSelection: true,
        minWidth: 130,
        tooltipField: 'Id',
        cellRenderer: 'agGroupCellRenderer',
        filter: 'agNumberColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: '#076192', backgroundColor: params.data.Color };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Partners.PartnerId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerId',
        resizable: true,
        sortable: true,
        filter: 'agNumberColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
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
        minWidth: 130,
        filter: 'agTextColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        },
        cellRenderer: function (params) {
          let color = params.data.Color;
          return `
          <div class="label" style="display: flex; justify-content: space-between; width: 117px">
          <label for="head" style="color: ${color === '#000000' ? '#FFFFFF' : '#000000'}; padding-right: 4px">${color}</label>
          <input type="color" disabled name="head"  value = ${color}>
          </div>`;
        },
        cellEditor: 'colorEditor',
      },
      {
        headerName: 'Sport.AbsoluteLimit',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'AbsoluteLimit',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.LiveDelay',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'LiveDelay',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.MaxWinPrematchSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchSingle',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.MaxWinPrematchMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinPrematchMultiple',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.MaxWinLiveSingle',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveSingle',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.MaxWinLiveMultiple',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MaxWinLiveMultiple',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numericEditor',
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color, height: '52px' };
          } else {
            return null;
          }
        }
      },
      // {
      //   headerName: 'Sport.AllowCashout',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'AllowCashout',
      //   resizable: true,
      //   sortable: true,
      //   editable: true,
      //   cellRenderer: 'selectStateRenderer',
      //   cellRendererParams: {
      //     onchange: this.onSelectCashOut['bind'](this),
      //     Selections: this.multipleBetsStates,
      //   },
      //   cellStyle: function (params) {
      //     if (params.data.Color !== '#FFFFFF') {
      //       return {color: 'black', backgroundColor: params.data.Color, height: '52px'};
      //     } else {
      //       return null;
      //     }
      //   }
      // },
      {
        headerName: 'Segments.IsDefault',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsDefault',
        resizable: true,
        sortable: true,
        filter: 'agBooleanColumnFilter',
        cellRenderer: 'checkBoxRenderer',
        cellRendererParams: {
          onchange: this.onCheckBoxChange2['bind'](this),
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
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
        minWidth: 140,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveCategorySettings['bind'](this),
          Label: this.translate.instant('Common.Save'),
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'View',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          } else {
            return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
            </i>`
          }

        },
        cellStyle: function (params) {
          if (params.data.Color !== '#FFFFFF') {
            return { color: 'black', backgroundColor: params.data.Color };
          } else {
            return null;
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.goToCompetition(event),
      },
    ];
  }

  ngOnInit() {
    this.getSports();
    this.gridStateName = 'competitions-categories-grid-state';
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
        this.getPage();
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onSportChange(val) {
    this.sportsId = val;
    this.getPage();
  }

  async addCategory() {
    const { CreateCompetitionCategoryComponent } = await import('../../competitions-categories/create-competition-category/create-competition-category.component');
    const dialogRef = this.dialog.open(CreateCompetitionCategoryComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

  clone() {
    const row = this.gridApi.getSelectedRows()[0];
    this.isSendingReqest = true;
    this.apiService.apiPost(this.clonePath, { "Id": row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData.unshift(data.ResponseObject);
          this.gridApi.setRowData(this.rowData);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }

  delete() {
    this.isSendingReqest = true;
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost(this.deletePath, { "Id": row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const index = this.rowData.findIndex(row => {
            return row.Id == data.Id;
          })
          this.rowData.splice(index, 1);
          this.gridApi.setRowData(this.rowData);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      })
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  onCheckBoxChange1(params, val, event) {
    params.AllowMultipleBets = val;
    this.onCellValueChanged(event);
  }

  onCheckBoxChange2(params, val, event) {
    params.IsDefault = val;
    this.onCellValueChanged(event);
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
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  saveCategorySettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row).subscribe(data => {
      if (data.Code === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onSelectCashOut(params, value: number, event) {
    params.AllowCashout = value;
  }

  getPage() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
          this.rowData = this.sportsId ? this.rowData.filter((item) => item.SportId == this.sportsId) : this.rowData;
          this.rowData.forEach(category => {
            let sportName = this.sports.find((sport) => {
              return sport.Id == category.SportId;
            })
            if (sportName) {
              category['SportName'] = sportName.Name;
            }
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  goToCompetition(ev) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/main/sportsbook/competitions-categories/competition-category/main`],
      { queryParams: { categoryId: ev.data.Id, sportId: ev.data.SportId, name: ev.data.Name } }));
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('Failed to construct URL');
    }
  }
}
