export interface GameState {
  score: number;
  isGameOver: boolean;
}

export interface GameConfig {
  width: number;
  height: number;
  gravity: number;
  debug: boolean;
}

export interface ScoreOverlayProps {
  score: number;
}

// Add Phaser specific type augmentations
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      sprite(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Phaser.Physics.Arcade.Sprite;
    }
  }
}
