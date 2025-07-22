// geocoding.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Coordinates {
  lat: number;
  lon: number;
}

// Nominatim API response interface
interface NominatimResponse {
  lat: string; // ⚠️ Nominatim returns strings, not numbers
  lon: string;
  display_name: string;
  importance: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  constructor(private http: HttpClient) {}

  getCoordinates(address: string): Observable<Coordinates[]> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

    return this.http.get<NominatimResponse[]>(url).pipe(
      map(results => 
        results.map(result => ({
          lat: parseFloat(result.lat), // ✅ Convert string to number
          lon: parseFloat(result.lon)  // ✅ Convert string to number
        }))
      )
    );
  }
}