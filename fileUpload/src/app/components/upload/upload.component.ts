import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, finalize, map, Subscription } from 'rxjs';
import { filehandler } from 'src/app/models/fileHandler';
import { FileInfoService } from 'src/app/services/file-info.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  fileName: string = '';
  errorMessage = '';
  file = {} as File;

  handler = new filehandler({
    mimeTpes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    maxSize: 1000000,
  });

  editFile = false;
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
    this.editFile = true;
  }
  submitFile() {
    if (this.file.size > 0) {
      const subListener = this.uploadService
        .uploadFile(this.file, this.fileName)
        .pipe(
          map((res) => {
            if (res?.success) {
              this.uploadService.notifier.next(res.success);
              this.toastr.success(res?.message);
            }
            return res?.message;
          })
        ).pipe(
          catchError((err:any) => {
            this.toastr.error(err?.error.message);
            return err;
          })
        )
        .pipe(
          finalize(() => {
            // clear file
            this.clear();
          })
        )
        
        .subscribe();

      this.subs = [subListener];
    } else {
      this.toastr.error('לחץ על כפתור העלאת קובץ העליון לפני שמירה');
    }
  }
  clear() {
    this.fileName = '';
    this.file = {} as File;
    (this.inputFileUpload?.nativeElement as HTMLInputElement).value = '';
    this.editFile = false;
  }
}
