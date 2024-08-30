import { Component, ElementRef, EventEmitter, input, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
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

@Component({
  selector: 'add-partners-product',
  templateUrl: './add-partners-product.component.html',
  styleUrls: ['./add-partners-product.component.scss'],
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
    MatMenuModule
  ]
})
export class AddPartnersProductComponent implements OnInit {
  @ViewChild('bulkEditorContainer') bulkEditorContainer!: ElementRef;
  @Input() bulkMenuTrigger: any;
  @Input() productCategories: any;
  @Input() statuses: any;
  @Input() partnerId: any;
  @Input() productIds: any;
  @Input() isRTPVisible: boolean = false;
  @Output() afterClosed = new EventEmitter<any>();
  public formGroup: UntypedFormGroup;

  constructor(
    private apiService: CoreApiService,
    public configService: ConfigService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.formGroup = this.fb.group({
      Percent: [null],
      Rating: [null],
      OpenMode: [null],
      RTP: [null],
      CategoryIds: [[]],
      State: [null, [Validators.required]],
    });
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
    if (setting.Percent === null) {
      delete setting.Percent;
    }
    this.apiService.apiPost(this.configService.getApiUrl, setting, true,
      Controllers.PRODUCT, Methods.SAVE_PARTNER_PRODUCT_SETTINGS).pipe(take(1)).subscribe((data) => {
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
