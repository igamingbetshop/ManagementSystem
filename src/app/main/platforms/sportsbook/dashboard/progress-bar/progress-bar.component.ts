import {Component, input, Input, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe]
})
export class ProgressBarComponent implements OnInit{
  @Input() src;
  number = input<string>('');

  constructor( ) {

  }

  ngOnInit() {
  }

}
