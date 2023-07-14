export class HeuristicClassifier {
  constructor(categories) {
    this.categories = categories;
    this.name = 'heuristic';
  }

  async execute(inputs) {
    const { url, openGraph, contentText } = inputs;
    const answer = [];
  }
}
