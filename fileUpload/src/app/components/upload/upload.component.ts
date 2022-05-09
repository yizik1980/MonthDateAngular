import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { finalize, Observable, of, Subscription } from 'rxjs';
import { filehandler } from 'src/app/models/fileHandler';
import { FileInfoService } from 'src/app/services/file-info.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  fileName: string = 'עלה קובץ';
  errorMessage = '';
  file = {} as File;
  handler = new filehandler({
    mimeTpes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/tiff',
      'image/png',
      'image/jpeg',
      'image/gif',
    ],
    maxSize: 1000000,
  });
  @ViewChild('inputFile')
  inputFileUpload: ElementRef | undefined;

  subs = new Array<Subscription>();
  constructor(
    private uploadService: FileInfoService,
    private toastr: HotToastService
  ) {}
  ngOnDestroy(): void {
    this.subs.map((item) => item.unsubscribe());
  }

  ngOnInit(): void {}

  fileUpload($event: Event) {
    let files = ($event.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach((f) => {
        const validate = this.handler.validate(f);
        if (validate.valid) {
          this.fileName = f.name;
          this.file = f;
        } else {
          this.toastr.error(validate.reason);
        }
      });
    } else {
      this.toastr.error('הקובץ לא נטען נסה שוב');
    }
  }
  clickInputFile($event: Event) {
    (this.inputFileUpload?.nativeElement as HTMLInputElement).click();
  }
  submitFile() {
    if (this.file.size > 0) {
      const subListener = this.uploadService
        .uploadFile(this.file, this.fileName)
        .pipe(
          finalize(() => {
            // clear file
            this.clear();
          })
        )
        .subscribe((res) => {
          this.toastr.success(res?.message);
        });

      this.subs = [subListener];
    } else {
      this.toastr.error('העלה קובץ בלחץ העליון לפני שמירה');
    }
  }
  clear() {
    this.fileName = '';
    this.file = {} as File;
    (this.inputFileUpload?.nativeElement as HTMLInputElement).value = '';
  }
}
