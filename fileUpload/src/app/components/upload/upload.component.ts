import { Component, OnDestroy, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
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
  handler = new filehandler({
    mimeTpes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    maxSize: 30000,
  });
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
          const subListener = this.uploadService
            .uploadFile(f)
            .subscribe((res) => {
              this.toastr.success(res?.message);
            });
            this.subs = [subListener];
        } else {
          this.toastr.error(validate.reason);
        }
      });
    } else {
      this.errorMessage = 'הקובץ לא נטען נסה שוב';
    }
  }
}
