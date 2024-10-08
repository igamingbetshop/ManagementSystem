import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { SnackBarHelper } from 'src/app/core/helpers/snackbar.helper';

@Component({
    selector: 'app-campaign-selector',
    templateUrl: './campaign-selector.component.html',
    styleUrls: ['./campaign-selector.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ]

})
export class CampaignSelectorComponent {
  campaignTypes = input<[]>(); 
  campaigns = input<[]>(); 
  selectedCampaignIds = input<[]>(); 
  
  typeChange  = output<number>()
  campaignChange = output<number[]>()
  valueAdded =  output<any>()

  formGroup: FormGroup;
  selectedType: number;
  campaignControl = new FormControl();
  valueControl = new FormControl();
  
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
) {
    this.formGroup = this.fb.group({
      campaignControl: this.campaignControl,
      valueControl: this.valueControl
    });

    this.campaignControl = new FormControl('');
    this.valueControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
      this.integerValidator
    ]);
  }

  onTypeChange(type: number) {
    this.selectedType = type;
    this.typeChange.emit(type);
  }

  onCampaignChange(selectedCampaignIds: number[]): void {
    this.campaignChange.emit(selectedCampaignIds);
  }

  addValue() {
    const campaign = this.campaignControl.value;
    const value = this.valueControl.value;

    if (campaign && value !== null && value !== undefined) {
      if (value > 10) {
        SnackBarHelper.show(this._snackBar, { Description: "Value must be between 1 and 10.", Type: "error" });
        return;
      }

      const newValue = {
        BonusId: campaign,
        Periodicity: value
      };

      this.valueAdded.emit(newValue);
      this.campaignControl.reset();
    //   this.valueControl.reset();
    } else {
      SnackBarHelper.show(this._snackBar, { Description: "Please select a campaign and enter a valid value.", Type: "error" });
    }
  }

  integerValidator(control: FormControl) {
    const value = control.value;
    return Number.isInteger(value) ? null : { integer: true };
  }
}
