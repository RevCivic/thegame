# Pull of War

A strategy-based web game where you manage units and spells to defend your wall against enemy forces.

## Overview

Pull of War is an engaging browser-based strategy game where you:
- Build and upgrade military units (soldiers, spearmen, etc.)
- Cast spells to damage enemy units
- Manage resources (gold, mana, territory)
- Progress through increasingly difficult levels
- Protect your wall while destroying the enemy's wall

**Game Creator:** Stop_Sign AKA Phurple

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run the development server
npm start
```

The game will be available at `http://localhost:3000`

### Docker Deployment

**Using Docker:**

```bash
# Build the image
docker build -f docker/Dockerfile -t pull-of-war:latest .

# Run the container
docker run -p 3000:3000 pull-of-war:latest
```

**Using Docker Compose:**

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f game

# Stop the service
docker-compose down
```

## How to Play

1. Go to the **Unit Spawning** tab
2. Click **Barracks** to build soldier-producing buildings
3. Click the **Battle** tab to start the game
4. Watch your units fight the enemy
5. Use spells (hotkeys 1 and 2) to damage enemy units:
   - **Fireball (1):** Deals 5 damage per stacked enemy, then 17 damage
   - **Chain Lightning (2):** Does 18 damage to 3 units
6. Upgrade units in the **Unit Upgrades** tab
7. Upgrade buildings in the **Buildings** tab
8. Defeat the enemy wall health to progress to the next level
9. Earn more territory as you progress to spawn more units

## Game Tabs

- **Battle:** View the combat arena and active units
- **Map:** Strategic map information
- **Unit Spawning:** Place buildings to spawn units
- **Unit Upgrades:** Upgrade unit stats and abilities
- **Buildings:** Upgrade your wall and fence
- **Spells:** View spell information and upgrades
- **Options:** Game settings and instructions

## Game Mechanics

### Resources

- **Gold:** Currency earned from defeating units
- **Mana:** Resource for casting spells (regenerates per level)
- **Territory:** Space to place unit-spawning buildings

### Units

- **Soldiers:** Basic melee units
- **Spearmen:** Ranged attackers

### Buildings

- **Barracks:** Spawns soldiers
- **Lumber Yard:** Spawns spearmen
- **Wall:** Defends your base
- **Fence:** Additional defensive structure

## Features

- **Persistent Save:** Your progress is saved to browser storage
- **Full-Speed Background Play:** Game runs at full speed in background tabs
- **Progressive Difficulty:** Levels increase in challenge
- **Strategic Depth:** Upgrade paths and unit combinations offer multiple strategies

## Project Structure

```
pull-of-war/
├── src/
│   ├── index.html          # Main game HTML
│   ├── server.js           # Express server
│   ├── js/                 # Game logic modules
│   │   ├── classes.js      # Game classes and units
│   │   ├── graphics.js     # Rendering logic
│   │   ├── handlers.js     # Event handlers
│   │   ├── helpers.js      # Utility functions
│   │   ├── manualActions.js# User actions
│   │   ├── mapvalues.js    # Game maps and values
│   │   ├── pullofwar.js    # Main game loop
│   │   ├── spells.js       # Spell definitions
│   │   └── interval.js     # Timing logic
│   ├── css/
│   │   └── stylesheet.css  # Game styling
│   └── assets/
│       └── pics/           # Game graphics
├── docker/
│   ├── Dockerfile          # Container definition
│   └── .dockerignore       # Docker ignore patterns
├── docs/                   # Documentation
├── package.json            # Node.js dependencies
├── docker-compose.yml      # Multi-container setup
├── .gitignore              # Git ignore patterns
├── .editorconfig           # Editor configuration
└── README.md              # This file
```

## Development

### Environment Variables

Create a `.env` file for environment-specific settings:

```
PORT=3000
NODE_ENV=development
```

See `.env.example` for available options.

### Requirements

- Node.js >= 14.0.0
- npm or yarn
- Docker (optional, for containerization)

## Containerization

### Image Size

The Docker image uses Alpine Linux as the base, resulting in a minimal footprint (~200MB).

### Building for Production

```bash
# Build the image with a specific tag
docker build -f docker/Dockerfile -t pull-of-war:v1.0 .

# Push to a registry
docker tag pull-of-war:v1.0 myregistry/pull-of-war:v1.0
docker push myregistry/pull-of-war:v1.0
```

### Deployment

The application is production-ready:
- Includes health checks
- Handles graceful shutdowns (SIGTERM/SIGINT)
- Lightweight Alpine base image
- No development dependencies included

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT

## Support

For issues, suggestions, or contributions, please create an issue or pull request.

---

**Original Creator:** Stop_Sign AKA Phurple  
**Modernized:** 2024
