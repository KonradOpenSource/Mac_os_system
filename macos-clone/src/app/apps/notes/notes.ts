import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Note {
  id: string;
  title: string;
  content: string;
  created: string;
  modified: string;
}

@Component({
  selector: 'app-notes',
  imports: [CommonModule],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  selectedNote: Note | null = null;
  isEditing = false;
  searchQuery = '';

  ngOnInit(): void {
    this.loadNotes();
    this.createSampleNotes();
  }

  private loadNotes(): void {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  private saveNotes(): void {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private createSampleNotes(): void {
    if (this.notes.length === 0) {
      const sampleNotes: Note[] = [
        {
          id: '1',
          title: 'Witaj w Notatkach',
          content: 'To jest przykładowa notatka. Możesz edytować ją lub tworzyć nowe.',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Lista zakupów',
          content: '- Mleko\n- Chleb\n- Jajka\n- Masło',
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      ];
      this.notes = sampleNotes;
      this.saveNotes();
    }
  }

  get filteredNotes(): Note[] {
    if (!this.searchQuery) {
      return this.notes;
    }
    return this.notes.filter(
      (note) =>
        note.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }

  selectNote(note: Note): void {
    this.selectedNote = note;
    this.isEditing = false;
  }

  createNewNote(): void {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nowa notatka',
      content: '',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    this.notes.unshift(newNote);
    this.saveNotes();
    this.selectNote(newNote);
    this.isEditing = true;
  }

  deleteNote(noteId: string): void {
    if (confirm('Czy na pewno chcesz usunąć tę notatkę?')) {
      this.notes = this.notes.filter((note) => note.id !== noteId);
      this.saveNotes();
      if (this.selectedNote?.id === noteId) {
        this.selectedNote = null;
      }
    }
  }

  startEditing(): void {
    this.isEditing = true;
  }

  saveNote(): void {
    if (this.selectedNote) {
      this.selectedNote.modified = new Date().toISOString();
      this.saveNotes();
      this.isEditing = false;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.loadNotes(); // Przywróć oryginalną treść
  }

  updateNoteTitle(event: Event): void {
    if (this.selectedNote) {
      const target = event.target as HTMLInputElement;
      this.selectedNote.title = target.value;
    }
  }

  updateNoteContent(event: Event): void {
    if (this.selectedNote) {
      const target = event.target as HTMLTextAreaElement;
      this.selectedNote.content = target.value;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
