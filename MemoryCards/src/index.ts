import { Engine, Scene, ArcRotateCamera, Vector3, SubMesh, MeshBuilder, Texture, Mesh, DirectionalLight, StandardMaterial, Color3, MultiMaterial } from 'babylonjs';

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

        //Array to store picked cards
        var pickedArray = [];

        //counter to show how many animations have completed
        var animationCompleted = 0;

        //counter to tell how many cards we have picked
		var pickedCards = 0;
		
		//shows if the card has been picked
		var picked = false;

		//card Index
		var cardIndex;

        //Create a Table background. Card will be in front of table.
        var tableMaterial = new StandardMaterial("tableMaterial", scene);
        tableMaterial.diffuseTexture = new Texture("wood.jpg", scene);
        var table = Mesh.CreateBox("table", 12, scene);
        table.scaling.z = 0.025;
        table.material = tableMaterial;

// Placing the 16 cards in a 4x4 matrix
var cardsArray = [];
	for(var i=0; i<16; i++){
			var card = Mesh.CreateBox("card"+ i, 2, scene);
			// determine card index
			cardIndex = i;
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

		}
   
		//Add a click listener and check how many cards a clicked
		window.addEventListener("click", function (e){
			var pickResult = scene.pick(e.clientX, e.clientY);

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
			}

			//set picked to true.
			cardsArray[cardIndex].picked = true;
			//store picked card in array
			pickedArray[pickedCards] = cardIndex;
			//increase picked card
			pickedCards++;

			console.log("you clicked on card " + cardIndex);

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