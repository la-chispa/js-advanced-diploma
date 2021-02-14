import themes from './themes';
import { generateTeam } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Vampire from './Vampire';
import Undead from './Undead';
import Magician from './Magician';
import Daemon from './Daemon';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const userChars = [Bowman, Swordsman];
    const aiChars = [Vampire, Undead];
    this.gamePlay.userCharacters = [Bowman, Swordsman, Magician];
    this.gamePlay.aiCharacters = [Vampire, Undead, Daemon];
    this.gamePlay.team = generateTeam(userChars, 1, 2).concat(generateTeam(aiChars, 1, 2));
    this.gamePlay.redrawPositions(this.gamePlay.team);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const position = this.team.find((i) => i.position === index);
    if (position) {
      const message = `\u{1F396}${position.character.level} \u{2694}${position.character.attack} \u{1F6E1}${position.character.defence} \u{2764}${position.character.health}`;
      this.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.team.find((i) => i.position === index)) {
      this.hideCellTooltip(index);
    }
  }
}
