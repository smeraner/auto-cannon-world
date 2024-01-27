import * as THREE from 'three';
import * as CANNON from 'cannon-es';
export declare class AutoCannonWorld extends CANNON.World {
    private static oneWorld;
    static getWorld(): AutoCannonWorld;
    addNewtonGravity(): void;
    attachMesh(mesh: THREE.Mesh, bodyOptions?: CANNON.BodyOptions): AutoBody;
    updateMeshes(): void;
    step(dt: number, timeSinceLastCalled?: number | undefined, maxSubSteps?: number | undefined): void;
}
export declare class AutoBody extends CANNON.Body {
    threeMesh: THREE.Mesh | undefined;
}
