import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, NgZone, Output} from '@angular/core';
import {DOCUMENT} from "@angular/common";

@Directive({
  selector: '[Dropdown]',
  standalone: true
})
export class DropdownDirective {
  @HostBinding('class.opened') opened: boolean = false;
  @Output() openedDropdown = new EventEmitter<boolean>();

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document) {
    this.zone.runOutsideAngular(() => {
      this.document.addEventListener(
        'click',
        this.onDocumentClick.bind(this)
      );
    });
  }

  onDocumentClick(e: MouseEvent) {
    if (this.opened) {
      this.zone.run(() => {this.close();});
    }
  }

  @HostListener('click', ['$event']) onDropdownClick($event: any) {
    if (this.el.nativeElement == $event.currentTarget) {
      $event.stopPropagation();
      this.opened = !this.opened;
      this.openedDropdown.emit(this.opened);
      let event = new CustomEvent('closeDropDown', {detail: this.el.nativeElement});
      document.dispatchEvent(event);
    }
  }

  @HostListener('document:closeDropDown', ['$event']) closeByDetails($event: any) {
    if ($event.detail != this.el.nativeElement)
      this.close()
  }

  close() {
    this.opened = false;
    this.openedDropdown.emit(this.opened);
  }
}
