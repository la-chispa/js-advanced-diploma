import { characterGenerator } from '../generators';
import Bowman from '../Bowman';

test('generator should returns object', () => {
  const character = characterGenerator([Bowman], 1).next().value;
  expect(character).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
  });
});
