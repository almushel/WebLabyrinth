import { Input } from './input';
import { Player } from './player';
import { Renderer } from './renderer';
import { StaticObject } from './static-object';
import { Vector } from './vector';

export class Game {
    public walls = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,3,0,0,0,2],
		[4,0,0,0,0,0,0,2,2,2,2,2,2,0,0,3,0,3,3,3,0,0,0,2],
		[4,0,3,3,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,2,0,2,2,0,2,0,0,3,3,3,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,0,0,0,2,0,2,0,0,3,0,0,0,3,0,0,0,2],
		[4,0,3,3,0,0,2,0,0,0,0,0,2,0,0,3,0,3,3,3,0,0,0,2],
		[4,0,0,0,0,0,2,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
		[4,0,6,6,0,6,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,2],
		[4,0,6,0,0,6,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,6,0,0,0,0,0,5,5,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,6,6,6,6,0,0,0,0,0,0,5,0,0,5,0,0,0,0,0,0,0,2],
		[4,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,1,0,0,1,1,2],
		[4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,4,0,0,0,0,4,0,0,0,0,4,0,0,0,0,1,0,0,1,1,2],
		[4,4,0,0,0,0,5,0,4,4,0,4,4,4,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,1,1,2],
		[4,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,1,0,0,0,0,2],
		[4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2],
		[4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

	public staticObjects = [
		new StaticObject(16.5, 8.5, 0),
		new StaticObject(18.5, 8.5, 0),
		new StaticObject(11.5, 8.5, 1),
		new StaticObject(19.5, 15.5, 1),
		new StaticObject(19.5, 22.5, 1),
	];

	public ceiling = 5;
	public floor = 2;

	player: Player;
	input: Input;
	renderer: Renderer;
	
	currentTileX = 0;
	currentTileY = 0;

	currentTime = 0;
	previousTime = 0;

	constructor(renderer: Renderer, input: Input) {
		this.renderer = renderer;
		this.input = input;
		this.player = new Player(17, 19);
	}

	/**
	 * Progresses the game by 1 step, and schedules the next step
	 */
	public tick() {
		this.gameStep();
		this.renderer.render(this);

		window.requestAnimationFrame(this.tick.bind(this));
	}

	private gameStep() {
		if ( this.input.keyQueue.length > 0) {
			console.log(this.input.keyQueue);
			if ( this.input.keyQueue.find((k) => k === 'm') != null) {
				this.renderer.toggleMap();
			}

			this.input.clearQueue();
		}

		if ( !this.input.anyDirectional() && this.input.mouseDragStart == null ) {
			return;
		}
		
		var movement = this.getMovementFromInput();
		if ( movement.x === 0 && movement.y === 0) {
			return;
		}

		const newPlayerX = this.player.posX + movement.x;
		const newPlayerY = this.player.posY + movement.y;

		// Out of bounds
		if (newPlayerY > this.walls.length || newPlayerY < 0 || newPlayerX > this.walls[0].length || newPlayerX < 0) {
			return;
		}
		this.currentTileX = Math.floor(newPlayerX);
		this.currentTileY = Math.floor(newPlayerY);

		const currentTile = this.walls[this.currentTileY][this.currentTileX];
		if (currentTile !== 0 ) {
			return;
		}

		for (let s = 0; s < this.staticObjects.length; s++) {
			if ( this.staticObjects[s].distanceTo(newPlayerX, newPlayerY) <= 0.5) {
				return;
			}
		}

		this.player.posX = newPlayerX;
		this.player.posY = newPlayerY;
	}

	private getMovementFromInput(): Vector {
		if ( this.input.leftPressed) {
			this.player.rotateBy(1.5);
		} else if ( this.input.rightPressed) {
			this.player.rotateBy(-1.5);
		}

		let xVel = 0;
		let yVel = 0;
		if ( this.input.upPressed ) {
			yVel += this.player.direction.y * this.player.movementSpeed;
			xVel += this.player.direction.x * this.player.movementSpeed;
		} else if (this.input.downPressed) {
			yVel -= this.player.direction.y * this.player.movementSpeed;
			xVel -= this.player.direction.x * this.player.movementSpeed;
		} 

		if ( this.input.mouseDragStart != null) {
			this.player.rotateBy((this.input.mouseDragStart.x - this.input.mousePosition.x)*0.01);
			const forward = (this.input.mouseDragStart.y - this.input.mousePosition.y) * 0.0005;
			if ( forward > 0.01 ) {
				yVel = this.player.direction.y * Math.min(forward, this.player.movementSpeed)
				xVel = this.player.direction.x * Math.min(forward, this.player.movementSpeed)
			} else if (forward < -0.01) {
				yVel = this.player.direction.y * Math.max(forward, -this.player.movementSpeed)
				xVel = this.player.direction.x * Math.max(forward, -this.player.movementSpeed)
			}
		}

		return new Vector(xVel, yVel);
	}
};