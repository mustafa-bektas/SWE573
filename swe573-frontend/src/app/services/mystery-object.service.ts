import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MysteryObject } from '../interfaces/mystery-object';

@Injectable({
  providedIn: 'root'
})
export class MysteryObjectService {

  private baseUrl = 'https://swe573-backend-594781402587.us-central1.run.app/api/mysteryObjects';  // Spring Boot API URL

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
