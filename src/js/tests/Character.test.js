import Character from '../Character';
import Bowman from '../Bowman';

test('object should be created by child classes, error', () => {
  function createByCharacter() {
    return new Character(1);
  }
  expect(createByCharacter).toThrow(new Error('Object should be created by child classes'));
});

test('object was created by child classes', () => {
  expect(new Bowman(1)).toEqual({
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
  });
});

test('object was created by class Bowman', () => {
  expect(new Bowman(1)).toBeInstanceOf(Bowman);
});
