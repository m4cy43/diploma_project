require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const { performance } = require("perf_hooks");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");

// Worker threads
if (isMainThread) {
  module.exports = async function returnOrderedSimilarities(
    subject,
    similarities
  ) {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { subject, similarities },
      });
      worker.on("message", resolve);
      worker.on("error", reject);
      worker.on("exit", (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  (async () => {
    const { subject, similarities } = workerData;

    let scores = [];
    let cords = [];
    // Embed a dictionary of a query and responses
    const input = {
      queries: subject,
      responses: similarities,
    };

    const timeStart = performance.now();

    // Load the model
    const model = await use.loadQnA();
    const embeddings = await model.embed(input);
    const embed_query = await embeddings["queryEmbedding"].array();
    const embed_responses = await embeddings["responseEmbedding"].array();

    // compute the dotProduct of each query and response pair
    for (let i = 0; i < input["queries"].length; i++) {
      for (let j = 0; j < input["responses"].length; j++) {
        scores.push(dotProduct(embed_query[i], embed_responses[j]));
        cords.push({ q: i, r: j });
      }
    }

    // Sorting results to get the order of sorting recommended books
    const keys = Array.from(scores.keys()).sort(
      (a, b) => scores[b] - scores[a]
    );

    const sortedScores = keys.map((i) => scores[i]);
    const sortedCords = keys.map((i) => cords[i]);

    const sortedSimilarities = [
      ...new Set(sortedCords.map((x) => similarities[x.r])),
    ];
    const order = [...new Set(sortedCords.map((x) => x.r))];

    const timeEnd = performance.now();
    const returnObj = {
      scores: sortedScores,
      similarities: sortedSimilarities,
      order: order,
      analyseTime: timeEnd - timeStart,
    };
    parentPort.postMessage(returnObj);
  })();
}

// Examples of dotProduct and zipWith functions from documentations on NPM
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

// module.exports = { returnOrderedSimilarities };
