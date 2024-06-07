import { Component, OnInit, Injector, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgGridAngular } from 'ag-grid-angular';
import { take } from 'rxjs/operators';
import { GridRowModelTypes } from 'src/app/core/enums';
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { NumericEditorComponent } from 'src/app/main/components/grid-common/numeric-editor.component';
import { TextEditorComponent } from 'src/app/main/components/grid-common/text-editor.component';
import { SportsbookApiService } from '../../services/sportsbook-api.service';
import 'ag-grid-enterprise';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent extends BasePaginatedGridComponent implements OnInit {

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  @ViewChild('agGrid1') agGrid1: AgGridAngular;

  public path: string = 'matches/activematchestree';
  public path1: string = 'matches/favorites';
  isSendingReqest = false;
  public sportTree;
  public sportTreeReference;
  public matches;
  public availableProviders: any[] = [];
  public sportProviders: any[] = [];
  public allProviders: any[] = [];
  public rowData = [];
  public rowData1 = [];
  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    numericEditor: NumericEditorComponent,
    textEditor: TextEditorComponent,
  };
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public rowModelType1: string = GridRowModelTypes.CLIENT_SIDE;
  public columnDefs2;

  public partners: any[] = [];
  public partnerId: number = null;
  public priority: number = null;
  compareDate: any;
  public availableStatuses = {
    statuses: [
      { id: '2', status: 0, name: this.translate.instant('Sport.Prematch')},
      { id: '3', status: 1, name: this.translate.instant('Common.Live') }
    ],
    selectedStatus: { id: '1', status: -1, name: this.translate.instant('Common.All') }
  };
  sports: any;


  constructor(
    protected injector: Injector,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private ref: ChangeDetectorRef
  ) {
    super(injector);

    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        sortable: false,
        resizable: true,
        tooltipField: 'Id',
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
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
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.RegionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'RegionName',
        sortable: false,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        sortable: false,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Common.StatusName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StatusName',
        sortable: false,
        resizable: true,
        filter: 'agSetColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          defaultToNothingSelected: true,
          values: this.availableStatuses.statuses.map(sp => sp.name),
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: false,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          return `${dat}`;
        },
        filterParams: {
          comparator: this.compareDate,
          browserDatePicker: true,
          buttons: ['apply', 'reset'],
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
    ];

    this.columnDefs2 = [
      {
        headerName: 'Sport.MatchId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'MatchId',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Sport.CompetitionId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionId',
        sortable: true,
        resizable: true,
        cellStyle: { color: '#076192', 'font-size': '14px', 'font-weight': '500' },
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },
      },
      {
        headerName: 'Partners.PartnerName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
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
          filterOptions: this.filterService.textOptions
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
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Sport.CompetitionName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'CompetitionName',
        resizable: true,
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.textOptions
        },
      },
      {
        headerName: 'Common.Name',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Name',
        sortable: false,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
      {
        headerName: 'Bonuses.Priority',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Priority',
        sortable: true,
        resizable: true,
        editable: true,
        filter: 'agNumberColumnFilter',
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
          filterOptions: this.filterService.numberOptions
        },

      },
      {
        headerName: 'Clients.StartTime',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'StartTime',
        sortable: false,
        filter: 'agDateColumnFilter',
        cellRenderer: function (params) {
          let datePipe = new DatePipe("en-US");
          let dat = datePipe.transform(params.data.StartTime, 'medium');
          return `${dat}`;
        },
        filterParams: {
          comparator: this.compareDate,
          browserDatePicker: true,
          buttons: ['apply', 'reset'],
        },
        cellStyle: function (params) {
          if (params.data.Status == 1) {
            return { backgroundColor: '#aefbae' };
          } else {
            return null;
          }
        }
      },
    ];
  }

  ngOnInit() {
    this.getSports();
    this.gridStateName = 'sport-favorites-type-grid-state';
    this.getProviders();
    this.getPartners();
    this.getActiveMatches();
    this.getPage();
  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.Code === 0) {
        this.partners = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
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

  onPartnerChange(val) {
    this.partnerId = null;
    this.partnerId = val;
  }

  onPriorityChange(val) {
    this.priority = val;
  }

  onAddMatch() {
    if (this.partnerId == null) {
      SnackBarHelper.show(this._snackBar, { Description: 'Select partner', Type: "error" });
      return;
    }
    this.isSendingReqest = true;
    let row = this.agGrid.api.getSelectedRows()[0];
    let model = {
      MatchId: row.MatchId,
      PartnerId: this.partnerId,
      Priority: +this.priority,
    };

    this.apiService.apiPost('matches/addfavorite', model)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          // this.rowData1.unshift(data);
          // this.agGrid1.api.setRowData(this.rowData1);
          this.getPage();
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });

    this.partnerId = null;
    this.priority = null;
  }

  getSports() {
    this.apiService.apiPost('sports').subscribe(data => {
      if (data.Code === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  onRemoveMatch() {
    let row = this.agGrid1.api.getSelectedRows()[0];
    this.isSendingReqest = true;

    this.apiService.apiPost('matches/removefavorite', { MatchId: row.MatchId, PartnerId: row.PartnerId  })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.getPage()
          // let index = this.rowData1.findIndex(links => {

          //   return links.Id = row.Id
          // })
          // if (index >= 0) {
          //   this.rowData1.splice(index, 1);
          // }
          this.agGrid1.api.setRowData(this.rowData1);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
        this.isSendingReqest = false;
      });
  }

  isRowSelected() {
    return this.agGrid?.api && this.agGrid?.api.getSelectedRows().length === 0;
  };

  isRowSelected1() {
    return this.agGrid1?.api && this.agGrid1?.api.getSelectedRows().length === 0;
  };

  onGridReady(params) {
    super.onGridReady(params);
  }

  onGridReady1(params) {
    super.onGridReady(params);
  }

  onCellValueChanged(params) {
    this.apiService.apiPost('matches/updatefavorite', params.data)
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  getPage() {
    this.apiService.apiPost(this.path1, {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          let _data = data.ResponseObject;
          _data.forEach(item => {
            item.Name = [],
            item["PartnerName"] = this.partners.find((partner) => partner.Id === item.PartnerId)?.Name;
            item.Competitors.forEach(elem => {
              item.Name.push(elem.TeamName)
            })
            item.Name = item.Name.join(' - ');
          })
          this.rowData1 = _data;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  order(arr) {
    arr.sort((a, b) => {
      return a.Priority - b.Priority;
    })
    return arr;
  }

  ngAfterContentChecked() {
    this.ref.detectChanges();
  }

  onGo() {
    this.getActiveMatches();
    this.getPage();
  }

  getActiveMatches() {
    this.apiService.apiPost(this.path, {})
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          let matches = [];
          this.sportTree = this.order(data.Sports);

          for (let i = 0; i < this.sportTree.length; i++) {
            this.sportTree[i].show = false;

            for (let j = 0; j < this.sportTree[i].Regions.length; j++) {
              this.sportTree[i].Regions[j].show = false;

              for (let k = 0; k < this.sportTree[i].Regions[j].Competitions.length; k++) {
                this.sportTree[i].Regions[j].Competitions[k].show = false;

                for (let m = 0; m < this.sportTree[i].Regions[j].Competitions[k].Matches.length; m++) {
                  this.sportTree[i].Regions[j].Competitions[k].Matches[m].show = false;

                  let teams = [];

                  for (let t = 0; t < this.sportTree[i].Regions[j].Competitions[k].Matches[m].Competitors.length; t++) {
                    teams.push(this.sportTree[i].Regions[j].Competitions[k].Matches[m].Competitors[t].TeamName);
                  }
                  this.sportTree[i].Regions[j].Competitions[k].Matches[m]['RegionName'] = this.sportTree[i].Regions[j].Name;

                  this.sportTree[i].Regions[j].Competitions[k].Matches[m].Name = teams.join(' - ');
                  this.sportTree[i].Regions[j].Competitions[k].Matches[m].SportName = this.sportTree[i].Name;
                  this.sportTree[i].Regions[j].Competitions[k].Matches[m].SportId = this.sportTree[i].SportId;
                  this.sportTree[i].Regions[j].Competitions[k].Matches[m].CompetitionName = this.sportTree[i].Regions[j].Competitions[k].Name;
                }
                matches.push.apply(matches, this.sportTree[i].Regions[j].Competitions[k].Matches);
              }

            }

          }
          this.sportTreeReference = JSON.parse(JSON.stringify(this.sportTree));
          this.matches = matches;
          this.rowData = matches;
          this.availableProviders = [];

          matches.forEach(item => {
            let provider = this.allProviders.find(elem => elem.Id == item.ProviderId);

            if (provider) {
              let index = this.availableProviders.findIndex(elem => elem.Id == provider.Id);

              if (index == -1)
                this.availableProviders.push(provider);
            }
            let statusName = this.availableStatuses.statuses.find((state) => {
              return state.status == item.Status;
            })
            if (statusName) {
              item['StatusName'] = statusName.name;
            }

          });
          this.sportProviders = this.availableProviders;
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })

  }




}
