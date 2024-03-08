import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from './announcement.component';
import { MatTabsModule } from "@angular/material/tabs";
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ViewAnnouncementChangesComponent } from './tabs/view-announcement-changes/view-announcement-changes.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    MatTabsModule,
    TranslateModule
  ],
  declarations: [AnnouncementComponent, ViewAnnouncementChangesComponent]
})
export class AnnouncementModule { }
