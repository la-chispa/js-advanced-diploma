import themes from './themes';
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
    this.gamePlay.redrawPositions(this.setTeam());
    this.gamePlay.team.activePlayer = 'user';
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
    // console.log(this);
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.team.activePlayer === 'user') {
      const position = this.team.characters.find((i) => i.position === index && i.player === 'user');
      const selectedCellIndex = this.cells.findIndex((i) => i.classList.contains('selected'));
      if (selectedCellIndex !== -1) {
        this.deselectCell(selectedCellIndex);
      }
      if (position) {
        this.team.characters.forEach((i) => this.deselectCell(i.position));
        this.selectCell(index);
      }
      if (selectedCellIndex === -1 && !position) {
        GamePlay.showError('There is no your character in this cell');
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const position = this.team.characters.find((i) => i.position === index);
    if (position) {
      const message = `\u{1F396}${position.character.level} \u{2694}${position.character.attack} \u{1F6E1}${position.character.defence} \u{2764}${position.character.health}`;
      this.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.team.characters.find((i) => i.position === index)) {
      this.hideCellTooltip(index);
    }
  }

  setTeam() {
    const userChars = [Bowman, Swordsman];
    const aiChars = [Vampire, Undead];
    this.gamePlay.team = new Team(generateTeam(userChars, 1, 2), generateTeam(aiChars, 1, 2));
    return this.gamePlay.team.characters;
  }
}
