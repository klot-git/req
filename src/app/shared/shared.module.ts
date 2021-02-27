import { NgModule } from '@angular/core';
import { AutofocusDirective } from '../directives/auto-focus.directive';

export const quillToolbar = {
  toolbar: [
    ['bold', 'italic', 'underline'],              // toggled buttons
    [{ 'color': [] }, { 'background': [] }],      // dropdown with defaults from theme
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],  // superscript/subscript
    ['link', 'image'],                            // link and image, video
    [{ 'align': [] }],
    ['clean'],                                    // remove formatting button
  ]
};


@NgModule({
  declarations: [ AutofocusDirective ],
  exports: [ AutofocusDirective ]
})
export class SharedModule { }
