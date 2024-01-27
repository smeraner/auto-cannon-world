import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import { AutoCannonWorld } from '../src';

test('Autocannon', () => {
    const world = new AutoCannonWorld();
    expect(world).toBeInstanceOf(AutoCannonWorld);
});

test('Autocannon singleton', () => {
    const world = AutoCannonWorld.getWorld();
    expect(world).toBeInstanceOf(AutoCannonWorld);
});

test('Autocannon add newtown gravity', () => {
    const world = AutoCannonWorld.getWorld();
    world.addNewtonGravity();
    expect(world.isNewtonGravity).toBe(true);
});

test('Autocannon add/remove newtown gravity', () => {
    const world = AutoCannonWorld.getWorld();
    world.addNewtonGravity();
    world.removeNewtonGravity();
    expect(world.isNewtonGravity).toBe(false);
});

test('Autocannon attach mesh', () => {
    const world = AutoCannonWorld.getWorld();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const atb = world.attachMesh(mesh);
    expect(atb).toBeInstanceOf(CANNON.Body);
});

test('Autocannon attach mesh with options', () => {
    const world = AutoCannonWorld.getWorld();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const atb = world.attachMesh(mesh, { mass: 2 });
    expect(atb.mass).toBe(2);
});

test('Autocannon detach mesh', () => {
    const world = AutoCannonWorld.getWorld();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
    const atb = world.attachMesh(mesh);
    world.detachMesh(mesh);
    expect(atb.world).toBe(null);
});