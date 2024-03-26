import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AVAILABLEBETCATEGORIES } from 'src/app/core/constantes/statuses';

@Component({
  selector: 'app-bet-category-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    TranslateModule
  ],
  template: `
      <div class="partner-dropdown">
      <mat-select 
        [(ngModel)]="availableBetCategoriesStatus"
        (selectionChange)="betCategoryChange($event.value)"
        panelClass="overlay-dropdown"
        [ngModelOptions]="{standalone: true}"
        disableOptionCentering>
        @for (betcategory of availableBetCategories; track betcategory.Id) {
        <mat-option [value]="betcategory.status">{{betcategory.Name | translate}}</mat-option>
        }
      </mat-select>
    </div>
  `,
  styleUrls: ['./partner-date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BetCategoryComponent {

  @Output() toBetCategoryChange = new EventEmitter<any>();

  availableBetCategoriesStatus: number = -1;
  availableBetCategories = AVAILABLEBETCATEGORIES;

  betCategoryChange(event: number) {
    this.toBetCategoryChange.emit(event);
  }

}