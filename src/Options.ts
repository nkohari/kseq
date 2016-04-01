import {defaults} from 'lodash';
import {Storage} from './Storage';

export interface Options<T> {
  startingWidth?: number
  maxDistance?: number
  storage?: Storage<T>
}

export function Options<T>(options: Options<T>): Options<T> {
  return defaults(options, {
    startingWidth: 16,
    maxDistance: 10
  });
}
