import {
  HttpClient,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileInfoService {
  notifier = new BehaviorSubject<boolean>(true);
  constructor(private http: HttpClient) {}
  getFileList(): Observable<Array<string>> {
    return this.http.get<Array<string>>(environment.webApiFiles);
  }
  uploadFile(file: File,fileName:string): Observable<{ message: string } | null> {
    let formData = new FormData();
    formData.append('file', file, fileName);
    return this.postFile(formData);
  }
  private postFile(formData: FormData): Observable<{ message: string }> {
    return this.http
      .post<{ message: string; success: boolean }>(
        `${environment.webApiFiles}/upload`,
        formData,
        {
          reportProgress: true,
          observe: 'body',
        }
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            this.notifier.next(res.success);
          }
        })
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
