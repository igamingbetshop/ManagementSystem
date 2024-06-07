import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteTabItem } from 'src/app/core/interfaces';

@Component({
  selector: 'app-competition-category',
  templateUrl: './competition-category.component.html',
  styleUrls: ['./competition-category.component.scss']
})
export class CompetitionCategoryComponent implements OnInit {

  tabs:RouteTabItem[] = [
    {
      label:'Partners.Main',
      route:'main'
    },
    {
      label:'Sport.Markets',
      route:'markets'
    },
    {
      label:'Sport.Competitions',
      route:'competitions'
    },
  ];

  categoryId:number;

  constructor(private activateRoute:ActivatedRoute) { }

  ngOnInit() {
    this.categoryId = this.activateRoute.snapshot.queryParams.categoryId;
  }

}
