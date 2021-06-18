const min = Math.min;
const max = Math.max;

function getStat(sa: any) {
  return {
    min: sa.min,
    max: sa.max,
    sum: sa.sum,
    nmin: sa.nmin,
    nmax: sa.nmax,
    nsum: sa.nsum,
  };
}

function getNewStat(sa: any, o: any) {
  var v = +o[sa.key];
  var n = v * sa.ratio;
  o._normalized = n;

  return {
    min: min(sa.min, v),
    max: max(sa.max, v),
    sum: sa.sum + v,
    nmin: min(sa.nmin, n),
    nmax: max(sa.nmax, n),
    nsum: sa.nsum + n,
  };
}

function setStat(sa: any, stat: any) {
  Object.assign(sa, stat);
}

function push(sa: any, o: any, stat: any) {
  sa._arr.push(o);
  setStat(sa, stat);
}

class statArray {
  key = null;
  ratio = null;
  _arr = [];
  _hist = [];
  sum = 0;
  nsum = 0;
  min = Infinity;
  max = -Infinity;
  nmin = Infinity;
  nmax = -Infinity;

  constructor(key: any, ratio: any) {
    let me = this;
    me.key = key;
    me.ratio = ratio;
    me.reset();
  }

  get length() {
    return this._arr.length;
  }

  reset() {
    var me = this;
    me._arr = [];
    me._hist = [];
    me.sum = 0;
    me.nsum = 0;
    me.min = Infinity;
    me.max = -Infinity;
    me.nmin = Infinity;
    me.nmax = -Infinity;
  }

  push(o: any) {
    push(this, o, getNewStat(this, o));
  }

  pushIf(o: any, fn: any, ...args: any) {
    var nstat = getNewStat(this, o);
    if (!fn(getStat(this), nstat, args)) {
      return o;
    }
    push(this, o, nstat);
  }

  get() {
    return this._arr;
  }
}

export default statArray;
