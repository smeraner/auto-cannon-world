import * as THREE from 'three';
import * as CANNON from 'cannon-es';
export declare class AutoCannonWorld extends CANNON.World {
    private static oneWorld;
    static getWorld(): AutoCannonWorld;
    isNewtonGravity: boolean;
    maxDistanceNewtonGravity: number;
    addNewtonGravity(): void;
    removeNewtonGravity(): void;
    preStepNewtonGravity(): void;
    private newtonGravityAcceleration;
    private newtonGravity;
    attachMesh(mesh: THREE.Mesh, bodyOptions?: CANNON.BodyOptions): AutoBody;
    detachMesh(mesh: THREE.Mesh): void;
    updateMeshes(): void;
    step(dt: number, timeSinceLastCalled?: number | undefined, maxSubSteps?: number | undefined): void;
}
export declare class AutoBody extends CANNON.Body {
    threeMesh: THREE.Mesh | undefined;
}
