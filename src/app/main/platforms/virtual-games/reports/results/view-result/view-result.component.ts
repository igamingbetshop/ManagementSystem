import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {VirtualGamesApiService} from "../../../services/virtual-games-api.service";
import {KeyValue} from "@angular/common";
import {BasePaginatedGridComponent} from "../../../../../components/classes/base-paginated-grid-component";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {OddsTypePipe} from "../../../../../../core/pipes/odds-type.pipe";
import {LocalStorageService} from "../../../../../../core/services";
import { GridRowModelTypes, OddsTypes } from 'src/app/core/enums';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss']
})
export class ViewResultComponent extends BasePaginatedGridComponent implements OnInit {
  public resultId: number;
  public data;
  public roundId;
  public gameId;
  public KenoOdds;
  public outcome;
  public state;
  public TableCards;
  public OutcomeNames;
  public CurrentDrawDate;
  public numberRexExp;
  public isEditModeDrawDate;
  public extra;
  public MainSelections;
  public SelectionsLenght;
  public SelectionsArr;
  public Status = 10;
  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public formGroup: UntypedFormGroup;
  private oddsType: number;

  constructor(
    private activateRoute: ActivatedRoute, private _snackBar: MatSnackBar,
    private apiService: VirtualGamesApiService, protected injector: Injector,
    private fb: UntypedFormBuilder,
    private localStorageService: LocalStorageService
  ) {
    super(injector);
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Sport.Coefficient',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Coefficient',
        resizable: true,
        sortable: true,
        cellRenderer: (params) => {
          const oddsTypePipe = new OddsTypePipe();
          let data = oddsTypePipe.transform(params.data.Coefficient, this.oddsType);
          return `${data}`;
        }
      },
      {
        headerName: 'Common.Status',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Status',
        resizable: true,
        sortable: true,
      },
      {
        headerName: 'Common.EventDate',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'EventDate',
        resizable: true,
        sortable: true,
      },
    ]
  }

  ngOnInit(): void {
    this.resultId = this.activateRoute.snapshot.params.id;
    this.gameId = +this.activateRoute.snapshot.queryParams.GameId;
    this.roundId = this.activateRoute.snapshot.queryParams.RoundId;
    this.oddsType = this.localStorageService.get('user')?.OddsType !== null ? this.localStorageService.get('user').OddsType : OddsTypes.Decimal;
    this.getUnitResult();
  }

  onGridReady(params) {
    super.onGridReady(params);
  }

  enableEditing(market) {
    this.extra[market.MarketTypeId].OldResult = JSON.parse(JSON.stringify(market?.Tickets));
    this.extra[market.MarketTypeId].isEditMode = true;
    this.extra[market.MarketTypeId].isValidMarket = true;
  }

  cancel(market) {
    market.Tickets = this.extra[market.MarketTypeId]?.OldResult;
    this.extra[market.MarketTypeId].isEditMode = false;
    this.extra[market.MarketTypeId].isValidMarket = true;
  }

  save(market) {
    this.extra[market.MarketTypeId].isValidMarket = market.Tickets.some(item => !!item);
    let a = {
      UnitId: this.state.UnitId,
      RoundId: +this.roundId,
      MarketTypeId: market.MarketTypeId,
      Tickets: market.Tickets
    }
    this.apiService.apiPost('game/lotteryunitoutcomes', a).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.extra[market.MarketTypeId].isEditMode = false;
        this.extra[market.MarketTypeId].isValidMarket = true;
        this.extra[market.MarketTypeId].completed = market.Tickets.every(x => !!x);
        this.getUnitResult();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  submit(market) {
    this.extra[market.MarketTypeId].isValidMarket = market.Tickets.some(item => !!item);
    let a = {
      UnitId: this.state.UnitId,
      RoundId: +this.roundId,
      MarketTypeId: market.MarketTypeId
    }
    this.apiService.apiPost('game/lotteryunitresults', a).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.extra[market.MarketTypeId].isEditMode = false;
        this.extra[market.MarketTypeId].isValidMarket = true;
        this.outcome.find(x => x.MarketTypeId === market.MarketTypeId).IsSubmitted = true;
        this.getUnitResult();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  public onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }

  getUnitResult() {
    this.apiService.apiPost('game/unitresult', {Id: +this.resultId}).subscribe(data => {

      if (data.ResponseCode === 0) {
        if (this.gameId === 1 || this.gameId === 101 || this.gameId === 107) {
          this.data = data.ResponseObject.Selections;
          this.rowData = data.ResponseObject.Selections;

          this.KenoOdds = [];

          for (var j = 0; j < 110; j++) {

            this.KenoOdds.push(0);
          }

          var state = JSON.parse(data.ResponseObject.State);

          for (var i = 0; i < state.length; i++) {

            var info = state[i].Info;

            for (var j = 0; j < info.length; j++) {

              this.KenoOdds[i + (j * state.length)] = info[j];
            }
          }

        }
        if (this.gameId === 4 || this.gameId === 104) {

          this.data = data.ResponseObject.Selections;
          this.rowData = data.ResponseObject.Selections;
        }

        if (data.ResponseObject.Outcome !== "") {
          this.outcome = JSON.parse(data.ResponseObject.Outcome);
        } else {
          this.outcome = [];
        }

        if (this.gameId === 2 || this.gameId === 102) {

          this.state = JSON.parse(data.ResponseObject.State);
          this.TableCards = {0: "Flop", 1: "Flop", 2: "Flop", 3: "Turn", 4: "River"};
        }
        if (this.gameId === 109) {

          this.OutcomeNames = {0: "Hash", 1: "Salt", 2: "Coef"};
        }
        if (this.gameId === 108) {

          this.state = JSON.parse(data.ResponseObject.State);
        }
        if (this.gameId === 105) {
          this.state = JSON.parse(data.ResponseObject.State)[0];
          this.data = data.ResponseObject;
          this.data.drawDate = data.ResponseObject.DrawDate;
          this.CurrentDrawDate = data.ResponseObject.DrawDate;
          this.isEditModeDrawDate = false;
          this.extra = this.outcome.reduce((extra, market) => {
            extra[market.MarketTypeId] = {
              isEditMode: false,
              isValidMarket: true,
              oldResult: '',
              completed: true
            };
            return extra;
          }, {});

          // let resetMarketValidation = (marketTypeId) => {
          //   let timeout = setTimeout(() => {
          //     this.extra[marketTypeId].isValidMarket = true;
          //     clearTimeout(timeout);
          //   }, 2000);
          // };

          let fillMarket = (market, updatedMarket) => {
            for (i = 0; i < market.TicketsCount; i++) {
              market.Tickets[i] = updatedMarket.Tickets[i] || '';
              if (market.Tickets[i] === '')
                this.extra[market.MarketTypeId].completed = false;
            }
          };
          let fillInitialOutcome = () => this.outcome.forEach(market => {
            fillMarket(market, market)
          });

          fillInitialOutcome();
        }
        if (this.gameId === 3 || this.gameId === 103) {
          if (data.ResponseObject.Outcome !== "") {
            var result = JSON.parse(data.ResponseObject.Outcome);

            this.outcome = Array(result) ? Array(result)[0].Outcome : [];
          }

          this.state = JSON.parse(data.ResponseObject.State);

          var l = this.state[0]?.Markets[7].Selections.length;

          this.SelectionsLenght = (1 + Math.sqrt(1 + (4 * l))) / 2;

          this.SelectionsArr = [];

          for (var m = 0; m < this.SelectionsLenght; m++) {

            this.SelectionsArr.push(m);
          }

          var h = -1;
          this.MainSelections = [];

          for (var j = 0; j < this.SelectionsLenght; j++) {

            for (var k = 0; k < this.SelectionsLenght; k++) {

              if (j == k) {

                this.MainSelections.push(false);

              } else {

                h++;
                this.MainSelections.push(this.state[0].Markets[7].Selections[h]);
              }
            }
          }
        }


      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }

  identify(index) {
    return index;
  }

  enableEditDrawDate() {
    this.isEditModeDrawDate = true;
    this.CurrentDrawDate = this.data.drawDate;
  }

  onDrawDateChange(event) {
    this.data.drawDate = event.value;
  }

  saveEditDrawDate() {
    this.apiService.apiPost('game/editgamestate', {
      Id: +this.resultId,
      CalculationDate: new Date(this.data.drawDate.setDate(this.data.drawDate.getDate() + 1))
    }).subscribe(data => {
      if (data.ResponseCode === 0) {
        this.isEditModeDrawDate = false;
        this.getUnitResult();
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    })
  }

  getCardPosition(unitKey: number) {

    let positionX = 0;
    let positionY = 0;

    if (unitKey < 13) {
      positionX = -60 * unitKey;
    } else if (unitKey > 13 && unitKey < 26) {
      unitKey = unitKey - 13;
      positionY = -85;
      positionX = -60 * unitKey;
    } else if (unitKey > 26 && unitKey < 39) {
      unitKey = unitKey - 26;
      positionY = -170;
      positionX = -60 * unitKey;
    } else if (unitKey > 39 && unitKey < 52) {
      unitKey = unitKey - 39;
      positionY = -255;
      positionX = -60 * unitKey;
    }
    return {
      'background-position-x': positionX + "px",
      'background-position-y': positionY + "px"
    };
  }
}
