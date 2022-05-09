import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { FileInfoService } from 'src/app/services/file-info.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  show = false;
  files$ = new Observable<string[]>();
  filesList = new Array<string>();
  constructor(private fileInfo: FileInfoService) {}

  ngOnInit(): void {
    this.files$ = this.fileInfo.getFileList().pipe(
      tap((files) => {
        this.filesList = files;
        return files;
      })
    );
    this.fileInfo.notifier.subscribe((res) => {
      if (res) {
        this.files$.subscribe();
      }
    });
  }
  toggle() {
    this.show = !this.show;
  }
  downloadFile(item:string){
    this.fileInfo.downloadFile(item);
  }
}
