import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import 'ag-grid-enterprise';
import { take } from 'rxjs/operators';

import { SportsbookApiService } from '../../../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { UnMappedCompetitionsGridComponent } from './grids/unmapped-competitions-grid/unmapped-competitions-grid.component';
import { MappedCompetitionsGridComponent } from './grids/mapped-competitons-grid/mapped-competitions-grid.component';

@Component({
  selector: 'app-map-competitions',
  templateUrl: './map-competitions.component.html',
  styleUrls: ['./map-competitions.component.scss']
})
export class MapCompetitionsTabComponent implements OnInit {

  @ViewChild(UnMappedCompetitionsGridComponent) unMappedCompetitionsGridComponent: UnMappedCompetitionsGridComponent;
  @ViewChild(MappedCompetitionsGridComponent) mappedCompetitionsGridComponent: MappedCompetitionsGridComponent;

  public rowData = [];
  public rowData1 = [];
  public columnDefs1;
  public isCanNotSelect = true;

  public providers: any[] = [];
  public sports: any[] = [];
  public sportId: number | null;

  constructor(
    private apiService:SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {
   }

  ngOnInit() {
    this.getProviders();
    this.getSports();

  }

  getSports(){
    this.apiService.apiPost('sports').subscribe(data => {
      if(data.Code === 0){
        this.sports = data.ResponseObject;
      }else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    })
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

  onSportChange(val){
    this.sportId = val;
    this.go();
  }

  go(){
    this.unMappedCompetitionsGridComponent.gridApi.refreshServerSide({ purge: true });
    this.mappedCompetitionsGridComponent.gridApi.refreshServerSide({ purge: true });
    this.isCanNotSelect = true
  }

  mapCompetition(){
    let unknownRow = this.unMappedCompetitionsGridComponent.gridApi.getSelectedRows()[0];
    let knownRow = this.mappedCompetitionsGridComponent.gridApi.getSelectedRows()[0];

    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: 3,
      ObjectExternalId: unknownRow.ExternalId
    };

    this.apiService.apiPost('common/map', model)
    .pipe(take(1))
    .subscribe(data => {
      if(data.Code === 0)
      {
        this.go();
      } else{
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });
  }

  handleValueEmitted(value: boolean) {
    this.isCanNotSelect = value;
  }

}
