import * as R from 'ramda';

const array2objects = data => {
  const parsed = {};
  let objectList;
  R.keysIn(data).forEach(key => {
    objectList = [];
    R.range(1, data[key].length).forEach(idx => {
      objectList.push(R.zipObj(data[key][0], data[key][idx]));
    });
    parsed[key] = objectList;
  });
  return parsed;
};

const parser = data => {
  const objects = array2objects(data);
  return objects;
};

export default parser;
