import path from 'path'

export const DIR = {
  SAMPLE: path.join(__dirname, '../data/samples/'),
  CHECKSAMPLE: path.join(__dirname, '../data/check-samples/'),
  MODEL: path.join(__dirname, '../data/models/'),
}

export const FILE = {
  EXT: '.json',
  SAMPLE: (name: string) => DIR.SAMPLE + `${name}.json`,
  CHECKSAMPLE: (name: string) => DIR.CHECKSAMPLE + `${name}.json`,
  MODEL: (name: string) => DIR.MODEL + `${name}.json`,
}