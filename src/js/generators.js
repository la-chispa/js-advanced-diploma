/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import PositionedCharacter from './PositionedCharacter';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Magician from './Magician';
// import Team from './Team';

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const i = Math.floor(Math.random() * (allowedTypes.length));
  const character = new allowedTypes[i](Math.floor(Math.random() * maxLevel) + 1);
  yield character;
  return character.value;
}

function generatePosition(allowedTypes) {
  // Math.floor(Math.random() * (max - min + 1)) + min
  const col = (allowedTypes.includes(Bowman || Swordsman || Magician)) ? 0 : 6;
  const index = (Math.floor(Math.random() * 8) + 0) * (8);
  const addition = Math.floor(Math.random() * ((col + 1) - col + 1)) + col;
  return index + addition;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  const positions = new Set();
  for (let i = 0; positions.size < characterCount; i += 1) {
    positions.add(generatePosition(allowedTypes));
  }
  for (const position of positions) {
    const character = characterGenerator(allowedTypes, maxLevel).next().value;
    const positionedCharacter = new PositionedCharacter(character, position);
    team.push(positionedCharacter);
  }
  return team;
}
