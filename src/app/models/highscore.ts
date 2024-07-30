export class HighScore {
  alias: string;
  score: number;
  gametype: number;

  constructor(alias: string, score: number, gametype: number) {
    this.alias = alias;
    this.score = score;
    this.gametype = gametype;
  }
}
