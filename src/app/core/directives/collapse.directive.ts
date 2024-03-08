import {Directive, HostBinding, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[collapse]',
    standalone: true
})
export class CollapseDirective {

    @Input('collapse')
    set collapse(value:boolean)
    {
        this.opened = value;
    }
    @HostBinding('class.opened') opened: boolean = false;

    constructor(private el: ElementRef) {}

    @HostListener('click', ['$event']) onCollapseClick($event)
    {
        $event.stopPropagation();
        this.opened = !this.opened;
    }
}
