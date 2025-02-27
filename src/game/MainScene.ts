import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite | null;
  private stars: Phaser.Physics.Arcade.Group | null;
  private bombs: Phaser.Physics.Arcade.Group | null;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null;
  private score: number;
  private gameOver: boolean;
  private scoreText: Phaser.GameObjects.Text | null;

  constructor() {
    super({ key: "MainScene" });
    this.player = null;
    this.stars = null;
    this.bombs = null;
    this.platforms = null;
    this.cursors = null;
    this.score = 0;
    this.gameOver = false;
    this.scoreText = null;
  }

  preload(): void {
    this.load.image("sky", "https://labs.phaser.io/assets/skies/space3.png");
    this.load.image(
      "ground",
      "https://labs.phaser.io/assets/sprites/platform.png"
    );
    this.load.image("star", "https://labs.phaser.io/assets/sprites/star.png");
    this.load.image("bomb", "/assets/bomb.png");
    this.load.spritesheet(
      "dude",
      "https://labs.phaser.io/assets/sprites/dude.png",
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Add background
    this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);

    // Create platforms group
    this.platforms = this.physics.add.staticGroup();

    // Ground platform
    const groundY = height - 64;
    this.platforms
      .create(width / 2, groundY, "ground")
      .setScale(width / 400, 1)
      .refreshBody();

    // Create floating platforms
    const platformCount = 6; // Reduced from 8 to 6 for better spacing
    const platformSpacing = (height - 200) / (platformCount + 1); // Increased spacing

    for (let i = 1; i <= platformCount; i++) {
      const y = groundY - platformSpacing * i;
      let x: number;
      let scale: number;

      // Create a more interesting pattern with varying platform widths
      if (i % 3 === 0) {
        // Middle platforms
        x = width * 0.5;
        scale = 0.9;
      } else if (i % 3 === 1) {
        // Left platforms
        x = width * 0.2;
        scale = 0.7;
      } else {
        // Right platforms
        x = width * 0.8;
        scale = 0.7;
      }

      this.platforms.create(x, y, "ground").setScale(scale, 1).refreshBody();
    }

    // Create player
    this.player = this.physics.add.sprite(width / 2, height - 150, "dude");
    this.player.setScale(1.5); // Make the player 50% larger
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Adjust the player's body size and offset to match the new scale
    const originalWidth = 32;
    const originalHeight = 48;
    this.player.body.setSize(originalWidth * 0.8, originalHeight * 0.9); // Slightly smaller than visual size for better collision
    this.player.body.setOffset(originalWidth * 0.1, originalHeight * 0.05);

    // Player animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Input
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    } else {
      throw new Error("Keyboard input not available");
    }

    // Stars
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: {
        x: width * 0.1,
        y: 0,
        stepX: (width * 0.8) / 11,
      },
    });

    this.stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      star.setCollideWorldBounds(true);
      return true; // Return true to continue iteration
    });

    // Bombs
    this.bombs = this.physics.add.group();

    // Score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
      stroke: "#000",
      strokeThickness: 4,
    });

    // Colliders and overlaps
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }
    if (this.stars && this.platforms) {
      this.physics.add.collider(this.stars, this.platforms);
    }
    if (this.bombs && this.platforms) {
      this.physics.add.collider(this.bombs, this.platforms);
    }
    if (this.player && this.stars) {
      this.physics.add.overlap(
        this.player,
        this.stars,
        this.collectStar,
        undefined,
        this
      );
    }
    if (this.player && this.bombs) {
      this.physics.add.collider(
        this.player,
        this.bombs,
        this.hitBomb,
        undefined,
        this
      );
    }
  }

  update(): void {
    if (this.gameOver || !this.player || !this.cursors) {
      return;
    }

    const playerSpeed = 240;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-playerSpeed);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerSpeed);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    // Add type guard for player body
    if (
      this.player.body &&
      this.cursors.up.isDown &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-450);
    }
  }

  private collectStar(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    star: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    const starSprite = star as Phaser.Physics.Arcade.Sprite;
    starSprite.disableBody(true, true);
    this.score += 10;
    if (this.scoreText) {
      this.scoreText.setText("Score: " + this.score);
    }

    if (this.stars?.countActive(true) === 0 && this.platforms) {
      // Get all platforms except the ground platform
      const platforms = this.platforms.getChildren().filter((platform) => {
        const p = platform as Phaser.Physics.Arcade.Sprite;
        return p.y < this.scale.height - 100; // Exclude ground platform
      });

      this.stars.children.iterate(
        (child: Phaser.GameObjects.GameObject): boolean => {
          const star = child as Phaser.Physics.Arcade.Sprite;
          // Choose a random platform from the floating platforms
          const platform = Phaser.Utils.Array.GetRandom(
            platforms
          ) as Phaser.Physics.Arcade.Sprite;

          // Calculate safe spawn position above the platform
          const minX = Math.max(
            50,
            platform.x - (platform.width * platform.scaleX) / 2 + 20
          );
          const maxX = Math.min(
            this.scale.width - 50,
            platform.x + (platform.width * platform.scaleX) / 2 - 20
          );

          const x = Phaser.Math.Between(minX, maxX);
          const y = platform.y - 60; // Ensure star is well above the platform

          // Enable the star with bounce for better visual feedback
          star.enableBody(true, x, y, true, true);
          star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6)); // Reduce bounce variation
          star.setVelocityX(0); // Ensure star starts with no horizontal velocity
          star.setCollideWorldBounds(true);
          return true; // Continue iteration
        }
      );

      // Create new bomb
      if (this.bombs) {
        const x =
          playerSprite.x < this.scale.width / 2
            ? Phaser.Math.Between(this.scale.width / 2, this.scale.width - 50)
            : Phaser.Math.Between(50, this.scale.width / 2);

        const bomb = this.bombs.create(
          x,
          16,
          "bomb"
        ) as Phaser.Physics.Arcade.Sprite;
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }
  }

  private hitBomb(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Tilemaps.Tile,
    _bomb: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    this.physics.pause();

    const playerSprite = player as Phaser.Physics.Arcade.Sprite;
    playerSprite.setTint(0xff0000);
    playerSprite.anims.play("turn");
    this.gameOver = true;

    // Show game over text
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width / 2, height / 2, "Game Over", {
        fontSize: "64px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, "Score: " + this.score, {
        fontSize: "32px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    console.log("Emitting gameOver event with score:", this.score);
    this.events.emit("gameOver", this.score);
  }
}
