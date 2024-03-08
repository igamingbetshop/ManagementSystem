import { Component, Injector, ViewChild } from '@angular/core';

import { debounceTime, take } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';
import { MatDialog } from '@angular/material/dialog';
import 'ag-grid-enterprise';
import { CellEditingStoppedEvent } from 'ag-grid-community';
import { Subject } from "rxjs";

import { Controllers, Methods } from '../../../../../core/enums';
import { BasePaginatedGridComponent } from '../../../../components/classes/base-paginated-grid-component';
import { CommonDataService } from '../../../../../core/services';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from '../../../../../core/helpers/snackbar.helper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonRendererComponent } from "../../../../components/grid-common/button-renderer.component";
import { syncPaginationWithoutBtn } from "../../../../../core/helpers/ag-grid.helper";

@Component({
  selector: 'all-clients',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.scss']
})
export class TranslationsComponent extends BasePaginatedGridComponent {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  public modelChanged = new Subject<string>();
  public rowData = [];
  public frameworkComponents;
  public languages = [];

  public objectTypes: any[] = [];
  public objectTypeId: number = 1;
  public languageModel = [{ Name: 'English', Id: 'en' }];
  public translationEntries: any = [];
  public dataToSend = {};
  public filter: any = {};
  public paginationPage = 1;

  constructor(
    protected injector: Injector,
    public dialog: MatDialog,
    private apiService: CoreApiService,
    private _snackBar: MatSnackBar,
    private commonDataService: CommonDataService) {
    super(injector);
  }

  ngOnInit() {
    this.modelChanged.pipe(debounceTime(300)).subscribe(() => {
      this.getCurrentPage();
    });
    this.languages = this.commonDataService.languages;
    this.getObjectTypes();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  selectObjectType(value) {
    this.objectTypeId = value;
    this.getCurrentPage();
  }

  selectLanguage(value) {
    this.languageModel = value;
    this.getCurrentPage();
  }

  comparer(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.Id === o2.Id : o2 === o2;
  }

  inputChanged(event) {
    this.modelChanged.next(event);
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncPaginationWithoutBtn();
    this.gridApi.setServerSideDatasource(this.createServerSideDatasource());
  }

  createServerSideDatasource = () => {
    return {
      getRows: (params) => {
        this.filter.SkipCount = this.paginationPage - 1;
        this.filter.TakeCount = Number(this.cacheBlockSize);
        this.filter.ObjectTypeId = this.objectTypeId;
        this.filter.SelectedLanguages = this.languageModel.map(el => el.Id);

        this.apiService.apiPost(this.configService.getApiUrl, this.filter,
          true, Controllers.BASE, Methods.GET_TRANSLATION_ENTRIES).pipe(take(1)).subscribe(data => {
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
              params.success({ rowData: this.translationEntries, rowCount: data.ResponseObject.Count });
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

  changeTranslation(translation, entry) {
    if (!this.dataToSend[translation.TranslationId]) {
      this.dataToSend[translation.TranslationId] = {}
    }

    // if (entry.Text.trim().length > 0) {
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
    // translation.notDisabled = true;
    // } else {
    //   translation.notDisabled = false;
    // }
  }

  saveTranslations(param) {

    const translation = param.data;

    if (this.dataToSend[translation.TranslationId]) {
      let values = Object.values(this.dataToSend[translation.TranslationId]);
      if (values.length > 0) {
        this.apiService.apiPost(this.configService.getApiUrl, values,
          true, Controllers.BASE, Methods.SAVE_TRANSLATION_ENTRIES)
          .pipe(take(1))
          .subscribe(data => {
            if (data.ResponseCode === 0) {
              SnackBarHelper.show(this._snackBar, { Description: 'Updated successfully', Type: "success" });
            } else {
              SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
            }
          });
      }
    }
  }

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(Number(this.cacheBlockSize));
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

  getObjectTypes() {
    this.apiService.apiPost(this.configService.getApiUrl, {},
      true, Controllers.BASE, Methods.GET_OBJECT_TYPES)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.objectTypes = data.ResponseObject.filter(el => el.HasTranslation);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

}


