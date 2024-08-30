import { Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { take } from 'rxjs';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { BaseGridComponent } from 'src/app/main/components/classes/base-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';

@Component({
  selector: 'app-corrections-grid',
  templateUrl: './corrections-grid.component.html',
  styleUrl: './corrections-grid.component.scss'
})
export class CorrectionsGridComponent extends BaseGridComponent {
  rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  components = {
    buttonRenderer: ButtonRendererComponent,
  };
  type: any;
  public headerName;

  defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: false,
    suppressMenu: true,
    minWidth: 50,
  };

  constructor(
    injector: Injector,
    public dialog: MatDialog,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Common.Balance',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Balance',
        sortable: true,
        resizable: true,
        valueFormatter: params => params.data.Balance.toFixed(2),
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Payments.Debit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.debitToAccount['bind'](this),
          Label: 'Debit To Account',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
      {
        headerName: 'Payments.Credit',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.creditFromAccount['bind'](this),
          Label: 'Credit From Account',
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      }
    ];

  }


  @Input() rowData: any[];
  @Input() clientId!: any;
  @Output() getClientCorrections = new EventEmitter<boolean>();

  onDebitToAccount() {
    this.debitToAccount(null, true)
  }

  onCreditFromAccount() {
    this.creditFromAccount(null, true)
  }

  async debitToAccount(params: any, showCurrency: boolean = false) {
    this.headerName = 'Debit';
    const { CorrectionModalComponent } = await import('../../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params?.data, headerName: this.headerName, showCurrency: showCurrency }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientCorrections.emit(true);
      }
    });
  }

  async creditFromAccount(params: any, showCurrency: boolean = false) {
    this.headerName = 'Credit';
    const { CorrectionModalComponent } = await import('../../corrections/correction-modal/correction-modal.component');
    const dialogRef = this.dialog.open(CorrectionModalComponent, {
      width: ModalSizes.MEDIUM,
      data: { account: params?.data, headerName: this.headerName, showCurrency: showCurrency }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getClientCorrections.emit(true);
      }
    });
  }

}
