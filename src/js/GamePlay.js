import { calcHealthLevel, calcTileType, calcCoords } from './utils';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach((o) => o.call(this, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach((o) => o.call(this, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(this, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    // debugger;
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  // Расчёт допустимых ходов персонажа
  setCharMoves(character) {
    const charcoord = this.coords[character.position];
    const moves = [];
    for (let i = 1; i <= character.character.move; i += 1) {
      const calc = calcCoords(charcoord, i);
      // const calc = [
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y,
      //   },
      //   {
      //     x: charcoord.x,
      //     y: charcoord.y + i,
      //   },
      //   {
      //     x: charcoord.x,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y + i,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y + i,
      //   },
      // ];
      const setMove = (coords) => {
        if (coords.x > 7 || coords.x < 0 || coords.y > 7 || coords.y < 0) {
          return;
        }
        const gameMove = this.coords.findIndex((n) => n.x === coords.x && n.y === coords.y);
        moves.push(gameMove);
      };
      calc.forEach((o) => setMove(o));
    }
    return moves;
  }

  setCharAttacks(character) {
    const charcoord = this.coords[character.position];
    const attacks = [];
    for (let i = 1; i <= character.character.range; i += 1) {
      const calc = calcCoords(charcoord, i);
      // const calc = [
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y,
      //   },
      //   {
      //     x: charcoord.x,
      //     y: charcoord.y + i,
      //   },
      //   {
      //     x: charcoord.x,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y + i,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x + i,
      //     y: charcoord.y - i,
      //   },
      //   {
      //     x: charcoord.x - i,
      //     y: charcoord.y + i,
      //   },
      // ];
      const setAttack = (coords) => {
        if (coords.x > 7 || coords.x < 0 || coords.y > 7 || coords.y < 0) {
          return;
        }
        const charAttack = this.coords.findIndex((n) => n.x === coords.x && n.y === coords.y);
        attacks.push(charAttack);
      };
      calc.forEach((o) => setAttack(o));
    }
    return attacks;
  }

  // ai() {
  //   // debugger;
  //   const aiTeam = [];
  //   this.team.characters.forEach((i) => {
  //     if (i.player === 'ai') {
  //       aiTeam.push(i);
  //     }
  //   });
  //   console.log(aiTeam);
  //   const active = aiTeam[Math.floor(Math.random() * (aiTeam.length - 0)) + 0];
  //   console.log(active);
  //   this.selectCell(active.position);
  //   this.team.charMoves = this.setCharMoves(active);
  //   this.team.charAttacks = this.setCharAttacks(active);
  //   console.log(this.team.charMoves);
  //   console.log(this.team.charAttacks);
  //   // const targets = [];
  //   // this.team.characters.forEach((i) => {
  //   //   if (this.team.charAttacks.includes(i.position) && i.player === 'user') {
  //   //     targets.push(i);
  //   //   }
  //   // });
  //   const target = this.team.characters.find((i) => this.team.charAttacks.includes(i.position) && i.player === 'user');
  //   // console.log(target);
  //   if (target) {
  //     console.log(target.position);
  //     const damage = Math.max(active.character.attack - target.character.defence, active.character.attack * 0.1);
  //     this.showDamage(target.position, damage).then();
  //     target.character.health -= damage;
  //     if (target.character.health <= 0) {
  //       this.team.characters.splice(this.team.characters.indexOf(target), 1);
  //     }
  //     this.deselectCell(active.position);
  //     this.redrawPositions(this.team.characters);
  //     this.team.activePlayer = 'user';
  //   } else {
  //     const move = this.team.charMoves[Math.floor(Math.random() * (this.team.charMoves.length - 1)) + 1];
  //     // console.log(move);
  //     this.deselectCell(active.position);
  //     active.position = move;
  //     this.redrawPositions(this.team.characters);
  //     this.team.activePlayer = 'user';
  //   }
  //   // const target = this.team.characters.find((i) => i.position )

  //   // Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  // }
}
