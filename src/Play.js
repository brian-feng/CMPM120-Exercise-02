class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width / 4))
        wallA.setVelocityX(400)
        wallA.body.setCollideWorldBounds(true)
        wallA.body.setBounce(1)
        wallA.setImmovable(true)    

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width / 4))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // one way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.shots = 0
        this.score = 0
        this.percentage = 0

         // text
         let textConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.thing = "Shots: " + this.shots.toString() + " | Score: " + this.score.toString() + " | Percentage: " + this.percentage.toString() + "%"
        this.text = this.add.text(game.config.width / 35, game.config.height * 0.95, this.thing, textConfig).setOrigin(0, 0)

        // input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX
            let shotDirectionY
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1
            pointer.y <= this.ball.y ? shotDirectionY = 1 : shotDirectionY = -1
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            this.shots++
            if(this.score != 0) this.percentage = parseInt(this.score/this.shots * 100, 10)
            this.thing = "Shots: " + this.shots.toString() + " | Score: " + this.score.toString() + " | Percentage: " + this.percentage.toString() + "%"
            this.text.text = this.thing
        })

        // collision 
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.setX(width / 2)
            ball.setY(height - height / 10)
            this.ball.setVelocityX(0)
            this.ball.setVelocityY(0)
            this.score++
            if(this.score != 0) this.percentage = parseInt(this.score/this.shots * 100, 10)
            this.thing = "Shots: " + this.shots.toString() + " | Score: " + this.score.toString() + " | Percentage: " + this.percentage.toString() + "%"
            this.text.text = this.thing
        })
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {

    }
}