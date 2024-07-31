export class HighScore {
  alias: string;
  score: number;
  gameTypeState: number;

  constructor(alias: string, score: number, gameTypeState: number) {
    this.alias = alias;
    this.score = score;
    this.gameTypeState = gameTypeState;
  }
}
