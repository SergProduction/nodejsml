// --- lib ---

const objMap = <A, B>(
  obj: Record<string, A>,
  fn: (k: string, v: A) => B,
): Record<string, B> => {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: fn(k, v) }),
    {} as Record<string, B>,
  );
};

const objLen = (obj: Record<string, any>): number => {
  return Object.keys(obj).length;
};

// --- parse weigth ---

const getTokens = (doc: string): string[] => {
  return doc.split(/\s+/);
};

type World = string;
type DictTF = Record<World, number>;

type CalcFn = (tf: number, all: number) => number;

const calcWeightDoc: CalcFn = (tf, all) => 1;
const calcWeightCorpus: CalcFn = (tf, all) => tf;

const calcWeight = (freqDict: DictTF, calcFn: CalcFn) =>
  objMap(freqDict, (k, v) => calcFn(v, objLen(freqDict)));

const docTF = (doc: string): DictTF => {
  const tokens = getTokens(doc);
  const freqTok: DictTF = {};
  tokens.forEach((t) => {
    if (freqTok[t]) {
      freqTok[t] = freqTok[t] + 1;
    } else {
      freqTok[t] = 1;
    }
  });
  return calcWeight(freqTok, calcWeightDoc);
};

type CorpusTF = Record<World, number>;

const corpusTF = (corpus: string[]): CorpusTF => {
  const docsFreq = corpus.map((doc) => docTF(doc));
  const corpusFreq: DictTF = {};
  docsFreq.forEach((docFreq) => {
    Object.keys(docFreq).forEach((docWorld) => {
      if (corpusFreq[docWorld]) {
        corpusFreq[docWorld] = corpusFreq[docWorld] + docFreq[docWorld];
      } else {
        corpusFreq[docWorld] = docFreq[docWorld];
      }
    });
  });
  return calcWeight(corpusFreq, calcWeightCorpus);
};

// corpusTF(hsCorpus);

export type Label = string;
export type LabeledDocs = Record<Label, string[]>;
export type CorpusesTF = Record<Label, CorpusTF>;
// state = {[key: label]: CorpusesTF}

export const corpusesFreq = (corpuses: LabeledDocs): CorpusesTF => {
  const corpusesTF: CorpusesTF = {};
  Object.keys(corpuses).forEach((label) => {
    corpusesTF[label] = corpusTF(corpuses[label]);
  });
  return corpusesTF;
};

export const getTop = (corpusesTF: CorpusesTF, count: number) => {
  const filtredCorpusesTF: CorpusesTF = {};
  Object.keys(corpusesTF).forEach((label) => {
    const corpusTF = corpusesTF[label];
    filtredCorpusesTF[label] = Object.fromEntries(
      Object.entries(corpusTF)
        .sort(([k1, v1], [k2, v2]) => v2 - v1) // 99,98,97
        .slice(0, count),
    );
  });
  return filtredCorpusesTF;
};

export class Parse {
  state: {[label: string]: {
    docCount: number,
    tf: CorpusTF
  }}

  constructor(state: CorpusesTF = {}) {
    this.state = {}
  }

  getState() {
    return this.state;
  }

  /* 
  add(p: Parse) {
    Object.keys(p.state).forEach((label) => {
      this.merge(label, p.state[label]);
    });
  } */

  push(label: string, corpus: string[]) {
    const result = corpusTF(corpus);
    this.merge(label, result, corpus.length);
  }

  merge(label: string, corpusTF: CorpusTF, docCount: number) {
    const acc = this.state[label];
    if (acc) {
      acc.docCount += docCount
      acc.tf = objMap(
        acc.tf,
        (k, v) => corpusTF[k]
          ? v + corpusTF[k]
          : v,
      );
    } else {
      this.state[label] = {
        docCount,
        tf: corpusTF
      }
    }
  }

  print() {}

  predictLabel(doc: string) {
    const docTok = getTokens(doc);
    
    const labelsMap = Object.keys(this.state).map((label) => {
      return {
        label,
        weigth: docTok.map((word) => ({
          word,
          tf: this.state[label].tf[word] || 0
        }))
      }
    });

/*
    labelsMap.forEach((doc) => {
      console.log(
        doc.label,
        this.state[doc.label].docCount,
        sum(doc.weigth.map(p => p.tf)),
        sum(doc.weigth.map(p => p.tf)) / this.state[doc.label].docCount
      );
    })
*/

    const productLabels = labelsMap.map((doc) => ({
      label: doc.label,
      // docCount: this.state[doc.label].docCount,
      // pp: sum(doc.weigth.map(p => p.tf)),
      product:
        sum(doc.weigth.map(p => p.tf)) / this.state[doc.label].docCount
    })).sort((a, b) => b.product - a.product)

    console.log({ productLabels });

    // const result = productLabels.reduce((p, n) => p > n ? p : n);

    return;
  }
}

const sum = (arr: number[]) => arr.reduce((acc, p) => acc + p, 0)
const product = (arr: number[]) => arr.reduce((acc, p) => acc * p, 0.00001)