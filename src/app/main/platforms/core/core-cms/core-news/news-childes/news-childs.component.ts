import { Component, Injector, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { take } from 'rxjs/operators';

import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CommonDataService } from 'src/app/core/services';
import { CellDoubleClickedEvent } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { NewsService } from '../news.service';
import {ACTIVITY_STATUSES, NEWS_TYPES} from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-news-childs',
  templateUrl: './news-childs.component.html',
  styleUrls: ['./news-childs.component.scss']
})
export class NewsChildsComponent extends BaseGridComponent implements OnInit, OnChanges {
  @Input() tableData: any[] = [];
  @Output() childCharakterData: EventEmitter<any> = new EventEmitter<any>()
  @Output() getParentData: EventEmitter<any> = new EventEmitter<any>()
  partnerId;
  rowData: any[];
  states = ACTIVITY_STATUSES;
  types = NEWS_TYPES;
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
        this.cellDoubleClicked(event, 98);
      }
    },
    {
      headerName: 'Bonuses.Description',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Description',
      onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
        this.cellDoubleClicked(event, 99);
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
      headerName: 'Common.Type',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'Type',
    },
    {
      headerName: 'Common.State',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'State',
      floatingFilter: false,
      filter:'agDropdownFilter',
      filterParams: {
        filterOptions: this.filterService.stateOptions,
        filterData: this.states
      },
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
        let data = { path: 'news', queryParams: null };
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
    menuTabs: [
      'filterMenuTab',
      'generalMenuTab',
    ],
  };

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private newsService: NewsService,
    public commonDataService: CommonDataService,
  ) {
    super(injector);
    this.columnDefs = this.colDefs;
  }

  ngOnInit() {
    this.subscribeToCurrentUpdate();
  }

  ngOnChanges(): void {
    this.rowData = this.tableData;
    if (this.tableData.length > 0) {

    }

  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi = params.api;
  }

  subscribeToCurrentUpdate() {
    this.newsService.currentUpdate.subscribe((news) => {

      if (news && this.gridApi && this.gridApi.getDisplayedRowCount() > 0) {
        const rowIdToUpdate = news?.Id;
        const displayedRows = this.gridApi.getDisplayedRowCount();
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
          const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
          if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {
            rowNode.data.StartDate = news.StartDate;
            rowNode.data.FinishDate = news.FinishDate;
            rowNode.data.NickName = news.NickName;
            rowNode.data.Order = news.Order;
            rowNode.data.Type = news['Type'] = this.types.find((type) => type.Id == news.Type)?.Name;
            this.gridApi.redrawRows({ rowNodes: [rowNode] });
            break;
          }
        }
      }
    });
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
