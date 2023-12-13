import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComponent } from './announcements.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: AnnouncementsComponent,
        children: [
            {
                path: 'announcement',
                loadChildren: () => import('./announcement/announcement.module').then(m => m.AnnouncementModule),
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnnouncementsRoutingModule {

}