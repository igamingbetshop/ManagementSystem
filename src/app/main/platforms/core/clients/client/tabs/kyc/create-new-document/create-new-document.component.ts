import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {CoreApiService} from "../../../../../services/core-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfigService} from "../../../../../../../../core/services";
import {ActivatedRoute} from "@angular/router";
import {Controllers, Methods} from "../../../../../../../../core/enums";
import {take} from "rxjs/operators";
import {SnackBarHelper} from "../../../../../../../../core/helpers/snackbar.helper";

@Component({
  selector: 'app-create-new-document',
  templateUrl: './create-new-document.component.html',
  styleUrls: ['./create-new-document.component.scss']
})
export class CreateNewDocumentComponent implements OnInit {
  clientId: number;
  formGroup: UntypedFormGroup;
  documentTypeName = [];
  documentStateName = [];
  validDocumentSize;
  validDocumentFormat;
  checkDocumentSize;
  isSendingRequest = false; 

  constructor(public dialogRef: MatDialogRef<CreateNewDocumentComponent>,
              private apiService: CoreApiService,
              private _snackBar: MatSnackBar,
              public configService: ConfigService,
              private activateRoute: ActivatedRoute,
              private fb: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.clientId = this.activateRoute.snapshot.queryParams.clientId;
    this.getFormValues();
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_TYPES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.documentTypeName = data.ResponseObject;
      }
    });
    this.apiService.apiPost(this.configService.getApiUrl, {}, true,
      Controllers.ENUMERATION, Methods.GET_KYC_DOCUMENT_STATES_ENUM).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.documentStateName = data.ResponseObject;
      }
    });

  }

  getFormValues() {
    this.formGroup = this.fb.group({
      ClientId: [this.clientId],
      DocumentTypeId: [null, [Validators.required]],
      State: [null, [Validators.required]],
      ImageData: [''],
      Name: [''],
      Extension: [''],
    });
  }

  close() {
    this.dialogRef.close();
  }

  get errorControl() {
    return this.formGroup.controls;
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }
    const obj = this.formGroup.getRawValue();
    this.isSendingRequest = true; 
    this.apiService.apiPost(this.configService.getApiUrl, obj, true, Controllers.CLIENT,
      Methods.UPLOAD_IMAGE).pipe(take(1)).subscribe((data) => {
      if (data.ResponseCode === 0) {
        this.dialogRef.close(data.ResponseObject);
      } else {
        SnackBarHelper.show(this._snackBar, {Description : data.Description, Type : "error"});
      }
      this.isSendingRequest = false;
    });
  }

  uploadFile(event) {
    let files = event.target.files && event.target.files[0];  
    if (files) {
      this.validDocumentSize = files.size < 2000000; 
      this.validDocumentFormat = /^(image\/png|image\/jpg|image\/jpeg|image\/gif|application\/pdf)$/.test(files.type);
  
      if (this.validDocumentFormat && this.validDocumentSize) {
        this.checkDocumentSize = true;
        
        const reader = new FileReader();
        reader.onload = () => {
          const binaryString = reader.result as string;
          this.formGroup.get('ImageData').setValue(binaryString.split(',')[1]);  // Extract base64 data
          this.formGroup.get('Name').setValue(files.name);
        };
        reader.onerror = (error) => {
          console.error("File could not be read: ", error);
          SnackBarHelper.show(this._snackBar, {Description: 'File Read Error', Type: 'error'});
        };
  
        reader.readAsDataURL(files);  // Read file as Data URL to handle base64 encoding
  
      } else {
        this.checkDocumentSize = false;
        files = null;  // Reset the file if validation fails
        SnackBarHelper.show(this._snackBar, {Description: 'Invalid file size or format', Type: "error"});
      }
    }
  }
  


}
