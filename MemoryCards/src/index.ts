import { Engine, Scene, Axis, Space, ArcRotateCamera, Vector3, Animation, Sound, SubMesh, Texture, Mesh, DirectionalLight, StandardMaterial, MultiMaterial } from 'babylonjs';
import { AdvancedDynamicTexture, TextBlock, Button } from 'babylonjs-gui'

export class Main {

	constructor() {
		// run our update method every frame.
		this.engine.runRenderLoop(() => {
			this.update();
		});
	}




	// record time.
	timeElapsed: number = 0;
	canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("gameCanvas");
	engine: Engine = new Engine(this.canvas, true);
	scene: Scene = this.createScene();
	camera: ArcRotateCamera;
	light: DirectionalLight;

	createScene(): Scene {

		// Setup important scene stuff
		var scene: Scene = new Scene(this.engine);
		//Add a camera to scene and attach controls
		this.camera = new ArcRotateCamera("camera", 3 * Math.PI / 2, 11 * Math.PI / 16, 20, Vector3.Zero(), scene);
		// this.camera = new ArcRotateCamera("camera", 3 * Math.PI / 2, 11 * Math.PI / 16, 5, Vector3.Zero(), scene);
		this.camera.attachControl(this.canvas, false);
		//Add lighting to scene
		this.light = new DirectionalLight("light", new Vector3(5, 0, 20), scene);
		this.light.position = new Vector3(1, 1, -10);
		//Add sound to be used in scene
		var click = new Sound("click", "sounds/click.mp3", scene);
		var win = new Sound("win", "sounds/win.mp3", scene);
		var lose = new Sound("lose", "sounds/lose.mp3", scene);
		var gameOver = new Sound("gameOver", "sounds/gameOver.mp3", scene);
		var gameWin = new Sound("gameWin", "sounds/gameWin.mp3", scene);
		// A little mood music
		var music = new Sound("music", "sounds/intro.mp3", scene, soundReady, { loop: true, volume: 0.5 });
		function soundReady() {
			music.play();
		}

		//Array to store card values. Array used for assigning textures to card as well
		var gameArray = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
		//Array to store picked cards
		var pickedArray: any = [];
		//counter to tell how many cards we have picked
		var pickedCards: number = 0;
		//score counter
		var score: number = 100;
		//number of correct guess count
		var correctGuesses: number = 0;
		//array to store all the cards
		var cardsArray: any = [];
		// Placing the 16 cards in a 4x4 matrix

		function generateCards() {
			//Use function to shuffle the card array
			function shuffle(array): any {
				var currentIndex = array.length, temporaryValue, randomIndex;

				// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}
				return array;
			}
			gameArray = shuffle(gameArray);

			for (var i = 0; i < 16; i++) {
				var card: Mesh = Mesh.CreateBox("card" + i, 2, scene);
				// determine card index
				var cardIndex: number = i;
				// scaling and placing the card
				card.scaling.z = 0.125;
				card.position = new Vector3((i % 4) * 2.5 - 3.75, Math.floor(i / 4) * 2.5 - 3.75, -0.25);
				// defining two different meshes, one for the bottom face and one for the rest of the card
				card.subMeshes = [];
				// arguments of Submesh:
				// 1: the index of the material to use
				// 2: the index of the first vertex
				// 3: the number of verices used
				// 4: index of the first indice to use
				// 5: the number of indices
				// 6: the main mesh
				card.subMeshes.push(new SubMesh(0, 4, 20, 6, 30, card));
				card.subMeshes.push(new SubMesh(1, 0, 4, 0, 6, card));
				// card material will be made with 2 different materials.
				// The first material is "cardMaterial", decorative backgroud
				var cardMaterial: StandardMaterial = new StandardMaterial("cardMaterial", scene);
				cardMaterial.diffuseTexture = new Texture("images/cardback.jpg", scene);
				// the second material is "cardBackMaterial", a image from array
				var cardBackMaterial: StandardMaterial = new StandardMaterial("cardBackMaterial", scene);
				//apply textures to card face
				cardBackMaterial.diffuseTexture = new Texture("images/" + gameArray[i] + ".jpg", scene);
				// build a multi material to store the 2 images
				var cardMultiMat: MultiMaterial = new MultiMaterial("cardMulti", scene);
				//push the materials into a multimaterial
				cardMultiMat.subMaterials.push(cardMaterial);
				cardMultiMat.subMaterials.push(cardBackMaterial);
				// this is the content of multi material - 0: CardMaterial, 1: CardBackMaterial
				// assigning the multi material to the card
				card.material = cardMultiMat;
				cardsArray[i] = card;
				// this is a custom attribute to know whether the card has been picked
				cardsArray[i].picked = false;
			}
		}
		generateCards();

		//function to dispose all cards and regerate new ones.
		function disposeAllCards() {
			for (let index = 0; index < cardsArray.length; index++) {
				cardsArray[index].dispose();
			}
		}

		//reset game function
		function reloadGame() {
			disposeAllCards();
			generateCards();
			pickedArray = [];
			score = 100;
			pickedCards = 0;
			correctGuesses = 0;
			txtScore.text = "Score: " + score;
			txtScore.color = "white";
		}

		//Create a table background for cards to sit on
		var tableMaterial: StandardMaterial = new StandardMaterial("tableMaterial", scene);
		tableMaterial.diffuseTexture = new Texture("images/wood.jpg", scene);
		var table: Mesh = Mesh.CreateBox("table", 12, scene);
		table.scaling.z = 0.025;
		// infoBox.position.z = -0.25;
		table.material = tableMaterial;
		table.isPickable = false;

		//Create a box to display user info
		var infoBoxMaterial: StandardMaterial = new StandardMaterial("infoBoxMaterial", scene);
		infoBoxMaterial.diffuseTexture = new Texture("images/infobox.jpg", scene);
		var infoBox: Mesh = Mesh.CreateBox("infoBox", 12, scene);
		infoBox.scaling.z = 0.025;
		// infoBox.position.z = -0.25;
		infoBox.material = infoBoxMaterial;
		infoBox.isPickable = false;

		// GUI - Title textbox, top of screen
		var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
		var txtTitle = new TextBlock();
		txtTitle.text = "Memory Game";
		txtTitle.color = "yellow";
		txtTitle.fontSize = 35;
		txtTitle.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		txtTitle.top = "20px";
		txtTitle.alpha = 0.7;

		//Add textbox on top of screen
		var txtScore = new TextBlock();
		txtScore.text = "Score Remaining: " + score;
		txtScore.color = "white";
		txtScore.fontSize = 20;
		txtScore.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		txtScore.top = "70px";
		txtScore.alpha = 0.7;

		//add button on the bottow of screen to restart game
		var button = Button.CreateSimpleButton("but", "Try Again!");
		button.width = 0.3;
		button.height = "40px";
		button.color = "white";
		button.cornerRadius = 10;
		button.background = "#34324c";
		button.alpha = 0.5;
		button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		button.top = "-50";

		//restart game if user chooses to do so
		button.onPointerUpObservable.add(function () {
			click.play();
			let response = confirm("You are about to reload the game?")
			if (response == true) {
				reloadGame();
			}
		});
		//add button and texbox to scene after intial animation completes (button freezes of all 3 add controls are in one setTImeout function!)
		setTimeout(() => {advancedTexture.addControl(txtTitle); }, 7000);
		setTimeout(() => { advancedTexture.addControl(txtScore); advancedTexture.addControl(button);  }, 7000);

		//DEFINE THE ANIMATION
		var infoBoxAnimation: Animation = new Animation("infoBoxAnimation", "position.z", 5, // animation speed
			Animation.ANIMATIONTYPE_FLOAT, // animation type
			Animation.ANIMATIONLOOPMODE_CONSTANT // animation loop mode
		);
		var tableAnimation: Animation = new Animation("tableAnimation", "position.z", 5, // animation speed
			Animation.ANIMATIONTYPE_FLOAT, // animation type
			Animation.ANIMATIONLOOPMODE_CONSTANT // animation loop mode
		);
		var cameraAnimation: Animation = new Animation("cameraAnimation", "radius", 1, // animation speed
			Animation.ANIMATIONTYPE_FLOAT, // animation type
			Animation.ANIMATIONLOOPMODE_CONSTANT // animation loop mode
		);

		//define animation keyframes
		var infoBoxKeys = [
			{
				frame: 0,
				value: -0.6
			},
			{
				frame: 30,
				value: 0.25
			}
		];
		var tableKeys = [
			{
				frame: 30,
				value: -0.5
			},
			{
				frame: 60,
				value: 0.025
			}
		];
		var cameraMoveKeys = [
			{
				frame: 60,
				value: 5
			},
			{
				frame: 66,
				value: 7
			},
			{
				frame: 66,
				value: 7
			},
			{
				frame: 66.5,
				value: 20
			}
		];
		//assign keys to mesh
		infoBoxAnimation.setKeys(infoBoxKeys);
		infoBox.animations.push(infoBoxAnimation);
		tableAnimation.setKeys(tableKeys);
		table.animations.push(tableAnimation);
		cameraAnimation.setKeys(cameraMoveKeys);
		this.camera.animations.push(cameraAnimation);
		//start animation
		scene.beginAnimation(infoBox, 0, 30, false);
		scene.beginAnimation(table, 30, 60, false);
		scene.beginAnimation(this.camera, 60, 90, false);

		//Add a click listener and check how many cards a clicked
		window.addEventListener("click", function (e) {
			var pickResult = scene.pick(e.clientX, e.clientY);
			try {
				//if score reaches zero game ends
				if (score > 0) {
					//can only pick 2 cards at a time
					if (pickedCards < 2 && pickResult.pickedMesh.name.match("card")) {
						let cardIndex;
						//check which card has been clicked
						switch (pickResult.pickedMesh.id) {
							case "card0":
								cardIndex = 0
								break;
							case "card1":
								cardIndex = 1
								break;
							case "card2":
								cardIndex = 2
								break;
							case "card3":
								cardIndex = 3
								break;
							case "card4":
								cardIndex = 4
								break;
							case "card5":
								cardIndex = 5
								break;
							case "card6":
								cardIndex = 6
								break;
							case "card7":
								cardIndex = 7
								break;
							case "card8":
								cardIndex = 8
								break;
							case "card9":
								cardIndex = 9
								break;
							case "card10":
								cardIndex = 10
								break;
							case "card11":
								cardIndex = 11
								break;
							case "card12":
								cardIndex = 12
								break;
							case "card13":
								cardIndex = 13
								break;
							case "card14":
								cardIndex = 14
								break;
							case "card15":
								cardIndex = 15
								break;
							default:
								console.log("Card was not clicked");
						}
						//play sound each time card is clicked
						click.play();
						//store picked card in array
						pickedArray[pickedCards] = cardIndex;
						//rotate card to reveal image.
						pickResult.pickedMesh.rotate(Axis.Y, this.Math.PI, Space.LOCAL);
						//set pickable to false so we can't pick same card again.
						cardsArray[cardIndex].isPickable = false;
						//increment picked card counter
						pickedCards++;
					}
				}

			} catch (error) {
				console.log(error);
			}

			//Add a delay before checking card match
			this.window.setTimeout(function () {
				//run card comparison only when 2 cards are picked
				if (pickedArray[1] != null) {

					//CARDS MATCH
					if (gameArray[pickedArray[0]] == gameArray[pickedArray[1]]) {
						console.log("Cards Match");
						win.play();
						cardsArray[pickedArray[0]].dispose();
						cardsArray[pickedArray[1]].dispose();
						//Reset picked cards count and clear picked cards array.
						pickedCards = 0;
						pickedArray = [];
						correctGuesses++;
						score += 10;
						txtScore.text = "Score: " + score;
						txtScore.color = "green";

						//if guess count reaches 8 game, all cards are matched
						if (correctGuesses == 8) {
							gameWin.play();
							alert("You did it!");
						}

					} else {
						//CARDS DON't MATCH
						console.log("cards DONT match");
						lose.play();
						//If cards don't match, rotate back to hide front face
						cardsArray[pickedArray[0]].rotate(Axis.Y, -this.Math.PI, Space.LOCAL);
						cardsArray[pickedArray[1]].rotate(Axis.Y, -this.Math.PI, Space.LOCAL);
						//Reset pickable status back to false
						cardsArray[pickedArray[0]].isPickable = true;
						cardsArray[pickedArray[1]].isPickable = true;
						//Reset picked cards count and clear picked cards array.
						pickedCards = 0;
						pickedArray = [];
						score -= 10;
						txtScore.text = "Score: " + score;
						txtScore.color = "red";

						//if score reaches zero game ends
						if (score == 0) {
							gameOver.play();
							alert("GAME OVER....Better luck next time!!!");
						}
					}
					console.log(score);
				}

			}, 1000);
		});
		return scene;
	}

	update() {
		// increment our time for use with sine waves etc.
		this.timeElapsed += this.engine.getDeltaTime() / 1000;

		// Render the scene.
		this.scene.render();
	}
}

new Main();