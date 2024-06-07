import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementsComponent } from './announcements.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HtmlEditorModule } from 'src/app/main/components/html-editor/html-editor.component';
import { AnnouncementsRoutingModule } from './announcements-routing.module';
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";


@NgModule({
    declarations: [AnnouncementsComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatDatepickerModule,
        TranslateModule,
        MatInputModule,
        HtmlEditorModule,
        AgGridModule,
        AnnouncementsRoutingModule,
        PartnerDateFilterComponent
    ]
})
export class AnnouncementsModule { }
