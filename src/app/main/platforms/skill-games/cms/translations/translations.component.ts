import { Component, Injector, OnInit, ViewChild } from '@angular/core';

import {Subject} from "rxjs";
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import {debounceTime, take} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

import {SkillGamesApiService} from "../../services/skill-games-api.service";
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import { BasePaginatedGridComponent } from 'src/app/main/components/classes/base-paginated-grid-component';
import { ButtonRendererComponent } from 'src/app/main/components/grid-common/button-renderer.component';
import { CellEditingStoppedEvent,  } from 'ag-grid-community';
import { syncPaginationWithoutBtn } from 'src/app/core/helpers/ag-grid.helper';

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
  public languageModel = [{Description: 'English', Id: 'en'}];
  public SelectedLanguages: any[] = [{Id: 'en', Description: 'en-English'}];
  public filter: any = {};
  public translationEntries: any = [];
  public dataToSend = {};

  constructor(
    protected injector: Injector,
    public apiService: SkillGamesApiService,
    private _snackBar: MatSnackBar
    ) {
      super(injector);
     }

  ngOnInit(): void {
    this.modelChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.getCurrentPage();
    });
    this.languages = this.configService.langList;
    this.getObjectTypes();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.Id === o2.Id : o2 === o2;
  }

  selectLanguage(value) {
    this.languageModel = value;
    this.getCurrentPage();
  }

  inputChanged(event) {
    this.modelChanged.next(event);
  }

  getObjectTypes() {
    this.apiService.apiPost('common/objecttype')
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.objectTypes = data.ResponseObject.filter(el => {
            return el.HasTranslation;
          })
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }

      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        this.filter.SkipCount = params.request.startRow / 100;
        this.filter.TakeCount = Number(this.cacheBlockSize);
        this.filter.ObjectTypeId = this.objectTypeId;
        this.filter.SelectedLanguages = this.languageModel.map(el => el.Id);
        this.apiService.apiPost('translation', this.filter,).pipe(take(1)).subscribe(data => {
          if (data.ResponseCode === 0) {
            this.translationEntries = data.ResponseObject.Entities;
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
            params.success({ rowData: this.translationEntries, rowCount: this.filter.SearchText ? this.translationEntries.length : data.ResponseObject.Count });
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
        filter: false,
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

  getLanguages() {
    this.apiService.apiPost('common/language')
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.languages = data.ResponseObject.map(item => {
            item.Description = item.Id + '-' + item.Description;
            return {Id: item.Id, Description: item.Description};
          })
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }

      });
  }

  selectObjectType(val) {
    this.objectTypeId = val;
    this.getCurrentPage();
  }

  orderBy(arr) {
    arr.sort((a, b) => {
      return a.Id - b.Id
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

  onFirstDataRendered(event) {
    syncPaginationWithoutBtn();
  }

  saveTranslations(translation) {
    if (this.dataToSend[translation.data.TranslationId]) {
      let values = Object.values(this.dataToSend[translation.data.TranslationId]);
      if (values.length > 0) {
        this.apiService.apiPost('translation/edit', {Translations: values})
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              translation.notDisabled = false;
            } else {
              SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
            }
          });
      }
    }
  }

  changed(ev) {
    this.modelChanged.next(ev);
  }

}
