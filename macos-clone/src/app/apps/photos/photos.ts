import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Photo {
  id: string;
  name: string;
  url: string;
  size: string;
  date: string;
}

@Component({
  selector: 'app-photos',
  imports: [CommonModule, FormsModule],
  templateUrl: './photos.html',
  styleUrl: './photos.scss',
})
export class PhotosComponent implements OnInit {
  photos: Photo[] = [];
  filteredPhotos: Photo[] = [];
  selectedPhoto: Photo | null = null;
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadPhotos();
  }

  private loadPhotos(): void {
    this.photos = [
      {
        id: '1',
        name: 'Zachód słońca',
        url: 'https://picsum.photos/400/300?random=1',
        size: '2.3 MB',
        date: '15 sty 2024',
      },
      {
        id: '2',
        name: 'Góry o świcie',
        url: 'https://picsum.photos/400/300?random=2',
        size: '3.1 MB',
        date: '14 sty 2024',
      },
      {
        id: '3',
        name: 'Miasto nocą',
        url: 'https://picsum.photos/400/300?random=3',
        size: '1.8 MB',
        date: '13 sty 2024',
      },
      {
        id: '4',
        name: 'Las jesienią',
        url: 'https://picsum.photos/400/300?random=4',
        size: '2.7 MB',
        date: '12 sty 2024',
      },
      {
        id: '5',
        name: 'Ocean',
        url: 'https://picsum.photos/400/300?random=5',
        size: '4.2 MB',
        date: '11 sty 2024',
      },
      {
        id: '6',
        name: 'Kwiaty',
        url: 'https://picsum.photos/400/300?random=6',
        size: '1.5 MB',
        date: '10 sty 2024',
      },
    ];
    this.filteredPhotos = [...this.photos];
  }

  selectPhoto(photo: Photo): void {
    this.selectedPhoto = photo;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filterPhotos();
  }

  private filterPhotos(): void {
    if (!this.searchQuery.trim()) {
      this.filteredPhotos = [...this.photos];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPhotos = this.photos.filter((photo) => photo.name.toLowerCase().includes(query));
    }
  }

  deletePhoto(id: string): void {
    this.photos = this.photos.filter((photo) => photo.id !== id);
    this.filterPhotos();
    if (this.selectedPhoto?.id === id) {
      this.selectedPhoto = null;
    }
  }

  addPhoto(): void {
    
    const newPhoto: Photo = {
      id: Date.now().toString(),
      name: 'Nowe zdjęcie',
      url: 'https://picsum.photos/400/300?random=' + Math.random(),
      size: '0 MB',
      date: new Date().toLocaleDateString('pl-PL'),
    };
    this.photos.unshift(newPhoto);
    this.filterPhotos();
  }
}
