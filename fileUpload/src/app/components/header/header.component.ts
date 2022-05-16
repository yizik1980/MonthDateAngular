import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { FileInfoService } from 'src/app/services/file-info.service';
import { SessionQuery } from 'src/app/storage/query.file';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  show = false;
  files$ = new Observable<string[]>();
  filesList = new Array<string>();
  constructor(
    private fileInfo: FileInfoService,
    private query: SessionQuery,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.fileInfo.notifier
      .pipe(
        switchMap((res) => {
          if (res) {
            return this.fileInfo.getFileList();
          }
          return this.query.filesSelect;
        })
      )
      .subscribe((files) => {
        if (files) {
          this.filesList = files;
        }
      });
  }
  toggle() {
    this.show = !this.show;
  }
  downloadFile(item: string) {
    this.fileInfo.downloadFile(item);
  }
}
