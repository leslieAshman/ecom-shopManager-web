/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';
import { TFunction } from 'react-i18next';
import { ObjectType } from '../types/commonTypes';
import * as uuid from 'uuid';

export const roundNumber2 = (num: number, scale = 2) => {
  if (Math.round(num) !== num) {
    // if (Math.pow(0.1, scale) > num) {
    //   return 0;
    // }
    const sign = Math.sign(num);
    const arr = ('' + Math.abs(num)).split('.');
    if (arr.length > 1) {
      if (arr[1].length > scale) {
        const integ = +arr[0] * Math.pow(10, scale);
        let dec = integ + (+arr[1].slice(0, scale) + Math.pow(10, scale));
        const proc = +arr[1].slice(scale, scale + 1);
        if (proc >= 5) {
          dec = dec + 1;
        }
        dec = (sign * (dec - Math.pow(10, scale))) / Math.pow(10, scale);
        return dec;
      }
    }
  }
  return num;
};

export const roundNumber = (num: number, scale = 2) => {
  if (!('' + num).includes('e')) {
    return +(Math.round((num + 'e+' + scale) as any) + 'e-' + scale);
  } else {
    const arr = ('' + num).split('e');
    let sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    const i = +arr[0] + 'e' + sig + (+arr[1] + scale);
    const j = Math.round(i as any);
    const k = +(j + 'e-' + scale);
    return k;
  }
};

// These options are needed to round to whole numbers if that's what you want.
// minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
// maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const currencyFormatter = (locale = 'en-GB', currencyCode = 'GBP') => {
  const mFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  });
  return {
    format: (value: number) => mFormatter.format(roundNumber(value)),
  };
};

export const formatter = currencyFormatter();

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isNull = (arg: unknown): arg is null => {
  return arg === null;
};

export const buildDisplayText = <T extends string>(
  keys: T[],
  translationPrefix: string,
  t: TFunction<'translation', undefined>,
  isCapitialisedFirstLeter = true,
): Record<string, string> =>
  keys.reduce((TResult, key) => {
    //the value of key is relative to the namespace specified by translationPrefix, but there are instance when we want to use a different namespace hence the following conditional check
    const translation = /(:)/.test(key) ? t(`${key}`) : t(`${translationPrefix}.${key}`);
    const result = translation && isCapitialisedFirstLeter ? capitalizeFirstLetter(translation) : translation;
    return { ...TResult, [key]: result !== undefined ? result : key };
  }, {});

export const sortItems = <T>(items: T[], isAscending: boolean, prop: keyof T): T[] => {
  return isAscending
    ? items.sort((a, b) => (a[prop] > b[prop] ? 1 : b[prop] > a[prop] ? -1 : 0))
    : items.sort((a, b) => (a[prop] < b[prop] ? 1 : b[prop] < a[prop] ? -1 : 0));
};

export const toInternalId = (str: string) => str.replace(/[ ,]/g, '').toLowerCase().trim();

export const uniqueItems = <T>(array: T[], key?: keyof T) => {
  if (key) return [...new Map(array.map((item) => [item[key], item])).values()];
  return [...new Map(array.map((item) => [item, item])).values()];
};

export const randomNumberBetween = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const calculateSum = (array: number[]) => array.reduce((partialSum, num) => partialSum + num, 0);
export const sumBy = <T>(data: T[], prop: keyof T): number => {
  return calculateSum(data.map((x) => x[prop] as number));
};

export const getRange = (length: number): number[] => {
  return Array.from({ length }, (x, i) => i);
};

export const getRandomChartData = () => {
  return getRange(20).map(() => randomNumberBetween(1, 1000));
};

export const toNumeric = (value: string, isPhone = false) => {
  let result = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
  if (!isPhone) result = result.replace(/^0[^.]/, '0');

  return result;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function randomDate(start: string, end: string, format = 'YYYY-MM-DD') {
  const startDate = moment(start, format).toDate();
  const endDate = moment(end, format).toDate();
  return moment(new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))).format(
    format,
  );
}

export const toChartXYPoint = <DataType>(
  source: DataType[],
  xProp?: keyof DataType,
  yProp?: keyof DataType,
  includeData = true,
) =>
  source.map((datePoint) => {
    const result: { x: string; y: unknown; data?: DataType } = { x: `${datePoint}`, y: datePoint };
    if (xProp) {
      result.x = `${datePoint[xProp]}`;
    }

    if (yProp) {
      result.y = datePoint[yProp];
    }
    if (includeData) {
      result.data = datePoint;
    }

    return { ...result };
  });

export const getRandomText = (wordCount = 10) => {
  const words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ];
  const text = [];
  let x = wordCount;
  while (--x) text.push(words[Math.floor(Math.random() * words.length)]);
  return text.join(' ');
};

export const pickRandom = <T>(arr: T[]): T => {
  return arr[randomNumberBetween(0, arr.length - 1)];
};

export const validateEmail = (email: string) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export const validatePassword = (
  value: string,
): { hasLetter: boolean; hasCapital: boolean; hasNumber: boolean; hasLength: boolean; isValid: boolean } => {
  const status = {
    hasLetter: false,
    hasCapital: false,
    hasNumber: false,
    hasLength: false,
  };

  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (value.match(lowerCaseLetters)) {
    status.hasLetter = true;
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (value.match(upperCaseLetters)) {
    status.hasCapital = true;
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if (value.match(numbers)) {
    status.hasNumber = true;
  }
  // Validate length
  status.hasLength = value.length >= 8;
  return {
    ...status,
    isValid: Object.keys(status).filter((x) => status[x as keyof typeof status] === false).length === 0,
  };
};
export const validatePhoneNumber = (phoneNumber: string) => {
  // eslint-disable-next-line no-useless-escape
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber);
};

/*!
 * Find the differences between two objects and push to a new object
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */
export const diff = (obj1: ObjectType, obj2: ObjectType) => {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }

  //
  // Variables
  //

  const diffs = {} as ObjectType;
  let key;

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  const arraysMatch = (arr1: unknown[], arr2: unknown[]) => {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  const compare = (item1: any, item2: any, keyIn: string) => {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[keyIn] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[keyIn] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[keyIn] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[keyIn] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[keyIn] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[keyIn] = item2;
      }
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};

export const diffKeys = (obj1: ObjectType, obj2: ObjectType) => {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }
  const diffs = {} as ObjectType;

  const compare = (item1: any, item2: any, keyIn: string) => {
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // If items are different types
    if (type1 !== type2) {
      diffs[keyIn] = null;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diffKeys(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[keyIn] = objDiff;
      }
      return;
    }
  };

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  const notInKey2 = keys1.filter((x: string) => !keys2.includes(x));
  const notInKey1 = keys2.filter((x: string) => !keys1.includes(x));

  [...notInKey2, ...notInKey1].forEach((x: string) => {
    diffs[x] = null;
  });

  const keysThatExist = keys1.filter((x: string) => keys2.includes(x));

  // Loop through the first object: string
  keysThatExist.forEach((x) => {
    compare(obj1[x], obj2[x], x);
  });

  // Return the object of differences
  return diffs;
};

// export const getUUID = () => {
//   let d = new Date().getTime();
//   const uuid = 'axxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = (d + Math.random() * 16) % 16 | 0;
//     d = Math.floor(d / 16);
//     return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
//   });
//   return uuid;
// };

export const getUUID = () => uuid.v4().toString();
