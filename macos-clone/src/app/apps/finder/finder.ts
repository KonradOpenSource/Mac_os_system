import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  icon: string;
  children?: FileItem[];
  parent?: FileItem;
}

export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  type: 'system' | 'folder';
}

@Component({
  selector: 'app-finder',
  imports: [CommonModule, CdkDrag, DragDropModule],
  templateUrl: './finder.html',
  styleUrl: './finder.scss',
})
export class FinderComponent implements OnInit {
  currentPath: string = '/';
  selectedItem: FileItem | null = null;
  fileSystem: FileItem[] = [];
  currentItems: FileItem[] = [];
  sidebarItems: SidebarItem[] = [];
  draggedItem: FileItem | null = null;

  ngOnInit(): void {
    this.initializeFileSystem();
    this.initializeSidebar();
    this.navigateToPath('/');
  }

  private initializeFileSystem(): void {
    this.fileSystem = [
      {
        id: '1',
        name: 'Dokumenty',
        type: 'folder',
        modified: '2024-01-15',
        icon: 'folder',
        children: [
          {
            id: '1-1',
            name: 'Projekty',
            type: 'folder',
            modified: '2024-01-14',
            icon: 'folder',
            children: [
              {
                id: '1-1-1',
                name: 'README.md',
                type: 'file',
                size: '2.5 KB',
                modified: '2024-01-14',
                icon: 'document',
              },
              {
                id: '1-1-2',
                name: 'package.json',
                type: 'file',
                size: '1.2 KB',
                modified: '2024-01-14',
                icon: 'code',
              },
              { id: '1-1-3', name: 'src', type: 'folder', modified: '2024-01-14', icon: 'folder' },
            ],
          },
          {
            id: '1-2',
            name: 'Notatki.txt',
            type: 'file',
            size: '856 B',
            modified: '2024-01-13',
            icon: 'document',
          },
        ],
      },
      {
        id: '2',
        name: 'Pobrane',
        type: 'folder',
        modified: '2024-01-15',
        icon: 'folder',
        children: [
          {
            id: '2-1',
            name: 'obraz.jpg',
            type: 'file',
            size: '3.2 MB',
            modified: '2024-01-12',
            icon: 'image',
          },
          {
            id: '2-2',
            name: 'dokument.pdf',
            type: 'file',
            size: '1.8 MB',
            modified: '2024-01-11',
            icon: 'pdf',
          },
        ],
      },
      {
        id: '3',
        name: 'Pulpit',
        type: 'folder',
        modified: '2024-01-15',
        icon: 'folder',
        children: [
          {
            id: '3-1',
            name: 'Zrzut ekranu.png',
            type: 'file',
            size: '2.1 MB',
            modified: '2024-01-15',
            icon: 'image',
          },
        ],
      },
      {
        id: '4',
        name: 'system.log',
        type: 'file',
        size: '15.3 KB',
        modified: '2024-01-15',
        icon: 'log',
      },
      {
        id: '5',
        name: 'config.json',
        type: 'file',
        size: '432 B',
        modified: '2024-01-14',
        icon: 'code',
      },
    ];
  }

  private initializeSidebar(): void {
    this.sidebarItems = [
      { id: 'favorites', name: 'Ulubione', icon: 'star', path: '/favorites', type: 'system' },
      { id: 'recent', name: 'Ostatnie', icon: 'clock', path: '/recent', type: 'system' },
      { id: 'desktop', name: 'Pulpit', icon: 'desktop', path: '/Pulpit', type: 'folder' },
      { id: 'documents', name: 'Dokumenty', icon: 'folder', path: '/Dokumenty', type: 'folder' },
      { id: 'downloads', name: 'Pobrane', icon: 'download', path: '/Pobrane', type: 'folder' },
      { id: 'applications', name: 'Aplikacje', icon: 'app', path: '/Applications', type: 'system' },
    ];
  }

  navigateToPath(path: string): void {
    this.currentPath = path;
    this.currentItems = this.getItemsAtPath(path);
    this.selectedItem = null;
  }

  private getItemsAtPath(path: string): FileItem[] {
    if (path === '/') {
      return this.fileSystem;
    }

    const pathParts = path.split('/').filter((part) => part);
    let currentItems = this.fileSystem;

    for (const part of pathParts) {
      const folder = currentItems.find((item) => item.name === part && item.type === 'folder');
      if (folder && folder.children) {
        currentItems = folder.children;
      } else {
        return [];
      }
    }

    return currentItems;
  }

  selectItem(item: FileItem): void {
    this.selectedItem = item;
  }

  openItem(item: FileItem): void {
    if (item.type === 'folder') {
      const newPath =
        this.currentPath === '/' ? `/${item.name}` : `${this.currentPath}/${item.name}`;
      this.navigateToPath(newPath);
    } else {
      console.log(`Otwieranie pliku: ${item.name}`);
    }
  }

  goBack(): void {
    if (this.currentPath !== '/') {
      const pathParts = this.currentPath.split('/').filter((part) => part);
      pathParts.pop();
      const newPath = pathParts.length > 0 ? `/${pathParts.join('/')}` : '/';
      this.navigateToPath(newPath);
    }
  }

 
  onDragStarted(item: FileItem): void {
    this.draggedItem = item;
  }

  onDragEnded(): void {
    this.draggedItem = null;
  }

  onDrop(event: CdkDragDrop<FileItem[]>): void {
    if (event.previousContainer === event.container) {
     
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
      if (this.draggedItem && event.container.data) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        
        this.updateFileSystemStructure();
      }
    }
  }

  private updateFileSystemStructure(): void {
    
    this.navigateToPath(this.currentPath);
  }

  getIconClass(icon: string): string {
    const iconClasses: Record<string, string> = {
      folder: 'icon-folder',
      document: 'icon-document',
      image: 'icon-image',
      code: 'icon-code',
      pdf: 'icon-pdf',
      log: 'icon-log',
      desktop: 'icon-desktop',
      download: 'icon-download',
      star: 'icon-star',
      clock: 'icon-clock',
      app: 'icon-app',
    };
    return iconClasses[icon] || 'icon-file';
  }

  formatFileSize(size: string): string {
    return size;
  }

  isFolderExpanded(folder: FileItem): boolean {
    
    return false;
  }

  toggleFolder(folder: FileItem): void {
    
    if (folder.type === 'folder') {
   
      console.log(`Toggle folder: ${folder.name}`);
    }
  }
}
