
Name	Last commit message	Last commit date
..
.vscode
Mac os sytem
1 minute ago
public
Mac os sytem
1 minute ago
src
Mac os sytem
1 minute ago
.editorconfig
Mac os sytem
1 minute ago
.gitignore
Mac os sytem
1 minute ago
README.md
Mac os sytem
1 minute ago
angular.json
Mac os sytem
1 minute ago
karma.conf.js
Mac os sytem
1 minute ago
package-lock.json
Mac os sytem
1 minute ago
package.json
Mac os sytem
1 minute ago
tsconfig.app.json
Mac os sytem
1 minute ago
tsconfig.json
Mac os sytem
1 minute ago
tsconfig.spec.json
Mac os sytem
1 minute ago
README.md
macOS Clone
A web application that is a clone of the macOS interface, designed for large desktop screens. The project reproduces characteristic macOS elements such as windows, dock, menu bar, and other interface components.

🖥️ About the Application
macOS Clone is an application dedicated exclusively for large computer screens - it is not optimized for mobile devices. The interface has been designed with the desktop user experience in mind, utilizing full screen space and typical macOS interaction patterns.

Key Features:
Authentic macOS appearance
Multiple windows with management capabilities
Functional dock with application icons
Menu bar with system options
Window dragging and resizing
Themes (light/dark)
🛠️ Technologies
The project was built using modern web technologies:

Angular 21 - frontend framework
Angular Material 21 - UI component library
Angular CDK - Component Development Kit
TypeScript 5.9 - JavaScript typing
RxJS 7.8 - reactive programming
SCSS - CSS preprocessor
Karma + Jasmine - testing framework
🚀 Running the Application
Requirements
Node.js (version 18 or newer)
npm (version 10.9.2 or newer)
Installation
npm install
Starting Development Server
npm start
# or
ng serve
The application will be available at http://localhost:4200/. The server will automatically reload the page when code changes are made.

Production Build
npm run build
# or
ng build
Build files will be saved in the dist/ folder.

🧪 Tests
Unit Tests
npm test
# or
ng test
Unit tests use:

Karma as test runner
Jasmine as testing framework
Chrome as test browser
Watch Mode Tests
ng test --watch
Code Coverage Tests
ng test --code-coverage
📁 Project Structure
src/
├── app/
│   ├── components/     # UI components (windows, dock, menu)
│   ├── services/       # Services (window, theme)
│   └── models/         # Data models
├── assets/            # Static assets (icons, wallpapers)
└── styles/            # Global styles
🔧 Additional Commands
Generating New Components
ng generate component component-name
Code Formatting
npx prettier --write .
⚠️ Important Notes
Application is incompatible with mobile devices
Requires a browser supporting modern web standards
Interface optimized for desktop resolutions (minimum 1024x768)
Some features may require high graphics card performance
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
