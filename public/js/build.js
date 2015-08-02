(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){




},{}],2:[function(require,module,exports){
var App;

module.exports = App = {};

App.Context = require('./context');

App.Model = require('./model');

App.View = require('./view');

App.EasyTestCase = require('./test');

App.EasyTestCase.start(App.Model.Table);



},{"./context":1,"./model":3,"./test":4,"./view":5}],3:[function(require,module,exports){
var Cell, Model, Table, init,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

module.exports = Model = {};

init = function() {
  Model.Cell = Cell;
  return Model.Table = Table;
};

Cell = (function() {
  Cell.prototype.opened = false;

  Cell.prototype.bombed = false;

  function Cell(table3, x1, y1) {
    this.table = table3;
    this.x = x1;
    this.y = y1;
    this.countBombsAround = bind(this.countBombsAround, this);
    this.open = bind(this.open, this);
    this.position = this.table.width * this.y + this.x;
  }

  Cell.prototype.open = function() {
    if (this.opened) {
      return true;
    }
    this.opened = true;
    return this.table.open(this);
  };

  Cell.prototype.countBombsAround = function() {
    return this.table.countBombsAround(this);
  };

  return Cell;

})();

Table = (function() {
  function Table(width, height, bombs1) {
    this.width = width;
    this.height = height;
    this.bombs = bombs1 != null ? bombs1 : 1;
    this.initCells = bind(this.initCells, this);
    if (this.bombs < 1) {
      throw 'no bombs';
    }
    this.cells = this.initCells();
    this.bombs = this.installBomb(this.bombs);
  }

  Table.prototype.initCells = function() {
    var x, y;
    return _.flatten((function() {
      var i, ref, results;
      results = [];
      for (y = i = 0, ref = this.height - 1; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
        results.push((function() {
          var j, ref1, results1;
          results1 = [];
          for (x = j = 0, ref1 = this.width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
            results1.push(new Cell(this, x, y));
          }
          return results1;
        }).call(this));
      }
      return results;
    }).call(this));
  };

  Table.prototype.installBomb = function(count) {
    var i, ref, results;
    return this.installBombManually.apply(this, _.shuffle(_.shuffle((function() {
      results = [];
      for (var i = 0, ref = this.cells.length - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this))).slice(0, +(count - 1) + 1 || 9e9));
  };

  Table.prototype.installBombManually = function() {
    var bombs, cell, i, len, position, ref;
    bombs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this.cells;
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      cell.bombed = false;
    }
    return this.bombs = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = bombs.length; j < len1; j++) {
        position = bombs[j];
        this.cells[position].bombed = true;
        results.push(position);
      }
      return results;
    }).call(this);
  };

  Table.prototype.around = function(cell) {
    var x, y;
    return _.flatten((function() {
      var i, ref, ref1, results;
      results = [];
      for (y = i = ref = cell.y - 1, ref1 = cell.y + 1; ref <= ref1 ? i <= ref1 : i >= ref1; y = ref <= ref1 ? ++i : --i) {
        results.push((function() {
          var j, ref2, ref3, results1;
          results1 = [];
          for (x = j = ref2 = cell.x - 1, ref3 = cell.x + 1; ref2 <= ref3 ? j <= ref3 : j >= ref3; x = ref2 <= ref3 ? ++j : --j) {
            results1.push(this.cell(x, y));
          }
          return results1;
        }).call(this));
      }
      return results;
    }).call(this));
  };

  Table.prototype.cell = function(x, y) {
    if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) {
      return null;
    }
    return this.cells[y * this.width + x];
  };

  Table.prototype.positionCell = function(position) {
    return this.cells[position];
  };

  Table.prototype.open = function(openCell) {
    _.find(this.cells, function(cell) {
      return cell === openCell;
    });
    return !openCell.bombed;
  };

  Table.prototype.countBombsAround = function(cell) {
    return _.filter(this.around(cell), function(picked) {
      return picked && picked.bombed;
    }).length;
  };

  Table.tests = {
    cellCount: function() {
      var table;
      table = new Table(5, 4);
      return table.cells.length === 20;
    },
    cellCount2: function() {
      var table1, table2;
      table1 = new Table(5, 4);
      table2 = new Table(6, 4);
      return table1.cells.length === 20 && table2.cells.length === 24;
    },
    cellPosition1: function() {
      var cell, table1;
      table1 = new Table(5, 4);
      cell = table1.positionCell(2);
      return [cell.x === 2 && cell.y === 0, cell];
    },
    bombsManually: function() {
      var result, table;
      table = new Table(5, 4, 1);
      table.installBombManually(0, 1, 2, 3);
      result = _.filter(table.cells, function(cell) {
        return cell.bombed;
      }).length;
      return [result === 4, result];
    },
    bombsCheck1: function() {
      var table;
      table = new Table(5, 4, 1);
      table.installBombManually(7);
      return table.open(table.positionCell(7)) === false;
    },
    bombsCheck2: function() {
      var result, table;
      table = new Table(5, 4, 1);
      table.installBombManually(7, 3, 19);
      result = _.map([7, 3, 19], function(position) {
        return table.open(table.positionCell(position));
      });
      return [result.join() === [false, false, false].join(), result];
    },
    bombsCheck3: function() {
      var table;
      table = new Table(5, 4, 1);
      table.installBombManually(7);
      return table.positionCell(7).open() === false;
    },
    bombsCheck4: function() {
      var result, table;
      table = new Table(5, 4, 1);
      table.installBombManually(7, 3, 19);
      result = _.map([7, 3, 19], function(position) {
        return table.positionCell(position).open();
      });
      return [result.join() === [false, false, false].join(), result];
    },
    bombsCheck4: function() {
      var result, table;
      table = new Table(5, 4, 1);
      table.installBombManually(7);
      result = _.map([6, 8], function(position) {
        return table.positionCell(position).open();
      });
      return [result.join() === [true, true].join(), result];
    },
    bombsCheck5: function() {
      var result, table;
      table = new Table(5, 4, 1);
      table.installBombManually(7, 3, 19);
      result = _.map([6, 8, 2, 4, 18], function(position) {
        return table.positionCell(position).open();
      });
      return [result.join() === [true, true, true, true, true].join(), result];
    },
    bombsCount1: function() {
      var table;
      table = new Table(5, 4, 1);
      table.installBombManually(7);
      return table.positionCell(1).countBombsAround() === 1;
    },
    bombsCount2: function() {
      var table;
      table = new Table(5, 4, 1);
      table.installBombManually(1, 2, 3, 6, 7, 8);
      return [table.positionCell(0).countBombsAround(), table.positionCell(5).countBombsAround(), table.positionCell(10).countBombsAround(), table.positionCell(11).countBombsAround(), table.positionCell(12).countBombsAround(), table.positionCell(13).countBombsAround(), table.positionCell(14).countBombsAround(), table.positionCell(9).countBombsAround(), table.positionCell(4).countBombsAround()].join() === [2, 2, 1, 2, 3, 2, 1, 2, 2].join();
    },
    bombsCount3: function() {
      var table;
      table = new Table(5, 4, 1);
      table.installBombManually(1, 7, 11, 17, 13);
      return [table.positionCell(6).countBombsAround(), table.positionCell(12).countBombsAround(), table.positionCell(10).countBombsAround(), table.positionCell(18).countBombsAround()].join() === [3, 4, 1, 2].join();
    },
    bombs1: function() {
      var result, table;
      table = new Table(5, 4, 1);
      result = _.filter(table.cells, function(cell) {
        return cell.bombed;
      }).length;
      return [table.cells.length === 20, result === 1, result];
    },
    bombs2: function() {
      var result, table;
      table = new Table(5, 4, 6);
      result = _.filter(table.cells, function(cell) {
        return cell.bombed;
      }).length;
      return [result === 6, result];
    },
    bombs3: function() {
      var result, table;
      table = new Table(5, 4, 18);
      result = _.filter(table.cells, function(cell) {
        return cell.bombed;
      }).length;
      return [result === 18, result];
    },
    around1: function() {
      var cell, result, table;
      table = new Table(5, 4);
      cell = table.cell(2, 1);
      result = _.map(table.around(cell), function(cell) {
        return cell.position;
      });
      return [result.join(',') === [1, 2, 3, 6, 7, 8, 11, 12, 13].join(','), result];
    },
    around2: function() {
      var cell, result, table;
      table = new Table(5, 4);
      cell = table.cell(0, 0);
      result = _.map(table.around(cell), function(cell) {
        return cell != null ? cell.position : void 0;
      });
      return [result.join(',') === [null, null, null, null, 0, 1, null, 5, 6].join(','), result];
    },
    around3: function() {
      var cell, result, table;
      table = new Table(5, 4);
      cell = table.cell(4, 0);
      result = _.map(table.around(cell), function(cell) {
        return cell != null ? cell.position : void 0;
      });
      return [result.join(',') === [null, null, null, 3, 4, null, 8, 9, null].join(','), result];
    }
  };

  return Table;

})();

