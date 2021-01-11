import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  addItem(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))  
  }

  removeItem(key: string) {
    return localStorage.removeItem(key)
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }
}
