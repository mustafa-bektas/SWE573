import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MysteryObject } from '../interfaces/mystery-object';
import {baseApiUrl} from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class MysteryObjectService {

  private baseUrl = `${baseApiUrl}/api/mysteryObjects`;  // Spring Boot API URL

  constructor(private http: HttpClient) { }

  // Create a new MysteryObject
  createMysteryObject(mysteryObject: MysteryObject): Observable<MysteryObject> {
    return this.http.post<MysteryObject>(`${this.baseUrl}`, mysteryObject);
  }

  // Get all MysteryObjects
  getAllMysteryObjects(): Observable<MysteryObject[]> {
    return this.http.get<MysteryObject[]>(`${this.baseUrl}`);
  }

}
