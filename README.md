# 🎮 Phaser Platform Game

## 📌 Project Overview
An exciting platform game built with **Phaser 3**, **React**, and **TypeScript**! Collect stars, avoid bombs, and try to achieve the highest score possible. The game features smooth animations, responsive controls, and progressive difficulty.

## 🎯 Game Features
- Responsive game design that adapts to different screen sizes
- Smooth platform-based movement and physics
- Collectible stars that respawn in strategic locations
- Progressive difficulty with bouncing bombs
- Score tracking and game over system
- Beautiful UI with a modern design

## ⚙️ Technical Stack
- **React 18** for UI components
- **Phaser 3** for game engine
- **TypeScript** for type safety
- **CSS Modules** for styling
- **Vite** for fast development and building

## 🚀 Getting Started

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/Phaser-Game.git
   cd Phaser-Game
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. Click the "Start Game" button to begin
2. Use the arrow keys to control your character:
   - ⬅️ Left Arrow: Move left
   - ➡️ Right Arrow: Move right
   - ⬆️ Up Arrow: Jump
3. Collect stars to score points (10 points each)
4. Avoid the bouncing bombs
5. Try to get the highest score possible!

## 📁 Project Structure

```
📂 Phaser-Game/
 ├── 📂 public/
 │   ├── 📄 MainScene.ts     # Main game scene with core gameplay logic
 │   └── 📂 assets/         # Game assets (images, sprites)
 ├── 📂 src/
 │   ├── 📄 App.tsx         # Main React component
 │   ├── 📄 main.tsx        # Application entry point
 │   ├── 📂 components/
 │   │   ├── 📄 Game.tsx    # Game component with Phaser initialization
 │   │   └── 📄 Game.module.css
 │   └── 📂 config/
 │       └── 📄 button-config.ts  # UI configuration
 └── 📄 tsconfig.json       # TypeScript configuration
```

## 🛠️ Development Notes

### Game Configuration
- Canvas Size: 720x1280 pixels
- Responsive scaling with minimum size of 360x640
- Physics engine: Arcade Physics with gravity
- Custom collision detection for platforms and collectibles

### Performance Optimizations
- Efficient sprite management
- Optimized collision checks
- Smart object pooling for stars and bombs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
- Phaser.io for the excellent game framework
- React team for the awesome UI library
- The open-source community for inspiration and support
