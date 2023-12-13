import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-mapped-phases',
  templateUrl: './mapped-result-types.component.html',
  styleUrls: ['./mapped-result-types.component.scss']
})
export class MappedResultTypesTabComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public providers: any[] = [];
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;

  constructor(
    protected injector:Injector,
    private apiService:SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectId',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500'},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.numberOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectNickName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        },
      },
      {
        headerName: 'Products.ExternalId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalId',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        },
      },
      {
        headerName: 'Products.ObjectExternalName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectExternalName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        },
      },
      {
        headerName: 'Partners.Provider',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions:this.filterService.textOptions
        },
      },
    ];
  }

  ngOnInit() {
    this.gridStateName = 'mapped-result-types-grid-state';
    this.getProviders();
    this.getPage();
  }

  getProviders(){
    this.apiService.apiPost('providers').subscribe(data => {
      if(data.Code === 0){
        this.providers = data.Objects;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  mapping(){
    let row = this.gridApi.getSelectedRows()[0];
    let model = {
      Id: row.Id
    };
    this.apiService.apiPost('common/cancelmapping',model).subscribe(data => {
      if(data.Code === 0){
        this.getPage();
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
  }

  async cancel(){
    const {ConfirmComponent} = await import('../../../../../../components/confirm/confirm.component');
    const dialogRef = this.dialog.open(ConfirmComponent, {width:ModalSizes.SMALL});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
     if(data){
      this.mapping();
     }

   })
  }

  onGridReady(params)
  {
    super.onGridReady(params);

  }

  getPage() {
    let filter = {
      PageIndex: 0,
      PageSize: 500,
      ObjectTypeId: 21
    }
    this.apiService.apiPost('common/mappendresulttypes', filter,
      ).pipe(take(1)).subscribe(data => {
      if(data.Code === 0)
      {
        this.rowData = data.ResponseObject;
        this.rowData.forEach(sport =>{
          let providerName = this.providers.find((provider) => {
            return provider.Id == sport.ProviderId;
          })
          if(providerName){
            sport['ProviderName'] = providerName.Name;
          }
        })
      } else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });

  }

}
