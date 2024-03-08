import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

import {QuillConfigModule, QuillModule} from "ngx-quill";
import {TranslateModule} from "@ngx-translate/core";
import * as Quill from "quill";
import {IndentStyle} from "./intend";

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})

export class HtmlEditorComponent implements OnInit {

  @Input() text: string;
  @Input() disabled: boolean = false;
  @Input() styles: {[key: string]: any};
  @Output() htmlCode = new EventEmitter<string>();
  public activeTab = 'editor';

  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
    },
    keyboard: {
      bindings: {
        enter:{
          key:13,
          handler: (range, context)=>{
            return true;
          }
        }
      }
    }
  };

  constructor()
  {
    const pixelLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    const TAB_MULTIPLIER = 30;


    const StyleColor = Quill.import('attributors/style/color');
    const StyleAlign = Quill.import('attributors/style/align');
    const StyleBackground = Quill.import('attributors/style/background');
    const StyleDirection = Quill.import('attributors/style/direction');
    const StyleSize = Quill.import('attributors/style/size');
    const ListItem = Quill.import('formats/list/item');
   /* const Parchment = Quill.import('parchment');
    const StyleListStyleType = new Parchment.Attributor.Style('indent', 'margin-left', {
       scope: Parchment.Scope.Block,
      whitelist: pixelLevels.map(value => `${value * TAB_MULTIPLIER}px`),
     });*/
    Quill.register(StyleColor, true);
    Quill.register(StyleAlign, true);
    Quill.register(StyleSize, true);
    Quill.register(StyleBackground, true);
    Quill.register(StyleDirection, true);
    //Quill.register(StyleListStyleType, true);
    Quill.register(IndentStyle, true);
    Quill.register(ListItem, true);
  }

  ngOnInit() {}

  onEditorCreated(event)
  {
    const content = event.getContents();
    const isHtml = this.checkHtmlFormat(content);
  }

  onContentChanged(event)
  {
    if(this.checkHtmlFormat(event.content))
    {
      this.htmlCode.emit(event.html);
    }
    else this.htmlCode.emit(event.text.slice(0, -1));
  }

  private checkHtmlFormat(content:any)
  {
    let result = false;

    parentLoop:
    for (let i = 0; i < content.ops.length; i++)
    {
      if(content.ops[i].hasOwnProperty('attributes'))
      {
        for (const property in content.ops[i].attributes)
        {
          if(content.ops[i].attributes[property])
          {
            result = true;
            break parentLoop;
          }
        }
      }
    }
    return result;
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    QuillModule.forRoot(),
    QuillConfigModule.forRoot({
      modules: {
        syntax: true,
        toolbar: `quill-toolbar`
      }
    }),
    TranslateModule
  ],
  declarations: [HtmlEditorComponent],

  exports: [
    HtmlEditorComponent
  ]
})
export class HtmlEditorModule {

}

