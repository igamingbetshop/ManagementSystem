import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs/operators";
import {VirtualGamesApiService} from "../../../services/virtual-games-api.service";
import {CommonDataService} from "../../../../../../core/services";
import {SnackBarHelper} from "../../../../../../core/helpers/snackbar.helper";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  public id
  public partners;
  public partnerId: number;
  public formGroup: UntypedFormGroup;
  public banner;

  constructor(private _snackBar: MatSnackBar,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder,
              public commonDataService: CommonDataService,
              private apiService: VirtualGamesApiService,
              public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.id = +this.activateRoute.snapshot.queryParams.Id;
    this.partners = this.commonDataService.partners;
    this.createForm();
    this.getBanner();
  }

  get errorControl() {
    return this.formGroup.controls;
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
      Link: [null],
      Image: [null, [Validators.required]],
      Type: [null, [Validators.required]],
      IsEnabled: [true],
      ImageData: [null, [Validators.required]],
    });
    this.formGroup.get('Head').disable();
    this.formGroup.get('Body').disable();

  }

  getBanner() {
    this.apiService.apiPost('cms/banner', {Id: this.id, MatchId: null})
      .pipe(take(1))
      .subscribe(data => {
        if (data.ResponseCode === 0) {
          this.banner = data.ResponseObject;
          this.partnerId = this.banner.PartnerId
          this.formGroup.get('StartDate').setValue(this.banner['StartDate']);
          this.formGroup.get('EndDate').setValue(this.banner['EndDate']);
          this.formGroup.get('Order').setValue(this.banner['Order']);
          this.formGroup.get('Body').setValue(this.banner['Body']);
          this.formGroup.get('NickName').setValue(this.banner['NickName']);
          this.formGroup.get('Head').setValue(this.banner['Head']);
          this.formGroup.get('Link').setValue(this.banner['Link']);
          this.formGroup.get('Image').setValue(this.banner['Image']);
          this.formGroup.get('Type').setValue(this.banner['Type']);
          this.formGroup.get('IsEnabled').setValue(this.banner['IsEnabled']);
          this.formGroup.get('ImageData').setValue(this.banner['ImageData']);
          this.formGroup.get('Id').setValue(this.banner['Id']);
        } else {
          SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
        }
      });
  }

  onSubmit() {
    const obj = this.formGroup.getRawValue();
    obj.PartnerId = this.partnerId;
    this.apiService.apiPost('cms/editbanner', obj).subscribe(data => {
      if (data.ResponseCode === 0) {
        SnackBarHelper.show(this._snackBar, {Description : 'Success', Type : "success"});
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
    });


  }


}
