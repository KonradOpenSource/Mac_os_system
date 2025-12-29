# macOS Clone

A web application that is a clone of the macOS interface, designed for large desktop screens. The project reproduces characteristic macOS elements such as windows, dock, menu bar, and other interface components.

## 🖥️ About the Application

**macOS Clone** is an application dedicated exclusively for large computer screens - **it is not optimized for mobile devices**. The interface has been designed with the desktop user experience in mind, utilizing full screen space and typical macOS interaction patterns.

### Key Features:

- Authentic macOS appearance
- Multiple windows with management capabilities
- Functional dock with application icons
- Menu bar with system options
- Window dragging and resizing
- Themes (light/dark)

Angular_Design is developed using following technologies:



![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)   ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)  ![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)


Testing:


![Jasmine](https://img.shields.io/badge/jasmine-%238A4182.svg?style=for-the-badge&logo=jasmine&logoColor=white)
<img src="https://raw.githubusercontent.com/detain/svg-logos/780f25886640cef088af994181646db2f6b1a3f8/svg/karma.svg" alt="karma" width="40" height="40"/> </a> 


## 🚀 Running the Application

### Requirements

- Node.js (version 18 or newer)
- npm (version 10.9.2 or newer)

### Installation

```bash
npm install
```

### Starting Development Server

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`. The server will automatically reload the page when code changes are made.

### Production Build

```bash
npm run build
# or
ng build
```

Build files will be saved in the `dist/` folder.

## 🧪 Tests

### Unit Tests

```bash
npm test
# or
ng test
```

Unit tests use:

- **Karma** as test runner
- **Jasmine** as testing framework
- **Chrome** as test browser

### Watch Mode Tests

```bash
ng test --watch
```

### Code Coverage Tests

```bash
ng test --code-coverage
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # UI components (windows, dock, menu)
│   ├── services/       # Services (window, theme)
│   └── models/         # Data models
├── assets/            # Static assets (icons, wallpapers)
└── styles/            # Global styles
```

## 🔧 Additional Commands

### Generating New Components

```bash
ng generate component component-name
```

### Code Formatting

```bash
npx prettier --write .
```

## ⚠️ Important Notes

- Application is **incompatible with mobile devices**
- Requires a browser supporting modern web standards
- Interface optimized for desktop resolutions (minimum 1024x768)
- Some features may require high graphics card performance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

