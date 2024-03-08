import { Component, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { GridRowModelTypes } from "../../../../../../../../../core/enums";

import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';

@Component({
  selector: 'app-all-language-settings',
  templateUrl: './all-language-settings.component.html',
  styleUrls: ['./all-language-settings.component.scss']
})
export class AllLanguageSettingsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  @Output() valueEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public partnerId;
  public partnerName;
  public columnDefs = [];
  public blockedData;
  @Output() selectedNodes: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected injector: Injector,
  ) {
    super(injector);
    this.columnDefs = [
      {
        field: '',
        minWidth: 20,
        checkboxSelection: true,
        filter: false,
      },
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.Language',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
      }
    ];
  }

  ngOnInit(): void {
  }

  onRowClicked(params) {
    this.blockedData = params;
  }

  onRowSelected() {
    this.selectedNodes.emit(this.agGrid.api.getSelectedNodes());
    this.valueEmitted.emit(false);
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

}
