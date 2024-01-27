"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
test('Autocannon', () => {
    const world = new src_1.AutoCannonWorld();
    expect(world).toBeInstanceOf(src_1.AutoCannonWorld);
});
