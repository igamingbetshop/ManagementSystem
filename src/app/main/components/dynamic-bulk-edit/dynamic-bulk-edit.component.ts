import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatInputModule } from "@angular/material/input";
import { TranslateModule } from "@ngx-translate/core";
import { MatButtonModule } from "@angular/material/button";
import { take } from "rxjs/operators";
import { ConfigService } from 'src/app/core/services';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CoreApiService } from 'src/app/main/platforms/core/services/core-api.service';
import { Controllers, Methods } from 'src/app/core/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';
import { MatMenuModule } from '@angular/material/menu';
import { CustomSelectComponent } from "../custom-select/custom-select.component";

@Component({
  selector: 'dynamic-bulk-edit',
  templateUrl: './dynamic-bulk-edit.component.html',
  styleUrls: ['./dynamic-bulk-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatSlideToggleModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    CustomSelectComponent
]
})
export class DynamicBulkEditComponent implements OnInit {
  @ViewChild('bulkEditorContainer') bulkEditorContainer!: ElementRef;
  @Input() bulkMenuTrigger: any;
  @Input() productCategories: any;
  @Input() statuses: any;
  @Input() partnerId: any;
  @Input() productIds: any;
  @Input() isRTPVisible: boolean = false;
  @Input() adminMenuId:number;
  @Input() gridIndex:number;
  @Input() controler: string;
  @Input() method: string;
  @Output() afterClosed = new EventEmitter<any>();
  public formGroup: UntypedFormGroup;

  fields: { [key: string]: string } = {}; 
  fieldKeys: string[] = [];

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getBulkEditFields();
  }

  getBulkEditFields() {
    this.apiService.apiPost(this.configService.getApiUrl, {
      AdminMenuId: this.adminMenuId,
      GridIndex: this.gridIndex
    }, true,
      Controllers.UTIL, Methods.GET_BULK_EDIT_FIELDS).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.fields = data.ResponseObject;
          this.fieldKeys = Object.keys(this.fields);
          this.createForm(this.fields);
        }
      });
  }

  private createForm(fields: { [key: string]: string }) {
    const formGroupConfig: { [key: string]: FormControl } = {};
    this.fieldKeys.forEach((key) => {
      if (key && fields[key] !== undefined) {
        formGroupConfig[key] = new FormControl('');
      }
    });
    this.formGroup = this.fb.group(formGroupConfig);
    console.clear();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  onCancelBtn(event: MouseEvent) {
    event.stopPropagation();
    this.bulkMenuTrigger.closeMenu();
  }

  openConfirmDialog() {
    const setting = this.formGroup.getRawValue();
    setting.PartnerId = +this.partnerId;
    setting.ProductIds = this.productIds;

    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      this.controler, this.method).pipe(take(1)).subscribe((data) => {
        if (data.ResponseCode === 0) {
          this.afterClosed.emit(true);
          this.bulkMenuTrigger.closeMenu(true);
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });

  }

  onKeydown(event: KeyboardEvent) {
    const key = event.key;
    const activeElement = document.activeElement as HTMLElement;
    const tabIndex = activeElement.getAttribute('tabindex');
    let nextElement: HTMLElement;

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      nextElement = this.bulkEditorContainer.nativeElement.querySelector(`[tabindex="${+tabIndex + 1}"]`);
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      nextElement = this.bulkEditorContainer.nativeElement.querySelector(`[tabindex="${+tabIndex - 1}"]`);
    }

    if (nextElement) {
      nextElement.focus();
      event.preventDefault();
    }
  }
}
