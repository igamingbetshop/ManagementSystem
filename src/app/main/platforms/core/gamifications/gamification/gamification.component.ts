import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

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
  backgroundImage: any;
  mobileBackgroundImage: any;
  isChilde = false;
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
    if (this.activateRoute.snapshot.queryParams.isChilde) {
      this.isChilde = true;
    };
    this.getGamificationById();
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
          if (this.isChilde) {
            this.backgroundImage = "https://"+ this.gamification.SiteUrl + this.gamification.BackgroundImageData;
            this.mobileBackgroundImage = "https://"+ this.gamification.SiteUrl + this.gamification.MobileBackgroundImageData;
          }

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
      ImageData: [null],
      CompPoints: [null, [Validators.required]],
      BackgroundImageData: [null],
      MobileBackgroundImageData: [null]
    });
  }

  handleFileUpload(files: File, imageControlName: string) {
    const validDocumentSize = files.size < 2500000;
    const validDocumentFormat = /(\.jpg|\.jpeg|\.png|\.gif)$/.test(files.name);

    if (validDocumentFormat && validDocumentSize) {
      const reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        if (files.size < 900000) {
          this.formGroup.get(imageControlName).setValue(binaryString.substring(binaryString.indexOf(',') + 1));
          if (imageControlName === 'ImageData') {
            this.formGroup.get('ImageExtension').setValue(files.name.substring(files.name.lastIndexOf(".") + 1));
          }
        } else {
          const img = new Image();
          img.src = binaryString;
          img.onload = () => {
            compressImage(img, 0.7).toBlob((blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                  const base64data = reader.result as string;
                  this.formGroup.get(imageControlName).setValue(binaryString.substring(binaryString.indexOf(',') + 1));
                }
              }
            }, files.type, 0.7)
          }
        }
      };
      reader.readAsDataURL(files);
    } else {
      this.formGroup.get(imageControlName).patchValue(null);
      SnackBarHelper.show(this._snackBar, { Description: 'Not a valid format (jpg, jpeg, png, or gif) or size exceeds 2.5MB', Type: "error" });
    }
  }

  uploadFile(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'ImageData');
    }
  }

  uploadBackgroundImage(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'BackgroundImageData');
    }
  }

  uploadMobileImage(event) {
    const files = event.target.files.length && event.target.files[0];
    if (files) {
      this.handleFileUpload(files, 'MobileBackgroundImageData');
    }
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    if (obj.ImageData === this.gamification.ImageData) {
      obj.ImageData = null;
    };
    if(obj.BackgroundImageData === this.gamification.BackgroundImageData){
      obj.BackgroundImageData = null;
    };
    if(obj.MobileBackgroundImageData === this.gamification.MobileBackgroundImageData){
      obj.MobileBackgroundImageData = null;
    };
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
