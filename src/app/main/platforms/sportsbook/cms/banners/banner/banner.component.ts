import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { SportsbookApiService } from '../../../services/sportsbook-api.service';
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { DateAdapter } from "@angular/material/core";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  id
  partners: any[] = [];
  partnerId: number;
  formGroup: UntypedFormGroup;
  banner;
  isEdit = false;
  isSendingReqest = false;
  bannerVisibilityTypes = [
    { id: 0, name: 'Always' },
    { id: 1, name: 'Logged Out' },
    { id: 2, name: 'Logged In' },
    { id: 3, name: 'No Deposit' },
    { id: 4, name: 'One Deposit Only' },
    { id: 5, name: 'Two Or More Deposits' }
  ];
  visibilytyName: string;
  image: string;

  constructor(
    private apiService: SportsbookApiService,
    private _snackBar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    public dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit() {
    this.id = +this.activateRoute.snapshot.queryParams.Id;
    this.getPartners();
    this.createForm();
    this.getBanner();
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

  get errorControl() {
    return this.formGroup?.controls;
  }

  uploadFile(evt) {
    let files = evt.target.files;
    let file = files[0];
    if (files && file) {
      let reader = new FileReader();
      reader.onload = () => {
        const binaryString = reader.result as string;
        this.formGroup.get('ImageData').setValue(binaryString.substr(binaryString.indexOf(',') + 1));
      };
      reader.readAsDataURL(file);
    }
  }

  public createForm() {
    this.formGroup = this.fb.group({
      Id: [null],
      StartDate: [null],
      EndDate: [null],
      Order: [null, [Validators.required]],
      Body: [null],
      NickName: [null, [Validators.required]],
      Head: [null],
      MatchId: [null],
      Link: [null],
      Image: [null, [Validators.required]],
      SportId: [null],
      Type: [null, [Validators.required]],
      Visibility: [null],
      MarketTypeId: [null],
      ShowLogin: [false],
      ShowDescription: [false],
      IsEnabled: [true],
      ImageData: [null,],
    });
    this.formGroup.get('Head').disable();
    this.formGroup.get('Body').disable();

  }

  getBanner() {
    this.apiService.apiPost('cms/banners', { Id: this.id, MatchId: null })
      .pipe(take(1))
      .subscribe(data => {
        if (data.Code === 0) {
          this.banner = data.Banners[0];
          this.visibilytyName = this.bannerVisibilityTypes.find(x => x.id === this.banner.Visibility)?.name || 'Always';
          this.partnerId = this.banner.PartnerId;
          this.formGroup.patchValue(this.banner);
          if (this.banner.Visibility == null) {
            this.formGroup.get('Visibility').setValue(0);
          }

          // todo
          // this.image = "https://" + this.banner?.SiteUrl + '/assets/images/b/' + this.banner?.Image;

        } else {
          SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
        }
      });
  }

  onSubmit() {
    const obj = this.formGroup.getRawValue();
    if (obj.Visibility == 0) {
      obj.Visibility = null;
    }
    this.isSendingReqest = true;
    obj.PartnerId = this.partnerId;
    this.apiService.apiPost('cms/savebanner', obj).subscribe(data => {
      if (data.Code === 0) {
        this.getBanner();
        this.isEdit = false;
        SnackBarHelper.show(this._snackBar, { Description: 'Success', Type: "success" });
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
      this.isSendingReqest = false;
    });
  }

  onCancel() {
    this.isEdit = false;
    this.formGroup.patchValue(this.banner);
  }

}
