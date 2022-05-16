import { Injectable } from '@angular/core';
import {  QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { FileState, FileStore, FileStorge } from './store';
@Injectable({
  providedIn: 'root',
})
export class SessionQuery extends QueryEntity<FileStore,FileState> {
  filesSelect: Observable<string[]>;

  constructor(protected fileStore: FileStorge) {
    super(fileStore);
    this.filesSelect = this.select('files');
  }
}
