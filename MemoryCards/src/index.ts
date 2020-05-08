import { Engine, Scene, Axis, Space, ArcRotateCamera, Vector3, Sound, SubMesh, MeshBuilder, Texture, Mesh, DirectionalLight, StandardMaterial, Color3, MultiMaterial } from 'babylonjs';

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
        this.camera = new ArcRotateCamera("camera",3 * Math.PI / 2, 11*Math.PI/16, 20, Vector3.Zero(), scene);
        this.camera.attachControl(this.canvas, false);

        //Add lighting to scene
        this.light = new DirectionalLight("light", new Vector3(5,0,20), scene);
		this.light.position = new Vector3(1,1,-10);
		
		var sound = new Sound("click","sounds/click.mp3", scene);

        //Card Array with colors, will be replaced with image array after test.
        var colors = [
            new Color3(1,0,0),
            new Color3(1,1,0),
            new Color3(1,0,1),
            new Color3(0,1,0),
            new Color3(0,1,1),
            new Color3(0,0,1),
            new Color3(1,1,1),
            new Color3(1,0.5,0)
        ];

        //Array to store card values.
		var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];

		//Use function to shuffle the array
		function shuffle(array) {
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

		// a counter to tell us how many animation have been completed so far
		var animationCompleted = 0;
        //Array to store picked cards
        var pickedArray = [];
        //counter to tell how many cards we have picked
		var pickedCards = 0;
	    //Create a table background. Card will be in front of table background.
        var tableMaterial = new StandardMaterial("tableMaterial", scene);
        tableMaterial.diffuseTexture = new Texture("wood.jpg", scene);
        var table = Mesh.CreateBox("table", 12, scene);
        table.scaling.z = 0.025;
		table.material = tableMaterial;
		table.isPickable = false;

// Placing the 16 cards in a 4x4 matrix
var cardsArray = [];
	for(var i=0; i<16; i++){
			var card = Mesh.CreateBox("card"+i, 2, scene);
			// determine card index
			var cardIndex = i;
			//shows if the card has been picked
			// var p = cardsArray[cardIndex];
			// p.mesh.picked = false;
			// assigning the card a color attribute: the value
			var cardValue = gameArray[i];
			// scaling and placing the card
			card.scaling.z = 0.125;
			card.position = new Vector3((i%4)*2.5-3.75,Math.floor(i/4)*2.5-3.75,-0.25);
			// defining two different meshes, one for the bottom face and one for the rest of the card
			card.subMeshes=[];
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
			// The first material is "cardMaterial", grey color
			var cardMaterial = new StandardMaterial("cardMaterial", scene);
			cardMaterial.diffuseColor = new Color3(0.5,0.5,0.5);
			// the second material is "cardBackMaterial", a the actual color color
			var cardBackMaterial = new StandardMaterial("cardBackMaterial", scene);
			cardBackMaterial.diffuseColor = colors[gameArray[i]];
			// build a multi material to store the 2 colors
			var cardMultiMat = new MultiMaterial("cardMulti", scene);
			//push the materials into a multimaterial
			cardMultiMat.subMaterials.push(cardMaterial);
			cardMultiMat.subMaterials.push(cardBackMaterial);
			// this is the content of multi material - 0: CardMaterial, 1: CardBackMaterial
			// assigning the multi material to the card
			card.material=cardMultiMat;
			cardsArray[i]=card;
			// this is a custom attribute to know whether the card has been picked
			cardsArray[i].picked = false;
			console.log("Cards picked: " + cardsArray[cardIndex].picked);

		}
   
		//Add a click listener and check how many cards a clicked
		window.addEventListener("click", function (e){
			var pickResult = scene.pick(e.clientX, e.clientY);
			
			if (pickedCards<2) {
				//set picked to true so we can't pick same card again.
				switch (pickResult.pickedMesh.id) {
					case "card0":
						cardIndex = 0
						sound.play();
						break;
					case "card1":
						cardIndex = 1
						sound.play();
						break;
					case "card2":
						cardIndex = 2
						sound.play();
						break;
					case "card3":
						cardIndex = 3
						sound.play();
						break;
					case "card4":
						cardIndex = 4
						sound.play();
						break;
					case "card5":
						cardIndex = 5
						sound.play();
						break;
					case "card6":
						cardIndex = 6
						sound.play();
						break;
					case "card7":
						cardIndex = 7
						sound.play();
						break;
					case "card8":
						cardIndex = 8
						sound.play();
						break;
					case "card9":
						cardIndex = 9
						sound.play();
						break;
					case "card10":
						cardIndex = 10
						sound.play();
						break;
					case "card11":
						cardIndex = 11
						sound.play();
						break;
					case "card12":
						cardIndex = 12
						sound.play();
						break;
					case "card13":
						cardIndex = 13
						sound.play();
						break;
					case "card14":
						cardIndex = 14
						sound.play();
						break;
					case "card15":
						cardIndex = 15
						sound.play();
						break;
						default:
						console.log("Card was not clicked");
				}
				pickResult.pickedMesh.rotate(Axis.Y, this.Math.PI, Space.LOCAL);

				cardsArray[cardIndex].picked = true;
				//store picked card in array
				pickedArray[pickedCards] = cardIndex;
				console.log("you clicked on card " + cardIndex);
				console.log("Number of pickedCards " + pickedCards);
				pickedCards++;
			}
			//Wait for a second before checking card match
			this.window.setTimeout(function(){
				if (pickedArray[1] != null){
					if (gameArray[pickedArray[0]] == gameArray[pickedArray[1]]) {
						console.log("Cards Match");
						cardsArray[pickedArray[0]].dispose();
						cardsArray[pickedArray[1]].dispose();
						//Reset picked cards count and clear picked cards array.
						pickedCards = 0;
						pickedArray = [];
		
					} else {
						console.log("cards DONT match")
						//If cards don't match, rotate back to hide front face
						cardsArray[pickedArray[0]].rotate(Axis.Y, -this.Math.PI, Space.LOCAL);
						cardsArray[pickedArray[1]].rotate(Axis.Y, -this.Math.PI, Space.LOCAL);
						//Reset picked status back to false
						cardsArray[0].picked = false;
						cardsArray[1].picked = false;
						//Reset picked cards count and clear picked cards array.
						pickedCards = 0;
						pickedArray = [];
					}
				}
			},1000);
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