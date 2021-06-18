import * as chartjs from 'chart.js';
import utils from './utils';
import squarify from './squarify';
import canvasTxt from 'canvas-txt';
let defaults = chartjs.defaults;
let helpers = chartjs.helpers;
let optionHelpers = helpers.options;
let parseFont = optionHelpers._parseFont;
let resolve = optionHelpers.resolve;
let valueOrDefault = helpers.valueOrDefault;

function rectNotEqual(r1: any, r2: any) {
  return (
    !r1 ||
    !r2 ||
    r1.x !== r2.x ||
    r1.y !== r2.y ||
    r1.w !== r2.w ||
    r1.h !== r2.h
  );
}

function arrayNotEqual(a1: any, a2: any) {
  let i, n;

  if (a1.lenght !== a2.length) {
    return true;
  }

  for (i = 0, n = a1.length; i < n; ++i) {
    if (a1[i] !== a2[i]) {
      return true;
    }
  }
  return false;
}

function drawCaption(rect: any, font: any) {
  let w = rect.width || rect.w;
  let h = rect.height || rect.h;
  let min = font.lineHeight * 2;
  return w > min && h > min;
}

function buildData(dataset: any, mainRect: any, font: any) {
  let key = dataset.key || '';
  let tree = dataset.tree || [];
  let groups = dataset.groups || [];
  let glen = groups.length;
  let sp = (dataset.spacing || 0) + (dataset.borderWidth || 0);

  function recur(gidx: any, rect: any, parent?: any, gs?: any) {
    let g = groups[gidx];
    let pg = gidx > 0 && groups[gidx - 1];
    let gdata = utils.group(tree, g, key, pg, parent);
    let gsq = squarify(gdata, rect, key, g, gidx, gs);
    let ret = gsq.slice();
    let subRect;
    if (gidx < glen - 1) {
      gsq.forEach(function (sq: any) {
        subRect = {
          x: sq.x + sp,
          y: sq.y + sp,
          w: sq.w - 2 * sp,
          h: sq.h - 2 * sp,
        };

        if (drawCaption(sq, font)) {
          subRect.y += font.lineHeight;
          subRect.h -= font.lineHeight;
        }
        ret.push.apply(ret, recur(gidx + 1, subRect, sq.g, sq.s));
      });
    }
    return ret;
  }

  if (!tree.length && dataset.data.length) {
    tree = dataset.tree = dataset.data;
  }

  return glen ? recur(0, mainRect) : squarify(tree, mainRect, key);
}

function parseFontOptions(options: any) {
  return helpers.extend(
    parseFont({
      fontFamily: valueOrDefault(options.fontFamily, defaults.fontFamily),
      fontSize: valueOrDefault(options.fontSize, defaults.fontSize),
      fontStyle: valueOrDefault(options.fontStyle, defaults.fontStyle),
      lineHeight: valueOrDefault(options.lineHeight, defaults.lineHeight),
    }),
    {
      color: resolve([
        options.fontColor,
        defaults.fontColor,
        defaults.global.defaultFontColor,
      ]),
    }
  );
}

