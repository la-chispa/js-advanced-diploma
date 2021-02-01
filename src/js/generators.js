/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const i = Math.floor(Math.random() * (allowedTypes.length));
  const character = new allowedTypes[i](Math.floor(Math.random() * maxLevel) + 1);
  yield character;
  return character.value;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
}
