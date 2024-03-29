"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoBody = exports.AutoCannonWorld = void 0;
const THREE = __importStar(require("three"));
const CANNON = __importStar(require("cannon-es"));
class AutoCannonWorld extends CANNON.World {
    constructor() {
        super(...arguments);
        this.isNewtonGravity = false;
        this.maxDistanceNewtonGravity = 100;
    }
    static getWorld() {
        if (!AutoCannonWorld.oneWorld) {
            AutoCannonWorld.oneWorld = new AutoCannonWorld();
        }
        return AutoCannonWorld.oneWorld;
    }
    addNewtonGravity() {
        if (this.isNewtonGravity)
            return;
        this.addEventListener('preStep', this.preStepNewtonGravity);
        this.isNewtonGravity = true;
    }
    removeNewtonGravity() {
        if (!this.isNewtonGravity)
            return;
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
            });
        });
    }
    newtonGravityAcceleration(m1, m2, r) {
        return this.newtonGravity(m1, m2, r) / m1;
    }
    newtonGravity(m1, m2, r) {
        const G = 6.67408e-11;
        return G * m1 * m2 / (r * r);
    }
    attachMesh(mesh, bodyOptions = { mass: 1 }) {
        var _a;
        const body = new AutoBody(bodyOptions);
        if (!mesh.geometry)
            throw new Error(`AutoCannonWorld: ${mesh.name} has no geometry`);
        if (mesh.geometry.constructor.name === "SphereGeometry") {
            const geo = mesh.geometry;
            const shape = new CANNON.Sphere(geo.parameters.radius);
            body.addShape(shape);
        }
        else if (mesh.geometry.constructor.name === "BoxGeometry") {
            const geo = mesh.geometry;
            const shape = new CANNON.Box(new CANNON.Vec3(geo.parameters.width / 2, geo.parameters.height / 2, geo.parameters.depth / 2));
            body.addShape(shape);
        }
        else {
            throw new Error(`AutoCannonWorld: ${mesh.geometry.constructor.name} not implemented`);
        }
        body.position.copy((((_a = mesh.parent) === null || _a === void 0 ? void 0 : _a.localToWorld(mesh.position)) || mesh.position));
        body.quaternion.copy(mesh.quaternion);
        body.threeMesh = mesh;
        this.addBody(body);
        return body;
    }
    detachMesh(mesh) {
        const body = this.bodies.find(body => body.threeMesh === mesh);
        if (body) {
            this.removeBody(body);
        }
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
//# sourceMappingURL=index.js.map