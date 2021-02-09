import themes from './themes';
import { generateTeam } from './generators';
import Bowman from './Bowman';
import Swordsman from './Swordsman';
import Vampire from './Vampire';
import Undead from './Undead';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    const userCharacters = [Bowman, Swordsman];
    const aiCharacters = [Vampire, Undead];
    const team = generateTeam(userCharacters, 1, 2).concat(generateTeam(aiCharacters, 1, 2));
    this.gamePlay.redrawPositions(team);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
