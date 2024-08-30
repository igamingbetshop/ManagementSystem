import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggleContent]',
  standalone: true
})
export class ToggleContentDirective {
    private isVisible = true;  // Set initial visibility to true
  
    constructor(private el: ElementRef, private renderer: Renderer2) {}
  
    @HostListener('click') onClick() {
      this.isVisible = !this.isVisible;
      
      const content = this.el.nativeElement.nextElementSibling;
      const icon = this.el.nativeElement.querySelector('.icon-arrow');
      
      if (this.isVisible) {
        this.renderer.setStyle(content, 'display', 'block');
        this.renderer.setStyle(icon, 'margin-bottom', '16px');
        this.renderer.setStyle(icon, 'transform', 'rotate(180deg)');
      } else {
        this.renderer.setStyle(content, 'display', 'none');
        this.renderer.setStyle(icon, 'transform', 'rotate(0deg)');
      }
    }
  
    ngOnInit() {
      const content = this.el.nativeElement.nextElementSibling;
      const icon = this.el.nativeElement.querySelector('.icon-arrow');
      this.renderer.setStyle(content, 'display', 'block'); 
      this.renderer.setStyle(icon, 'transform', 'rotate(180deg)');
      this.renderer.setStyle(icon, 'margin-bottom', '16px');
    }
  }
