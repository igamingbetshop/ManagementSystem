import {Component, OnInit, Injector} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes, ObjectTypes} from 'src/app/core/enums';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {AgBooleanFilterComponent} from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import {ButtonRendererComponent} from 'src/app/main/components/grid-common/button-renderer.component';
import {NumericEditorComponent} from 'src/app/main/components/grid-common/numeric-editor.component';
import {TextEditorComponent} from 'src/app/main/components/grid-common/text-editor.component';
import {CoreApiService} from '../services/core-api.service';
import {SnackBarHelper} from "../../../../core/helpers/snackbar.helper";
import {CellDoubleClickedEvent, IRowNode, RowNode} from "ag-grid-community";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.scss']
})
export class ProductCategoriesComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  frameworkComponents = {
    agBooleanColumnFilter: AgBooleanFilterComponent,
    buttonRenderer: ButtonRendererComponent,
    textEditor: TextEditorComponent,
    numberEditor: NumericEditorComponent,
  };

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.PRODUCT_CATEGORIES;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size': '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
        editable: true,
        filter: 'agTextColumnFilter',
        cellEditor: 'textEditor',
      },
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        cellEditor: 'numberEditor',
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
          onClick: this.saveProductCategory['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF',
        }
      }

    ];

  }

  ngOnInit() {
    this.gridStateName = 'product-category-grid-state';
    this.getPage();
  }


  async addCategory() {
    const {CreateProductCategoryComponent} = await import('../../core/product-categories/create-product-category/create-product-category.component');
    const dialogRef = this.dialog.open(CreateProductCategoryComponent, {width: ModalSizes.SMALL});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.getPage();
    })
  }

  saveProductCategory(params) {
    const row = params.data;
    this.apiService.apiPost(this.configService.getApiUrl, row,
      true, Controllers.PRODUCT, Methods.SAVE_PRODUCT_CATEGORY)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }

      })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();

  }

  getPage() {
    this.apiService
      .apiPost(this.configService.getApiUrl, {}, true, Controllers.PRODUCT, Methods.GET_PRODUCT_CATEGORIES)
      .subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 300);
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

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.data.Id;
    const {AddEditTranslationComponent} = await import('../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: ObjectTypes.ProductCategory
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

}
