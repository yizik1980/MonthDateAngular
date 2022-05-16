import { Injectable } from '@angular/core';
import { arrayAdd } from '@datorama/akita';
import { SessionQuery } from '../storage/query.file';
import { FileStorge } from '../storage/store';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private store: FileStorge,private q:SessionQuery) { }
  initFiles(list:Array<string>) {
    return this.store.update({
        files:[...list]
      });
  }

  updatFile(fileName:string) {
    return this.store.update(1, ({ files }) => ({
        files: arrayAdd(files, fileName)
      }));
  }
}