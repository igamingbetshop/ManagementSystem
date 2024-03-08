import {Component, Injector, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BasePaginatedGridComponent} from 'src/app/main/components/classes/base-paginated-grid-component';
import {CoreApiService} from '../../services/core-api.service';
import {CommonDataService} from 'src/app/core/services';
import {MatDialog} from '@angular/material/dialog';
import 'ag-grid-enterprise';
import {Controllers, GridMenuIds, GridRowModelTypes, Methods, ModalSizes, ObjectTypes} from 'src/app/core/enums';
import {take} from 'rxjs/operators';
import {CellDoubleClickedEvent, IRowNode} from 'ag-grid-community';
import {SnackBarHelper} from "../../../../../core/helpers/snackbar.helper";
import {ButtonRendererComponent} from "../../../../components/grid-common/button-renderer.component";
import {SelectRendererComponent} from "../../../../components/grid-common/select-renderer.component";
import { syncColumnReset } from 'src/app/core/helpers/ag-grid.helper';

@Component({
  selector: 'app-security-questions',
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.scss']
})
export class SecurityQuestionsComponent extends BasePaginatedGridComponent implements OnInit {
  public partners: any[] = [];
  public partnerId = null;

  public rowData = [];
  public rowModelType: string = GridRowModelTypes.CLIENT_SIDE;
  public filter: any = {};

  public states = [
    {Id: 0, isActive: true, Name: 'Active'},
    {Id: 1, isActive: false, Name: 'Inactive '},
  ];

  public frameworkComponents = {
    buttonRenderer: ButtonRendererComponent,
    selectRenderer: SelectRendererComponent
  };

  constructor(
    protected injector: Injector,
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    public commonDataService: CommonDataService,
    public dialog: MatDialog,
  ) {
    super(injector);
    this.adminMenuId = GridMenuIds.CORE_SECURITY_QUESTIONS;
    this.columnDefs = [
      {
        headerName: 'Common.Id',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'Id',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Partners.Partner',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'PartnerName',
        resizable: true,
        filter: false,
      },
      {
        headerName: 'Common.NickName',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'NickName',
        resizable: true,
        filter: false,
        onCellDoubleClicked: (event: CellDoubleClickedEvent) => {
          this.cellDoubleClicked(event);
        }
      },
      {
        headerName: 'Common.State',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'State',
        resizable: true,
        filter: false,
        editable: true,
        cellRenderer: 'selectRenderer',
        cellRendererParams: {
          onchange: this.onSelectChange['bind'](this),
          Selections: this.states,
        },
      },
      {
        headerName: 'Common.Save',
        headerValueGetter: this.localizeHeader.bind(this),
        field: 'save',
        resizable: true,
        minWidth: 90,
        sortable: false,
        filter: false,
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.saveSecurityQuestion['bind'](this),
          Label: 'Save',
          isDisabled: true,
          bgColor: '#3E4D66',
          textColor: '#FFFFFF'
        }
      },
    ];
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.getSecurityQuestions();
  }

  async cellDoubleClicked(event: CellDoubleClickedEvent) {
    const id = event.data.Id;
    const {AddEditTranslationComponent} = await import('../../../../components/add-edit-translation/add-edit-translation.component');
    const dialogRef = this.dialog.open(AddEditTranslationComponent, {
      width: ModalSizes.MEDIUM, data: {
        ObjectId: id,
        ObjectTypeId: ObjectTypes.SecurityQuestion
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getSecurityQuestions();
      }
    })
  }

  onPartnerChange(value: string) {
    this.partnerId = null;
    this.partnerId = value;
    this.getSecurityQuestions();
  }

  isRowSelected() {
    return this.gridApi && this.gridApi.getSelectedRows().length === 0;
  };

  async addQuestion() {
    const dialogData = {partnerId: this.partnerId};
    const {AddSecurityQuestionsComponent} = await import('./add-security-questions/add-security-questions.component');
    const dialogRef = this.dialog.open(AddSecurityQuestionsComponent, {width: ModalSizes.MEDIUM, data: dialogData});
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
        this.getSecurityQuestions();
      }
    })
  }

  onSelectChange(params, value, event) {
    params.State = value;
    this.onCellValueChanged(event);
  }

  onCellValueChanged (event) {
    if (event.oldValue !== event.value) {
      let findingNode: IRowNode;
      let rowIndex = event.node.rowIndex;
      this.gridApi.forEachNode(node => {
        if (node.rowIndex == rowIndex) {
          findingNode = node;
        }
      })
      this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = false;
      this.gridApi.redrawRows({rowNodes: [findingNode]});
    }
  }

  getSecurityQuestions() {
    const requestBody = {PartnerId : this.partnerId};

    this.apiService.apiPost(this.configService.getApiUrl, requestBody,
      true, Controllers.PARTNER, Methods.GET_SECURITY_QUESTIONS)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.rowData = data.ResponseObject
            .map((question) => {
              question.PartnerName = this.partners.find((partner) => partner.Id === question.PartnerId)?.Name;
              question.State = this.states.find((state) => state.isActive === question.Status)?.Id;
              return question;
            });
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
        setTimeout(() => {this.gridApi.sizeColumnsToFit();}, 300);
      });
  }

  onGridReady(params) {
    super.onGridReady(params);
    syncColumnReset();
  }

  saveSecurityQuestion(params) {
    const requestBody = {
      Id: params.data.Id,
      Status: params.data.Status,
      NickName: params.data.NickName
    };

    this.apiService.apiPost(this.configService.getApiUrl, requestBody, true, Controllers.PARTNER,
      Methods.SAVE_SECURITY_QUESTION).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.gridApi.getColumnDef('save').cellRendererParams.isDisabled = true;
        SnackBarHelper.show(this._snackBar, {Description: 'State successfully updated', Type: "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
      }
    });
  }
}
