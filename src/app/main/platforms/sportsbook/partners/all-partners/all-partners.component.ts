import { Component, OnInit, Injector } from '@angular/core';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { OpenerComponent } from 'src/app/main/components/grid-common/opener/opener.component';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { MatDialog } from "@angular/material/dialog";
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { CellClickedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-all-partners',
  templateUrl: './all-partners.component.html',
  styleUrls: ['./all-partners.component.scss']
})
export class AllPartnersComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public path = 'partners';

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_PARTNERS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Clients.Currency',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CurrencyId',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        cellRenderer: function (params) {
          let status = params.data.State == 1 ? 'active' : params.data.State == 2 ? 'Blocked' : '';
          return `${status}`;
        }
      },
      {
        headerName: 'View',
        cellRenderer: function (params) {
          if (params.node.rowPinned) {
            return '';
          } else {
            return `<i style=" color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
           visibility
            </i>`
          }
        },
        onCellClicked: (event: CellClickedEvent) => this.goToPartner(event),
      },
    ];
  }

  ngOnInit() {
    this.gridStateName = 'all-partners-grid-state';
    this.getPage();
  }

  async addPartner() {
    const { CreatePartnerComponent } = await import('../../partners/create-partner/create-partner.component');
    const dialogRef = this.dialog.open(CreatePartnerComponent, { width: ModalSizes.SMALL });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data)
        this.rowData.unshift(data);
      this.gridApi.setRowData(this.rowData);
    })
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  getPage() {
    this.apiService.apiPost(this.path)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.Code === 0) {
          this.rowData = data.ResponseObject;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  goToPartner(event) {
    const url = this.router.serializeUrl(this.router.createUrlTree([`/main/sportsbook/partners/partner/main`],
      {
        queryParams: {
          partnerId: event.data.Id, partnerName: event.data.Name
        }
      }));
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('Failed to construct URL');
    }
  }
}
