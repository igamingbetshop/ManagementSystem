import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DateAdapter, MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VirtualGamesApiService } from "../../../services/virtual-games-api.service";
import { SnackBarHelper } from "../../../../../../core/helpers/snackbar.helper";
import { take } from 'rxjs';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
})
export class AddBannerComponent implements OnInit {
  public sports: any[] = [];
  public partners: any[] = [];
  public fragments: any[] = [];
  public widgets: any[] = [];
  public partnerId = null;
  public formGroup: UntypedFormGroup;
  public bannerTypes = [
    { id: 1, name: 'Fragmental' },
    { id: 2, name: 'Widget' },
    { id: 4, name: 'SportSpecificWeb' },
    { id: 5, name: 'SportSpecificMobile' }
  ];
  public types = [
    { Id: '1', Name: 'Home Page' },
    { Id: '2', Name: 'Mobile Home Page' },
  ]
  public bannerTypeId: number = 1;

  public bannerVisibilityTypes = [
    { id: 'null', name: 'Always' },
    { id: 1, name: 'Logged Out' },
    { id: 2, name: 'Logged In' },
    { id: 3, name: 'No Deposit' },
    { id: 4, name: 'One Deposit Only' },
    { id: 5, name: 'Two Or More Deposits' }
  ];
  isSendingReqest = false;

  constructor(public dialogRef: MatDialogRef<AddBannerComponent>,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public apiService: VirtualGamesApiService,
    public dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.apiService.apiPost('game').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
    this.getPartners();
    this.getSports();
    this.createForm();
    this.getDate();
  }

  getDate() {
    let fromDay = new Date();
    fromDay.setHours(0);
    fromDay.setMinutes(0);
    fromDay.setSeconds(0);
    fromDay.setMilliseconds(0);

    let toDay = new Date();
    toDay.setHours(0);
    toDay.setMinutes(0);
    toDay.setSeconds(0);
    toDay.setMilliseconds(0);
    toDay.setDate(toDay.getDate() + 1);

    this.formGroup.get('StartDate').setValue(fromDay);
    this.formGroup.get('EndDate').setValue(toDay);

  }

  getPartners() {
    this.apiService.apiPost('partners').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.partners = data.ResponseObject.Entities;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    });
  }

  getSports() {
    this.apiService.apiPost('game').subscribe(data => {
      if (data.ResponseCode === 0) {
        this.sports = data.ResponseObject;
      } else {
        SnackBarHelper.show(this._snackBar, { Description: data.Description, Type: "error" });
      }
    })
  }

  // onPartnerChange(val){
  //   this.fragments = [];
  //   this.widgets = [];
  //   console.log(val);
  //   if(val){
  //     this.apiService.apiPost('cms/bannerfragments',{PartnerId:val}).subscribe(data => {
  //       if(data.ResponseCode === 0){
  //
  //         data.ResponseObject.forEach(item => {
  //           if(item.Type == 1)
  //             this.fragments.push(item);
  //           else
  //             this.widgets.push(item);
  //         });
  //
  //       }else{
  //         this._snackBar.open(data.Description, null, { duration: 3000 });
  //       }
  //     });
  //     this.formGroup.get('FragmentName').enable();
  //     this.formGroup.get('Type').enable();
  //   }else if(val == null){
  //     console.log("val");
  //     this.formGroup.get('FragmentName').disable();
  //     this.formGroup.get('Type').disable();
  //   }
  //   this.partnerId = val;
  //
  // }

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
      PartnerId: [null, [Validators.required]],
      StartDate: [null],
      GameId: [null],
      EndDate: [null],
      Order: [null, [Validators.required]],
      Body: [null],
      NickName: [null, [Validators.required]],
      Head: [null],
      Link: [null],
      Image: [null, [Validators.required]],
      Type: [null],
      IsEnabled: [true],
      ImageData: [null],
    });
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {

    if (this.formGroup.invalid) {
      return;
    }
    this.isSendingReqest = true;
    const obj = this.formGroup.getRawValue();
      this.apiService.apiPost('cms/addbanner', obj).pipe(take(1)).subscribe(data => {
        if (data.ResponseCode === 0) {
          this.dialogRef.close(true);
        } else {
          SnackBarHelper.show(this._snackBar, {Description: data.Description, Type: "error"});
        }
      });
  }

}
