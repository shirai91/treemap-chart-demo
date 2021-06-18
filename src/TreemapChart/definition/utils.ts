// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
function flatten(input: any) {
  const stack = [...input];
  const res = [];
  while (stack.length) {
    // pop value from stack
    const next = stack.pop();
    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // reverse to restore input order
  return res.reverse();
}

function group(values: any, grp: any, key: any, mainGrp: any, mainValue: any) {
  var tmp = Object.create(null);
  var data = Object.create(null);
  var ret: any = [];
  var g, i, n, v;
  for (i = 0, n = values.length; i < n; ++i) {
    v = values[i];
    if (mainGrp && v[mainGrp] !== mainValue) {
      continue;
    }
    g = v[grp] || '';
    if (!(g in tmp)) {
      tmp[g] = 0;
      data[g] = [];
    }
    tmp[g] += +v[key];
    data[g].push(v);
  }

  Object.keys(tmp).forEach(function (k) {
    v = { children: data[k] } as any;
    v[key] = +tmp[k];
    v[grp] = k;
    if (mainGrp) {
      v[mainGrp] = mainValue;
    }
    ret.push(v);
  });

  return ret;
}

function isObject(obj: any) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}

function index(values: any, key: any) {
  var n = values.length;
  var i, obj;

  if (!n) {
    return key;
  }

  obj = isObject(values[0]);
  key = obj ? key : 'v';

  for (i = 0, n = values.length; i < n; ++i) {
    if (obj) {
      values[i]._idx = i;
    } else {
      values[i] = { v: values[i], _idx: i };
    }
  }
  return key;
}

function sort(values: any, key: any) {
  if (key) {
    values.sort(function (a: any, b: any) {
      return +b[key] - +a[key];
    });
  } else {
    values.sort(function (a: any, b: any) {
      return +b - +a;
    });
  }
}

function sum(values: any, key: any) {
  var s, i, n;

  for (s = 0, i = 0, n = values.length; i < n; ++i) {
    s += key ? +values[i][key] : +values[i];
  }

  return s;
}

const exportedUtils = {
  flatten: flatten,
  group: group,
  index: index,
  isObject: isObject,
  sort: sort,
  sum: sum,
};

export default exportedUtils;
