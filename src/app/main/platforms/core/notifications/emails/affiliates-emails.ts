import { Component, OnInit } from '@angular/core';
import { AgGridModule } from "ag-grid-angular";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { EmailsComponent } from './emails.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PartnerDateFilterComponent } from 'src/app/main/components/partner-date-filter/partner-date-filter.component';
import { NotificationsObjectType } from 'src/app/core/enums';

@Component({
  selector: 'app-affiliates-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    PartnerDateFilterComponent
  ]
})

export class AffiliatesEmailsComponent extends EmailsComponent implements OnInit {
    title = "Notifications.AffiliatesEmails";
; 

    ngOnInit(): void {
        this.objectTypeId = NotificationsObjectType.Affiliate;
        super.ngOnInit();
    }
}