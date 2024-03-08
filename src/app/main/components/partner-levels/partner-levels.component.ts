import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner-levels',
  templateUrl: './partner-levels.component.html',
  styleUrls: ['./partner-levels.component.scss']
})
export class PartnerLevelsComponent implements OnInit {
  currentStep: number = 0;
  totalSteps: number = 6;
  nthChildValue: number = this.currentStep + 1;
  steps: number[] = Array(this.totalSteps).fill(0).map((x, i) => i);
  openedAbout = false;
  openedAboutSections: boolean[] = [];

  constructor() {
    this.steps.forEach(() => {
      this.openedAboutSections.push(false);
    });
  }

  ngOnInit(): void {
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  resetProgress(): void {
    this.currentStep = 0;
  }

  getStepClasses(index: number): string {
    if (index <= this.currentStep) {
      return 'step-active';
    } else {
      return 'step-inactive';
    }
  }

  getPercentageClasses(index: number): string {
    if (index <= this.currentStep) {
      return 'percentage-circle-active';
    } else {
      return 'percentage-circle-inactive';
    }
  }

  about(index: number) {
    this.openedAboutSections.forEach((state, i) => {
      if (i !== index) {
        this.openedAboutSections[i] = false;
      }
    });
    this.openedAboutSections[index] = !this.openedAboutSections[index];
  }

  close() {
    const index = this.openedAboutSections.findIndex(state => state === true);
    if (index !== -1) {
      this.openedAboutSections[index] = false;
    }
  }

}
