import { calcTileType } from '../utils';

test('top-left', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('top-right', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('top, 7th col', () => {
  expect(calcTileType(6, 8)).toBe('top');
});

test('top, 2nd col', () => {
  expect(calcTileType(2, 8)).toBe('top');
});

test('left, 2nd row', () => {
  expect(calcTileType(8, 8)).toBe('left');
});

test('left, 7th row', () => {
  expect(calcTileType(48, 8)).toBe('left');
});

test('right, 2nd row', () => {
  expect(calcTileType(15, 8)).toBe('right');
});

test('right, 7th row', () => {
  expect(calcTileType(55, 8)).toBe('right');
});

test('bottom-left', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('bottom-right', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

test('bottom, 7th col', () => {
  expect(calcTileType(57, 8)).toBe('bottom');
});

test('bottom, 2nd col', () => {
  expect(calcTileType(62, 8)).toBe('bottom');
});

test('center', () => {
  expect(calcTileType(20, 8)).toBe('center');
});
