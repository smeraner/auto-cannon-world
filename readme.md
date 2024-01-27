# Auto Cannon World

A brief description of the project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

Instructions on how to install and set up the project.
```bash
npm i https://github.com/smeraner/auto-cannon-world.git
```

## Usage

Instructions on how to use the project and any relevant examples.
```typescript
import { AutoCannonWorld } from 'auto-cannon-world'

const world = new AutoCannonWorld()

// optional gravity mode
world.addNewtonGravity();

// add mesh to world
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.set(x, y, z);
world.attachMesh(cubeMesh, { mass: 50 });

//execute world step, like in cannon es
world.step(1 / 60, deltaTime, 3);
```
