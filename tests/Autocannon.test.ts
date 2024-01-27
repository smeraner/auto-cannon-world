import { AutoCannonWorld } from '../src';

test('Autocannon', () => {
    const world = new AutoCannonWorld();
    expect(world).toBeInstanceOf(AutoCannonWorld);
});