init();



},{}],4:[function(require,module,exports){
var EasyTestCase,
  slice = [].slice;

EasyTestCase = (function() {
  function EasyTestCase() {}

  EasyTestCase.start = function() {
    var classes, klass, name, result, test;
    classes = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return _.flatten((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = classes.length; i < len; i++) {
        klass = classes[i];
        results.push((function() {
          var ref, results1;
          ref = klass.tests;
          results1 = [];
          for (name in ref) {
            test = ref[name];
            result = test();
            if (_.isArray(result)) {
              if (result[0]) {
                results1.push(console.log.apply(console, [name].concat(slice.call(result))));
              } else {
                results1.push(console.error.apply(console, [name].concat(slice.call(result))));
              }
            } else {
              if (result) {
                results1.push(console.log(name, result));
              } else {
                results1.push(console.error(name, result));
              }
            }
          }
          return results1;
        })());
      }
      return results;
    })());
  };

  return EasyTestCase;

})();

module.exports = EasyTestCase;



},{}],5:[function(require,module,exports){




},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvaW5kZXguY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvbW9kZWwuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdGVzdC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsR0FBQSxHQUFNOztBQUN2QixHQUFHLENBQUMsT0FBSixHQUFjLE9BQUEsQ0FBUSxXQUFSOztBQUNkLEdBQUcsQ0FBQyxLQUFKLEdBQVksT0FBQSxDQUFRLFNBQVI7O0FBQ1osR0FBRyxDQUFDLElBQUosR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxHQUFHLENBQUMsWUFBSixHQUFtQixPQUFBLENBQVEsUUFBUjs7QUFHbkIsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFqQixDQUF1QixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQWpDOzs7OztBQ1BBLElBQUEsd0JBQUE7RUFBQTs7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxHQUFROztBQUV6QixJQUFBLEdBQU8sU0FBQTtFQUNMLEtBQUssQ0FBQyxJQUFOLEdBQWE7U0FDYixLQUFLLENBQUMsS0FBTixHQUFjO0FBRlQ7O0FBSUQ7aUJB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a0IsTUFBbEIsR0FERjtlQUFBLE1BQUE7OEJBR0UsT0FBTyxDQUFDLEtBQVIsQ0FBYyxJQUFkLEVBQW9CLE1BQXBCLEdBSEY7ZUFORjs7QUFGRjs7O0FBRE07O1FBQVY7RUFETTs7Ozs7O0FBZVYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDaEJqQjtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDJodmJXVXZkR1Z1TDBSeWIzQmliM2d2Y0hKdmFtVmpkQzl0YVc1bEwzTnlZeTloY0hBdlkyOXVkR1Y0ZEM1amIyWm1aV1VpTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjeUk2V3lJdmFHOXRaUzkwWlc0dlJISnZjR0p2ZUM5d2NtOXFaV04wTDIxcGJtVXZjM0pqTDJGd2NDOWpiMjUwWlhoMExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUlsMTlcbiIsIm1vZHVsZS5leHBvcnRzID0gQXBwID0ge31cbkFwcC5Db250ZXh0ID0gcmVxdWlyZSAnLi9jb250ZXh0J1xuQXBwLk1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbCdcbkFwcC5WaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xuQXBwLkVhc3lUZXN0Q2FzZSA9IHJlcXVpcmUgJy4vdGVzdCdcblxuXG5BcHAuRWFzeVRlc3RDYXNlLnN0YXJ0KEFwcC5Nb2RlbC5UYWJsZSlcbiIsIm1vZHVsZS5leHBvcnRzID0gTW9kZWwgPSB7fVxuXG5pbml0ID0gLT5cbiAgTW9kZWwuQ2VsbCA9IENlbGxcbiAgTW9kZWwuVGFibGUgPSBUYWJsZVxuXG5jbGFzcyBDZWxsXG4gIG9wZW5lZDogZmFsc2VcbiAgYm9tYmVkOiBmYWxzZVxuICBjb25zdHJ1Y3RvcjogKEB0YWJsZSwgQHgsIEB5KSAtPlxuICAgIEBwb3NpdGlvbiA9IEB0YWJsZS53aWR0aCAqIEB5ICsgQHhcbiAgb3BlbjogPT5cbiAgICByZXR1cm4gdHJ1ZSBpZiBAb3BlbmVkXG4gICAgQG9wZW5lZCA9IHRydWVcbiAgICBAdGFibGUub3BlbihAKVxuICBjb3VudEJvbWJzQXJvdW5kOiA9PlxuICAgIEB0YWJsZS5jb3VudEJvbWJzQXJvdW5kKEApXG5cbmNsYXNzIFRhYmxlXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLCBAaGVpZ2h0LCBAYm9tYnMgPSAxKSAtPlxuICAgIHRocm93ICdubyBib21icycgaWYgQGJvbWJzIDwgMVxuXG4gICAgQGNlbGxzID0gQGluaXRDZWxscygpXG4gICAgQGJvbWJzID0gQGluc3RhbGxCb21iKEBib21icylcblxuICBpbml0Q2VsbHM6ID0+XG4gICAgXy5mbGF0dGVuKGZvciB5IGluIFswLi4oQGhlaWdodCAtIDEpXVxuICAgICAgZm9yIHggaW4gWzAuLihAd2lkdGggLSAxKV1cbiAgICAgICAgbmV3IENlbGwoQCwgeCwgeSkpXG4gIGluc3RhbGxCb21iOiAoY291bnQpLT5cbiAgICBAaW5zdGFsbEJvbWJNYW51YWxseShfLnNodWZmbGUoXy5zaHVmZmxlKFswLi4oQGNlbGxzLmxlbmd0aCAtIDEpXSkpWzAuLihjb3VudCAtIDEpXS4uLilcbiAgaW5zdGFsbEJvbWJNYW51YWxseTogKGJvbWJzLi4uKS0+XG4gICAgZm9yIGNlbGwgaW4gQGNlbGxzXG4gICAgICBjZWxsLmJvbWJlZCA9IGZhbHNlXG4gICAgQGJvbWJzID0gZm9yIHBvc2l0aW9uIGluIGJvbWJzXG4gICAgICBAY2VsbHNbcG9zaXRpb25dLmJvbWJlZCA9IHRydWVcbiAgICAgIHBvc2l0aW9uXG4gIGFyb3VuZDogKGNlbGwpLT5cbiAgICBfLmZsYXR0ZW4oZm9yIHkgaW4gWyhjZWxsLnkgLSAxKS4uKGNlbGwueSArIDEpXVxuICAgICAgZm9yIHggaW4gWyhjZWxsLnggLSAxKS4uKGNlbGwueCArIDEpXVxuICAgICAgICBAY2VsbCh4LCB5KSlcbiAgY2VsbDogKHgsIHkpLT5cbiAgICByZXR1cm4gbnVsbCBpZiB4IDwgMCB8fCB5IDwgMCB8fCB4ID4gQHdpZHRoIC0gMSB8fCB5ID4gQGhlaWdodCAtIDFcbiAgICBAY2VsbHNbeSAqIEB3aWR0aCArIHhdXG4gIHBvc2l0aW9uQ2VsbDogKHBvc2l0aW9uKSAtPlxuICAgIEBjZWxsc1twb3NpdGlvbl1cbiAgb3BlbjogKG9wZW5DZWxsKSAtPlxuICAgIF8uZmluZChAY2VsbHMsIChjZWxsKS0+IGNlbGwgPT0gb3BlbkNlbGwpXG4gICAgbm90IG9wZW5DZWxsLmJvbWJlZFxuICBjb3VudEJvbWJzQXJvdW5kOiAoY2VsbCktPlxuICAgIF8uZmlsdGVyKEBhcm91bmQoY2VsbCksIChwaWNrZWQpLT5cbiAgICAgIHBpY2tlZCAmJiBwaWNrZWQuYm9tYmVkXG4gICAgKS5sZW5ndGhcbiAgQHRlc3RzOlxuICAgIGNlbGxDb3VudDogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNClcbiAgICAgIHRhYmxlLmNlbGxzLmxlbmd0aCA9PSAyMFxuICAgIGNlbGxDb3VudDI6ID0+XG4gICAgICB0YWJsZTEgPSBuZXcgQCg1LCA0KVxuICAgICAgdGFibGUyID0gbmV3IEAoNiwgNClcbiAgICAgIHRhYmxlMS5jZWxscy5sZW5ndGggPT0gMjAgJiYgdGFibGUyLmNlbGxzLmxlbmd0aCA9PSAyNFxuICAgIGNlbGxQb3NpdGlvbjE6ID0+XG4gICAgICB0YWJsZTEgPSBuZXcgQCg1LCA0KVxuICAgICAgY2VsbCA9IHRhYmxlMS5wb3NpdGlvbkNlbGwoMilcbiAgICAgIFtcbiAgICAgICAgY2VsbC54ID09IDIgJiYgY2VsbC55ID09IDBcbiAgICAgICAgY2VsbFxuICAgICAgXVxuICAgIGJvbWJzTWFudWFsbHk6ID0+XG4gICAgICB0YWJsZSA9IG5ldyBAKDUsIDQsIDEpXG4gICAgICB0YWJsZS5pbnN0YWxsQm9tYk1hbnVhbGx5KDAsIDEsIDIsIDMpXG4gICAgICByZXN1bHQgPSBfLmZpbHRlcih0YWJsZS5jZWxscywgKGNlbGwpLT4gY2VsbC5ib21iZWQpLmxlbmd0aFxuICAgICAgW1xuICAgICAgICByZXN1bHQgPT0gNFxuICAgICAgICByZXN1bHRcbiAgICAgIF1cbiAgICBib21ic0NoZWNrMTogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgMSlcbiAgICAgIHRhYmxlLmluc3RhbGxCb21iTWFudWFsbHkoNylcbiAgICAgIHRhYmxlLm9wZW4odGFibGUucG9zaXRpb25DZWxsKDcpKSA9PSBmYWxzZVxuICAgIGJvbWJzQ2hlY2syOiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0LCAxKVxuICAgICAgdGFibGUuaW5zdGFsbEJvbWJNYW51YWxseSg3LCAzLCAxOSlcbiAgICAgIHJlc3VsdCA9IF8ubWFwKFs3LCAzLCAxOV0sIChwb3NpdGlvbiktPlxuICAgICAgICB0YWJsZS5vcGVuKHRhYmxlLnBvc2l0aW9uQ2VsbChwb3NpdGlvbikpXG4gICAgICApXG4gICAgICBbXG4gICAgICAgIHJlc3VsdC5qb2luKCkgPT0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdLmpvaW4oKVxuICAgICAgICByZXN1bHRcbiAgICAgIF1cbiAgICBib21ic0NoZWNrMzogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgMSlcbiAgICAgIHRhYmxlLmluc3RhbGxCb21iTWFudWFsbHkoNylcbiAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCg3KS5vcGVuKCkgPT0gZmFsc2VcbiAgICBib21ic0NoZWNrNDogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgMSlcbiAgICAgIHRhYmxlLmluc3RhbGxCb21iTWFudWFsbHkoNywgMywgMTkpXG4gICAgICByZXN1bHQgPSBfLm1hcChbNywgMywgMTldLCAocG9zaXRpb24pLT5cbiAgICAgICAgdGFibGUucG9zaXRpb25DZWxsKHBvc2l0aW9uKS5vcGVuKClcbiAgICAgIClcbiAgICAgIFtcbiAgICAgICAgcmVzdWx0LmpvaW4oKSA9PSBbZmFsc2UsIGZhbHNlLCBmYWxzZV0uam9pbigpXG4gICAgICAgIHJlc3VsdFxuICAgICAgXVxuICAgIGJvbWJzQ2hlY2s0OiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0LCAxKVxuICAgICAgdGFibGUuaW5zdGFsbEJvbWJNYW51YWxseSg3KVxuICAgICAgcmVzdWx0ID0gXy5tYXAoWzYsIDhdLCAocG9zaXRpb24pLT5cbiAgICAgICAgdGFibGUucG9zaXRpb25DZWxsKHBvc2l0aW9uKS5vcGVuKClcbiAgICAgIClcbiAgICAgIFtcbiAgICAgICAgcmVzdWx0LmpvaW4oKSA9PSBbdHJ1ZSwgdHJ1ZV0uam9pbigpXG4gICAgICAgIHJlc3VsdFxuICAgICAgXVxuICAgIGJvbWJzQ2hlY2s1OiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0LCAxKVxuICAgICAgdGFibGUuaW5zdGFsbEJvbWJNYW51YWxseSg3LCAzLCAxOSlcbiAgICAgIHJlc3VsdCA9IF8ubWFwKFs2LCA4LCAyLCA0LCAxOF0sIChwb3NpdGlvbiktPlxuICAgICAgICB0YWJsZS5wb3NpdGlvbkNlbGwocG9zaXRpb24pLm9wZW4oKVxuICAgICAgKVxuICAgICAgW1xuICAgICAgICByZXN1bHQuam9pbigpID09IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXS5qb2luKClcbiAgICAgICAgcmVzdWx0XG4gICAgICBdXG4gICAgYm9tYnNDb3VudDE6ID0+XG4gICAgICB0YWJsZSA9IG5ldyBAKDUsIDQsIDEpXG4gICAgICB0YWJsZS5pbnN0YWxsQm9tYk1hbnVhbGx5KDcpXG4gICAgICB0YWJsZS5wb3NpdGlvbkNlbGwoMSkuY291bnRCb21ic0Fyb3VuZCgpID09IDFcbiAgICBib21ic0NvdW50MjogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgMSlcbiAgICAgIHRhYmxlLmluc3RhbGxCb21iTWFudWFsbHkoMSwgMiwgMywgNiwgNywgOClcbiAgICAgIFtcbiAgICAgICAgdGFibGUucG9zaXRpb25DZWxsKDApLmNvdW50Qm9tYnNBcm91bmQoKVxuICAgICAgICB0YWJsZS5wb3NpdGlvbkNlbGwoNSkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMCkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMSkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMikuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMykuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxNCkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCg5KS5jb3VudEJvbWJzQXJvdW5kKClcbiAgICAgICAgdGFibGUucG9zaXRpb25DZWxsKDQpLmNvdW50Qm9tYnNBcm91bmQoKVxuICAgICAgXS5qb2luKCkgPT0gWzIsIDIsIDEsIDIsIDMsIDIsIDEsIDIsIDJdLmpvaW4oKVxuICAgIGJvbWJzQ291bnQzOiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0LCAxKVxuICAgICAgdGFibGUuaW5zdGFsbEJvbWJNYW51YWxseSgxLCA3LCAxMSwgMTcsIDEzKVxuICAgICAgW1xuICAgICAgICB0YWJsZS5wb3NpdGlvbkNlbGwoNikuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMikuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxMCkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICAgIHRhYmxlLnBvc2l0aW9uQ2VsbCgxOCkuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICBdLmpvaW4oKSA9PSBbMywgNCwgMSwgMl0uam9pbigpXG4gICAgYm9tYnMxOiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0LCAxKVxuICAgICAgcmVzdWx0ID0gXy5maWx0ZXIodGFibGUuY2VsbHMsIChjZWxsKS0+IGNlbGwuYm9tYmVkKS5sZW5ndGhcbiAgICAgIFtcbiAgICAgICAgdGFibGUuY2VsbHMubGVuZ3RoID09IDIwXG4gICAgICAgIHJlc3VsdCA9PSAxXG4gICAgICAgIHJlc3VsdFxuICAgICAgXVxuICAgIGJvbWJzMjogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgNilcbiAgICAgIHJlc3VsdCA9IF8uZmlsdGVyKHRhYmxlLmNlbGxzLCAoY2VsbCktPiBjZWxsLmJvbWJlZCkubGVuZ3RoXG4gICAgICBbXG4gICAgICAgIHJlc3VsdCA9PSA2XG4gICAgICAgIHJlc3VsdFxuICAgICAgXVxuICAgIGJvbWJzMzogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNCwgMTgpXG4gICAgICByZXN1bHQgPSBfLmZpbHRlcih0YWJsZS5jZWxscywgKGNlbGwpLT4gY2VsbC5ib21iZWQpLmxlbmd0aFxuICAgICAgW1xuICAgICAgICByZXN1bHQgPT0gMThcbiAgICAgICAgcmVzdWx0XG4gICAgICBdXG4gICAgYXJvdW5kMTogPT5cbiAgICAgIHRhYmxlID0gbmV3IEAoNSwgNClcbiAgICAgIGNlbGwgPSB0YWJsZS5jZWxsKDIsIDEpXG4gICAgICByZXN1bHQgPSBfLm1hcCh0YWJsZS5hcm91bmQoY2VsbCksIChjZWxsKS0+IGNlbGwucG9zaXRpb24pXG4gICAgICBbXG4gICAgICAgIHJlc3VsdC5qb2luKCcsJykgPT0gWzEsIDIsIDMsIDYsIDcsIDgsIDExLCAxMiwgMTNdLmpvaW4oJywnKVxuICAgICAgICByZXN1bHRcbiAgICAgIF1cbiAgICBhcm91bmQyOiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0KVxuICAgICAgY2VsbCA9IHRhYmxlLmNlbGwoMCwgMClcbiAgICAgIHJlc3VsdCA9IF8ubWFwKHRhYmxlLmFyb3VuZChjZWxsKSwgKGNlbGwpLT4gY2VsbD8ucG9zaXRpb24pXG4gICAgICBbXG4gICAgICAgIHJlc3VsdC5qb2luKCcsJykgPT0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIDAsIDEsIG51bGwsIDUsIDZdLmpvaW4oJywnKVxuICAgICAgICByZXN1bHRcbiAgICAgIF1cbiAgICBhcm91bmQzOiA9PlxuICAgICAgdGFibGUgPSBuZXcgQCg1LCA0KVxuICAgICAgY2VsbCA9IHRhYmxlLmNlbGwoNCwgMClcbiAgICAgIHJlc3VsdCA9IF8ubWFwKHRhYmxlLmFyb3VuZChjZWxsKSwgKGNlbGwpLT4gY2VsbD8ucG9zaXRpb24pXG4gICAgICBbXG4gICAgICAgIHJlc3VsdC5qb2luKCcsJykgPT0gW251bGwsIG51bGwsIG51bGwsIDMsIDQsIG51bGwsIDgsIDksIG51bGxdLmpvaW4oJywnKVxuICAgICAgICByZXN1bHRcbiAgICAgIF1cblxuaW5pdCgpXG4iLCJjbGFzcyBFYXN5VGVzdENhc2VcbiAgQHN0YXJ0OiAoY2xhc3Nlcy4uLiktPlxuICAgIF8uZmxhdHRlbihmb3Iga2xhc3MgaW4gY2xhc3Nlc1xuICAgICAgICBmb3IgbmFtZSwgdGVzdCBvZiBrbGFzcy50ZXN0c1xuICAgICAgICAgIHJlc3VsdCA9IHRlc3QoKVxuICAgICAgICAgIGlmIF8uaXNBcnJheShyZXN1bHQpXG4gICAgICAgICAgICBpZiByZXN1bHRbMF1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgbmFtZSwgcmVzdWx0Li4uXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgbmFtZSwgcmVzdWx0Li4uXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgcmVzdWx0XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nIG5hbWUsIHJlc3VsdFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIG5hbWUsIHJlc3VsdFxuICAgIClcbm1vZHVsZS5leHBvcnRzID0gRWFzeVRlc3RDYXNlXG4iLCJcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pTDJodmJXVXZkR1Z1TDBSeWIzQmliM2d2Y0hKdmFtVmpkQzl0YVc1bEwzTnlZeTloY0hBdmRtbGxkeTVqYjJabVpXVWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl2YUc5dFpTOTBaVzR2UkhKdmNHSnZlQzl3Y205cVpXTjBMMjFwYm1VdmMzSmpMMkZ3Y0M5MmFXVjNMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lJbDE5XG4iXX0=
