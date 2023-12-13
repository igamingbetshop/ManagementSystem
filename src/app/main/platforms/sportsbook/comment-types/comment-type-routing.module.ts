import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CommentTypeComponent } from './comment-type.component';




const routes: Routes = [
  {
    path: '',
    component:CommentTypeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommentTypeRoutingModule
{

}
