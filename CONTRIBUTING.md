# Contributing to Pull of War

Thank you for your interest in contributing to Pull of War! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/thegame.git
   cd thegame
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Local Development

Run the development server:

```bash
npm start
```

The game will be available at `http://localhost:3000`.

### Code Organization

- **Game Logic:** `src/js/`
- **Styling:** `src/css/`
- **Assets:** `src/assets/`
- **HTML:** `src/index.html`
- **Server:** `src/server.js`

### Making Changes

1. Make your changes in a new branch
2. Test your changes thoroughly in the browser
3. Ensure the game runs without errors (check browser console)
4. Keep commits focused and descriptive

## Coding Standards

- Follow the existing code style
- Use 2-space indentation (configured in .editorconfig)
- Add comments for complex logic
- Keep functions focused and single-purpose
- Test your changes across different browsers

## File Structure

- **src/js/classes.js** - Game classes and unit definitions
- **src/js/graphics.js** - Rendering and canvas operations
- **src/js/handleSavingPull.js** - Save/load functionality
- **src/js/helpers.js** - Utility functions
- **src/js/interval.js** - Timing and animation loops
- **src/js/manualActions.js** - User input handling
- **src/js/mapvalues.js** - Game level maps and values
- **src/js/pullofwar.js** - Main game loop and logic
- **src/js/spells.js** - Spell mechanics and effects

## Testing

While this project doesn't have automated tests yet, please:

1. Test your changes manually in the browser
2. Try different browsers (Chrome, Firefox, Safari, Edge)
3. Check browser console for errors
4. Test gameplay mechanics thoroughly
5. Verify save/load functionality works

## Submitting Changes

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Why the changes are needed
   - Any related issues

## Pull Request Guidelines

- Keep PRs focused on a single feature or bug fix
- Include a clear description of the problem and solution
- Reference any related issues (e.g., "Fixes #123")
- Ensure no console errors are introduced
- Test gameplay thoroughly

## Areas for Contribution

### Bug Fixes
- Game balance issues
- Visual glitches
- Save/load problems
- Performance optimizations

### Features
- New unit types
- Additional spells
- New game levels/maps
- UI/UX improvements
- Documentation

### Quality Improvements
- Code refactoring
- Documentation updates
- Containerization improvements
- Developer experience enhancements

## Questions?

Feel free to:
- Open an issue for questions
- Ask in PR reviews
- Discuss ideas before implementing

## Code of Conduct

Be respectful and constructive in all interactions. We want this to be a welcoming community for everyone.

---

Thank you for contributing to Pull of War! 🎮
