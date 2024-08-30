import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';

import { GridMenuIds, GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { CellClickedEvent, GetContextMenuItemsParams, MenuItemDef } from 'ag-grid-community';
import { SelectRendererComponent } from 'src/app/main/components/grid-common/select-renderer.component';
import { syncNestedColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { BET_SELECTION_STATUSES } from 'src/app/core/constantes/statuses';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-selections-grid',
  templateUrl: './selections-grid.component.html',
  styleUrls: ['./selections-grid.component.scss']
})
export class SelectionsGridComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @Output() finishedMatchesMarket: EventEmitter<any> = new EventEmitter<any>();
  @Input() rowData = [];
  public selectionStatuses = BET_SELECTION_STATUSES

  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public frameworkComponents = {
    selectRenderer: SelectRendererComponent,
  }

  public defaultColDef1 = {
    flex: 1,
    resizable: true,
    sortable: false,
    filter: false,
    minWidth: 50,
  };

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_REPORT_BY_NOT_ACCEPTED_BETS;
    this.gridIndex = 1;
    this.columnDefs = [
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500', 'padding-left': '10px', },
      },
      {
        headerName: 'Segments.SelectionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionId',
      },
      {
        headerName: 'Common.EventDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EventDate',
        cellRenderer: (params) => {
          if (params.node.rowPinned || params.data.EventDate === null) {
            return '';
          }
          let datePipe = new DatePipe("en-US");
          let time = datePipe.transform(params.data.EventDate, 'HH:mm:ss');
          let date = datePipe.transform(params.data.EventDate, 'mediumDate');
          return time && date ? `${time} ${date}` : '';
        },
      },
      {
        headerName: 'Sport.MatchNumber',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchNumber',
      },
      {
        headerName: 'Common.SelectionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SelectionName',
      },
      {
        headerName: 'Sport.MarketId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketId',
      },
      {
        headerName: 'Sport.MarketName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MarketName',
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
      },
      {
        headerName: 'Sport.Competitors',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Competitors',
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'IsLive',
        cellRenderer: params => {
          let isLiv = params.data.IsLive;
          let show = isLiv ? 'Live' : 'Prematch';
          return `${show}`;
        }
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        // cellRenderer: (params) => {
        //   const oddsTypePipe = new OddsTypePipe();
        //   let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
        //   return `${data}`;
        // }
      },
      {
        headerName: 'Sport.MatchState',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchState',
      },
      {
        headerName: 'Sport.ForcedChosen',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ForcedChosen',
      },
      // {
      //   headerName: 'Common.Info',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'Info',
      // },
      // {
      //   headerName: 'Common.Info',
      //   headerValueGetter: this.localizeHeader.bind(this),
      //   field: 'Info',
      // },
      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        cellRenderer: function (params) {
          return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
           </i>`
        },
        onCellClicked: (event: CellClickedEvent) => this.goToFinishedMatchesMarket(event),
      },
    ];
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncNestedColumnReset();
  }

  goToFinishedMatchesMarket(event) {
    this.finishedMatchesMarket.emit(event)
  }

  onSelectChange(params, val) {
    params.ResettleStatus = val;
  }

  getContextMenuItemsForBets(params: GetContextMenuItemsParams): (string | MenuItemDef)[] {
    const result: (string | MenuItemDef)[] = [
      'copy',
    ];
    return result;
  }

}
