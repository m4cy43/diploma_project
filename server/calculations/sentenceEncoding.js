require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const { performance } = require("perf_hooks");

const returnOrderedSimilarities = async (subject, similarities) => {
  let scores = [];

  // Load the model
  return use.loadQnA().then((model) => {
    const timeStart = performance.now();

    // Embed a dictionary of a query and responses
    const input = {
      queries: [subject],
      responses: similarities,
    };

    const embeddings = model.embed(input);

    const embed_query = embeddings["queryEmbedding"].arraySync();
    const embed_responses = embeddings["responseEmbedding"].arraySync();

    // compute the dotProduct of each query and response pair
    for (let i = 0; i < input["queries"].length; i++) {
      for (let j = 0; j < input["responses"].length; j++) {
        scores.push(dotProduct(embed_query[i], embed_responses[j]));
      }
    }

    const keys = Array.from(scores.keys()).sort(
      (a, b) => scores[b] - scores[a]
    );

    const sortedScores = keys.map((i) => scores[i]);
    const sortedSimilarities = keys.map((i) => similarities[i]);

    const timeEnd = performance.now();
    return {
      scores: sortedScores,
      similarities: sortedSimilarities,
      analyseTime: timeEnd - timeStart,
    };
  });
};

// Calculate the dot product of two vector arrays
const dotProduct = (xs, ys) => {
  const sum = (xs) => (xs ? xs.reduce((a, b) => a + b, 0) : undefined);

  return xs.length === ys.length
    ? sum(zipWith((a, b) => a * b, xs, ys))
    : undefined;
};

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith = (f, xs, ys) => {
  const ny = ys.length;
  return (xs.length <= ny ? xs : xs.slice(0, ny)).map((x, i) => f(x, ys[i]));
};

module.exports = { returnOrderedSimilarities };
