export const calStat = (scores: number[], totalStudent: number) => {
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  // calculate Mean
  const mean = scores.reduce((a, b) => a + b, 0) / totalStudent;

  // calculate Median
  let median = 0;
  const middle = (totalStudent + 1) / 2;
  if (totalStudent % 2 === 0) {
    const lwMid = scores[Math.floor(middle) - 1];
    const upMid = scores[Math.ceil(middle) - 1];
    median = (lwMid + upMid) / 2;
  } else {
    median = scores[middle - 1];
  }

  // calculate SD
  let sd = 0;
  let x = 0;
  scores.map((e) => (x += Math.pow(e - mean, 2)));
  sd = Math.sqrt(x / totalStudent);
  const Q1 = (totalStudent + 1) / 4 - 1;
  const Q3 = (3 * (totalStudent + 1)) / 4 - 1;
  const baseQ1 = Math.floor(Q1);
  const baseQ3 = Math.floor(Q3);

  // calculate Upper Quartile Q3
  let temp = Number(scores[baseQ3]?.toFixed(2));
  if (baseQ3 + 1 < scores.length) {
    temp = temp + (Q3 - baseQ3) * (scores[baseQ3 + 1] - scores[baseQ3]);
  }
  const q3 = temp;

  // calculate Lower Quartile Q1
  const q1 =
    scores[baseQ1] + (Q1 - baseQ1) * (scores[baseQ1 + 1] - scores[baseQ1]);

  return {
    mean: mean,
    sd: sd,
    median: median,
    maxScore,
    minScore,
    q1: q1,
    q3: q3,
  };
};

export const generateBellCurveData = (
  mean: number,
  sd: number,
  fullScore: number
): { x: number; y: number }[] => {
  const numPoints = 100;
  const step = fullScore / (numPoints - 1);
  const bellCurveData = [];

  for (let i = 0; i < numPoints; i++) {
    const x = i * step;
    const y =
      (1 / (sd * Math.sqrt(2 * Math.PI))) *
      Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2)));
    bellCurveData.push({ x, y });
  }

  return bellCurveData;
};
