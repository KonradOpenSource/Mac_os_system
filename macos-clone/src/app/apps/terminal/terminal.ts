import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowService } from '../../services/window';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-terminal',
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('terminalOutput') terminalOutput!: ElementRef<HTMLDivElement>;

  currentCommand = '';
  commandHistory: string[] = [];
  historyIndex = -1;
  currentDirectory = '~';
  user = 'user';
  host = 'macos-clone';

  constructor(private windowService: WindowService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.addOutput('macOS Clone Terminal v1.0.0');
    this.addOutput('Copyright (c) 2024 macOS Clone');
    this.addOutput('');
    this.showPrompt();
  }

  ngAfterViewInit(): void {
    this.terminalInput?.nativeElement.focus();
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentCommand = target.value;
  }

  onCommandSubmit(): void {
    const command = this.currentCommand.trim();
    if (!command) return;

    this.addOutput(`${this.user}@${this.host}:${this.currentDirectory}$ ${command}`);
    this.executeCommand(command);
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
    this.currentCommand = '';
    this.showPrompt();
  }

  private executeCommand(command: string): void {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'help':
        this.showHelp();
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'ls':
        this.listDirectory();
        break;
      case 'cd':
        this.changeDirectory(args[0]);
        break;
      case 'pwd':
        this.printWorkingDirectory();
        break;
      case 'echo':
        this.addOutput(args.join(' '));
        break;
      case 'date':
        this.addOutput(new Date().toString());
        break;
      case 'whoami':
        this.addOutput(this.user);
        break;
      case 'hostname':
        this.addOutput(this.host);
        break;
      case 'mkdir':
        this.addOutput(`Utworzono katalog: ${args[0] || 'brak nazwy'}`);
        break;
      case 'touch':
        this.addOutput(`Utworzono plik: ${args[0] || 'brak nazwy'}`);
        break;
      case 'cat':
        this.addOutput(`Zawartość pliku: ${args[0] || 'brak nazwy'}`);
        break;
      case 'ps':
        this.showProcesses();
        break;
      case 'top':
        this.addOutput('CPU: 12% | Memory: 4.2GB/16GB | Disk: 45GB/256GB');
        break;
      case 'uname':
        this.addOutput('Darwin macos-clone.local 23.0.0 Darwin Kernel Version 23.0.0');
        break;
      case 'theme':
        this.toggleTheme(args[0]);
        break;
      case 'wallpaper':
        this.setWallpaper(args[0]);
        break;
      case 'open':
        this.openApplication(args[0]);
        break;
      default:
        this.addOutput(`bash: ${cmd}: command not found`);
    }
  }

  private showHelp(): void {
    const commands = [
      'help     - Pokaż tę pomoc',
      'clear    - Wyczyść terminal',
      'ls       - Lista plików i katalogów',
      'cd       - Zmień katalog',
      'pwd      - Pokaż aktualny katalog',
      'echo     - Wyświetl tekst',
      'date     - Pokaż datę i czas',
      'whoami   - Pokaż nazwę użytkownika',
      'hostname - Pokaż nazwę hosta',
      'mkdir    - Utwórz katalog',
      'touch    - Utwórz plik',
      'cat      - Pokaż zawartość pliku',
      'ps       - Pokaż procesy',
      'top      - Pokaż statystyki systemu',
      'uname    - Informacje o systemie',
      'theme    - Przełącz motyw (light/dark)',
      'wallpaper - Ustaw tapetę (default/dark/ocean/forest)',
      'open     - Otwórz aplikację (finder/settings/photos/calculator/notes)',
    ];
    commands.forEach((cmd) => this.addOutput(cmd));
  }

  private clearTerminal(): void {
    if (this.terminalOutput) {
      this.terminalOutput.nativeElement.innerHTML = '';
    }
  }

  private listDirectory(): void {
    const files = ['Documents', 'Downloads', 'Desktop', 'Pictures', 'Music', 'Movies'];
    files.forEach((file) => this.addOutput(file));
  }

  private changeDirectory(dir: string): void {
    if (dir === '..') {
      this.currentDirectory = '~';
    } else if (dir === '~') {
      this.currentDirectory = '~';
    } else if (dir) {
      this.currentDirectory = `~/${dir}`;
    }
  }

  private printWorkingDirectory(): void {
    this.addOutput(
      `/Users/${this.user}${this.currentDirectory === '~' ? '' : '/' + this.currentDirectory}`
    );
  }

  private showProcesses(): void {
    this.addOutput('PID    COMMAND');
    this.addOutput('123    finder');
    this.addOutput('456    terminal');
    this.addOutput('789    dock');
  }

  private addOutput(text: string): void {
    if (this.terminalOutput) {
      const output = this.terminalOutput.nativeElement;
      const line = document.createElement('div');
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }
  }

  private showPrompt(): void {
    if (this.terminalOutput) {
      const output = this.terminalOutput.nativeElement;
      const prompt = document.createElement('div');
      prompt.innerHTML = `<span class="prompt">${this.user}@${this.host}:${this.currentDirectory}$</span>`;
      output.appendChild(prompt);
      output.scrollTop = output.scrollHeight;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentCommand = this.commandHistory[this.historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.currentCommand = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.currentCommand = '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      // Simple tab completion
      if (this.currentCommand.startsWith('cd')) {
        this.currentCommand = 'cd Documents';
      }
    }
  }

  private toggleTheme(theme?: string): void {
    if (theme === 'light' || theme === 'dark') {
      this.themeService.toggleTheme();
      this.addOutput(`Motyw zmieniony na: ${theme}`);
    } else {
      this.themeService.toggleTheme();
      const currentTheme = this.themeService.getCurrentTheme() ? 'dark' : 'light';
      this.addOutput(`Motyw zmieniony na: ${currentTheme}`);
    }
  }

  private setWallpaper(wallpaper?: string): void {
    const availableWallpapers = ['default', 'dark', 'ocean', 'forest'];
    if (wallpaper && availableWallpapers.includes(wallpaper)) {
      this.themeService.setWallpaper(wallpaper);
      this.addOutput(`Tapeta ustawiona na: ${wallpaper}`);
    } else {
      this.addOutput('Dostępne tapety: default, dark, ocean, forest');
      this.addOutput('Użycie: wallpaper <nazwa>');
    }
  }

  private openApplication(appName?: string): void {
    const availableApps = ['finder', 'settings', 'photos', 'calculator', 'notes'];

    if (!appName) {
      this.addOutput('Dostępne aplikacje: finder, settings, photos, calculator, notes');
      this.addOutput('Użycie: open <nazwa_aplikacji>');
      return;
    }

    if (availableApps.includes(appName)) {
      const window = this.windowService.createWindow({
        title: appName.charAt(0).toUpperCase() + appName.slice(1),
        appId: appName,
        width: 800,
        height: 600,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
      });
      this.addOutput(`Otwieram aplikację: ${appName} (okno: ${window.id})`);
    } else {
      this.addOutput(`Nieznana aplikacja: ${appName}`);
      this.addOutput(`Dostępne: ${availableApps.join(', ')}`);
    }
  }
}
