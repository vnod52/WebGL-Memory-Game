import { Engine, Scene, ArcRotateCamera, DirectionalLight } from 'babylonjs';
export declare class Main {
    constructor();
    timeElapsed: number;
    canvas: HTMLCanvasElement;
    engine: Engine;
    scene: Scene;
    camera: ArcRotateCamera;
    light: DirectionalLight;
    createScene(): Scene;
    update(): void;
}
