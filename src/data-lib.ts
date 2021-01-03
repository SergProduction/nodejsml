
export const objMap = <A, B>(
  obj: Record<string, A>,
  fn: (k: string, v: A) => B
): Record<string, B> => (
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => ([
      k,
      fn(k, v)
    ]))
  )
)

export const objForEach = <A>(
  obj: Record<string, A>,
  fn: (k: string, v: A) => void
): void => {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] 
    fn(key, obj[key])
  }
}


export const objLen = (obj: Record<string, any>): number => {
  return Object.keys(obj).length;
};


export const sum = (arr: number[]) => arr.reduce((acc, p) => acc + p, 0)
export const product = (arr: number[]) => arr.reduce((acc, p) => acc * p, 0.00001)


/*
считает кол-во одинаковых строк в массиве
*/
export class Counter {
  target: Record<string, number>

  constructor(target?: Record<string, number>) {
    this.target = target || {} // Object.create(null)
  }

  static fromArray(arr: string[]): Counter {
    const target: Record<string, number> = {}
    arr
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        if (target[key]) {
          target[key] = target[key] + 1;
        } else {
          target[key] = 1;
        }
      })

    return new Counter(target)
  }

  toObject() {
    return this.target
    // .sort(([k0,v0], [k1,v1]) => v0 > v1 ? 1 : 0 )
    // .reduce((acc, [k,v]) => ({ ...acc, [k]: v}), {})
  }

  set(key: string, count: number) {
    this.target[key] = count
  }

  count(key: string): number {
    return this.target[key] || 0
  }

  len(): number {
    return Object.keys(this.target).length
  }

  // immutable
  map(fn: (key: string, count: number, len: number) => number): Counter {
    const objectCounter: Record<string, number> = {}
    this.forEach((key, count, len) => {
      objectCounter[key] = fn(key, count, len)
    })
    return new Counter(objectCounter)
  }

  // iter
  forEach(fn: (key: string, count: number, len: number) => void): void {
    const len = this.len()
    Object.entries(this.target).forEach(([key, count]) => {
      fn(key, count, len)
    })
  }

  // immutable
  concat(counter: Counter): Counter {
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

  // mutable
  extend(counter: Counter): Counter {
    counter.forEach((key, count) => {
      this.target[key] = this.target[key]
        ? this.target[key] + count
        : count
    })
    return this
  }
}
