import { Component, Injector, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Controllers, GridRowModelTypes, Methods } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import 'ag-grid-enterprise';
import { CoreApiService } from '../../../../services/core-api.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BasePaginatedGridComponent implements OnInit {

  public rowData = [];
  public rowModelType:string = GridRowModelTypes.CLIENT_SIDE;
  public roleId:number;

  constructor(
    protected injector:Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private activateRoute:ActivatedRoute,
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Id',
        field: 'RoleId',
        resizable: true,
        cellStyle: {color: '#076192', 'font-size' : '14px', 'font-weight': '500'},
        filter: false,
      },
      {
        headerName: 'User Id',
        field: 'UserId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Partner Id',
        field: 'PartnerId',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'User Name',
        field: 'UserName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'First Name',
        field: 'FirstName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Last Name',
        field: 'LastName',
        resizable: true,
        filter: false,
      },
    ]
   }

  ngOnInit() {
    this.roleId = +this.activateRoute.snapshot.queryParams.roleId;
    this.gridStateName = 'role-users-grid-state';
    this.getPage()
  }

  onGridReady(params)
  {
    super.onGridReady(params);

  }

  getPage(){
    this.apiService.apiPost(this.configService.getApiUrl, {Id: this.roleId},
      true, Controllers.PERMISSION, Methods.GET_ROLE_USERS)
    .pipe(take(1))
    .subscribe(data => {
      if(data.ResponseCode === 0){
        this.rowData = data.ResponseObject;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

}
