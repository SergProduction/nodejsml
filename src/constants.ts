import path from 'path'

export const DIR = {
  SAMPLE: path.join(__dirname, '../sample/'),
  CHECKSAMPLE: path.join(__dirname, '../check-sample/'),
  MODEL: path.join(__dirname, '../storage/'),
}

export const FILE = {
  EXT: '.json',
  SAMPLE: (name: string) => DIR.SAMPLE + `${name}.json`,
  CHECKSAMPLE: (name: string) => DIR.CHECKSAMPLE + `${name}.json`,
  MODEL: (name: string) => DIR.MODEL + `${name}.json`,
}