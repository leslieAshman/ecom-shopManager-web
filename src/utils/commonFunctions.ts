// import moment from 'moment';

// function NewGuidFunc() {
//   function s4() {
//     return Math.floor((1 + Math.random()) * 0x10000)
//       .toString(16)
//       .substring(1);
//   }
//   return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
// }

// // function getItemById<T,>(arr: T[], itemId, $filter) {
// //   const itmArr = $filter('filter')(
// //     arr,
// //     {
// //       Id: parseInt(itemId),
// //     },
// //     true,
// //   );
// //   return itmArr != null ? itmArr[0] : {};
// // }

// // function getItemByName(arr, itemName, $filter) {
// //   const itmArr = $filter('filter')(
// //     arr,
// //     {
// //       Name: itemName,
// //     },
// //     true,
// //   );
// //   return itmArr != null ? itmArr : {};
// // }

// function FormatNumberWithCommas(x: number) {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }

// function randomDate(start: Date, end: Date) {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//   //randomDate(new Date(2012, 0, 1), new Date())
// }

// function FormatMoney(x: any) {
//   return x.formatMoney(2);
// }

// function GetItemFunc<T>(arr: T[], val: unknown, idPropertyName: keyof T) {
//   return arr.find((x) => x[idPropertyName] === val);
// }

// function GetItemIndex<T extends { [key: string]: unknown }>(arr: T[], val: string, propertyName: keyof T): number {
//   for (let i = 0; i < arr.length; i = i + 1) {
//     if (arr[i][propertyName] === val) {
//       return i;
//     }
//   }
//   return -1;
// }

// // const waitUntil = (condition, callback, checkFrequencyInSeconds = 1) => {
// //   const waitUntilLoad = Rx.Observable.interval(checkFrequencyInSeconds * 1000).subscribe(() => {
// //     if (condition()) {
// //       waitUntilLoad.unsubscribe();
// //       _.delay(() => callback(), 100);
// //     }
// //   });
// // };

// function RemoveItem<T>(arr: T[], id: unknown, idPropertyName: keyof T) {
//   const item = GetItemFunc(arr, id, idPropertyName);
//   if (item !== undefined && item.length > 0) {
//     const index = arr.indexOf(item!);
//     arr.splice(index, 1);
//   }
// }

// function UpdateLabel(obj, id, prop, arr) {
//   const itm = getItems(arr, obj[id]);
//   obj[prop] = itm.Name;
// }

// function getItems(input, items, $filter) {
//   const elementIds = items.map(Number);
//   const output = $filter('filterArray')(input, elementIds);
//   return output != null ? output : [];
// }

// export function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// export const cLog = (text = 'TEXT EMPTY', obj = {}, bg = '#ff0000') => {
//   console.log('%c' + `${moment().format('HHmmss')}-${text}`, 'background:' + bg + '; color: #ffffff');
//   console.log(text, obj);
// };

// function Mutex() {
//   this._busy = false;
//   this._queue = [];
// }

// Mutex.prototype.synchronize = function (task) {
//   const self = this;

//   return new Promise(function (resolve, reject) {
//     self._queue.push([task, resolve, reject]);
//     if (!self._busy) self._dequeue();
//   });
// };

// Mutex.prototype._execute = function (record) {
//   const task = record[0],
//     resolve = record[1],
//     reject = record[2],
//     self = this;

//   task()
//     .then(resolve, reject)
//     .then(function () {
//       self._dequeue();
//     });
// };

// Mutex.prototype._dequeue = function () {
//   this._busy = true;
//   const next = this._queue.shift();

//   if (next) this._execute(next);
//   else this._busy = false;
// };
// export const getKey = (x) => `${x.shopId}${x._id}${(x.variations || []).map((z) => `${z.name}${z.value}`).join('_')}`;

// export const groupByArray = (
//   xs,
//   key,
//   initObj = [],
//   verFn = () => {
//     return true;
//   },
// ) => {
//   return xs.reduce(function (rv, x) {
//     const v = key instanceof Function ? key(x) : x[key];
//     const el = rv.find((r) => r && r.key === v);

//     if (verFn(x)) {
//       if (el) {
//         el.values.push(x);
//       } else {
//         rv.push({ key: v, values: [x] });
//       }
//     }
//     return rv;
//   }, initObj);
// };

export {};
