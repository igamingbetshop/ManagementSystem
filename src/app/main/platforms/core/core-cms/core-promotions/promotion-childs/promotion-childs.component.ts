import { Component, Injector, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { take } from 'rxjs/operators';

import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CommonDataService } from 'src/app/core/services';
import { CellDoubleClickedEvent } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { PromotionsService } from '../core-promotions.service';
import { ACTIVITY_STATUSES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-promotion-childs',
  templateUrl: './promotion-childs.component.html',
  styleUrls: ['./promotion-childs.component.scss']
})
export class PromotionChildsComponent extends BaseGridComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Output() childCharakterData: EventEmitter<any> = new EventEmitter<any>()
  @Output() getParentData: EventEmitter<any> = new EventEmitter<any>()
  partnerId;
  frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
  };
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  colDefs = [
    {
      headerName: 'Common.Id',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Id',
      cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
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
      headerName: 'Bonuses.Description',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Description',
      onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
        this.cellDoubleClicked(event, 84);
      }
    },
    {
      headerName: 'Common.Content',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Content',
      onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
        this.cellDoubleClicked(event, 85);
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
      headerName: 'Common.StartDate',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'StartDate',
      cellRenderer: function (params) {
        let datePipe = new DatePipe("en-US");
        let dat = datePipe.transform(params.data.StartDate, 'medium');
        return `${dat}`;
      },
    },
    {
      headerName: 'Common.FinishDate',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'FinishDate',
      cellRenderer: function (params) {
        let datePipe = new DatePipe("en-US");
        let dat = datePipe.transform(params.data.FinishDate, 'medium');
        return `${dat}`;
      },
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
        data.queryParams = { Id: params.data.Id, Childe: true };
        return data;
      },
      sortable: false
    },
  ];
  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
  };
  states = ACTIVITY_STATUSES;
  rowData: any[];

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private promotionsService: PromotionsService,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    this.columnDefs = this.colDefs;
    this.subscribeToCurrentUpdate();
  }

  ngOnChanges(): void {
    this.rowData = this.tableData;
  }

  subscribeToCurrentUpdate() {
    this.promotionsService.currentUpdate.subscribe((promotion) => {
      const rowIdToUpdate = promotion?.Id;
      if (promotion && this.rowData.length > 0) {
        const displayedRows = this.rowData.length; 
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
          const rowNode = this.rowData[rowIndex];
          if (rowNode.Id == rowIdToUpdate) {
            rowNode.Title = promotion.Title;
            rowNode.Image = promotion.Image;
            rowNode.State = this.states.find((state) => state.Id == promotion.State)?.Name;
            rowNode.StyleType = promotion.StyleType;
            rowNode.Order = promotion.Order;
            rowNode.StartDate = promotion.StartDate;
            rowNode.FinishDate = promotion.FinishDate;
            this.rowData[rowIndex] = rowNode
            break;
          }
        }  
        this.rowData = [...this.rowData];
      }
    });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi = params.api;
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
