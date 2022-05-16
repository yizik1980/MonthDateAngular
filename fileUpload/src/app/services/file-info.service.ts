import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class FileInfoService {
  notifier = new BehaviorSubject<boolean>(true);
  constructor(private http: HttpClient, private fileStore: StorageService) {}

  getFileList(): Observable<Array<string>> {
    return this.http.get<Array<string>>(environment.webApiFiles).pipe(
      tap((list) => {
        this.fileStore.initFiles(list);
      })
    );
  }

  uploadFile(
    file: File,
    fileName: string
  ): Observable<{ message: string; success: boolean }> {
    let formData = new FormData();
    formData.append('file', file, fileName);
    return this.postFile(formData).pipe(
      tap((res) => {
        if (res.success) this.fileStore.updatFile(fileName);
      })
    );
  }

  private postFile(
    formData: FormData
  ): Observable<{ message: string; success: boolean }> {
    return this.http.post<{ message: string; success: boolean }>(
      `${environment.webApiFiles}/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'body',
      }
    );
  }
  downloadFile(name: string): void {
    const link = document.createElement('a');
    link.href = `${environment.webApiFiles}/download/${name}`;
    link.style.visibility = 'hidden';
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
