import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';


export interface FileState {
    files: Array<string>;
}
export interface FileStore extends EntityState<FileState> {}

export function createInitialState(): FileStore {
  return {
    files:new Array<string>()
  };
}
@Injectable({
    providedIn: 'root'
  })
@StoreConfig({ name: 'FileStorge' })
export class FileStorge extends EntityStore<FileStore> {
  constructor() {
    super(createInitialState());
  }
}