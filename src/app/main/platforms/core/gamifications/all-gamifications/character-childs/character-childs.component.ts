import { Component, Injector, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { take } from 'rxjs/operators';

import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { ACTIVITY_STATUSES, ENVIRONMENTS_STATUSES } from 'src/app/core/constantes/statuses';
import { CommonDataService } from 'src/app/core/services';
import { CellDoubleClickedEvent } from 'ag-grid-community';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-character-childs',
  templateUrl: './character-childs.component.html',
  styleUrls: ['./character-childs.component.scss']
})
export class CharacterChildsComponent extends BaseGridComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Output() childCharakterData: EventEmitter<any> = new EventEmitter<any>()
  @Output() getParentData: EventEmitter<any> = new EventEmitter<any>()
  public partnerId;
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partners: any[] = [];
  public statuses: any[] = ACTIVITY_STATUSES;
  public environments: any[] = ENVIRONMENTS_STATUSES
  public colDefs = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id',
    },
    {
      headerName: 'Partners.Title',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Title',
      onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
        this.cellDoubleClicked(event, 94);
      }
    },
    {
      headerName: 'Bonuses.Description',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Description',
      onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
        this.cellDoubleClicked(event, 95);
      }
    },
    {
      headerName: 'Clients.NickName',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'NickName',
    },
    {
      headerName: 'Products.ParentId',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'ParentId',
    },
    {
      headerName: 'Common.Order',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Order',
    },
    {
      headerName: 'Segments.ComplimentaryPoint',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'CompPoints',
    },
    {
      headerName: 'Common.Status',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Status',
    },
    {
      headerName: 'Details',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        innerRenderer: 'detailCellRenderer',
        suppressCount: true,
      },
      cellClass: 'ag-grid-cell-with-detail',
      hide: true,
    },
    {
      headerName: 'Common.View',
      headerValueGetter: this.localizeHeader.bind(this),
      cellRenderer: OpenerComponent,
      filter: false,
      valueGetter: params => {
        let data = { path: 'gamification', queryParams: null };
        data.queryParams = { gamificationId: params.data.Id, isChilde: true };
        return data;
      },
      sortable: false
    },
  ];

  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };

  private clickedRowId: number | null = null;

  public rowData: any[];

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    this.columnDefs = this.colDefs;
  }

  ngOnChanges(): void {
    this.rowData = this.tableData;
    this.rowData?.forEach((item) => {
      item.Status = item.Status === 1 ? 'Active' : 'Inactive';
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi = params.api;
    this.gridApi.closeToolPanel();
  }

  public getDataPath = (data: any) => {
    return data.groupKey;
  };

  async cellDoubleClicked(event: CellDoubleClickedEvent, typeId) {
    const id = event.data.Id;
    const { AddEditTranslationComponent } = await import('../../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: typeId
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getParentData.emit();
      }
    })
  }

  onRowClicked(event: any) {
    this.childCharakterData.emit(event.data);
  }

}
