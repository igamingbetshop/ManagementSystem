import { Component, OnInit, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { AgBooleanFilterComponent } from 'src/app/main/components/grid-common/ag-boolean-filter/ag-boolean-filter.component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { debounceTime, take } from 'rxjs/operators';
import { GridMenuIds, GridRowModelTypes, ModalSizes } from 'src/app/core/enums';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { CommonDataService } from "../../../../../../core/services";
import { Subject } from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';
import { AgDateTimeFilter } from 'src/app/main/components/grid-common/ag-date-time-filter/ag-date-time-filter.component';
import { CellClickedEvent } from 'ag-grid-community';
import { DateHelper } from 'src/app/main/components/partner-date-filter/data-helper.class';

@Component({
  selector: 'app-all-active',
  templateUrl: './all-active.component.html',
  styleUrls: ['./all-active.component.scss']
})
export class AllActiveComponent extends BasePaginatedGridComponent implements OnInit {
  public rowData = [];
  public frameworkComponents;
  public partners: any[] = [];
  public partnerId: number;
  public allProviders: any[] = [];
  public sportProviders: any[] = [];
  public availableProviders: any[] = [];
  public sports: any[] = [];
  public sportsId: number;
  public statusId: number = -1;
  public sportLocalFilter: any[] = [];
  public providerId: number;
  public searchMatch: any = {};
  public view: string = 'tree'
  public path = 'matches/activematchestree';
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  fromDate: Date;
  public defaultColDef = {
    flex: 1,
    editable: false,
    sortable: true,
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    minWidth: 50,
    cellStyle: function (params) {
      if (params.data.Status == 1) {
        return { backgroundColor: '#aefbae' };
      } else {
        return null;
      }
    }
  };

  public availableStatuses = {
    statuses: [
      // { id: '1', status: -1, name: 'All' },
      { id: '2', status: 0, name: this.translate.instant('Sport.Prematch') },
      { id: '3', status: 1, name: this.translate.instant('Common.Live') }
    ],
    selectedStatus: { id: '1', status: -1, name: 'All' }
  };

  public sportTree;
  public sportTreeReference;
  public matches;
  public competitionSearchText: string;
  public teamSearchText: string;
  public searchMatchId: number | string;
  public searchExternalId: number | string;
  public searchByTimeField: string | Date;
  private searchCompetition$: Subject<string> = new Subject();
  private searchTeam$: Subject<string> = new Subject();
  private searchByTime$: Subject<string | Date> = new Subject();
  private searchMatchId$: Subject<string> = new Subject();
  private searchExternalId$: Subject<string> = new Subject();
  private timeInterval = 500;

  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public activateRoute: ActivatedRoute,
    private commonDataService: CommonDataService
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.SP_MATCHES_ACTIVE;
    this.frameworkComponents = {
      agBooleanColumnFilter: AgBooleanFilterComponent,
      buttonRenderer: ButtonRendererComponent,
      agDateTimeFilter: AgDateTimeFilter
    };

    this.subscribeSearchText();
  }

  init() {
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
      },
      {
        headerName: 'Sport.Number',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchNumber',
      },
      {
        headerName: 'Sport.SportName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'SportName',
        sortable: false,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
          values: this.sports.map(sp => sp.Name),
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: false,
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
      },
      {
        headerName: 'Common.Type',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Type',
      },
      {
        headerName: 'Sport.ProviderId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'ProviderId',
      },
      {
        headerName: 'Common.StatusName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
          values: this.availableStatuses.statuses.map(sp => sp.name),
        },
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
      },
      {
        headerName: 'Sport.Supsend',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          const label = params.data.Enabled ? this.translate.instant('Sport.Supsend') : this.translate.instant('Sport.UnSupsend');
          const bgColor = params.data.Enabled ? '#FFC107' : '#ff7e54';
          const textColor = 'black';
          return `<button mat-stroked-button mat-button class="mat-btn" style="background-color:${bgColor};
                    cursor: pointer;
                    border: none;
                    padding: 6px;
                    color:${textColor}";
                    >
                      ${label}
                  </button>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.onSupsendMatch(event),
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.Reset',
        headerValueGetter: this.localizeHeader.bind(this),
        resizable: true,
        minWidth: 150,
        sortable: false,
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }

          const label = this.translate.instant('Sport.Reset');
          const bgColor = 'red';
          const textColor = 'white';

          return `<button mat-stroked-button mat-button class="mat-btn" style="background-color:${bgColor};
                    cursor: pointer;
                    padding: 6px;
                    border: none;
                    color:${textColor}";
                    >
                      ${label}
                  </button>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.resetMatch(event),
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },

      {
        headerName: 'Common.View',
        headerValueGetter: this.localizeHeader.bind(this),
        filter: false,
        cellRenderer: params => {
          if (params.node.rowPinned) {
            return '';
          }
          return `<i style="color:#076192; padding-left: 20px; cursor: pointer;" class="material-icons">
            visibility
          </i>`;
        },
        onCellClicked: (event: CellClickedEvent) => this.redirectToMatch(event),
      },
    ];
  }

  ngOnInit() {
    this.setTime();
    this.partners = this.commonDataService.partners;
    this.getProviders();
    this.getSports();
    this.gridStateName = 'all-active=matches-grid-state';
    this.getPage();
  }

  setTime() {
    const [fromDate, toDate] = DateHelper.startDate();
    this.fromDate = fromDate;
  }

  redirectToMatch(ev) {
    const row = ev.data;
    const queryParams = {
      MatchId: row.MatchId,
      partnerId: this.partnerId,
      number: row.Number,
      name: row.Name,
      sportId: row.SportId,
    };

    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    const newWindow = window.open(`/main/sportsbook/matches/active-matches/all-active/active/main?${queryString}`, '_blank');
    if (newWindow) {
      newWindow.focus();
    }
  }

  subscribeSearchText() {
    this.searchCompetition$.pipe(debounceTime(this.timeInterval)).subscribe(value => {
      this.competitionSearchText = value;
      this.onTeamsFind();
    });

    this.searchTeam$.pipe(debounceTime(this.timeInterval)).subscribe(value => {
      this.teamSearchText = value;
      this.onTeamsFind();
    });

    this.searchMatchId$.pipe(debounceTime(this.timeInterval)).subscribe(value => {
      this.searchMatchId = value;
      this.onTeamsFind();
    });

    this.searchExternalId$.pipe(debounceTime(this.timeInterval)).subscribe(value => {
      this.searchExternalId = value;
      this.onTeamsFind();
    });

    this.searchByTime$.pipe(debounceTime(this.timeInterval)).subscribe(value => {
      this.searchByTimeField = value;
      this.onTeamsFind();
    });

  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.init();
    })
  }

  compareDate(filterLocalDate: Date, cellValue: string) {
    filterLocalDate = new Date(filterLocalDate);
    const cellDate = new Date(cellValue);

    const filterDateUtc = Date.UTC(filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate());
    const cellDateUtc = Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());

    return Math.floor((filterDateUtc - cellDateUtc) / (1000 * 60 * 60 * 24));
  }

  onSportChange(value: number) {
    this.sportsId = value;
    this.findSport();
    this.filterSportStatus();
    this.filterCompetition();
    this.filterTeam();
  }

  onStatusChange(value: number) {
    this.statusId = value;
    this.findSport();
    if (this.statusId === -1) {
      this.filterCompetition();
      this.filterTeam();
      return;
    }

    this.filterSportStatus();
    this.filterCompetition();
    this.filterTeam();
  }

  findSport() {
    this.sportTree = JSON.parse(JSON.stringify(this.sportTreeReference));
    if (!this.sportsId) {
      return;
    }
    this.sportTree = [this.sportTree.find(elem => elem.SportId == +this.sportsId)];
  }

  filterSportStatus(): void {
    if (this.statusId === -1) {
      return;
    }
    this.sportTree = this.sportTree.filter(sport => {
      sport.Regions = sport.Regions.filter(region => {
        region.Competitions = region.Competitions.filter(competition => {
          competition.Matches = competition.Matches.filter(match => match.Status === this.statusId);
          return competition.Matches.length > 0;
        })
        return region.Competitions.length > 0;
      });
      return sport.Regions.length > 0;
    });
  }

  filterCompetition(): void {
    if (!this.competitionSearchText) {
      return;
    }
    const searchedPattern = new RegExp(this.competitionSearchText, 'gi');
    this.sportTree = this.sportTree.filter(sport => {
      sport.Regions = sport.Regions.filter(region => {
        region.Competitions = region.Competitions.filter(competition => competition.Name.match(searchedPattern))
        return region.Competitions.length > 0;
      });
      return sport.Regions.length > 0;
    });
  }

  onTeamsFind(): void {
    this.findSport();
    this.filterSportStatus();
    this.filterCompetition();
    this.filterTeam();
    this.filterByMatch();
    this.filterByExternal();
    this.filterByTime();
  }

  filterTeam(): void {
    if (!this.teamSearchText) {
      return;
    }
    const searchedPattern = new RegExp(this.teamSearchText, 'gi');
    this.sportTree = this.sportTree.filter(sport => {
      sport.Regions = sport.Regions.filter(region => {
        region.Competitions = region.Competitions.filter(competition => {
          competition.Matches = competition.Matches.filter(match => {
            match.Competitors = match.Competitors.filter(competitor => competitor.TeamName.match(searchedPattern))
            return match.Competitors.length > 0;
          });
          return competition.Matches.length > 0;
        })
        return region.Competitions.length > 0;
      });
      return sport.Regions.length > 0;
    });
  }

  filterByMatch(): void {
    if (!this.searchMatchId) {
      return;
    }
    const searchedPattern = (this.searchMatchId);
    this.sportTree = this.sportTree.filter(sport => {
      sport.Regions = sport.Regions.filter(region => {
        region.Competitions = region.Competitions.filter(competition => {
          competition.Matches = competition.Matches.filter(match => {
            return match.MatchId == (searchedPattern)
          }
          );
          return competition.Matches.length > 0;

        })
        return region.Competitions.length > 0;
      });
      return sport.Regions.length > 0;
    });
  }

  filterByExternal(): void {
    if (!this.searchExternalId) {
      return;
    }
    const searchedPattern = (this.searchExternalId);
    this.sportTree = this.sportTree.filter(sport => {
      sport.Regions = sport.Regions.filter(region => {
        region.Competitions = region.Competitions.filter(competition => {
          competition.Matches = competition.Matches.filter(match => {
            return match.ExternalId == (searchedPattern)
          }
          );
          return competition.Matches.length > 0;

        })
        return region.Competitions.length > 0;
      });
      return sport.Regions.length > 0;
    });
  }

  filterByTime(): void {
    if (!this.searchByTimeField) {
        return;
    }
    const searchedDate = new Date(this.searchByTimeField);
    this.sportTree = this.sportTree.filter(sport => {
        sport.Regions = sport.Regions.filter(region => {
            region.Competitions = region.Competitions.filter(competition => {
                competition.Matches = competition.Matches.filter(match => {
                    const matchStartTime = new Date(match.StartTime);
                    return matchStartTime <= searchedDate;
                });
                return competition.Matches.length > 0;
            });
            return region.Competitions.length > 0;
        });
        return sport.Regions.length > 0;
    });
}


  searchCompetition(value: string) {
    this.searchCompetition$.next(value);
  }

  searchTeam(value: string) {
    this.searchTeam$.next(value);
  }

  searchByMatchId(value: string) {
    this.searchMatchId$.next(value);
  }

  searchByExternalId(value: string) {
    this.searchExternalId$.next(value);
  }

  searchByTime() {
    this.searchByTime$.next(this.fromDate)
  }

  getProviders() {
    this.apiService.apiPost('providers').subscribe(data => {
      if (data.Code === 0) {
        this.allProviders = data.Objects;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onPartnerChange(value) {
    this.partnerId = undefined;
    this.partnerId = value;
  }

  onProviderChange(value) {
    this.providerId = value;
  }

  onSupsendMatch(params) {
    let row;
    if (params.data) {
      row = params.data;
    } else row = params;
    const matchData = {
      MatchId: row.MatchId,
      PartnerId: this.partnerId,
    };

    this.apiService.apiPost('matches/match', matchData)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          const sData = data.ResponseObject;
          sData.Enabled = !sData.Enabled;
          this.apiService.apiPost('matches/update', sData)
            .subscribe(data => {
              if (data.Code === 0) {
                SnackBarHelper.show(this._snackBar, { Description: "Match Updated is successful!", Type: "success" });

                this.sportTree.forEach(sport => {
                  sport.Regions.forEach(region => {
                    region.Competitions.forEach(competition => {
                      competition.Matches.forEach(match => {
                        if (match.MatchId === sData.MatchId) {
                          match.Enabled = sData.Enabled;
                        }
                      });
                    });
                  });
                });

                const rowIndex = this.gridApi.getRenderedNodes()
                  .findIndex(node => node.data.MatchId === sData.MatchId);

                if (rowIndex !== -1) {
                  const rowNode = this.gridApi.getRenderedNodes()[rowIndex];
                  rowNode.data.Enabled = sData.Enabled;

                  this.gridApi.refreshCells({ rowNodes: [rowNode], force: true });
                }
              } else {
                SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
              }
            });
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  resetMatch(params) {
    let row;
    if (params.data) {
      row = params.data;
    } else row = params;
    const sData = {
      MatchId: row.MatchId,
      ServiceType: row.Status,
      PartnerId: this.partnerId,
    }

    this.apiService.apiPost('matches/reset', sData)
      .subscribe(data => {
        if (data.Code === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Match reset is successfully!", Type: "success" });

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  go() {
    this.getPage();
  }

  toggleOpened(obj) {
    obj.Opened = !obj.Opened;
  }

  order(arr) {
    arr.sort((a, b) => {
      return a.Priority - b.Priority;
    })
    return arr;
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  // getPage() {
  //   this.apiService.apiPost(this.path, {})
  //     .pipe(take(1))
  //     .subscribe(data => {
  //       if (data.Code === 0) {
  //         let matches = [];
  //         this.sportTree = this.order(data.Sports);
  //         for (let i = 0; i < this.sportTree.length; i++) {
  //           this.sportTree[i].show = false;

  //           for (let j = 0; j < this.sportTree[i].Regions.length; j++) {
  //             this.sportTree[i].Regions[j].show = false;

  //             for (let k = 0; k < this.sportTree[i].Regions[j].Competitions.length; k++) {
  //               this.sportTree[i].Regions[j].Competitions[k].show = false;

  //               for (let m = 0; m < this.sportTree[i].Regions[j].Competitions[k].Matches.length; m++) {
  //                 this.sportTree[i].Regions[j].Competitions[k].Matches[m].show = false;

  //                 let teams = [];

  //                 for (let t = 0; t < this.sportTree[i].Regions[j].Competitions[k].Matches[m].Competitors.length; t++) {

  //                   teams.push(this.sportTree[i].Regions[j].Competitions[k].Matches[m].Competitors[t].TeamName);
  //                 }

  //                 this.sportTree[i].Regions[j].Competitions[k].Matches[m].Name = teams.join(' - ');
  //                 this.sportTree[i].Regions[j].Competitions[k].Matches[m].SportName = this.sportTree[i].Name;
  //                 this.sportTree[i].Regions[j].Competitions[k].Matches[m].SportId = this.sportTree[i].SportId;
  //                 this.sportTree[i].Regions[j].Competitions[k].Matches[m].CompetitionName = this.sportTree[i].Regions[j].Competitions[k].Name;
  //               }
  //               matches.push.apply(matches, this.sportTree[i].Regions[j].Competitions[k].Matches);
  //             }
  //           }
  //         }
  //         this.sportTreeReference = JSON.parse(JSON.stringify(this.sportTree));
  //         this.rowData = matches;
          
  //         this.rowData.forEach(element => {
  //           element.StartTime = this.formatDate(element.StartTime)
  //         })
  //         this.matches = matches;
  //         this.availableProviders = [];

  //         matches.forEach(item => {
  //           let provider = this.allProviders.find(elem => elem.Id == item.ProviderId);

  //           if (provider) {
  //             let index = this.availableProviders.findIndex(elem => elem.Id == provider.Id);

  //             if (index == -1)
  //               this.availableProviders.push(provider);
  //           }
  //           let statusName = this.availableStatuses.statuses.find((state) => {
  //             return state.status == item.Status;
  //           })
  //           if (statusName) {
  //             item['StatusName'] = statusName.name;
  //           }
  //         });
  //         this.sportProviders = this.availableProviders;
  //       } else {
  //         SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
  //       }
  //     })

  // }

  getPage() {
    this.apiService.apiPost(this.path, {})
        .pipe(take(1))
        .subscribe(data => {
            if (data.Code === 0) {
                this.sportTree = this.order(data.Sports);
                const matches = this.extractMatches(this.sportTree);
                
                this.sportTreeReference = JSON.parse(JSON.stringify(this.sportTree));
                this.rowData = matches;
                this.rowData.forEach(element => {
                    element.StartTime = this.formatDate(element.StartTime);
                });

                this.matches = matches;
                this.availableProviders = this.extractAvailableProviders(matches);
                this.sportProviders = this.availableProviders;
            } else {
                SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
        });
}

extractMatches(sportTree) {
    let matches = [];

    sportTree.forEach(sport => {
        sport.show = false;
        sport.Regions.forEach(region => {
            region.show = false;
            region.Competitions.forEach(competition => {
                competition.show = false;
                competition.Matches.forEach(match => {
                    match.show = false;

                    match.Name = match.Competitors.map(comp => comp.TeamName).join(' - ');
                    match.SportName = sport.Name;
                    match.SportId = sport.SportId;
                    match.CompetitionName = competition.Name;

                    matches.push(match);
                });
            });
        });
    });

    return matches;
}

extractAvailableProviders(matches) {
    let availableProviders = [];
    matches.forEach(item => {
        const provider = this.allProviders.find(provider => provider.Id === item.ProviderId);
        if (provider && !availableProviders.some(prov => prov.Id === provider.Id)) {
            availableProviders.push(provider);
        }
        const statusName = this.availableStatuses.statuses.find(state => state.status === item.Status);
        if (statusName) {
            item['StatusName'] = statusName.name;
        }
    });
    return availableProviders;
}

  async addMatch(sport?, region?, competition?) {
    competition = competition || {};
    competition.SportId = sport?.SportId || null;
    competition.SportName = sport?.Name || null;
    if (typeof region !== 'undefined') {
      competition.RegionId = region.RegionId;
      competition.RegionName = region.Name;
    }
    const { AddMatchComponent } = await import('../all-active/add-match/add-match.component');
    const dialogRef = this.dialog.open(AddMatchComponent, {
      width: ModalSizes.SMALL, data: {
        competition: competition,
        sportProviders: this.allProviders,
        sports: this.sports,
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getPage();
      }
    })
  }

  navigateToMatch(competition) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['main/sportsbook/matches/active-matches/all-active/active/main'],
      { queryParams: { "MatchId": competition.MatchId, 'name': competition.Name, 'sportId': competition.SportId } }));
    window.open(url, '_blank');
  }

  formatDate(inputDate) {
    const date = new Date(inputDate);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedDate = months[date.getMonth()] + " " +
      date.getDate() + ", " +
      date.getFullYear() + ", " +
      (date.getHours() % 12 || 12) + ":" +
      (date.getMinutes() < 10 ? "0" : "") + date.getMinutes() + ":" +
      (date.getSeconds() < 10 ? "0" : "") + date.getSeconds() + " " +
      (date.getHours() >= 12 ? "PM" : "AM");

    return formattedDate;
  }

  onStartDateChange(event: any) {
    if (event instanceof Date) {
      this.fromDate = event;
    } else {
      const formattedDateTime = event;
      this.fromDate = this.parseDateTimeString(formattedDateTime);
      this.searchByTime$.next(this.formatDateForSearch(this.fromDate));      
    }
  }

  private parseDateTimeString(dateTimeString: string): Date {
    const dateTimeParts = dateTimeString.split('T');
    if (dateTimeParts.length === 2) {
      const [datePart, timePart] = dateTimeParts;
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    }
    return new Date();
  }

  formatDateTime(date: any): string {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return '';
  }

  formatDateForSearch(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}



}
