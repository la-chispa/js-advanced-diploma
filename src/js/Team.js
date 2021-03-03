export default class Team {
  constructor(user, ai) {
    this.characters = user.concat(ai);
    this.activePlayer = 'user';
    this.charMoves = [];
    this.charAttacks = [];
  }
}
