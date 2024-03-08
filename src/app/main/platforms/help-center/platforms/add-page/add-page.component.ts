import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommModule } from '../../../core/bonuses/commons/comm.module';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
  standalone: true,
  imports: [
    CommModule,
    FormsModule,
    QuillModule,
    MatButtonModule
  ],
})

export class AddPageComponent implements AfterViewInit {
  editorContent: string = '';
  quill: Quill;

  @ViewChild('fileInput') fileInput: ElementRef;

  ngAfterViewInit() {
    if (!this.quill) {
      return;
    }
    this.quill = new Quill('.quill-editor', {
      theme: 'snow',
      modules: {
        toolbar: true,
      },
      placeholder: 'Compose an epic...',
      formats: ['video'],
    });
  }

  onSelectFile(event: any) {
    const files: FileList = event.target.files;

    if (this.quill && files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const blob = new Blob([file], { type: file.type });
        const url = URL.createObjectURL(blob);

        const range = this.quill.getSelection(true);
        this.quill.clipboard.dangerouslyPasteHTML(range ? range.index : this.quill.getLength(), `<p><video src="${url}" controls autoplay playsinline muted></video></p>`);
      });
    }
  }

  onSubmit() {
    console.log('submit', this.editorContent);
  }
}

const BlockEmbed = Quill.import('blots/block/embed');
class VideoBlot extends BlockEmbed {
  static blotName = 'video';
  static tagName = 'video';

  static create(value) {
    const node = super.create();
    node.setAttribute('controls', 'true');
    node.setAttribute('autoplay', 'true');
    node.setAttribute('playsinline', 'true');
    node.setAttribute('muted', 'true');
    node.setAttribute('src', value);
    return node;
  }

  static value(node) {
    return node.getAttribute('src');
  }

}

Quill.register(VideoBlot);

export { VideoBlot };

// export class AddPageComponent implements AfterViewInit {
//   editorContent: string = '';
//   quill: Quill;


//   @ViewChild('fileInput') fileInput: ElementRef;

//   ngAfterViewInit() {
//     if (!this.quill) {
//       return; // Quill is not ready, return
//     }
//     this.quill = new Quill('.quill-editor', {
//       theme: 'snow',
//       modules: {
//         toolbar: true,
//       },
//       placeholder: 'Compose an epic...',
//       formats: ['video'],
//     });
//   }

//   onSelectFile(event: any) {
//     const files: FileList = event.target.files;

//     if (files && files.length > 0) {
//       Array.from(files).forEach((file: File) => {
//         const blob = new Blob([file], { type: file.type });
//         const url = URL.createObjectURL(blob);

//         const range = this.quill.getSelection(true);
//         this.quill.clipboard.dangerouslyPasteHTML(range.index, `<p><video src="${url}" controls autoplay playsinline muted></video></p>`);
//       });
//     }
//   }
// }

// const BlockEmbed = Quill.import('blots/block/embed');
// class VideoBlot extends BlockEmbed {
//   static blotName = 'video';
//   static tagName = 'video';

//   static create(value) {
//     const node = super.create();
//     node.setAttribute('controls', 'true');
//     node.setAttribute('autoplay', 'true');
//     node.setAttribute('playsinline', 'true');
//     node.setAttribute('muted', 'true');
//     node.setAttribute('src', value);
//     return node;
//   }

//   static value(node) {
//     return node.getAttribute('src');
//   }
// }

// Quill.register(VideoBlot);

// export { VideoBlot };
