import { Component, OnInit, Injector, ViewChild } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { CellEditingStoppedEvent, ICellRendererParams } from 'ag-grid-community';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { SportsbookApiService } from '../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { syncColumnSelectPanel, syncPaginationWithoutBtn } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent extends BasePaginatedGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;

  public modelChanged = new Subject<string>();
  public rowData = [];
  public frameworkComponents;

  public objectTypes: any[] = [];
  public languages: any[] = [];
  public objectTypeId: number = null;
  public languageModel = [{Id: 'en', Name: 'English'}];
  public searchLanguageModel = [{Id: null , Name: 'Select Search Language'}, { Id: 'en' , Name: 'English'}];
  public SelectedLanguages: any[] = [{ Name: 'English', Id: 'en' }];;
  public filter: any = {};
  public translationEntries: any = [];
  public dataToSend = {};
  public paginationPage = 1;

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar) {
    super(injector);
  }

  ngOnInit() {
    this.modelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.getCurrentPage();
    });
    this.languages = this.configService.langList;
    this.getObjectTypes();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  selectObjectType(value) {
    this.objectTypeId = value;
    this.getCurrentPage();
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.Id === o2.Id : o2 === o2;
  }

  selectLanguage(value) {
    this.languageModel = value;
    this.searchLanguageModel = [{Id: null , Name: 'Select Search Language'}];
    this.searchLanguageModel = this.searchLanguageModel.concat(this.languageModel);
    this.getCurrentPage();
  }

  selectSearchLanguage(value) {
    this.filter.SearchLanguage = value.Id;
  }

  inputChanged(event) {
    this.modelChanged.next(event);
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnSelectPanel();
    syncPaginationWithoutBtn();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        this.filter.pagesize = Number(this.cacheBlockSize);
        this.filter.pageindex = params.request.startRow / Number(this.cacheBlockSize);
        this.filter.ObjectTypeId = this.objectTypeId;
        this.filter.SelectedLanguages = this.languageModel.map(el => el.Id);
        this.setSort(params.request.sortModel, this.filter, "OrderByDescending");
        this.setFilter(params.request.filterModel, this.filter);

        this.apiService.apiPost('common/translationentries', this.filter,).pipe(take(1)).subscribe(data => {
          if (data.Code === 0) {
            this.translationEntries = data.Objects;
            this.translationEntries.forEach(item => {
              const translationEntries = item.TranslationEntries;
              translationEntries.forEach(translationEntity => {
                for (let translation in translationEntity) {
                  if (translation == 'LanguageId') {
                    item[translationEntity[translation]] = translationEntity['Text'];
                  }
                }
              })
            });
            this.setColumnDefs();
            params.success({ rowData: this.translationEntries, rowCount: data.TotalCount });
          } else {
            SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: 'error' });
          }
        },
        );
      },
    };
  };

  setColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Bonuses.TranslationId',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'TranslationId',
        resizable: true,
        sortable: true,
        width: 90,
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
        field: 'NickName',
        resizable: true,
        sortable: true,
        editable: true,
        cellEditor: 'textEditor',
        filter: false,
      },
    ];

    if (this.translationEntries.length > 0) {
      const translationEntry = Object.values(this.translationEntries[0]['TranslationEntries']);
      for (let i = 0; i < translationEntry.length; i++) {
        this.columnDefs.push({
          headerName: translationEntry[i]['LanguageId'].charAt(0).toUpperCase() + translationEntry[i]['LanguageId'].slice(1),
          field: translationEntry[i]['LanguageId'],
          resizable: true,
          editable: true,
          cellEditor: 'textEditor',
          filter: false
        }
        )
      }
    }

    this.columnDefs.push({
      headerName: 'Common.Save',
      headerValueGetter: this.localizeHeader.bind(this),
      field: 'save',
      resizable: true,
      sortable: false,
      filter: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.saveTranslations['bind'](this),
        Label: 'Save',
        isDisabled: true,
        bgColor: '#3E4D66',
        textColor: '#FFFFFF'
      }
    });

    this.gridApi.setColumnDefs(this.columnDefs);
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    let entry = null;
    event.data.TranslationEntries.forEach(translationEntry => {
      if (translationEntry.LanguageId === event.column.getColId()) {
        entry = translationEntry
      }
    });
    entry.Text = event.value;
    this.changeTranslation(event.data, entry)
  }

  getObjectTypes() {
    this.apiService.apiPost('common/objecttypes')
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.objectTypes = data.ObjectTypes.filter(el => el.HasTranslation);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  changeTranslation(translation, entry) {
    if (!this.dataToSend[translation.TranslationId]) {
      this.dataToSend[translation.TranslationId] = {}
    }

    if (entry.Text.trim().length > 0) {
      if (this.dataToSend[translation.TranslationId][entry.LanguageId]) {
        this.dataToSend[translation.TranslationId][entry.LanguageId].Text = entry.Text;
      } else {
        this.dataToSend[translation.TranslationId][entry.LanguageId] = {
          Text: entry.Text,
          LanguageId: entry.LanguageId,
          TranslationId: translation.TranslationId,
          ObjectTypeId: translation.ObjectTypeId,
          ObjectId: entry.ObjectId
        };
      }
      translation.notDisabled = true;
    } else {
      translation.notDisabled = false;
    }
  }

  saveTranslations(translation) {
    if (this.dataToSend[translation.data.TranslationId]) {
      let values = Object.values(this.dataToSend[translation.data.TranslationId]);
      if (values.length > 0) {
        this.apiService.apiPost('common/savetranslationentries', { Translations: values })
          .pipe(take(1))
          .subscribe(data => {

            if (data.Code === 0) {
              translation.notDisabled = false;
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  onPaginationChanged(event) {
    this.paginationPage = this.gridApi?.paginationGetCurrentPage() + 1;
  }

  onPaginationGoToPage(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.gridApi.paginationGoToPage(this.paginationPage - 1);
    }
  }

  localizeHeader(parameters: ICellRendererParams): string {
    let headerIdentifier = parameters.colDef.headerName;
    return this.translate.instant(headerIdentifier);
  }

  exportToCsv() {
    this.apiService.apiPost('common/exporttranslationentries', this.filter).pipe(take(1)).subscribe((data) => {
      if (data.Code === 0) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.configService.defaultOptions.SBApiUrl + '/' + data.ResponseObject.ExportedFilePath);
        iframe.setAttribute("style", "display: none");
        document.body.appendChild(iframe);
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

}
