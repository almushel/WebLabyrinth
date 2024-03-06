import { Input } from './input';
import { Player } from './player';
import { Renderer } from './renderer';

export class Game {
    public worldMap = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
		[1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
		[1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

	player: Player;
	input: Input;
	renderer: Renderer;

	currentTime = 0;
	previousTime = 0;

	constructor(renderer: Renderer, input: Input) {
		this.renderer = renderer;
		this.input = input;
		this.player = new Player(22, 12);
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

		if ( !this.input.anyDirectional() ) {
			return;
		}
		
		if ( this.input.leftPressed) {
			this.player.rotateBy(-1);
		} else if ( this.input.rightPressed) {
			this.player.rotateBy(1);
		}

		let xVel = 0;
		let yVel = 0;
		if ( this.input.upPressed ) {
			yVel += this.player.direction.y * this.player.movementSpeed;
			xVel += this.player.direction.x * this.player.movementSpeed;
		} else if (this.input.downPressed) {
			yVel -= this.player.direction.y * this.player.movementSpeed;
			xVel -= this.player.direction.x * this.player.movementSpeed;
		} else {
			return;
		}

		const newPlayerX = this.player.posX += xVel;
		const newPlayerY = this.player.posY += yVel;

		// This check doesn't work, probably because I'm doing something wrong with coordinates somewhere
		if ( newPlayerX > this.worldMap.length || newPlayerX < 0 || newPlayerY > this.worldMap[0].length || newPlayerY < 0 ||
			this.worldMap[Math.floor(newPlayerX)][Math.floor(newPlayerY)] !== 0) {
			return;
		}

		this.player.posX = newPlayerX;
		this.player.posY = newPlayerY;
	}
};