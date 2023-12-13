import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-core-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './core-section.component.html',
  styleUrls: ['./core-section.component.scss']
})
export class CoreSectionComponent implements OnInit {

  pageId: number = 166;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onAddSection() {
    this.router.navigate(['/main/help/add-page'], {
      queryParams: { "pageId": this.pageId }
    });
  }

}
