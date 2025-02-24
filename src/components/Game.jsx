import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/MainScene';
import styles from './Game.module.css';
import useViewport from '../hooks/useViewport';

const Game = () => {
    const gameRef = useRef(null);
    const viewport = useViewport();

    useEffect(() => {
        const calculateGameSize = () => {
            const maxWidth = 800;
            const maxHeight = 600;
            const windowRatio = viewport.width / viewport.height;
            const gameRatio = maxWidth / maxHeight;

            let width, height;

            if (windowRatio < gameRatio) {
                height = Math.min(viewport.height * 0.95, maxHeight);
                width = height * gameRatio;
            } else {
                width = Math.min(viewport.width * 0.95, maxWidth);
                height = width / gameRatio;
            }

            return { width, height };
        };

        const { width, height } = calculateGameSize();

        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width,
            height,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: MainScene
        };

        // Initialize the game
        const game = new Phaser.Game(config);
        gameRef.current = game;

        // Cleanup on unmount
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, [viewport.width, viewport.height]);

    return (
        <div className={styles.gameWrapper}>
            <div id="game-container" className={styles.gameContainer}></div>
        </div>
    );
};

export default Game;
