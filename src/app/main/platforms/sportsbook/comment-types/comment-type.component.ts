import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../services/sportsbook-api.service';
import { CommonDataService } from "../../../../core/services";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AgGridAngular } from "ag-grid-angular";
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { MatDialog } from "@angular/material/dialog";
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { ColorEditorComponent } from 'src/app/main/components/grid-common/color-editor.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { SnackBarHelper } from "../../../../core/helpers/snackbar.helper";
import { IRowNode } from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

const commentTypeKinds = [
  { Id: 1, Name: 'Bet Comment' },
  { Id: 2, Name: 'Delete Reason' },
  { Id: 3, Name: 'Reject Reason' },
];

@Component({
  selector: 'app-teams',
  templateUrl: './comment-type.component.html',
  styleUrls: ['./comment-type.component.scss']
})
export class CommentTypeComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  rowData = [];
  path: string = 'commenttypes';
  updatePath: string = 'commenttypes/update';
  removePath: string = 'commenttypes/remove';

  frameworkComponents;
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  isSendingReqest = false;

  constructor(
    private apiService: SportsbookApiService,
    protected injector: Injector,
    public commonDataService: CommonDataService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_COMMENT_TYPES;
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
        cellStyle: (params) => this.getCellStyle(params),
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        editable: false,
        filter: 'agTextColumnFilter',
        cellStyle: (param) => this.getCellStyle(param),
      },
      {
        headerName: 'Sport.Color',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Color',
        sortable: false,
        resizable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        cellStyle: (param) => this.getCellStyle(param),
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
        headerName: 'Sport.Commenttype',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'KindName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        cellStyle: (param) => this.getCellStyle(param),
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
          onClick: this.saveCommentSettings['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        },
        cellStyle: (param) => this.getCellStyle(param),
      }
    ]

    this.frameworkComponents = {
      colorEditor: ColorEditorComponent,
      buttonRenderer: ButtonRendererComponent,
    }
  }

  ngOnInit() {
    this.gridStateName = 'comment-type-grid-state';
    super.ngOnInit();
    this.getPage()
  }

  async addTeam() {
    const { AddCommentTypeComponent } = await import('../comment-types/add-comentType/add-comment-type.component');
    const dialogRef = this.dialog.open(AddCommentTypeComponent, { width: ModalSizes.LARGE });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        let kindName = commentTypeKinds.find((kind) => kind.Id == data.Kind);
        if (kindName) {
          data['KindName'] = kindName.Name;
        }
        this.rowData.push(data);
        this.gridApi.setRowData(this.rowData);
      }
    })
  }

  delateTeam() {
    const row = this.gridApi.getSelectedRows()[0];
    this.apiService.apiPost(this.removePath, { Id: row.Id })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const index = this.rowData.findIndex(el => el.Id == data.ResponseObject.Id);
          if (index > -1) {
            this.rowData.splice(index, 1);
            this.gridApi.setRowData(this.rowData);
          }
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
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({ rowNodes: [findedNode] });
    }
  }

  saveCommentSettings(params) {
    const row = params.data;
    this.apiService.apiPost(this.updatePath, row)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          SnackBarHelper.show(this._snackBar, { Description: 'Templates successfully updated', Type: "success" });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
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
          this.rowData = data.CommentTypes;

          this.rowData.forEach(comment => {
            let kindName = commentTypeKinds.find((kind) => kind.Id == comment.Kind);
            if (kindName) {
              comment['KindName'] = kindName.Name;
            }
          });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getCellStyle(params) {
    if (params.data.Color !== '#000000') {
      return { color: 'black', 'font-size': '14px', 'font-weight': '500', backgroundColor: params.data.Color };
    }
    return { color: 'white', 'font-size': '14px', 'font-weight': '500', backgroundColor: params.data.Color };
  }
}
