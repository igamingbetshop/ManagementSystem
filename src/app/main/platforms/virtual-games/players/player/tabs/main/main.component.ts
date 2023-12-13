import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {GridRowModelTypes} from "../../../../../../../core/enums";
import {ActivatedRoute} from "@angular/router";
import {VirtualGamesApiService} from "../../../../services/virtual-games-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BasePaginatedGridComponent} from "../../../../../../components/classes/base-paginated-grid-component";
import {DatePipe} from "@angular/common";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public player;
  public playerId: number;
  public Categories: any[] = [];
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;

  constructor(private activateRoute: ActivatedRoute,
              public apiService: VirtualGamesApiService,
              private _snackBar: MatSnackBar,
              protected injector: Injector) {
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
        headerName: 'Users.User',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'User',
        sortable: true,
        resizable: true,
        cellRenderer: params => {
          var a = document.createElement('div');
          if (params.data.UserFirstName !== null || params.data.UserLastName !== null) {
            a.innerHTML = params.data.UserFirstName + ' ' + params.data.UserLastName;
          }
          return a;
        },
      },
      {
        headerName: 'Payments.Date',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ChangeDate',
        sortable: true,
        resizable: true,
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.ChangeDate, 'medium');
          return `${dat}`;
        },
      },
      {
        headerName: 'Payments.Comment',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Comment',
        sortable: true,
        resizable: true,
      },
      {
        headerName: 'Clients.CategoryName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CategoryName',
        sortable: true,
        resizable: true,
      }
    ]
  }

  ngOnInit(): void {
    this.apiService.apiPost('clientcategory')
      .pipe(take(1))
      .subscribe(data => {

        if (data.ResponseCode == 0) {
          this.Categories = data.ResponseObject.Entities;
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
    this.playerId = this.activateRoute.snapshot.queryParams.playerId;
    this.getPlayer();
  }

  getPlayer() {
    let obj = {
      Ids: {
        ApiOperationTypeList: [{IntValue: this.playerId, OperationTypeId: 1}]
      }
    }
    this.apiService.apiPost('players', obj)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.player = data.ResponseObject.Entities[0];
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      })
  }

}
