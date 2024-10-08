import { CommonModule } from '@angular/common';
import { Component, Injector, input, OnInit, output } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';

import { GridRowModelTypes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';

@Component({
  selector: 'app-menus-grid',
  templateUrl: './menus-grid.component.html',
  styleUrl: './menus-grid.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AgGridModule
  ]
})

export class MenusGridComponent extends BaseGridComponent implements OnInit {
  menuClicked = output<any>();
  rowData = input(false, {
    transform: (value: any) => {
      if (this.gridApi) {        
        const currentFilterModel = this.gridApi.getFilterModel();
        this.gridApi.setRowData(value);
        this.gridApi.setFilterModel(currentFilterModel);
      }
      if (value && value.length > 0) {
        this.selectRow(value[0]);
        this.gridApi.setFilterModel(null);

      }
      return value;
    }
  });

  removeStyle = input(false, {
    transform: (value: any) => {
      if (value) {
        const filteredColumns = this.columnDefs.filter(element => element.field !== 'StyleType');
        this.columnDefs = filteredColumns;
      }
      return value;
    }
  });

  gridOptions = {
    getRowNodeId: (data) => data.Id,  // Use 'Id' field as the unique identifier for each row
  };

  changeData = input('', {
    transform: (value: any) => {
      if (this.gridApi && value?.Id) {
        const rowIdToUpdate = value.Id;
        const displayedRows = this.gridApi.getDisplayedRowCount();
  
        for (let rowIndex = 0; rowIndex < displayedRows; rowIndex++) {
          const rowNode = this.gridApi.getDisplayedRowAtIndex(rowIndex);
  
          if (rowNode && rowNode.data && rowNode.data.Id === rowIdToUpdate) {

            rowNode.setData(value);
            this.gridApi.refreshCells({ rowNodes: [rowNode], force: true }); // Refresh the cell
            break;
          }
        }
      }
      return value;
    }
  });
  

  icon = input('Icon', {
    transform: (value: any) => {
      const filteredColumns = this.columnDefs.filter(element => element.field !== 'Orientation');
      this.columnDefs = filteredColumns;
      return value;
    }
  });

  editMenuItem = output<any>();
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  rowHeight = 42;
  type: any;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    suppressMenu: true,
    minWidth: 50,
  };

  constructor(
    injector: Injector,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        maxWidth: 70,
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Id'),
      },
      {
        headerName: 'Partners.Title',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Title',
        tooltipValueGetter: (params) => `${params.value}`,
        tooltipComponent: 'customTooltip',
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Title'),
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
        filter: 'agSetColumnFilter',
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Type'),
      },
      {
        headerName: 'Partners.StyleType',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StyleType',
        minWidth: 200,
        cellRenderer: (params) => {
          const columnWidth = params.column.getActualWidth();
          const span = `<span title="${params.value}" 
            style="
              cursor: pointer;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all; 
              display: block;
              font-size: 13px;
              overflow-wrap: break-word;
              max-height: ${params.node.rowHeight}px;
              line-height: 1.4;
              padding: 2px; 
              width: ${columnWidth - 10}px;
            ">${params.value}</span>`;
          return span;
        },
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'StyleType'),
      },
      {
        headerName: 'Partners.Href',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Href',
        tooltipValueGetter: (params) => `${params.value}`,
        tooltipComponent: 'customTooltip',
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Href'),
        cellRenderer: (params) => {
          const columnWidth = params.column.getActualWidth();
          const span = `<span title="${params.value}" 
            style="
              cursor: pointer;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all; 
              display: block;
              font-size: 13px;
              overflow-wrap: break-word;
              max-height: ${params.node.rowHeight}px;
              line-height: 1.4;
              padding: 2px; 
              width: ${columnWidth - 10}px;
            ">${params.value}</span>`;
          return span;
        },
      },
      {
        headerName: this.icon(),
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Icon',
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Icon'),
      },
      {
        headerName: 'Partners.Routing',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'OpenInRouting',
        width: 90,
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Routing'),
      },
      {
        headerName: 'Partners.Orientation',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Orientation',
        maxWidth: 50,
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Orientation'),
      },
      {
        headerName: 'Common.Order',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Order',
        maxWidth: 60,
        onCellDoubleClicked: (event) => this.handleDoubleClick(event, 'Order'),
      }
    ];
  }

  ngOnInit(): void { }

  addResetButton(gridIndex) {
    const observer = new MutationObserver(() => {
      const columnSelectElements = document.querySelectorAll('.ag-tool-panel-wrapper .ag-column-select');

      if (columnSelectElements.length > gridIndex) {
        const targetElement = columnSelectElements[gridIndex];

        if (targetElement) {
          observer.disconnect();
          const dynamicButton = document.createElement('button');
          dynamicButton.textContent = 'Reset';
          dynamicButton.classList.add('mat-button', 'mat-reset-btn');
          dynamicButton.addEventListener('click', this.resetState.bind(this));
          targetElement.prepend(dynamicButton);
        } else {
          console.warn('Target element not found');
        }
      } else {
        console.warn('Not enough column select elements found');
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  selectRow(rowData) {
    const rowNode = this.gridApi.getRowNode(rowData.Id);
    if (rowNode) {
      this.gridApi.ensureIndexVisible(rowNode.rowIndex);
      this.gridApi.getSelectedNodes().forEach(node => node.setSelected(false));
      rowNode.setSelected(true);
    }
  }

  onMenuClicked(event) {
    this.menuClicked.emit(event);
  }

  handleDoubleClick(event, colId: string) {
    event.data.colId = colId;
    this.editMenuItem.emit(event);
  }

  getRowHeight(params) {
    if (params.data && params.data.StyleType) {
      const styleTypeLength = params.data.StyleType.length;
      if (styleTypeLength > 100) {
        return 130;
      } else if (styleTypeLength > 40) {
        return 90;
      }
    }
    if (params.data && params.data.Href) {
      const hrefLength = params.data.Href.length;
      if (hrefLength > 100) {
        return 140;
      } else if (hrefLength > 40) {
        return 90;
      }
    }
    return this.rowHeight;
  }

  onColumnResized(params) {
    if (params.finished) {
      params.api.refreshCells({ force: true });
    }
  }

  onGridReady(params: any): void {
    super.onGridReady(params);
    if (this.icon()) {
      this.addResetButton(3);
    } else {
      this.addResetButton(2);
    }
  }

  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }
}
