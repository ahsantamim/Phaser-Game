import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
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

  preload() {
    this.load.image("sky", "https://labs.phaser.io/assets/skies/space3.png");
    this.load.image(
      "ground",
      "https://labs.phaser.io/assets/sprites/platform.png"
    );
    this.load.image("star", "https://labs.phaser.io/assets/sprites/star.png");
    this.load.image("bomb", "public/assets/bomb.png");
    this.load.spritesheet(
      "dude",
      "https://labs.phaser.io/assets/sprites/dude.png",
      { frameWidth: 32, frameHeight: 48 }
    );
  }

  create() {
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
    const platformCount = 8;
    const platformSpacing = (height - 150) / (platformCount + 1);

    for (let i = 1; i <= platformCount; i++) {
      const y = groundY - platformSpacing * i;
      let x;

      // Alternate between left, center, and right
      if (i % 3 === 0) {
        x = width * 0.5;
      } else if (i % 3 === 1) {
        x = width * 0.25;
      } else {
        x = width * 0.75;
      }

      this.platforms.create(x, y, "ground").setScale(0.75, 1).refreshBody();
    }

    // Create player
    this.player = this.physics.add.sprite(width / 2, height - 150, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

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
    this.cursors = this.input.keyboard.createCursorKeys();

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
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      child.setCollideWorldBounds(true);
    });

    // Bombs
    this.bombs = this.physics.add.group();

    // Score
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      fill: "#fff",
      stroke: "#000",
      strokeThickness: 4,
    });

    // Colliders and overlaps
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      null,
      this
    );
  }

  update() {
    if (this.gameOver) {
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

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-450);
    }
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const y = Phaser.Math.Between(50, this.scale.height - 100);
        child.enableBody(true, x, y, true, true);
      });

      const x =
        player.x < this.scale.width / 2
          ? Phaser.Math.Between(this.scale.width / 2, this.scale.width - 50)
          : Phaser.Math.Between(50, this.scale.width / 2);

      const bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }

  hitBomb(player) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.gameOver = true;

    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width / 2, height / 2, "Game Over", {
        fontSize: "64px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 80, "Score: " + this.score, {
        fontSize: "32px",
        fill: "#fff",
        stroke: "#000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);
  }
}
