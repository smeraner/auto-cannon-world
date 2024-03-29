import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export class AutoCannonWorld extends CANNON.World {
    private static oneWorld: AutoCannonWorld | undefined;
    static getWorld() {
        if (!AutoCannonWorld.oneWorld) {
            AutoCannonWorld.oneWorld = new AutoCannonWorld();
        }
        return AutoCannonWorld.oneWorld;
    }

    public isNewtonGravity = false;
    public maxDistanceNewtonGravity = 100;

    addNewtonGravity() {
        if (this.isNewtonGravity) return;
        this.addEventListener('preStep', this.preStepNewtonGravity);
        this.isNewtonGravity = true;
    }

    removeNewtonGravity() {
        if (!this.isNewtonGravity) return;
        this.removeEventListener('preStep', this.preStepNewtonGravity);
        this.isNewtonGravity = false;
    }

    preStepNewtonGravity() {
        this.bodies.forEach(body => {
            this.bodies.forEach(bodyB => {
                if (body !== bodyB) {
                    const distance = body.position.distanceTo(bodyB.position);
                    if (distance < this.maxDistanceNewtonGravity) {
                        const force = new CANNON.Vec3();
                        body.position.vsub(bodyB.position, force);
                        force.normalize();
                        const forceMagnitude = this.newtonGravityAcceleration(bodyB.mass, body.mass, distance);
                        force.scale(forceMagnitude, force);
                        bodyB.force.vadd(force, bodyB.force);
                    }
                }
            })
        });
    }
   
    /**
     * newton gravity acceleration
     * @param m1 mass of body 1
     * @param m2 mass of body 2
     * @param r distance between body 1 and body 2
     * @returns acceleration of body 1
     */
    private newtonGravityAcceleration(m1:number, m2:number, r:number):number {
        return this.newtonGravity(m1, m2, r) / m1;
    }
    private newtonGravity(m1:number, m2:number, r:number):number {
        const G = 6.67408e-11;
        return G * m1 * m2 / (r * r);
    }

    attachMesh(mesh: THREE.Mesh, bodyOptions: CANNON.BodyOptions = { mass: 1 }): AutoBody {
        const body = new AutoBody(bodyOptions);
        if(!mesh.geometry) throw new Error(`AutoCannonWorld: ${mesh.name} has no geometry`); 

        if(mesh.geometry.constructor.name === "SphereGeometry") {
            const geo = mesh.geometry as THREE.SphereGeometry;
            const shape = new CANNON.Sphere(geo.parameters.radius);
            body.addShape(shape);
        } else if(mesh.geometry.constructor.name === "BoxGeometry") {
            const geo = mesh.geometry as THREE.BoxGeometry;
            const shape = new CANNON.Box(new CANNON.Vec3(geo.parameters.width / 2, geo.parameters.height / 2, geo.parameters.depth / 2));
            body.addShape(shape);
        } else {
            throw new Error(`AutoCannonWorld: ${mesh.geometry.constructor.name} not implemented`);
        }
        //adjust position and rotation
        body.position.copy((mesh.parent?.localToWorld(mesh.position) || mesh.position) as any);
        body.quaternion.copy(mesh.quaternion as any);

        //link body to mesh
        body.threeMesh = mesh;

        //add to world
        this.addBody(body);

        return body;
    }

    detachMesh(mesh: THREE.Mesh) {
        const body = this.bodies.find(body => (body as AutoBody).threeMesh === mesh);
        if(body) {
            this.removeBody(body);
        }
    }

    updateMeshes() {
        this.bodies.forEach(body=> {
            const autoBody = body as AutoBody;
            if(autoBody.threeMesh) {
                const threeVec = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
                autoBody.threeMesh.position.copy(autoBody.threeMesh.parent?.worldToLocal(threeVec) || threeVec);
                autoBody.threeMesh.quaternion.copy(body.quaternion as any);
            }
        });
    }

    step(dt: number, timeSinceLastCalled?: number | undefined, maxSubSteps?: number | undefined): void {
        super.step(dt, timeSinceLastCalled, maxSubSteps);
        this.updateMeshes();
    }
}

export class AutoBody extends CANNON.Body {
    threeMesh: THREE.Mesh | undefined;
}