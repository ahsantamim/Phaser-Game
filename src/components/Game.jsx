import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import MainScene from '../game/MainScene';
import styles from './Game.module.css';
import useViewport from '../hooks/useViewport';
import { buttonConfig } from '../config/button-config';

const Game = () => {
    const gameRef = useRef(null);
    const viewport = useViewport();
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!gameStarted) return;

        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: 720,
            height: 1280,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 720,
                height: 1280
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 400 },
                    debug: false
                }
            },
            scene: MainScene,
            backgroundColor: '#000000'
        };

        // Initialize the game
        const game = new Phaser.Game(config);
        gameRef.current = game;

        // Cleanup on unmount
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [gameStarted]);

    const handleStartGame = () => {
        setGameStarted(true);
    };

    return (
        <div className={styles.gameWrapper}>
            <div id="game-container" className={styles.gameContainer} />
            {!gameStarted && (
                <button 
                    className={styles.startButton}
                    onClick={handleStartGame}
                >
                    {buttonConfig.buttonText}
                </button>
            )}
        </div>
    );
};

export default Game;
