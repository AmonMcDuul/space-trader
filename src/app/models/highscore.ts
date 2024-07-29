export class HighScore {
  alias: string;
  score: number;
  gametypeState: number;

  constructor(alias: string, score: number, gametypeState: number) {
    this.alias = alias;
    this.score = score;
    this.gametypeState = gametypeState;
  }
}
