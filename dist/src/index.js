"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBody = exports.AutoCannonWorld = void 0;
const THREE = require("three");
const CANNON = require("cannon-es");
class AutoCannonWorld extends CANNON.World {
    static getWorld() {
        if (!AutoCannonWorld.oneWorld) {
            AutoCannonWorld.oneWorld = new AutoCannonWorld();
        }
        return AutoCannonWorld.oneWorld;
    }
    addNewtonGravity() {
        this.addEventListener('preStep', () => {
            this.bodies.forEach(body => {
                this.bodies.forEach(bodyB => {
                    if (body !== bodyB) {
                        const distance = body.position.distanceTo(bodyB.position);
                        if (distance < 100) {
                            const force = new CANNON.Vec3();
                            body.position.vsub(bodyB.position, force);
                            force.normalize();
                            force.scale(body.mass / Math.pow(distance, 2), force);
                            bodyB.force.vadd(force, bodyB.force);
                        }
                    }
                });
            });
        });
    }
    attachMesh(mesh, bodyOptions = { mass: 1 }) {
        var _a;
        const body = new AutoBody(bodyOptions);
        if (mesh.geometry instanceof THREE.SphereGeometry) {
            const shape = new CANNON.Sphere(mesh.geometry.parameters.radius);
            body.addShape(shape);
        }
        else if (mesh.geometry instanceof THREE.BoxGeometry) {
            const shape = new CANNON.Box(new CANNON.Vec3(mesh.geometry.parameters.width / 2, mesh.geometry.parameters.height / 2, mesh.geometry.parameters.depth / 2));
            body.addShape(shape);
        }
        else {
            throw new Error(`AutoCannonWorld: ${mesh.geometry.constructor.name} not implemented`);
        }
        //adjust position and rotation
        body.position.copy((((_a = mesh.parent) === null || _a === void 0 ? void 0 : _a.localToWorld(mesh.position)) || mesh.position));
        body.quaternion.copy(mesh.quaternion);
        //link body to mesh
        //mesh.userData.cannonBody = body;
        body.threeMesh = mesh;
        //add to world
        this.addBody(body);
        return body;
    }
    updateMeshes() {
        this.bodies.forEach(body => {
            var _a;
            const autoBody = body;
            if (autoBody.threeMesh) {
                const threeVec = new THREE.Vector3(body.position.x, body.position.y, body.position.z);
                autoBody.threeMesh.position.copy(((_a = autoBody.threeMesh.parent) === null || _a === void 0 ? void 0 : _a.worldToLocal(threeVec)) || threeVec);
                autoBody.threeMesh.quaternion.copy(body.quaternion);
            }
        });
    }
    step(dt, timeSinceLastCalled, maxSubSteps) {
        super.step(dt, timeSinceLastCalled, maxSubSteps);
        this.updateMeshes();
    }
}
exports.AutoCannonWorld = AutoCannonWorld;
class AutoBody extends CANNON.Body {
}
exports.AutoBody = AutoBody;
