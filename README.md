# PopDocs

PopDocs is an interactive documentation viewer with a tree-based navigation system. It provides an intuitive interface for browsing and viewing documentation files with a split-pane layout.

## Features

- 📑 Interactive documentation tree viewer
- 🌓 Dark/Light mode support with smooth transitions
- 🌲 Hierarchical document structure visualization
- ↔️ Dual-layout support (Horizontal/Vertical)
- 📱 Responsive design
- 🔍 Real-time document preview
- 🎯 Smart node selection and navigation

## Tech Stack

- React
- Vite
- React Flow (for tree visualization)
- React Icons
- Custom theming system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ningargiola/popdocs.git
cd popdocs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
popdocs/
├── docs/               # Documentation files
├── public/            # Static assets
├── src/
│   ├── assets/        # Project assets
│   │   ├── AnimatedNode.jsx
│   │   ├── DummyLeft.jsx
│   │   └── DummyRight.jsx
│   ├── utils/         # Utility functions
│   │   ├── ThemeContext.jsx
│   │   └── treeToFlow.js
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
└── package.json
```

## Features in Detail

### Document Navigation
- Tree-based navigation system
- Animated node transitions
- Smart folder expansion/collapse
- Automatic markdown file selection

### Theme System
- System-preference based theme detection
- Manual theme toggle
- Smooth transitions between themes
- Consistent styling across components

### Layout Options
- Horizontal layout (default)
- Vertical layout option
- Responsive design adjustments
- Split-pane view with adjustable content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Flow for the amazing graph visualization library
- React Icons for the beautiful icon set
- The React community for inspiration and support
