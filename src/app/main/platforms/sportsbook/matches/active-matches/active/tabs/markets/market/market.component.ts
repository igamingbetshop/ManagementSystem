import { Component, OnInit, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { SportsbookApiService } from 'src/app/main/platforms/sportsbook/services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent extends BasePaginatedGridComponent implements OnInit {

  public name: string = '';
  public MatchId: number;
  public number: number;
  public partnerId: number;
  public SelectionId: number;
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;
  public rowData = [];
  public path: string = 'markets/selectionchangehistory';

  constructor(
    protected injector:Injector,
    private apiService:SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute:ActivatedRoute,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Name/Surname',
        field: 'UserName',
        resizable: true,
        filter: false,
        cellRenderer: function(params) {
          let name = params.data.UserFirstName;
          let surName = params.data.UserLastName;
            return `<div">${name} - ${surName}</div>`;
        },
      },
      {
        headerName: 'Old Blocked',
        field: 'OldBlocked',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'New Blocked',
        field: 'NewBlocked',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Old Coefficient',
        field: 'OldInitialCoefficient',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'New Coefficient',
        field: 'NewInitialCoefficient',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Old Status',
        field: 'OldStatus',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'New Status',
        field: 'NewStatus',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Comment',
        field: 'Comment',
        resizable: true,
        filter: false,
      },
    ]
  }

  ngOnInit() {
    this.MatchId = +this.activateRoute.snapshot.queryParams.MatchId;
    this.name = this.activateRoute.snapshot.queryParams.name;
    this.number = +this.activateRoute.snapshot.queryParams.number;
    this.partnerId = this.activateRoute.snapshot.queryParams.partnerId;
    this.SelectionId = +this.activateRoute.snapshot.queryParams.SelectionId;
    this.getPage();
  }

  onGridReady(params)
  {
    super.onGridReady(params);
  }

  getPage(){
    this.apiService.apiPost(this.path,{SelectionId:this.SelectionId})
    .pipe(take(1))
    .subscribe(data => {
      if(data.Code === 0){

        this.rowData = data.ResponseObject;

      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
