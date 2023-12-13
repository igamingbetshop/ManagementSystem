import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CoreApiService } from '../../services/core-api.service';
import { CommonDataService, LocalStorageService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { Controllers, GridRowModelTypes, Methods, ModalSizes } from 'src/app/core/enums';
import { take } from 'rxjs/operators';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { CellDoubleClickedEvent } from 'ag-grid-community';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-core-promotions',
  templateUrl: './core-promotions.component.html',
  styleUrls: ['./core-promotions.component.scss']
})
export class CorePromotionsComponent extends BasePaginatedGridComponent implements OnInit {

  partners: any[] = [];
  partnerId = null;
  rowData = [];
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  filter: any = {};
  promotionTypes: any[] = [];
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  states = ACTIVITY_STATUSES;
  tableData = [];
  promotionId: any;
  childId: any;

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public activateRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
  ) {
    super(injector);
    // this.adminMenuId = GridMenuIds.CORE_PROMOTIONS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
      },
      {
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
      },
      {
        headerName: 'Partners.Title',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Title',
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event, 83);
        }
      },
      {
        headerName: 'Cms.Image',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ImageName',
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
      },
      {
        headerName: 'Partners.StyleType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StyleType',
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        filter: false
      },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: OpenerComponent,
        filter: false,
        valueGetter: params => {
          let data = { path: 'promotion', queryParams: null };
          data.queryParams = { Id: params.data.Id };
          return data;
        },
        sortable: false
      },


    ];
  }

  ngOnInit() {
    this.gridStateName = 'core-promotions-grid-state';
    this.partners = this.localStorageService.get('core_partners');
    this.getPromotionTypesEnum();
    this.getPage();
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPromotionTypesEnum() {
    this.apiService.apiPost(this.configService.getApiUrl, this.filter,
      true, Controllers.ENUMERATION, Methods.GET_PROMOTION_TYPES_ENUM)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.promotionTypes = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  async cellDoubleClicked(event: CellDoubleClickedEvent, typeId) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: typeId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }


  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
    this.getPage();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async addPromotion(parentId?) {
    const { AddCorePromotionsComponent } = await import('./add-core-promotions/add-core-promotions.component');
    const dialogRef = this.dialog.open(AddCorePromotionsComponent, { width: ModalSizes.LARGE, data: { PartnerId: this.partnerId, ParentId: parentId } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  onLisenChildCharacter(event) {
    this.childId = event.Id;
  }
  async delete(id?) {
    let rowId;
    if (id) {
      rowId = id;
    } else {
      rowId = this.gridApi.getSelectedRows()[0].Id;
    }
    const { ConfirmComponent } = await import('../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.apiService.apiPost(this.configService.getApiUrl, rowId,
          true, Controllers.CONTENT, Methods.REMOVE_PROMOTION)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              this.getPage();
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    })
  }

  getPage(parentId?, group = true) {
    this.filter.PartnerId = this.partnerId;
    this.filter.ParentId = null
    if (!group) {
      this.filter.ParentId = parentId;
    }
    this.apiService.apiPost(this.configService.getApiUrl, this.filter,
      true, Controllers.CONTENT, Methods.GET_PROMOTIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          if (!!parentId) {
            const _data = data.ResponseObject;
            _data.forEach((element) => {
              element['Type'] = this.promotionTypes.find((type) => type.Id == element.Type)?.Name;
              element['State'] = this.states.find((state) => state.Id == element.State)?.Name;
            });
            this.tableData = _data;
          } else {
            this.rowData = data.ResponseObject;
            this.rowData.forEach((element) => {
              element['PartnerName'] = this.partners.find((partner) => partner.Id == element.PartnerId)?.Name;
              element['Type'] = this.promotionTypes.find((type) => type.Id == element.Type)?.Name;
              element['State'] = this.states.find((state) => state.Id == element.State)?.Name;
            });
            this.tableData = [];
            if (this.promotionId) {
              this.getPage(this.promotionId, false);
            }
          }

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }


  onRowClicked(event: any) {
    this.promotionId = event.data.Id;    
    this.getPage(this.promotionId, false);
  }
}
