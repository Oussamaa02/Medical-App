import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  standalone: true
})
export class LeafletMapComponent implements AfterViewInit {
  @Input() lat: number = 0;
  @Input() lon: number = 0;
  @ViewChild('mapContainer', { static: true }) mapContainerRef!: ElementRef;

  map!: L.Map;

  ngAfterViewInit(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
    });

    this.map = L.map(this.mapContainerRef.nativeElement).setView([this.lat, this.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([this.lat, this.lon]).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 50);
  }
}
