import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import MainScene from '../../public/MainScene';
import styles from './Game.module.css';
import { buttonConfig } from '../config/button-config';

const Game: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    useEffect(() => {
        if (!gameStarted) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: 720,
            height: 1280,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 720,
                height: 1280,
                min: {
                    width: 360,
                    height: 640
                },
                max: {
                    width: 720,
                    height: 1280
                }
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 400 },
                    debug: false
                }
            },
            scene: [MainScene],
            backgroundColor: '#000000'
        };

        // Initialize the game
        const game = new Phaser.Game(config);
        gameRef.current = game;
        
        const setupGameOverListener = (): void => {
            const mainScene = game.scene.getScene('MainScene');
            if (mainScene) {
                mainScene.events.once('gameOver', (score: number) => {
                    console.log('Game Over Event Received with score:', score);
                    setFinalScore(score);
                    setTimeout(() => {
                        if (gameRef.current) {
                            gameRef.current.destroy(true);
                            gameRef.current = null;
                            setGameStarted(false);
                            setFinalScore(null);
                        }
                    }, 1000);
                });
            }
        };

        // Wait a short moment for the scene to be ready
        setTimeout(setupGameOverListener, 100);

        // Cleanup on unmount
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [gameStarted]);

    const handleStartGame = (): void => {
        setGameStarted(true);
        setFinalScore(null);
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
            {finalScore !== null && (
                <div className={styles.scoreOverlay}>
                    Final Score: {finalScore}
                </div>
            )}
        </div>
    );
};

export default Game;
