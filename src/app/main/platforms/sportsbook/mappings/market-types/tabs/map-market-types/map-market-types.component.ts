import {Component, OnInit, ViewChild} from '@angular/core';

import {MatSnackBar} from '@angular/material/snack-bar';
import {take} from 'rxjs/operators';

import {SportsbookApiService} from '../../../../services/sportsbook-api.service';
import {SnackBarHelper} from "../../../../../../../core/helpers/snackbar.helper";
import { UnmappedMarketTypesGridComponent } from './grids/unmapped-market-types-grid/unmapped-market-types-gird.component';
import { MappedMarketTypesGridComponent } from './grids/mapped-market-types-grid/mapped-market-types-gird.component';


@Component({
  selector: 'app-map-market-types-tab',
  templateUrl: './map-market-types.component.html',
  styleUrls: ['./map-market-types.component.scss']
})
export class MapMarketTypesTabComponent implements OnInit {

  @ViewChild(UnmappedMarketTypesGridComponent) unmappedMarketTypesGridComponent: UnmappedMarketTypesGridComponent;
  @ViewChild(MappedMarketTypesGridComponent) mappedMarketTypesGridComponent: MappedMarketTypesGridComponent;

  public columnDefs1;

  public isCanNotSelect = true;
  public isUnmappedDetailSelected = false;
  public unmappedRowSelected = false;
  public isMappedDetailSelected = false;
  public mappedRowSelected = false;
  public rowDetailed: any;
  public deteledGridOption;

  public providers: any[] = [];
  public sports: any[] = [];
  public sportId = null;

  public masterDetail;
  public detailGridParams: any;
  public detailGridParamsSecond: any;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
  ) {}


  ngOnInit() {
    this.getProviders();
    this.getSports();
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject.sort((a, b) => a.Name.toLowerCase() > b.Name.toLowerCase() ? 1 : -1);
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.providers = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  onSportChange(val) {
    this.sportId = val;
    this.unmappedMarketTypesGridComponent.sportId = val;
    this.mappedMarketTypesGridComponent.sportId = val;
    this.go();
  }

  go() {
    this.unmappedMarketTypesGridComponent.getRows();
    this.mappedMarketTypesGridComponent.getRows();
    this.isCanNotSelect = true
  }

  mapCompetition(type: string = 'detailRow') {
    let unknownRow = this.unmappedMarketTypesGridComponent.rowDetailed ? this.unmappedMarketTypesGridComponent.rowDetailed : this.unmappedMarketTypesGridComponent.agGrid.api.getSelectedRows()[0];
    let knownRow = this.mappedMarketTypesGridComponent.rowDetailed ? this.mappedMarketTypesGridComponent.rowDetailed : this.mappedMarketTypesGridComponent.agGrid.api.getSelectedRows()[0];


    let model = {
      ProviderId: unknownRow.ProviderId,
      ObjectId: knownRow.Id,
      ObjectTypeId: null,
      ObjectExternalId: unknownRow.ExternalId
    };
    model.ObjectTypeId = unknownRow.ParentId === null ? 6 : 8;
    this.apiService.apiPost('common/map', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          if(type ==='parentRow') {
            this.unmappedMarketTypesGridComponent.rowData =
            this.unmappedMarketTypesGridComponent.rowData.filter(item => item.Id !== data.ResponseObject);
            this.deselectAll()
          } else {
            this.unmappedMarketTypesGridComponent.detailGridParams.api.redrawRows();
            this.mappedMarketTypesGridComponent.detailGridParams.api.redrawRows();
            this.deselectAll()
          }
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

  isUnknownRowSelected() {
    return this.unmappedMarketTypesGridComponent.agGrid.api &&
      this.unmappedMarketTypesGridComponent.agGrid.api.getSelectedRows().length === 0;
  };

  isKnownRowSelected() {
    return this.mappedMarketTypesGridComponent.agGrid.api
      && this.mappedMarketTypesGridComponent.agGrid.api.getSelectedRows().length === 0;
  };

  handleValueEmitted(value: boolean) {
    this.unmappedRowSelected = value;
  }

  handleUnmappedDetaliRow(value: boolean) {
    this.isUnmappedDetailSelected = value;
  }

  handleMappedRows(value: boolean) {
    this.mappedRowSelected = value;
    if (!this.isUnknownRowSelected() && !this.isUnmappedDetailSelected && !this.isMappedDetailSelected) {
      this.mapCompetition('parentRow');
    } else {
      SnackBarHelper.show(this._snackBar, {Description: 'You have to map selections at first.', Type: "info"});
      this.deselectAll();
    }
  }

  handleMappedDetaliRow(value: boolean) {
    this.isMappedDetailSelected = value;
    if(this.isMappedDetailSelected && this.isUnmappedDetailSelected) {
      this.mapCompetition();
      this.deselectAll();
    } else {
      SnackBarHelper.show(this._snackBar, {Description: 'You have to select correct items.', Type: "info"});
      this.deselectAll();
    }
  }

  deselectAll() {
    this.unmappedMarketTypesGridComponent.agGrid.api?.deselectAll();
    this.mappedMarketTypesGridComponent.agGrid.api?.deselectAll();
    this.unmappedMarketTypesGridComponent.deteledGridOption?.deselectAll();
    this.mappedMarketTypesGridComponent.deteledGridOption?.deselectAll();
    this.isMappedDetailSelected = false;
    this.isUnmappedDetailSelected = false;
    this.mappedRowSelected = false;
    this.unmappedRowSelected = false;
  }
}
