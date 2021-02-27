import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements OnInit
{
    private focus = true;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
      if (this.focus) {
          window.setTimeout(() => {
            if (this.el.nativeElement.nodeName === 'ION-INPUT') {
              this.el.nativeElement.setFocus();
            } else if (this.el.nativeElement.nodeName === 'QUILL-EDITOR') {
              const ed = this.el.nativeElement.querySelectorAll('.ql-editor');
              if (ed) {
                ed[0].focus();
              }
            }
            else {
              this.el.nativeElement.focus();
            }
          }, 500);
      }
    }

    @Input() set appAutoFocus(condition: boolean) {
        this.focus = condition !== false;
    }
}