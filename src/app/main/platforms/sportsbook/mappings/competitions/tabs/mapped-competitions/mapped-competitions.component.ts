import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';
import { Paging } from 'src/app/core/models';
import { MatDialog } from '@angular/material/dialog';
import { ModalSizes } from 'src/app/core/enums';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-mapped-competitions',
  templateUrl: './mapped-competitions.component.html',
  styleUrls: ['./mapped-competitions.component.scss']
})
export class MappedCompetitionsTabComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public providers: any[] = [];

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
        field: 'Id',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500', 'padding-left' : '50px',},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Payments.CompetitionsExternalId',
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
        headerName: 'Sport.Competitions',
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
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
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
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
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
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ObjectId',
        sortable: true,
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500', 'padding-left' : '50px',},
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
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
    ];
  }

  ngOnInit() {
    this.gridStateName = 'mapped-competitions-grid-state';
    this.getProviders();
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
        this.getCurrentPage();
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
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource()
  {
    return {
      getRows:  (params) => {
        const paging = new Paging();
        paging.PageIndex = this.paginationPage - 1;
        // paging.PageSize = this.cacheBlockSize;
        paging.PageSize = Number(this.cacheBlockSize);
        paging.ObjectTypeId = 1;
        this.setSort(params.request.sortModel, paging, "OrderByDescending");
        this.setFilter(params.request.filterModel, paging);
        if(paging.ObjectIds?.ApiOperationTypeList.length === 1) {
          paging.ObjectIds = {ApiOperationTypeList: [...paging.ObjectIds.ApiOperationTypeList]}
        }


        this.apiService.apiPost('competitions/mapped', paging,
          ).pipe(take(1)).subscribe(data => {
          if(data.Code === 0)
          {
            const mappedRows = data.Objects;
            mappedRows.forEach(sport =>{
              let providerName = this.providers.find((provider) => {
                return provider.Id == sport.ProviderId;
              })
              if(providerName){
                sport['ProviderName'] = providerName.Name;
              }
            })
            params.success({ rowData: mappedRows, rowCount: data.TotalCount});
          } else{
            SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
          }
        });
      },
    };
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

}
