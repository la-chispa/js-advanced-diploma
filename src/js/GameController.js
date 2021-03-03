import themes from './themes';
import cursors from './cursors';
import { generateTeam } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import Daemon from './Daemon';
import GamePlay from './GamePlay';
import Team from './Team';

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
    this.gamePlay.redrawPositions(this.setTeam());
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    console.log(this);
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.team.activePlayer === 'user') {
      const position = this.team.characters.find((i) => i.position === index);
      const userChar = this.team.characters.find((i) => i.position === index && i.player === 'user');
      const selectedCharIndex = this.cells.findIndex((i) => i.classList.contains('selected-yellow'));
      const selectedChar = this.team.characters.find((i) => i.position === selectedCharIndex);
      const aiChar = this.team.characters.find((i) => i.position === index && i.player === 'ai');
      if (userChar) {
        this.selectCell(index);
        this.team.charMoves = this.setCharMoves(userChar);
        this.team.charAttacks = this.setCharAttacks(userChar);
      }
      if (selectedChar && userChar) {
        this.deselectCell(selectedChar.position);
        this.selectCell(index);
      }
      if (selectedChar && this.team.charMoves.includes(index)) {
        this.selectCell(index, 'green');
      }
      if ((!selectedChar && !userChar)) {
        GamePlay.showError('There is no your character in this cell');
      }
      if (selectedChar && !position && this.team.charMoves.includes(index)) {
        this.deselectCell(selectedChar.position);
        this.deselectCell(index);
        selectedChar.position = index;
        this.redrawPositions(this.team.characters);
        // this.team.activePlayer = 'ai';
      }
      if (selectedChar && aiChar && this.team.charAttacks.includes(index)) {
        const attacker = selectedChar.character;
        const target = aiChar.character;
        const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
        this.showDamage(index, damage).then();
        target.health -= damage;
        if (target.health <= 0) {
          this.team.characters.splice(this.team.characters.indexOf(aiChar), 1);
        }
        this.deselectCell(selectedChar.position);
        this.redrawPositions(this.team.characters);
        // this.team.activePlayer = 'ai';
      }
    }
    // if (this.team.activePlayer === 'ai') {
    //   this.ai();
    // }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const position = this.team.characters.find((i) => i.position === index);
    const userChar = this.team.characters.find((i) => i.position === index && i.player === 'user');
    const selectedCharIndex = this.cells.findIndex((i) => i.classList.contains('selected-yellow'));
    const selectedChar = this.team.characters.find((i) => i.position === selectedCharIndex);
    const aiChar = this.team.characters.find((i) => i.position === index && i.player === 'ai');
    if (position) {
      const message = `\u{1F396}${position.character.level} \u{2694}${position.character.attack} \u{1F6E1}${position.character.defence} \u{2764}${position.character.health}`;
      this.showCellTooltip(message, index);
    }
    if (this.team.activePlayer === 'user') {
      if (!selectedChar && userChar) {
        this.setCursor(cursors.pointer);
      } else if (!selectedChar) {
        this.setCursor(cursors.auto);
      } else if (selectedChar && userChar) {
        this.setCursor(cursors.pointer);
      } else if (selectedChar && aiChar && this.team.charAttacks.includes(index)) {
        this.selectCell(index, 'red');
        this.setCursor(cursors.crosshair);
      } else if (selectedChar && !position && this.team.charMoves.includes(index)) {
        this.selectCell(index, 'green');
        this.setCursor(cursors.pointer);
      } else {
        this.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const position = this.team.characters.find((i) => i.position === index);
    const userChar = this.team.characters.find((i) => i.position === index && i.player === 'user');
    const selectedCharIndex = this.cells.findIndex((i) => i.classList.contains('selected-yellow'));
    const selectedChar = this.team.characters.find((i) => i.position === selectedCharIndex);
    const aiChar = this.team.characters.find((i) => i.position === index && i.player === 'ai');
    if (position) {
      this.hideCellTooltip(index);
    }
    if (this.cells[index].classList.contains('selected-green')) {
      this.deselectCell(index);
    }
    if (this.cells[index].classList.contains('selected-red')) {
      this.deselectCell(index);
    }
  }

  setTeam() {
    const userChars = [Bowman, Swordsman];
    const aiChars = [Vampire, Undead];
    this.gamePlay.team = new Team(generateTeam(userChars, 1, 2), generateTeam(aiChars, 1, 2));
    return this.gamePlay.team.characters;
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