const Controller = (chartjs as any).DatasetController.extend({
  dataElementType: (chartjs as any).elements.Rectangle,

  update: function (reset: any) {
    let me = this;
    let meta = me.getMeta();
    let dataset = me.getDataset();
    let groups = dataset.groups || (dataset.groups = []);
    let font = parseFontOptions(dataset);
    let data = meta.data || [];
    let area = me.chart.chartArea;
    let key = dataset.key || '';
    let i, ilen, mainRect;

    mainRect = {
      x: area.left,
      y: area.top,
      w: area.right - area.left,
      h: area.bottom - area.top,
    };

    if (
      reset ||
      rectNotEqual(me._rect, mainRect) ||
      me._key !== key ||
      arrayNotEqual(me._groups, groups)
    ) {
      me._rect = mainRect;
      me._groups = groups.slice();
      me._key = key;
      dataset.data = buildData(dataset, mainRect, font);
      me.resyncElements();
    }

    for (i = 0, ilen = data.length; i < ilen; ++i) {
      me.updateElement(data[i], i, reset);
    }
  },

  updateElement: function (item: any, index: any, reset: any) {
    let me = this;
    let datasetIndex = me.index;
    let dataset = me.getDataset();
    let sq = dataset.data[index];
    let options = me._resolveElementOptions(item, index);
    let h = reset ? 0 : sq.h - options.spacing * 2;
    let w = reset ? 0 : sq.w - options.spacing * 2;
    let x = sq.x + w / 2 + options.spacing;
    let y = sq.y + h / 2 + options.spacing;
    let halfH = h / 2;

    item._options = options;
    item._datasetIndex = datasetIndex;
    item._index = index;
    item.hidden = h <= options.spacing || w <= options.spacing;

    item._model = {
      x: x,
      base: y - halfH,
      y: y + halfH,
      top: sq.y,
      left: sq.x,
      width: w,
      height: h,
      backgroundColor: options.backgroundColor,
      borderColor: options.borderColor,
      borderSkipped: options.borderSkipped,
      borderWidth: options.borderWidth,
      font: parseFont(options),
      fontColor: options.fontColor,
    };

    item.pivot();
  },

  draw: function () {
    let me = this;
    let metadata = me.getMeta().data || [];
    let dataset = me.getDataset();
    let levels = (dataset.groups || []).length - 1;
    let data = dataset.data || [];
    let ctx = me.chart.ctx;
    let i, ilen, rect, item, vm;

    for (i = 0, ilen = metadata.length; i < ilen; ++i) {
      rect = metadata[i];
      vm = rect._view;
      item = data[i];

      // console.log(`value= ${value} | label = ${label}`);
      if (!rect.hidden) {
        rect.draw();
        if (drawCaption(vm, vm.font) && item.g) {
          ctx.save();

          ctx.fillStyle = vm.fontColor;
          ctx.font = vm.font.string;
          ctx.beginPath();
          ctx.rect(vm.left, vm.top, vm.width, vm.height);
          ctx.clip();
          if (!('l' in item) || item.l === levels) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
              item.g,
              vm.left + vm.width / 2,
              vm.top + vm.height / 2
            );
          } else {
            ctx.textAlign = 'start';
            ctx.textBaseline = 'top';
            ctx.fillText(
              item.g,
              vm.left + vm.borderWidth + 3,
              vm.top + vm.borderWidth + 3
            );
          }

          ctx.restore();
        }

        if (vm.width > 60 && vm.height > 50) {
          const labelPosition = {
            x: vm.left + 3 + vm.borderWidth,
            y: vm.y - vm.height + 3 + vm.borderWidth,
          };

          ctx.save();
          //Draw caption
          const value = dataset.percentLabels[i];
          const label = dataset.treeLabels[i];
          ctx.fillStyle = vm.fontColor;
          // canvasTxt.debug = true;
          canvasTxt.font = vm.font.family;
          canvasTxt.fontSize = vm.font.size;
          canvasTxt.align = 'center';
          canvasTxt.drawText(
            ctx,
            `${label} (${value})`,
            labelPosition.x,
            labelPosition.y,
            vm.width > 50 ? vm.width : 50,
            vm.height > 50 ? vm.height : 50
          );
          ctx.restore();
        }
      }
    }
  },

  /**
   * @private
   */
  _resolveElementOptions: function (rectangle: any, index: any) {
    let me = this;
    let chart = me.chart;
    let dataset = me.getDataset();
    let options = chart.options.elements.rectangle;
    let values = {} as any;
    let i, ilen, key;

    // Scriptable options
    let context = {
      chart: chart,
      dataIndex: index,
      dataset: dataset,
      datasetIndex: me.index,
    };

    let keys = [
      'backgroundColor',
      'borderColor',
      'borderSkipped',
      'borderWidth',
      'fontColor',
      'fontFamily',
      'fontSize',
      'fontStyle',
      'spacing',
    ];

    for (i = 0, ilen = keys.length; i < ilen; ++i) {
      key = keys[i];
      values[key] = resolve([dataset[key], options[key]], context, index);
    }

    return values;
  },
});

export default Controller;
