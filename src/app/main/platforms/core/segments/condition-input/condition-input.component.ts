import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-condition-input',
  templateUrl: './condition-input.component.html',
  styleUrls: ['./condition-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class ConditionInputComponent {
  @Input() hasLabel: boolean = true;
  @Input() label: string;
  @Input() conditions: any[] = [];
  @Input() operations: any[] = [];
  @Input() inputPattern: string = '^\d+$'
  @Input() placeholder: string = 'Bonuses.Value';
  @Output() conditionsChange = new EventEmitter<any[]>();

  selectedConditionType: any = null;
  selectedConditionValue: any = '';

  addCondition() {
    if (this.selectedConditionType && this.selectedConditionValue) {
      this.conditions.push({
        ConditionType: this.selectedConditionType,
        ConditionValue: this.selectedConditionValue
      });
      this.selectedConditionType = null;
      this.selectedConditionValue = '';
      this.conditionsChange.emit(this.conditions);
    }
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
    this.conditionsChange.emit(this.conditions);
  }
}
