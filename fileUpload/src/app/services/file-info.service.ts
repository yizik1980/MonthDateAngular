import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileInfoService {
  notifier = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getFileList(): Observable<Array<string>> {
    return this.http.get<Array<string>>(environment.webApiFiles);
  }
  uploadFile(file: File): Observable<{message:string} | null>{
    let formData = new FormData();
    formData.append('file', file,file.name);
    return this.postFile(formData);
  }
  private postFile(formData: FormData) :Observable<{message:string}>{
    const req = new HttpRequest('POST', `${environment.webApiFiles}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.post<{message:string, success:boolean}>(`${environment.webApiFiles}/upload`,formData,{
      reportProgress:true,
      observe:'body'
    }).pipe(tap(res=>{
        if(res.success){
          this.notifier.next(res.success);
        }
    }));
  }
}
