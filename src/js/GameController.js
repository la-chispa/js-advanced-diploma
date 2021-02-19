import themes from './themes';
import { generateTeam } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import Daemon from './Daemon';
import GamePlay from './GamePlay';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    this.setTwoDimensionalBoard();
    const userChars = [Bowman, Swordsman];
    const aiChars = [Vampire, Undead];
    this.gamePlay.userCharacters = [Bowman, Swordsman, Magician];
    this.gamePlay.aiCharacters = [Vampire, Undead, Daemon];
    this.gamePlay.team = generateTeam(userChars, 1, 2).concat(generateTeam(aiChars, 1, 2));
    this.gamePlay.redrawPositions(this.gamePlay.team);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    console.log(this);
    console.log(this.gamePlay);
  }

  onCellClick(index) {
    // TODO: react to click
    const position = this.team.find((i) => i.position === index);
    console.log(position);
    if (this.cells.some((i) => i.classList.contains('selected'))) {
      this.deselectCell(this.cells.findIndex((i) => i.classList.contains('selected')));
    }
    if (position && this.userCharacters.some((i) => position.character instanceof i)) {
      this.team.forEach((i) => this.deselectCell(i.position));
      this.selectCell(index);
    } else {
      GamePlay.showError('There is no your character in this cell');
    }

    // Рабочий вариант
    // const position = this.team.find((i) => i.position === index);
    // const isSelected = this.cells[index].classList.contains('selected');
    // // const isUserChar = this.userCharacters.some((i) => position.character instanceof i);
    // if (position && !isSelected && this.userCharacters.some((i) => position.character instanceof i)) {
    //   this.team.forEach((i) => this.deselectCell(i.position));
    //   this.selectCell(index);
    // } else if (position && isSelected && this.userCharacters.some((i) => position.character instanceof i)) {
    //   this.deselectCell(index);
    // } else if (this.cells.some((i) => i.classList.contains('selected'))) {
    //   this.deselectCell(this.cells.findIndex((i) => i.classList.contains('selected')));
    // } else {
    //   GamePlay.showError('There is no your character in this cell');
    // }
    // *Рабочий вариант
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const selectedCharIndex = this.cells.findIndex((i) => i.classList.contains('selected'));
    const selectedCharacter = this.team.find((i) => i.position === selectedCharIndex);
    const position = this.team.find((i) => i.position === index);
    const userChar = (position) ? this.userCharacters.some((i) => position.character instanceof i) : false;
    if (position) {
      const message = `\u{1F396}${position.character.level} \u{2694}${position.character.attack} \u{1F6E1}${position.character.defence} \u{2764}${position.character.health}`;
      this.showCellTooltip(message, index);
    }
    if (selectedCharIndex !== -1 && userChar) {
      this.setCursor(cursors.pointer);
    }

    if (selectedCharIndex !== -1) {
      const charcoord = this.coords[selectedCharIndex];
      const gameMoves = [];
      for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
        const move = {};
        const setMove = (coords) => {
          if (coords.x > 7 || coords.x < 0 || coords.y > 7 || coords.y < 0) {
            return;
          }
          const gameMove = this.coords.findIndex((n) => n.x === coords.x && n.y === coords.y);
          gameMoves.push(gameMove);
        };
        move.x = charcoord.x + i;
        move.y = charcoord.y;
        setMove(move);
        move.x = charcoord.x - i;
        move.y = charcoord.y;
        setMove(move);
        move.x = charcoord.x;
        move.y = charcoord.y + i;
        setMove(move);
        move.x = charcoord.x;
        move.y = charcoord.y - i;
        setMove(move);
        move.x = charcoord.x - i;
        move.y = charcoord.y - i;
        setMove(move);
        move.x = charcoord.x + i;
        move.y = charcoord.y + i;
        setMove(move);
        move.x = charcoord.x - i;
        move.y = charcoord.y + i;
        setMove(move);
        move.x = charcoord.x + i;
        move.y = charcoord.y - i;
        setMove(move);
      }

      // // Ось x+
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.x = charcoord.x + i;
      //   move.y = charcoord.y;
      //   if (move.x > 7) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Ось x-
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.x = charcoord.x - i;
      //   move.y = charcoord.y;
      //   if (move.x < 0) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Ось y-
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y - i;
      //   move.x = charcoord.x;
      //   if (move.y < 0) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Ось y+
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y + i;
      //   move.x = charcoord.x;
      //   if (move.y > 7) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Диагональ x+ y+
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y + i;
      //   move.x = charcoord.x + i;
      //   if (move.y > 7 || move.x > 7) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Диагональ x- y-
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y - i;
      //   move.x = charcoord.x - i;
      //   if (move.y < 0 || move.x < 0) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Диагональ x+ y-
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y - i;
      //   move.x = charcoord.x + i;
      //   if (move.y < 0 || move.x > 7) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // // Диагональ x- y+
      // for (let i = 1; i <= selectedCharacter.character.move; i += 1) {
      //   const move = {};
      //   move.y = charcoord.y + i;
      //   move.x = charcoord.x - i;
      //   if (move.y > 7 || move.x < 0) break;
      //   const gameMove = this.coords.findIndex((n) => n.x === move.x && n.y === move.y);
      //   console.log(gameMove);
      //   gameMoves.push(gameMove);
      // }
      // console.log(gameMoves);
    }

    // const left = [];
    // const right = [];
    // const top = [];
    // const bottom = [];
    // for (let i = 0; i < this.boardSize; i += 1) {
    //   top.push(i);
    //   left.push(i * this.boardSize);
    //   right.push(i * (this.boardSize) + (this.boardSize - 1));
    //   bottom.push((this.boardSize ** 2) - 1 - (this.boardSize - 1 - i));
    // }

    // console.log(left);
    // console.log(right);
    // console.log(top);
    // console.log(bottom);
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.team.find((i) => i.position === index)) {
      this.hideCellTooltip(index);
    }
  }

  setTwoDimensionalBoard() {
    this.gamePlay.coords = [];
    for (let y = 0; y < this.gamePlay.boardSize; y += 1) {
      for (let x = 0; x < this.gamePlay.boardSize; x += 1) {
        const cell = {};
        cell.x = x;
        cell.y = y;
        this.gamePlay.coords.push(cell);
      }
    }
  }
}
