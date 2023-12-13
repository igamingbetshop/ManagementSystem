import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Controllers, Methods, ModalSizes } from 'src/app/core/enums';
import { CoreApiService } from '../../services/core-api.service';
import { SnackBarHelper } from "../../../../../core/helpers/snackbar.helper";
import { CommonDataService, ConfigService } from 'src/app/core/services';
import { ACTIVITY_STATUSES, ENVIRONMENTS_STATUSES } from 'src/app/core/constantes/statuses';
import { compressImage } from 'src/app/core/utils';

@Component({
  selector: 'app-core-gamification',
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.scss']
})
export class GamificationComponent implements OnInit {
  formGroup: UntypedFormGroup;
  gamificationId: number;
  gamification;
  partners: any[] = [];
  statuses: any[] = ACTIVITY_STATUSES;
  environments: any[] = ENVIRONMENTS_STATUSES;
  isEdit = false;
  image: any;

  constructor(
    private _snackBar: MatSnackBar,
    private apiService: CoreApiService,
    private activateRoute: ActivatedRoute,
    private configService: ConfigService,
    private commonDataService: CommonDataService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.partners = this.commonDataService.partners;
    this.gamificationId = +this.activateRoute.snapshot.queryParams.gamificationId;
    this.getGamificationById()
  }

  getGamificationById() {
    this.apiService.apiPost(this.configService.getApiUrl, this.gamificationId,
      true, Controllers.PARTNER, Methods.GET_CHATACTER_BY_ID)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.gamification = data.ResponseObject;
          this.gamification.PartnerName = this.partners.find(x => x.Id === this.gamification.PartnerId).Name;
          this.image = "https://"+ this.gamification.SiteUrl + this.gamification.ImageData;
          this.formGroup.patchValue(this.gamification);
          this.formGroup.get('EnvironmentTypeId').setValue(1);
          
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null, [Validators.required]],
      NickName: [null],
      Description: [null, [Validators.required]],
      EnvironmentTypeId: [null, [Validators.required]],
      Title: [null, [Validators.required]],
      ParentId: [null],
      PartnerId: [null, [Validators.required]],
      Status: [null, [Validators.required]],
      Order: [null, [Validators.required]],
      ImageExtension: [null],
      ImageUrl: [null],
      CompPoints: [null, [Validators.required]],
    });
  }

  uploadFile(event) {
    let files = event.target.files.length && event.target.files[0];
    if (files) {
      const validDocumentSize = files.size < 5000000;
      const validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif)$/.test(event.target.value);
      if (validDocumentFormat && validDocumentSize) {
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          if (files.size < 700000) {
            this.formGroup.get('ImageUrl').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
            this.formGroup.get('ImageExtension').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
          }
          else {
            const img = new Image();
            img.src = binaryString;
            img.onload = (data) => {
              compressImage(img, 0.7).toBlob((blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    const base64data = reader.result as string;
                    this.formGroup.get('ImageUrl').setValue(binaryString.substring(binaryString.indexOf(',') + 1));
                    this.formGroup.get('ImageExtension').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
                  }
                }
              },
                files.type,
                0.7)
            }
          }
        };
        reader.readAsDataURL(files);
      } else {
        this.formGroup.get('ImageExtension').patchValue(null);
        files = null;
        SnackBarHelper.show(this._snackBar, { Description: 'Not valid format jpg, png, or Gif and size < 700KB', Type: "error" });
      }
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    if (obj.ImageUrl === this.image) {
      obj.ImageUrl = null;
    }
    this.apiService.apiPost(this.configService.getApiUrl, obj,
      true, Controllers.PARTNER, Methods.SAVE_CHARACHTER)
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          SnackBarHelper.show(this._snackBar, { Description: "Success", Type: "success" });
          this.isEdit = false;
          this.getGamificationById();
          
        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      })
  }

  async onShowImage() {
    const { ImagePopupComponent } = await import('../../../../components/image-popup/image-popup.component');
    const dialogRef = this.dialog.open(ImagePopupComponent, { width: ModalSizes.LARGE, data: { imagePath: this.image } });
    dialogRef.afterClosed().pipe(take(1)).subscribe(data => {
      if (data) {
      }
    })
  }

}
