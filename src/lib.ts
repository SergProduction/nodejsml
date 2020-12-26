export const objMap = <A, B>(
  obj: Record<string, A>,
  fn: (k: string, v: A) => B,
): Record<string, B> => {
  return Object.entries(obj).reduce(
    (acc, [k, v]) => ({ ...acc, [k]: fn(k, v) }),
    {} as Record<string, B>,
  );
};


export const objLen = (obj: Record<string, any>): number => {
  return Object.keys(obj).length;
};


export const sum = (arr: number[]) => arr.reduce((acc, p) => acc + p, 0)
export const product = (arr: number[]) => arr.reduce((acc, p) => acc * p, 0.00001)


export class Counter {
  target: Record<string, number>
  constructor(target?: Record<string, number>) {
    this.target = target || {} // Object.create(null)
  }

  static fromArray(arr: string[]) {
    const target: Record<string, number> = {}
    arr.forEach((key) => {
      if (target[key]) {
        target[key] = target[key] + 1;
      } else {
        target[key] = 1;
      }
    })
    return new Counter(target)
  }

  count(key: string): number {
    return this.target[key] || 0
  }
  
  len() {
    return Object.keys(this.target).length
  }

  map(fn: (key: string, count: number, len: number) => number) {
    const objectCounter: Record<string, number> = {}
    this.forEach((key, count, len) => {
      objectCounter[key] = fn(key, count, len)
    })
    return new Counter(objectCounter)
  }

  forEach(fn: (key: string, count: number, len: number) => void) {
    const len = this.len()
    objMap(this.target, (key, count) => fn(key, count, len))
  }

  merge(counter: Counter) {
    const fullTarget: Record<string, number> = {}
    const targets = [this.target, counter.target]
    targets.forEach((target) => {
      Object.entries(target).forEach(([key, count]) => {
        fullTarget[key] = fullTarget[key] !== undefined
          ? fullTarget[key] + count
          : count
      })
    })
    return new Counter(fullTarget)
  }
}
