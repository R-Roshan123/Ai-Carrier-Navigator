// Shuffle options per attempt so the correct answer's position can't be memorised.
export const shuffleOptions = (questions) =>
  questions.map((question) => {
    const order = question.options.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { ...question, options: order.map((index) => question.options[index]), answer: order.indexOf(question.answer) };
  });
