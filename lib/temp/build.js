(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Context;

module.exports = Context = {};

Context.GameContext = require('./contexts/game');

Context.SettingContext = require('./contexts/setting');


},{"./contexts/game":2,"./contexts/setting":3}],2:[function(require,module,exports){
var GameContext,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = GameContext = (function(superClass) {
  extend(GameContext, superClass);

  function GameContext() {
    return GameContext.__super__.constructor.apply(this, arguments);
  }

  GameContext.prototype.component = React.createClass({
    render: function() {
      return ce({
        $el: App.View.Game,
        config: this.props.config
      });
    }
  });

  GameContext.prototype.initState = function(props) {
    return props.table = this.createTable(props.config);
  };

  GameContext.prototype.expandComponentProps = function(props, state) {
    return {
      config: props.table
    };
  };

  GameContext.prototype.delegate = function(subscribe) {
    GameContext.__super__.delegate.apply(this, arguments);
    subscribe('back', (function(_this) {
      return function() {
        return _this.props.router.popContext();
      };
    })(this));
    subscribe('cell:rightClick', (function(_this) {
      return function(cell) {
        cell.rotateMode();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
    subscribe('cell:leftClick', (function(_this) {
      return function(cell) {
        cell.open();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
    subscribe('cell:leftRightClick', (function(_this) {
      return function(cell) {
        cell.openAround();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
    subscribe('restart', (function(_this) {
      return function() {
        _this.props.table = _this.createTable(_this.props.config);
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
    return subscribe('timer', (function(_this) {
      return function() {
        _this.props.table.computeTime();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
  };

  GameContext.prototype.createTable = function(dat) {
    return new App.Model.Table(dat.width, dat.height, dat.bombs);
  };

  return GameContext;

})(Arda.Context);


},{}],3:[function(require,module,exports){
var SettingContext,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = SettingContext = (function(superClass) {
  extend(SettingContext, superClass);

  function SettingContext() {
    return SettingContext.__super__.constructor.apply(this, arguments);
  }

  SettingContext.prototype.component = React.createClass({
    render: function() {
      return ce({
        $el: App.View.Configuration
      });
    }
  });

  SettingContext.prototype.initState = function(props) {
    return props;
  };

  SettingContext.prototype.expandComponentProps = function(props, state) {
    return {
      config: state.config
    };
  };

  SettingContext.prototype.delegate = function(subscribe) {
    SettingContext.__super__.delegate.apply(this, arguments);
    subscribe('preset', (function(_this) {
      return function(dat) {
        return _this.props.router.pushContext(App.Context.GameContext, {
          router: _this.props.router,
          config: dat
        });
      };
    })(this));
    return subscribe('freestyle', (function(_this) {
      return function(dat) {
        return _this.props.router.pushContext(App.Context.GameContext, {
          router: _this.props.router,
          config: dat
        });
      };
    })(this));
  };

  return SettingContext;

})(Arda.Context);


},{}],4:[function(require,module,exports){
(function (global){
var App,
  slice = [].slice;

module.exports = App = {};

if (typeof window !== "undefined" && window !== null) {
  window.App = App;
  window.ce = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = App.Util).ce.apply(ref, args);
  };
} else {
  global.App = App;
  global.ce = function() {
    var args, ref;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = App.Util).ce.apply(ref, args);
  };
}

App.Context = require('./context');

App.Util = require('./util');

App.Model = require('./model');

App.View = require('./view');

App.start = function(node) {
  var router;
  router = new Arda.Router(Arda.DefaultLayout, node);
  return router.pushContext(App.Context.SettingContext, {
    router: router
  });
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./context":1,"./model":5,"./util":8,"./view":9}],5:[function(require,module,exports){
var Model;

module.exports = Model = {};

Model.Cell = require('./models/cell');

Model.Table = require('./models/table');


},{"./models/cell":6,"./models/table":7}],6:[function(require,module,exports){
var Cell,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Cell = (function() {
  Cell.status = {
    none: 'none',
    flag: 'flag',
    question: 'question',
    open: 'open'
  };

  Cell.prototype.state = null;

  Cell.prototype._counted = 0;

  Cell.prototype.blankMap = null;

  function Cell(table, x, y) {
    this.table = table;
    this.x = x;
    this.y = y;
    this.countFlagsAround = bind(this.countFlagsAround, this);
    this.countBombsAround = bind(this.countBombsAround, this);
    this.blankMap = [this];
    this.position = this.table.width * this.y + this.x;
    this.state = Cell.status.none;
    this._bomb = false;
  }

  Cell.prototype.addAroundBlankCell = function(cell) {
    return this.blankMap.push(cell);
  };

  Cell.prototype.countBombsAround = function() {
    return this._counted != null ? this._counted : this._counted = this.table.countBombsAround(this);
  };

  Cell.prototype.countFlagsAround = function() {
    return this.table.countFlagsAround(this);
  };

  Cell.prototype.getDownCell = function() {
    return this.table.getPointCell(this.x, this.y + 1);
  };

  Cell.prototype.getLeftCell = function() {
    return this.table.getPointCell(this.x - 1, this.y);
  };

  Cell.prototype.getRightCell = function() {
    return this.table.getPointCell(this.x + 1, this.y);
  };

  Cell.prototype.getUpCell = function() {
    return this.table.getPointCell(this.x, this.y - 1);
  };

  Cell.prototype.hasBomb = function() {
    return this._bomb;
  };

  Cell.prototype.incrementAroundBombsCount = function() {
    return this._counted += 1;
  };

  Cell.prototype.isSafe = function() {
    return !this._bomb;
  };

  Cell.prototype.isBlank = function() {
    return this._counted === 0;
  };

  Cell.prototype.isFlagged = function() {
    return this.state === Cell.status.flag;
  };

  Cell.prototype.isOpened = function() {
    return this.state === Cell.status.open;
  };

  Cell.prototype.isOpenable = function() {
    return !this.isOpened() && this.state !== Cell.status.none;
  };

  Cell.prototype.installBomb = function() {
    this._bomb = true;
    return this.informBombExistence();
  };

  Cell.prototype.informBombExistence = function() {
    return this.table.informBombExistence(this);
  };

  Cell.prototype.pal = function(cell) {
    this.blankMap = cell.blankMap;
    return this.blankMap.push(this);
  };

  Cell.prototype.open = function() {
    if (this.table.isLocked()) {
      return;
    }
    if (this.isOpened() || this.isOpenable()) {
      return true;
    }
    this.state = Cell.status.open;
    return this.table.open(this);
  };

  Cell.prototype.openAround = function() {
    if (this.table.isLocked()) {
      return;
    }
    if (this.isOpened() && this.countBombsAround() === this.countFlagsAround()) {
      return this.table.openAround(this);
    }
  };

  Cell.prototype.rotateMode = function() {
    if (this.isOpened() || this.table.locked) {
      return;
    }
    this.state = (function() {
      switch (this.state) {
        case Cell.status.none:
          return Cell.status.flag;
        case Cell.status.flag:
          return Cell.status.question;
        case Cell.status.question:
          return Cell.status.none;
      }
    }).call(this);
    return this.table.computeRestBombsCount();
  };

  Cell.prototype.uninstallBomb = function() {
    return this._bomb = false;
  };

  return Cell;

})();


},{}],7:[function(require,module,exports){
var Table,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

module.exports = Table = (function() {
  Table.status = {
    play: 'play',
    win: 'win',
    lose: 'lose'
  };

  Table.prototype.state = null;

  Table.prototype.calm = false;

  function Table(width, height, _bombsCount) {
    this.width = width;
    this.height = height;
    this._bombsCount = _bombsCount != null ? _bombsCount : 1;
    this.initCells = bind(this.initCells, this);
    if (this._bombsCount < 1) {
      throw 'no bombs';
    }
    if (this._bombsCount >= this.width * this.height) {
      throw 'over bombs';
    }
    this._cells = this.initCells();
    this.installBombs(this._bombsCount);
    this._startedTime = +new Date();
    this.passedTime = 0;
    this.restBomsCount = this._bombsCount;
    this._blankCellsCount = this._cells.length - this._bombsCount;
    this.state = Table.status.play;
  }

  Table.prototype.computeTime = function() {
    if (this.isLocked()) {
      return;
    }
    return this.passedTime = _((+new Date() - this._startedTime) / 1000).floor();
  };

  Table.prototype.countBombsAround = function(cell) {
    return _(this.getAroundUnopenedCells(cell)).filter(function(picked) {
      return picked.hasBomb();
    }).value().length;
  };

  Table.prototype.countFlagsAround = function(cell) {
    return _(this.getAroundUnopenedCells(cell)).filter(function(picked) {
      return picked.isFlagged();
    }).value().length;
  };

  Table.prototype.countFlaggedCell = function() {
    return _(this._cells).filter(function(picked) {
      return picked.isFlagged();
    }).value().length;
  };

  Table.prototype.countOpenedCell = function() {
    return _(this._cells).filter(function(picked) {
      return picked.isOpened();
    }).value().length;
  };

  Table.prototype.countRestBombs = function() {
    return this._bombsCount - this.countFlaggedCell();
  };

  Table.prototype.computeRestBombsCount = function() {
    return this.restBomsCount = this.countRestBombs();
  };

  Table.prototype.getAroundCellsBase = function(cell) {
    var i, ref, ref1, results;
    return _((function() {
      results = [];
      for (var i = ref = cell.y - 1, ref1 = cell.y + 1; ref <= ref1 ? i <= ref1 : i >= ref1; ref <= ref1 ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this)).map((function(_this) {
      return function(y) {
        var i, ref, ref1, results;
        return _((function() {
          results = [];
          for (var i = ref = cell.x - 1, ref1 = cell.x + 1; ref <= ref1 ? i <= ref1 : i >= ref1; ref <= ref1 ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this)).map(function(x) {
          return _this.getPointCell(x, y);
        }).value();
      };
    })(this)).flatten().compact();
  };

  Table.prototype.getAroundCells = function(cell) {
    return this.getAroundCellsBase(cell).value();
  };

  Table.prototype.getAroundUnopenedCells = function(cell) {
    return this.getAroundCellsBase(cell).select(function(cell) {
      return !cell.isOpened();
    }).value();
  };

  Table.prototype.getCells = function() {
    return this._cells;
  };

  Table.prototype.getPointCell = function(x, y) {
    if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) {
      return null;
    }
    return this.getPositionCell(y * this.width + x);
  };

  Table.prototype.getPositionCell = function(position) {
    return this._cells[position];
  };

  Table.prototype.informBombExistence = function(cell) {
    return _(this.getAroundCells(cell)).map(function(picked) {
      return picked.incrementAroundBombsCount();
    }).value();
  };

  Table.prototype.initCells = function() {
    var i, ref, results;
    return _((function() {
      results = [];
      for (var i = 0, ref = this.height - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this)).map((function(_this) {
      return function(y) {
        var i, ref, results;
        return _((function() {
          results = [];
          for (var i = 0, ref = _this.width - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
          return results;
        }).apply(this)).map(function(x) {
          return new App.Model.Cell(_this, x, y);
        }).value();
      };
    })(this)).flatten().value();
  };

  Table.prototype.installBombs = function(count) {
    var bombPositions, i, ref, results;
    bombPositions = _((function() {
      results = [];
      for (var i = 0, ref = this._cells.length - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this)).sample(count).value();
    return this.installBombsManually.apply(this, bombPositions);
  };

  Table.prototype.installBombsManually = function() {
    var bombs;
    bombs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    _(this._cells).map((function(_this) {
      return function(cell) {
        return cell.uninstallBomb();
      };
    })(this)).value();
    _(bombs).map((function(_this) {
      return function(position) {
        return _this.getPositionCell(position).installBomb();
      };
    })(this)).value();
    return _(this._cells).map((function(_this) {
      return function(cell) {
        if (cell.isBlank()) {
          return _(_this.getAroundCells(cell)).map(function(around) {}).value();
        }
      };
    })(this)).value();
  };

  Table.prototype.isLocked = function() {
    return this.locked;
  };

  Table.prototype.lock = function() {
    return this.locked = true;
  };

  Table.prototype.lose = function() {
    this.computeTime();
    this.state = Table.status.lose;
    _(this._bombsCount).map((function(_this) {
      return function(position) {
        return _this.getPositionCell(position).open();
      };
    })(this));
    return this.lock();
  };

  Table.prototype.open = function(opened) {
    if (this.isLocked()) {
      return;
    }
    if (opened.hasBomb()) {
      return this.lose();
    }
    if (this._blankCellsCount === this.countOpenedCell()) {
      return this.win();
    }
    if (!this.calm && opened.isBlank()) {
      this.calm = true;
      _(opened.blankMap).map(function(cell) {
        return cell != null ? cell.open() : void 0;
      }).value();
      return this.calm = false;
    }
  };

  Table.prototype.openAround = function(cell) {
    return _(this.getAroundUnopenedCells(cell)).map(function(around) {
      return around.open();
    }).value();
  };

  Table.prototype.unlock = function() {
    return this.locked = false;
  };

  Table.prototype.win = function() {
    this.computeTime();
    this.state = Table.status.win;
    return this.lock();
  };

  return Table;

})();


},{}],8:[function(require,module,exports){
var Util,
  slice = [].slice;

module.exports = Util = {

  /*
  React.createElementを変形
  
  ce(object)
    object.$cn -> className
    object.$el -> タグ名
    object.$inc -> 末尾引数、あるいは可変長引数として渡される値
    object -> 引数はそのままpropsとして渡される
  
  普通
  
     ce {$el: 'div', $cn: 'short', $inc: 'text'}
  
     <div className="short">
       text
     </div>
  
  入れ子
  
     Item = ReactClass
       render: ->
         ce {$el: 'li', $inc: 'item'}
  
     ce {$el: 'ul', $inc: [Item, Item]}
  
     <ul>
       {Item}
       {Item}
     </ul>
   */
  ce: function(object) {
    var child, children, i, len, results;
    switch (true) {
      case object != null ? object.hasOwnProperty('$el') : void 0:
        object.className = object.$cn;
        children = this.ce(object.$inc);
        if (_.isArray(children)) {
          return React.createElement.apply(React, [object.$el, object].concat(slice.call(children)));
        } else {
          return React.createElement(object.$el, object, children);
        }
        break;
      case _.isArray(object):
        results = [];
        for (i = 0, len = object.length; i < len; i++) {
          child = object[i];
          results.push(this.ce(child));
        }
        return results;
        break;
      case _.isString(object):
        return object;
      case _.isNumber(object):
        return object;
      case _.isObject(object):
        return object;
      default:
        return '';
    }
  }
};


},{}],9:[function(require,module,exports){
var View;

module.exports = View = {};

View.Table = require('./views/table');

View.Cell = require('./views/cell');

View.Fa = require('./views/fa');

View.Configuration = require('./views/configuration');

View.Preset = require('./views/preset');

View.Game = require('./views/game');


},{"./views/cell":10,"./views/configuration":11,"./views/fa":12,"./views/game":13,"./views/preset":14,"./views/table":15}],10:[function(require,module,exports){
var Cell;

module.exports = Cell = React.createClass({
  mixins: [Arda.mixin],
  render: function() {
    return ce({
      $el: 'li',
      $cn: this.genClasses(),
      ref: 'cell',
      $inc: this.genIncs()
    });
  },
  componentDidMount: function() {
    var cell;
    cell = React.findDOMNode(this.refs.cell);
    cell.addEventListener("contextmenu", this.onContextMenu);
    cell.addEventListener("mousedown", this.onMouseDown);
    return this.setState({
      cell: cell
    });
  },
  componentWillUnmount: function() {
    var cell;
    cell = this.state.cell;
    cell.removeEventListener("contextmenu", this.onContextMenu);
    return cell.removeEventListener("mousedown", this.onMouseDown);
  },
  genClasses: function() {
    var classes;
    classes = ['cell'];
    if (this.props.model.isOpened()) {
      classes.push('opened');
    }
    return classes.join(' ');
  },
  genIncs: function() {
    var count;
    if (!this.props.model.isOpened()) {
      return ce({
        $el: App.View.Fa,
        icon: this.props.model.state
      });
    }
    if (this.props.model.hasBomb()) {
      return ce({
        $el: App.View.Fa,
        icon: 'bomb'
      });
    } else {
      count = this.props.model.countBombsAround();
      if (count === 0) {
        return '';
      } else {
        return count;
      }
    }
  },
  onContextMenu: function(e) {
    return e.preventDefault();
  },
  onMouseDown: function(e) {
    e.preventDefault();
    if (e.buttons != null) {
      switch (e.buttons) {
        case 1:
          return this.dispatch('cell:leftClick', this.props.model);
        case 2:
          return this.dispatch('cell:rightClick', this.props.model);
        case 3:
          return this.dispatch('cell:leftRightClick', this.props.model);
        case 4:
          return this.dispatch('cell:middleClick', this.props.model);
      }
    } else if (e.button != null) {
      switch (e.button) {
        case 0:
          return this.dispatch('cell:leftClick', this.props.model);
        case 1:
          return this.dispatch('cell:middleClick', this.props.model);
        case 2:
          return this.dispatch('cell:rightClick', this.props.model);
      }
    } else {
      return this.dispatch('cell:leftClick', this.props.model);
    }
  }
});


},{}],11:[function(require,module,exports){
var Configuration;

module.exports = Configuration = React.createClass({
  mixins: [Arda.mixin],
  initialState: {
    width: 9,
    height: 9,
    bombs: 10
  },
  getInitialState: function() {
    return this.initialState;
  },
  render: function() {
    return ce({
      $el: 'div',
      $cn: 'container conf-page',
      $inc: [
        ce({
          $el: 'h1',
          $cn: 'main-title',
          $inc: 'No Mines Land'
        }), ce({
          $el: 'h1',
          $cn: 'conf-page title',
          $inc: 'プリセット'
        }), ce({
          $el: 'ul',
          $cn: 'conf-page preset-games',
          $inc: [
            ce({
              $el: App.View.Preset,
              preset: {
                name: '初級',
                dat: {
                  width: 9,
                  height: 9,
                  bombs: 10
                }
              }
            }), ce({
              $el: App.View.Preset,
              preset: {
                name: '中級',
                dat: {
                  width: 16,
                  height: 16,
                  bombs: 40
                }
              }
            }), ce({
              $el: App.View.Preset,
              preset: {
                name: '上級',
                dat: {
                  width: 30,
                  height: 16,
                  bombs: 99
                }
              }
            })
          ]
        }), ce({
          $el: 'h1',
          $cn: 'conf-page title',
          $inc: 'フリースタイル'
        }), ce({
          $el: 'ul',
          $cn: 'conf-page form-layout',
          $inc: [
            ce({
              $el: 'li',
              $cn: 'conf-page input-title-layout',
              $inc: [
                ce({
                  $el: 'label',
                  $cn: 'input-title conf-page',
                  $inc: '横'
                })
              ]
            }), ce({
              $el: 'li',
              $cn: 'conf-page input-layout',
              $inc: [
                ce({
                  $el: 'input',
                  $cn: 'form-control conf-page',
                  ref: 'width',
                  value: this.state.width,
                  onChange: this.genOnChangeValue('width')
                })
              ]
            }), ce({
              $el: 'li',
              $cn: 'conf-page input-title-layout',
              $inc: [
                ce({
                  $el: 'label',
                  $cn: 'input-title conf-page',
                  $inc: '縦'
                })
              ]
            }), ce({
              $el: 'li',
              $cn: 'conf-page input-layout',
              $inc: [
                ce({
                  $el: 'input',
                  $cn: 'form-control conf-page',
                  ref: 'height',
                  value: this.state.height,
                  onChange: this.genOnChangeValue('height')
                })
              ]
            }), ce({
              $el: 'li',
              $cn: 'conf-page input-title-layout',
              $inc: [
                ce({
                  $el: 'label',
                  $cn: 'input-title conf-page',
                  $inc: [
                    ce({
                      $el: App.View.Fa,
                      icon: 'bomb',
                      fixedWidth: true
                    })
                  ]
                })
              ]
            }), ce({
              $el: 'li',
              $cn: 'conf-page input-layout',
              $inc: [
                ce({
                  $el: 'input',
                  $cn: 'form-control conf-page',
                  ref: 'bombs',
                  value: this.state.bombs,
                  onChange: this.genOnChangeValue('bombs')
                })
              ]
            })
          ]
        }), ce({
          $el: 'button',
          $cn: 'btn btn-success conf-page wide',
          onClick: this.onClickFreeStyle,
          $inc: 'スタート'
        })
      ]
    });
  },
  genOnChangeValue: function(target) {
    return (function(_this) {
      return function(e) {
        var state, value;
        state = {};
        value = +e.target.value;
        state[target] = (function() {
          switch (true) {
            case _.isNaN(value):
              return this.initialState[target];
            case value < 1:
              return this.initialState[target];
            case _.isNumber(value):
              return value;
            default:
              return this.initialState[target];
          }
        }).call(_this);
        return _this.setState(state);
      };
    })(this);
  },
  onClickFreeStyle: function(e) {
    e.preventDefault();
    return this.dispatch('freestyle', {
      width: React.findDOMNode(this.refs.width).value,
      height: React.findDOMNode(this.refs.height).value,
      bombs: React.findDOMNode(this.refs.bombs).value
    });
  }
});


},{}],12:[function(require,module,exports){
var Fa;

module.exports = Fa = React.createClass({
  render: function() {
    var classes;
    classes = ['fa'];
    classes.push("fa-" + this.props.icon);
    if (this.props.scale != null) {
      classes.push("fa-" + this.props.scale + "x");
    }
    if (this.props.fixedWidth) {
      classes.push('fa-fw');
    }
    if (this.props.list) {
      classes.push('fa-li');
    }
    if (this.props.border) {
      classes.push('fa-border');
    }
    if (this.props.pull != null) {
      classes.push("fa-pull-" + this.props.pull);
    }
    if (this.props.animation != null) {
      classes.push("fa-" + this.props.animation);
    }
    if (this.props.rotate != null) {
      classes.push("fa-rotate-" + this.props.rotate);
    }
    if (this.props.flip != null) {
      classes.push("fa-flip-" + this.props.animation);
    }
    return ce({
      $el: 'i',
      $cn: classes.join(' ')
    });
  }
});


},{}],13:[function(require,module,exports){
var Game;

module.exports = Game = React.createClass({
  mixins: [Arda.mixin],
  render: function() {
    var table;
    table = this.props.config;
    return ce({
      $el: 'div',
      $inc: [
        ce({
          $el: 'h1',
          $cn: 'main-title',
          $inc: 'No Mines Land'
        }), ce({
          $el: 'header',
          $cn: 'game-page header',
          $inc: [
            ce({
              $el: 'div',
              $cn: 'game-page time',
              $inc: [table.passedTime]
            }), ce({
              $el: 'div',
              $cn: 'game-page restart',
              $inc: [
                ce({
                  $el: 'button',
                  $cn: "btn btn-" + (this.detectColor()) + " game-page wide",
                  onClick: this.onClickRestart,
                  $inc: [
                    ce({
                      $el: App.View.Fa,
                      icon: this.detectFace(),
                      scale: 2
                    })
                  ]
                })
              ]
            }), ce({
              $el: 'div',
              $cn: 'game-page rest',
              $inc: [table.restBomsCount]
            })
          ]
        }), ce({
          $el: 'div',
          $cn: 'clearfix',
          $inc: [
            ce({
              $el: App.View.Table,
              model: this.props.config
            })
          ]
        }), ce({
          $el: 'footer',
          $cn: 'game-page footer',
          $inc: [
            ce({
              $el: 'button',
              $cn: 'btn btn-success conf-page',
              onClick: this.onClickBack,
              $inc: [
                ce({
                  $el: App.View.Fa,
                  icon: 'chevron-circle-left'
                }), ' もどる'
              ]
            })
          ]
        })
      ]
    });
  },
  componentDidMount: function() {
    return this.sid = setInterval(((function(_this) {
      return function() {
        return _this.dispatch('timer');
      };
    })(this)), 1000);
  },
  componentWillUnmount: function() {
    return clearInterval(this.sid);
  },
  detectColor: function() {
    switch (this.props.config.state) {
      case App.Model.Table.status.play:
        return 'default';
      case App.Model.Table.status.win:
        return 'primary';
      case App.Model.Table.status.lose:
        return 'danger';
    }
  },
  detectFace: function() {
    switch (this.props.config.state) {
      case App.Model.Table.status.play:
        return 'meh-o';
      case App.Model.Table.status.win:
        return 'smile-o';
      case App.Model.Table.status.lose:
        return 'frown-o';
    }
  },
  onClickBack: function(e) {
    e.preventDefault();
    return this.dispatch('back');
  },
  onClickRestart: function(e) {
    e.preventDefault();
    return this.dispatch('restart');
  }
});


},{}],14:[function(require,module,exports){
var Preset;

module.exports = Preset = React.createClass({
  mixins: [Arda.mixin],
  render: function() {
    return ce({
      $el: 'li',
      $cn: 'conf-page preset',
      $inc: [
        ce({
          $el: 'button',
          $cn: 'btn btn-primary conf-page wide',
          onClick: this.onClick,
          $inc: this.props.preset.name
        })
      ]
    });
  },
  onClick: function(e) {
    e.preventDefault();
    return this.dispatch('preset', this.props.preset.dat);
  }
});


},{}],15:[function(require,module,exports){
var Table;

module.exports = Table = React.createClass({
  render: function() {
    return ce({
      $el: 'ul',
      $cn: 'table',
      $inc: this.genCells(),
      style: this.genStyles()
    });
  },
  genCells: function() {
    return _(this.props.model.getCells()).map(function(cell) {
      return ce({
        $el: App.View.Cell,
        model: cell
      });
    }).value();
  },
  genStyles: function() {
    return {
      width: this.props.model.width * 30
    };
  }
});


},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9jb250ZXh0LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHRzL2dhbWUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvY29udGV4dHMvc2V0dGluZy5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9pbmRleC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9tb2RlbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9tb2RlbHMvY2VsbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9tb2RlbHMvdGFibGUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdXRpbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2NlbGwuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvY29uZmlndXJhdGlvbi5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9mYS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9nYW1lLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3ByZXNldC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy90YWJsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FBVTs7QUFFM0IsT0FBTyxDQUFDLFdBQVIsR0FBc0IsT0FBQSxDQUFRLGlCQUFSOztBQUN0QixPQUFPLENBQUMsY0FBUixHQUF5QixPQUFBLENBQVEsb0JBQVI7Ozs7QUNIekIsSUFBQSxXQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBckM7T0FBSDtJQURNLENBQVI7R0FEUzs7d0JBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNULEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFLLENBQUMsTUFBbkI7RUFETDs7d0JBR1gsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUNwQjtNQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsS0FBZDs7RUFEb0I7O3dCQUd0QixRQUFBLEdBQVUsU0FBQyxTQUFEO0lBQ1IsMkNBQUEsU0FBQTtJQUVBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUNoQixLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFkLENBQUE7TUFEZ0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBR0EsU0FBQSxDQUFVLGlCQUFWLEVBQTZCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxJQUFEO1FBQzNCLElBQUksQ0FBQyxVQUFMLENB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QyxDQUFBLFNBQUQsQ0FBQSxDQUFyRDtLQUFIO0VBRE0sQ0FBUjtFQUdBLFFBQUEsRUFBVSxTQUFBO1dBQ1IsQ0FBQSxDQUFFLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQWIsQ0FBQSxDQUFGLENBQTBCLENBQUMsR0FBM0IsQ0FBK0IsU0FBQyxJQUFEO2FBQzdCLEVBQUEsQ0FBRztRQUFFLEdBQUEsRUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQWhCO1FBQXNCLEtBQUEsRUFBTyxJQUE3QjtPQUFIO0lBRDZCLENBQS9CLENBRUMsQ0FBQyxLQUZGLENBQUE7RUFEUSxDQUhWO0VBUUEsU0FBQSxFQUFXLFNBQUE7V0FDVDtNQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLEVBQTVCOztFQURTLENBUlg7Q0FETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IENvbnRleHQgPSB7fVxuXG5Db250ZXh0LkdhbWVDb250ZXh0ID0gcmVxdWlyZSAnLi9jb250ZXh0cy9nYW1lJ1xuQ29udGV4dC5TZXR0aW5nQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dHMvc2V0dGluZydcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZUNvbnRleHQgZXh0ZW5kcyBBcmRhLkNvbnRleHRcbiAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgICByZW5kZXI6IC0+XG4gICAgICBjZSB7ICRlbDogQXBwLlZpZXcuR2FtZSwgY29uZmlnOiBAcHJvcHMuY29uZmlnIH1cbiAgKVxuXG4gIGluaXRTdGF0ZTogKHByb3BzKSAtPlxuICAgIHByb3BzLnRhYmxlID0gQGNyZWF0ZVRhYmxlKHByb3BzLmNvbmZpZylcblxuICBleHBhbmRDb21wb25lbnRQcm9wczogKHByb3BzLCBzdGF0ZSkgLT5cbiAgICBjb25maWc6IHByb3BzLnRhYmxlXG5cbiAgZGVsZWdhdGU6IChzdWJzY3JpYmUpIC0+XG4gICAgc3VwZXJcblxuICAgIHN1YnNjcmliZSAnYmFjaycsID0+XG4gICAgICBAcHJvcHMucm91dGVyLnBvcENvbnRleHQoKVxuXG4gICAgc3Vic2NyaWJlICdjZWxsOnJpZ2h0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5yb3RhdGVNb2RlKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAnY2VsbDpsZWZ0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5vcGVuKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAnY2VsbDpsZWZ0UmlnaHRDbGljaycsIChjZWxsKT0+XG4gICAgICBjZWxsLm9wZW5Bcm91bmQoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuXG4gICAgc3Vic2NyaWJlICdyZXN0YXJ0JywgPT5cbiAgICAgIEBwcm9wcy50YWJsZSA9IEBjcmVhdGVUYWJsZShAcHJvcHMuY29uZmlnKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuXG4gICAgc3Vic2NyaWJlICd0aW1lcicsID0+XG4gICAgICBAcHJvcHMudGFibGUuY29tcHV0ZVRpbWUoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuXG4gIGNyZWF0ZVRhYmxlOiAoZGF0KS0+XG4gICAgbmV3IEFwcC5Nb2RlbC5UYWJsZShkYXQud2lkdGgsIGRhdC5oZWlnaHQsIGRhdC5ib21icykiLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNldHRpbmdDb250ZXh0IGV4dGVuZHMgQXJkYS5Db250ZXh0XG4gIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkNvbmZpZ3VyYXRpb24gfVxuICApXG5cbiAgaW5pdFN0YXRlOiAocHJvcHMpIC0+XG4gICAgcHJvcHNcblxuICBleHBhbmRDb21wb25lbnRQcm9wczogKHByb3BzLCBzdGF0ZSkgLT5cbiAgICBjb25maWc6IHN0YXRlLmNvbmZpZ1xuXG4gIGRlbGVnYXRlOiAoc3Vic2NyaWJlKSAtPlxuICAgIHN1cGVyXG5cbiAgICBzdWJzY3JpYmUgJ3ByZXNldCcsIChkYXQpPT5cbiAgICAgIEBwcm9wcy5yb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuR2FtZUNvbnRleHQsIHtcbiAgICAgICAgcm91dGVyOiBAcHJvcHMucm91dGVyXG4gICAgICAgIGNvbmZpZzogZGF0XG4gICAgICB9KVxuXG4gICAgc3Vic2NyaWJlICdmcmVlc3R5bGUnLCAoZGF0KT0+XG4gICAgICBAcHJvcHMucm91dGVyLnB1c2hDb250ZXh0KEFwcC5Db250ZXh0LkdhbWVDb250ZXh0LCB7XG4gICAgICAgIHJvdXRlcjogQHByb3BzLnJvdXRlclxuICAgICAgICBjb25maWc6IGRhdFxuICAgICAgfSlcbiIsIm1vZHVsZS5leHBvcnRzID0gQXBwID0ge31cblxuaWYgd2luZG93P1xuICB3aW5kb3cuQXBwID0gQXBwXG4gIHdpbmRvdy5jZSA9IChhcmdzLi4uKS0+XG4gICAgQXBwLlV0aWwuY2UoYXJncy4uLilcbmVsc2VcbiAgZ2xvYmFsLkFwcCA9IEFwcFxuICBnbG9iYWwuY2UgPSAoYXJncy4uLiktPlxuICAgIEFwcC5VdGlsLmNlKGFyZ3MuLi4pXG5cbkFwcC5Db250ZXh0ID0gcmVxdWlyZSAnLi9jb250ZXh0J1xuQXBwLlV0aWwgPSByZXF1aXJlICcuL3V0aWwnXG5BcHAuTW9kZWwgPSByZXF1aXJlICcuL21vZGVsJ1xuQXBwLlZpZXcgPSByZXF1aXJlICcuL3ZpZXcnXG5cbkFwcC5zdGFydCA9IChub2RlKS0+XG4gIHJvdXRlciA9IG5ldyBBcmRhLlJvdXRlcihBcmRhLkRlZmF1bHRMYXlvdXQsIG5vZGUpXG4gIHJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5TZXR0aW5nQ29udGV4dCwgeyByb3V0ZXI6IHJvdXRlciB9KVxuIiwibW9kdWxlLmV4cG9ydHMgPSBNb2RlbCA9IHt9XG5cbk1vZGVsLkNlbGwgPSByZXF1aXJlICcuL21vZGVscy9jZWxsJ1xuTW9kZWwuVGFibGUgPSByZXF1aXJlICcuL21vZGVscy90YWJsZSdcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgQ2VsbFxuICAgIEBzdGF0dXM6XG4gICAgICBub25lOiAnbm9uZSdcbiAgICAgIGZsYWc6ICdmbGFnJ1xuICAgICAgcXVlc3Rpb246ICdxdWVzdGlvbidcbiAgICAgIG9wZW46ICdvcGVuJ1xuICAgIHN0YXRlOiBudWxsXG4gICAgX2NvdW50ZWQ6IDBcbiAgICBibGFua01hcDogbnVsbFxuXG5cbiAgICBjb25zdHJ1Y3RvcjogKEB0YWJsZSwgQHgsIEB5KSAtPlxuICAgICAgQGJsYW5rTWFwID0gW0BdXG4gICAgICBAcG9zaXRpb24gPSBAdGFibGUud2lkdGggKiBAeSArIEB4XG4gICAgICBAc3RhdGUgPSBDZWxsLnN0YXR1cy5ub25lXG4gICAgICBAX2JvbWIgPSBmYWxzZVxuXG5cbiAgICBhZGRBcm91bmRCbGFua0NlbGw6IChjZWxsKS0+XG4gICAgICBAYmxhbmtNYXAucHVzaChjZWxsKVxuXG4gICAgY291bnRCb21ic0Fyb3VuZDogPT5cbiAgICAgIEBfY291bnRlZCA/PSBAdGFibGUuY291bnRCb21ic0Fyb3VuZChAKVxuXG4gICAgY291bnRGbGFnc0Fyb3VuZDogPT5cbiAgICAgIEB0YWJsZS5jb3VudEZsYWdzQXJvdW5kKEApXG5cbiAgICBnZXREb3duQ2VsbDogLT5cbiAgICAgIEB0YWJsZS5nZXRQb2ludENlbGwoQHgsIEB5ICsgMSlcblxuICAgIGdldExlZnRDZWxsOiAtPlxuICAgICAgQHRhYmxlLmdldFBvaW50Q2VsbChAeCAtIDEsIEB5KVxuXG4gICAgZ2V0UmlnaHRDZWxsOiAtPlxuICAgICAgQHRhYmxlLmdldFBvaW50Q2VsbChAeCArIDEsIEB5KVxuXG4gICAgZ2V0VXBDZWxsOiAtPlxuICAgICAgQHRhYmxlLmdldFBvaW50Q2VsbChAeCwgQHkgLSAxKVxuXG4gICAgaGFzQm9tYjogLT5cbiAgICAgIEBfYm9tYlxuXG4gICAgaW5jcmVtZW50QXJvdW5kQm9tYnNDb3VudDogLT5cbiAgICAgIEBfY291bnRlZCArPSAxXG5cbiAgICBpc1NhZmU6IC0+XG4gICAgICBub3QgQF9ib21iXG5cbiAgICBpc0JsYW5rOiAtPlxuICAgICAgQF9jb3VudGVkID09IDBcblxuICAgIGlzRmxhZ2dlZDogLT5cbiAgICAgIEBzdGF0ZSA9PSBDZWxsLnN0YXR1cy5mbGFnXG5cbiAgICBpc09wZW5lZDogLT5cbiAgICAgIEBzdGF0ZSA9PSBDZWxsLnN0YXR1cy5vcGVuXG5cbiAgICBpc09wZW5hYmxlOiAtPlxuICAgICAgbm90IEBpc09wZW5lZCgpICYmIEBzdGF0ZSAhPSBDZWxsLnN0YXR1cy5ub25lXG5cbiAgICBpbnN0YWxsQm9tYjogLT5cbiAgICAgIEBfYm9tYiA9IHRydWVcbiAgICAgIEBpbmZvcm1Cb21iRXhpc3RlbmNlKClcblxuICAgIGluZm9ybUJvbWJFeGlzdGVuY2U6IC0+XG4gICAgICBAdGFibGUuaW5mb3JtQm9tYkV4aXN0ZW5jZShAKVxuXG4gICAgcGFsOiAoY2VsbCktPlxuICAgICAgQGJsYW5rTWFwID0gY2VsbC5ibGFua01hcFxuICAgICAgQGJsYW5rTWFwLnB1c2goQClcblxuICAgIG9wZW46IC0+XG4gICAgICByZXR1cm4gaWYgQHRhYmxlLmlzTG9ja2VkKClcbiAgICAgIHJldHVybiB0cnVlIGlmIEBpc09wZW5lZCgpIHx8IEBpc09wZW5hYmxlKClcbiAgICAgIEBzdGF0ZSA9IENlbGwuc3RhdHVzLm9wZW5cbiAgICAgIEB0YWJsZS5vcGVuKEApXG5cbiAgICBvcGVuQXJvdW5kOiAtPlxuICAgICAgcmV0dXJuIGlmIEB0YWJsZS5pc0xvY2tlZCgpXG4gICAgICBAdGFibGUub3BlbkFyb3VuZChAKSBpZiBAaXNPcGVuZWQoKSAmJiBAY291bnRCb21ic0Fyb3VuZCgpID09IEBjb3VudEZsYWdzQXJvdW5kKClcblxuICAgIHJvdGF0ZU1vZGU6IC0+XG4gICAgICByZXR1cm4gaWYgQGlzT3BlbmVkKCkgfHwgQHRhYmxlLmxvY2tlZFxuICAgICAgQHN0YXRlID0gc3dpdGNoIEBzdGF0ZVxuICAgICAgICB3aGVuIENlbGwuc3RhdHVzLm5vbmVcbiAgICAgICAgICBDZWxsLnN0YXR1cy5mbGFnXG4gICAgICAgIHdoZW4gQ2VsbC5zdGF0dXMuZmxhZ1xuICAgICAgICAgIENlbGwuc3RhdHVzLnF1ZXN0aW9uXG4gICAgICAgIHdoZW4gQ2VsbC5zdGF0dXMucXVlc3Rpb25cbiAgICAgICAgICBDZWxsLnN0YXR1cy5ub25lXG4gICAgICBAdGFibGUuY29tcHV0ZVJlc3RCb21ic0NvdW50KClcblxuICAgIHVuaW5zdGFsbEJvbWI6IC0+XG4gICAgICBAX2JvbWIgPSBmYWxzZVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUYWJsZVxuICBAc3RhdHVzOlxuICAgIHBsYXk6ICdwbGF5J1xuICAgIHdpbjogJ3dpbidcbiAgICBsb3NlOiAnbG9zZSdcbiAgc3RhdGU6IG51bGxcbiAgY2FsbTogZmFsc2VcbiAgY29uc3RydWN0b3I6IChAd2lkdGgsIEBoZWlnaHQsIEBfYm9tYnNDb3VudCA9IDEpIC0+XG4gICAgdGhyb3cgJ25vIGJvbWJzJyBpZiBAX2JvbWJzQ291bnQgPCAxXG4gICAgdGhyb3cgJ292ZXIgYm9tYnMnIGlmIEBfYm9tYnNDb3VudCA+PSBAd2lkdGggKiBAaGVpZ2h0XG5cbiAgICBAX2NlbGxzID0gQGluaXRDZWxscygpXG4gICAgQGluc3RhbGxCb21icyhAX2JvbWJzQ291bnQpXG4gICAgQF9zdGFydGVkVGltZSA9ICtuZXcgRGF0ZSgpXG4gICAgQHBhc3NlZFRpbWUgPSAwXG4gICAgQHJlc3RCb21zQ291bnQgPSBAX2JvbWJzQ291bnRcbiAgICBAX2JsYW5rQ2VsbHNDb3VudCA9IEBfY2VsbHMubGVuZ3RoIC0gQF9ib21ic0NvdW50XG4gICAgQHN0YXRlID0gVGFibGUuc3RhdHVzLnBsYXlcblxuICBjb21wdXRlVGltZTogLT5cbiAgICByZXR1cm4gaWYgQGlzTG9ja2VkKClcbiAgICBAcGFzc2VkVGltZSA9IF8oKCtuZXcgRGF0ZSgpIC0gQF9zdGFydGVkVGltZSkgLyAxMDAwKS5mbG9vcigpXG5cbiAgY291bnRCb21ic0Fyb3VuZDogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRVbm9wZW5lZENlbGxzKGNlbGwpKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkLmhhc0JvbWIoKVxuICAgICkudmFsdWUoKS5sZW5ndGhcblxuICBjb3VudEZsYWdzQXJvdW5kOiAoY2VsbCktPlxuICAgIF8oQGdldEFyb3VuZFVub3BlbmVkQ2VsbHMoY2VsbCkpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQuaXNGbGFnZ2VkKClcbiAgICApLnZhbHVlKCkubGVuZ3RoXG5cbiAgY291bnRGbGFnZ2VkQ2VsbDogLT5cbiAgICBfKEBfY2VsbHMpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQuaXNGbGFnZ2VkKClcbiAgICApLnZhbHVlKCkubGVuZ3RoXG5cbiAgY291bnRPcGVuZWRDZWxsOiAtPlxuICAgIF8oQF9jZWxscykuZmlsdGVyKChwaWNrZWQpLT5cbiAgICAgIHBpY2tlZC5pc09wZW5lZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50UmVzdEJvbWJzOiAtPlxuICAgIEBfYm9tYnNDb3VudCAtIEBjb3VudEZsYWdnZWRDZWxsKClcblxuICBjb21wdXRlUmVzdEJvbWJzQ291bnQ6IC0+XG4gICAgQHJlc3RCb21zQ291bnQgPSBAY291bnRSZXN0Qm9tYnMoKVxuXG4gIGdldEFyb3VuZENlbGxzQmFzZTogKGNlbGwpLT5cbiAgICBfKFsoY2VsbC55IC0gMSkuLihjZWxsLnkgKyAxKV0pLm1hcCgoeSk9PlxuICAgICAgXyhbKGNlbGwueCAtIDEpLi4oY2VsbC54ICsgMSldKS5tYXAoKHgpPT5cbiAgICAgICAgQGdldFBvaW50Q2VsbCh4LCB5KVxuICAgICAgKS52YWx1ZSgpXG4gICAgKS5mbGF0dGVuKCkuY29tcGFjdCgpXG5cbiAgZ2V0QXJvdW5kQ2VsbHM6IChjZWxsKS0+XG4gICAgQGdldEFyb3VuZENlbGxzQmFzZShjZWxsKS52YWx1ZSgpXG5cblxuICBnZXRBcm91bmRVbm9wZW5lZENlbGxzOiAoY2VsbCktPlxuICAgIEBnZXRBcm91bmRDZWxsc0Jhc2UoY2VsbCkuc2VsZWN0KChjZWxsKS0+XG4gICAgICBub3QgY2VsbC5pc09wZW5lZCgpXG4gICAgKS52YWx1ZSgpXG5cbiAgZ2V0Q2VsbHM6IC0+XG4gICAgQF9jZWxsc1xuXG4gIGdldFBvaW50Q2VsbDogKHgsIHkpLT5cbiAgICByZXR1cm4gbnVsbCBpZiB4IDwgMCB8fCB5IDwgMCB8fCB4ID4gQHdpZHRoIC0gMSB8fCB5ID4gQGhlaWdodCAtIDFcbiAgICBAZ2V0UG9zaXRpb25DZWxsKHkgKiBAd2lkdGggKyB4KVxuXG4gIGdldFBvc2l0aW9uQ2VsbDogKHBvc2l0aW9uKSAtPlxuICAgIEBfY2VsbHNbcG9zaXRpb25dXG5cbiAgaW5mb3JtQm9tYkV4aXN0ZW5jZTogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRDZWxscyhjZWxsKSkubWFwKChwaWNrZWQpLT5cbiAgICAgIHBpY2tlZC5pbmNyZW1lbnRBcm91bmRCb21ic0NvdW50KClcbiAgICApLnZhbHVlKClcblxuICBpbml0Q2VsbHM6ID0+XG4gICAgXyhbMC4uKEBoZWlnaHQgLSAxKV0pLm1hcCgoeSk9PlxuICAgICAgXyhbMC4uKEB3aWR0aCAtIDEpXSkubWFwKCh4KT0+XG4gICAgICAgIG5ldyBBcHAuTW9kZWwuQ2VsbChALCB4LCB5KVxuICAgICAgKS52YWx1ZSgpXG4gICAgKS5mbGF0dGVuKCkudmFsdWUoKVxuXG4gIGluc3RhbGxCb21iczogKGNvdW50KS0+XG4gICAgYm9tYlBvc2l0aW9ucyA9IF8oWzAuLihAX2NlbGxzLmxlbmd0aCAtIDEpXSkuc2FtcGxlKGNvdW50KS52YWx1ZSgpXG4gICAgQGluc3RhbGxCb21ic01hbnVhbGx5KGJvbWJQb3NpdGlvbnMuLi4pXG5cbiAgaW5zdGFsbEJvbWJzTWFudWFsbHk6IChib21icy4uLiktPlxuICAgIF8oQF9jZWxscykubWFwKChjZWxsKT0+XG4gICAgICBjZWxsLnVuaW5zdGFsbEJvbWIoKVxuICAgICkudmFsdWUoKVxuXG4gICAgXyhib21icykubWFwKChwb3NpdGlvbik9PlxuICAgICAgQGdldFBvc2l0aW9uQ2VsbChwb3NpdGlvbikuaW5zdGFsbEJvbWIoKVxuICAgICkudmFsdWUoKVxuXG4gICAgXyhAX2NlbGxzKS5tYXAoKGNlbGwpPT5cbiAgICAgIGlmIGNlbGwuaXNCbGFuaygpXG4gICAgICAgIF8oQGdldEFyb3VuZENlbGxzKGNlbGwpKS5tYXAoKGFyb3VuZCk9PlxuXG4gICAgICAgICkudmFsdWUoKVxuICAgICkudmFsdWUoKVxuXG5cbiAgaXNMb2NrZWQ6IC0+XG4gICAgQGxvY2tlZFxuXG5cbiAgbG9jazogLT5cbiAgICBAbG9ja2VkID0gdHJ1ZVxuXG4gICAgXG5cbiAgbG9zZTogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy5sb3NlXG4gICAgXyhAX2JvbWJzQ291bnQpLm1hcCgocG9zaXRpb24pPT4gQGdldFBvc2l0aW9uQ2VsbChwb3NpdGlvbikub3BlbigpKVxuICAgIEBsb2NrKClcblxuICBvcGVuOiAob3BlbmVkKSAtPlxuICAgIHJldHVybiBpZiBAaXNMb2NrZWQoKVxuICAgIHJldHVybiBAbG9zZSgpIGlmIG9wZW5lZC5oYXNCb21iKClcbiAgICByZXR1cm4gQHdpbigpIGlmIEBfYmxhbmtDZWxsc0NvdW50ID09IEBjb3VudE9wZW5lZENlbGwoKVxuXG5cbiAgICBpZiBub3QgQGNhbG0gJiYgb3BlbmVkLmlzQmxhbmsoKVxuICAgICAgQGNhbG0gPSB0cnVlXG4gICAgICBfKG9wZW5lZC5ibGFua01hcCkubWFwKChjZWxsKS0+XG4gICAgICAgIGNlbGw/Lm9wZW4oKVxuICAgICAgKS52YWx1ZSgpXG4gICAgICBAY2FsbSA9IGZhbHNlXG5cbiAgb3BlbkFyb3VuZDogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRVbm9wZW5lZENlbGxzKGNlbGwpKS5tYXAoKGFyb3VuZCktPiBhcm91bmQub3BlbigpKS52YWx1ZSgpXG5cbiAgdW5sb2NrOiAtPlxuICAgIEBsb2NrZWQgPSBmYWxzZVxuXG4gIHdpbjogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy53aW5cbiAgICBAbG9jaygpXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgIyMjXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnTjgpLlpInlvaJcblxuICBjZShvYmplY3QpXG4gICAgb2JqZWN0LiRjbiAtPiBjbGFzc05hbWVcbiAgICBvYmplY3QuJGVsIC0+IOOCv+OCsOWQjVxuICAgIG9iamVjdC4kaW5jIC0+IOacq+WwvuW8leaVsOOAgeOBguOCi+OBhOOBr+WPr+WkiemVt+W8leaVsOOBqOOBl+OBpua4oeOBleOCjOOCi+WApFxuICAgIG9iamVjdCAtPiDlvJXmlbDjga/jgZ3jga7jgb7jgb5wcm9wc+OBqOOBl+OBpua4oeOBleOCjOOCi1xuXG4gIOaZrumAmlxuXG4gICAgIGNlIHskZWw6ICdkaXYnLCAkY246ICdzaG9ydCcsICRpbmM6ICd0ZXh0J31cblxuICAgICA8ZGl2IGNsYXNzTmFtZT1cInNob3J0XCI+XG4gICAgICAgdGV4dFxuICAgICA8L2Rpdj5cblxuICDlhaXjgozlrZBcblxuICAgICBJdGVtID0gUmVhY3RDbGFzc1xuICAgICAgIHJlbmRlcjogLT5cbiAgICAgICAgIGNlIHskZWw6ICdsaScsICRpbmM6ICdpdGVtJ31cblxuICAgICBjZSB7JGVsOiAndWwnLCAkaW5jOiBbSXRlbSwgSXRlbV19XG5cbiAgICAgPHVsPlxuICAgICAgIHtJdGVtfVxuICAgICAgIHtJdGVtfVxuICAgICA8L3VsPlxuICAjIyNcbiAgY2U6IChvYmplY3QpLT5cbiAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgd2hlbiBvYmplY3Q/Lmhhc093blByb3BlcnR5KCckZWwnKVxuICAgICAgICBvYmplY3QuY2xhc3NOYW1lID0gb2JqZWN0LiRjblxuICAgICAgICBjaGlsZHJlbiA9IEBjZShvYmplY3QuJGluYylcbiAgICAgICAgaWYgXy5pc0FycmF5KGNoaWxkcmVuKVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbi4uLilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbilcbiAgICAgIHdoZW4gXy5pc0FycmF5KG9iamVjdClcbiAgICAgICAgZm9yIGNoaWxkIGluIG9iamVjdFxuICAgICAgICAgIEBjZShjaGlsZClcbiAgICAgIHdoZW4gXy5pc1N0cmluZyhvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgd2hlbiBfLmlzTnVtYmVyKG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICB3aGVuIF8uaXNPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIGVsc2VcbiAgICAgICAgJydcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gVmlldyA9IHt9XG5cblZpZXcuVGFibGUgPSByZXF1aXJlICcuL3ZpZXdzL3RhYmxlJ1xuVmlldy5DZWxsID0gcmVxdWlyZSAnLi92aWV3cy9jZWxsJ1xuVmlldy5GYSA9IHJlcXVpcmUgJy4vdmlld3MvZmEnXG5WaWV3LkNvbmZpZ3VyYXRpb24gPSByZXF1aXJlICcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24nXG5WaWV3LlByZXNldCA9IHJlcXVpcmUgJy4vdmlld3MvcHJlc2V0J1xuVmlldy5HYW1lID0gcmVxdWlyZSAnLi92aWV3cy9nYW1lJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBDZWxsID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnbGknLCAkY246IEBnZW5DbGFzc2VzKCksIHJlZjogJ2NlbGwnLCAkaW5jOiBAZ2VuSW5jcygpIH1cblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBjZWxsID0gUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuY2VsbClcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBAb25Db250ZXh0TWVudSlcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgQG9uTW91c2VEb3duKVxuXG4gICAgQHNldFN0YXRlKGNlbGw6IGNlbGwpXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IC0+XG4gICAgY2VsbCA9IEBzdGF0ZS5jZWxsXG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgQG9uQ29udGV4dE1lbnUpXG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bilcblxuICBnZW5DbGFzc2VzOiAtPlxuICAgIGNsYXNzZXMgPSBbJ2NlbGwnXVxuICAgIGNsYXNzZXMucHVzaCgnb3BlbmVkJykgaWYgQHByb3BzLm1vZGVsLmlzT3BlbmVkKClcbiAgICBjbGFzc2VzLmpvaW4oJyAnKVxuXG4gIGdlbkluY3M6IC0+XG4gICAgcmV0dXJuIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogQHByb3BzLm1vZGVsLnN0YXRlIH0gaWYgbm90IEBwcm9wcy5tb2RlbC5pc09wZW5lZCgpXG5cbiAgICBpZiBAcHJvcHMubW9kZWwuaGFzQm9tYigpXG4gICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdib21iJyB9XG4gICAgZWxzZVxuICAgICAgY291bnQgPSBAcHJvcHMubW9kZWwuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICBpZiBjb3VudCA9PSAwXG4gICAgICAgICcnXG4gICAgICBlbHNlXG4gICAgICAgIGNvdW50XG4gIG9uQ29udGV4dE1lbnU6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgb25Nb3VzZURvd246IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgZS5idXR0b25zP1xuICAgICAgc3dpdGNoIChlLmJ1dHRvbnMpXG4gICAgICAgIHdoZW4gMVxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpyaWdodENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDNcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdFJpZ2h0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gNFxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDptaWRkbGVDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICBlbHNlIGlmIGUuYnV0dG9uP1xuICAgICAgc3dpdGNoIChlLmJ1dHRvbilcbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOm1pZGRsZUNsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6cmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICBlbHNlXG4gICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdENsaWNrJywgQHByb3BzLm1vZGVsKVxuKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBDb25maWd1cmF0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgaW5pdGlhbFN0YXRlOlxuICAgIHdpZHRoOiA5XG4gICAgaGVpZ2h0OiA5XG4gICAgYm9tYnM6IDEwXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIEBpbml0aWFsU3RhdGVcblxuICByZW5kZXI6IC0+XG4gICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb250YWluZXIgY29uZi1wYWdlJywgJGluYzogW1xuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ21haW4tdGl0bGUnLCAkaW5jOiAnTm8gTWluZXMgTGFuZCcgfVxuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ2NvbmYtcGFnZSB0aXRsZScsICRpbmM6ICfjg5fjg6rjgrvjg4Pjg4gnIH1cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICdjb25mLXBhZ2UgcHJlc2V0LWdhbWVzJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBwcmVzZXQ6IHsgbmFtZTogJ+WInee0micsIGRhdDogeyB3aWR0aDogOSwgaGVpZ2h0OiA5LCBib21iczogMTAgfSB9IH1cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlByZXNldCwgcHJlc2V0OiB7IG5hbWU6ICfkuK3ntJonLCBkYXQ6IHsgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2LCBib21iczogNDAgfSB9IH1cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlByZXNldCwgcHJlc2V0OiB7IG5hbWU6ICfkuIrntJonLCBkYXQ6IHsgd2lkdGg6IDMwLCBoZWlnaHQ6IDE2LCBib21iczogOTkgfSB9IH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ2NvbmYtcGFnZSB0aXRsZScsICRpbmM6ICfjg5Xjg6rjg7zjgrnjgr/jgqTjg6snIH1cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICdjb25mLXBhZ2UgZm9ybS1sYXlvdXQnLCAkaW5jOiBbXG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiAn5qiqJyB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ3dpZHRoJywgdmFsdWU6IEBzdGF0ZS53aWR0aCwgb25DaGFuZ2U6IEBnZW5PbkNoYW5nZVZhbHVlKCd3aWR0aCcpIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiAn57imJyB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2hlaWdodCcsIHZhbHVlOiBAc3RhdGUuaGVpZ2h0LCBvbkNoYW5nZTogQGdlbk9uQ2hhbmdlVmFsdWUoJ2hlaWdodCcpIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiBbXG4gICAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdib21iJywgZml4ZWRXaWR0aDogdHJ1ZSB9XG4gICAgICAgICAgXSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2JvbWJzJywgdmFsdWU6IEBzdGF0ZS5ib21icywgb25DaGFuZ2U6IEBnZW5PbkNoYW5nZVZhbHVlKCdib21icycpIH1cbiAgICAgICAgXSB9XG4gICAgICBdIH1cbiAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiAnYnRuIGJ0bi1zdWNjZXNzIGNvbmYtcGFnZSB3aWRlJywgb25DbGljazogQG9uQ2xpY2tGcmVlU3R5bGUsICRpbmM6ICfjgrnjgr/jg7zjg4gnIH1cbiAgICBdIH1cblxuICBnZW5PbkNoYW5nZVZhbHVlOiAodGFyZ2V0KS0+XG4gICAgKGUpPT5cbiAgICAgIHN0YXRlID0ge31cbiAgICAgIHZhbHVlID0gK2UudGFyZ2V0LnZhbHVlXG5cbiAgICAgIHN0YXRlW3RhcmdldF0gPSBzd2l0Y2ggdHJ1ZVxuICAgICAgICB3aGVuIF8uaXNOYU4odmFsdWUpXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG4gICAgICAgIHdoZW4gdmFsdWUgPCAxXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG4gICAgICAgIHdoZW4gXy5pc051bWJlcih2YWx1ZSlcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG5cbiAgICAgIEBzZXRTdGF0ZShzdGF0ZSlcblxuICBvbkNsaWNrRnJlZVN0eWxlOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAnZnJlZXN0eWxlJywge1xuICAgICAgd2lkdGg6IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLndpZHRoKS52YWx1ZVxuICAgICAgaGVpZ2h0OiBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy5oZWlnaHQpLnZhbHVlXG4gICAgICBib21iczogUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuYm9tYnMpLnZhbHVlXG4gICAgfVxuKSIsIm1vZHVsZS5leHBvcnRzID1cbiAgRmEgPSBSZWFjdC5jcmVhdGVDbGFzcyAoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2xhc3NlcyA9IFsnZmEnXVxuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtI3tAcHJvcHMuaWNvbn1cIilcbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLnNjYWxlfXhcIikgaWYgQHByb3BzLnNjYWxlP1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1mdycpIGlmIEBwcm9wcy5maXhlZFdpZHRoXG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWxpJykgaWYgQHByb3BzLmxpc3RcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtYm9yZGVyJykgaWYgQHByb3BzLmJvcmRlclxuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtcHVsbC0je0Bwcm9wcy5wdWxsfVwiKSBpZiBAcHJvcHMucHVsbD9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLmFuaW1hdGlvbn1cIikgaWYgQHByb3BzLmFuaW1hdGlvbj9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLXJvdGF0ZS0je0Bwcm9wcy5yb3RhdGV9XCIpIGlmIEBwcm9wcy5yb3RhdGU/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1mbGlwLSN7QHByb3BzLmFuaW1hdGlvbn1cIikgaWYgQHByb3BzLmZsaXA/XG5cbiAgICAgIGNlIHsgJGVsOiAnaScsICRjbjogY2xhc3Nlcy5qb2luKCcgJykgfVxuICApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cblxuICByZW5kZXI6IC0+XG4gICAgdGFibGUgPSBAcHJvcHMuY29uZmlnXG5cbiAgICBjZSB7ICRlbDogJ2RpdicsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnaDEnLCAkY246ICdtYWluLXRpdGxlJywgJGluYzogJ05vIE1pbmVzIExhbmQnIH1cbiAgICAgIGNlIHsgJGVsOiAnaGVhZGVyJywgJGNuOiAnZ2FtZS1wYWdlIGhlYWRlcicsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdnYW1lLXBhZ2UgdGltZScsICRpbmM6IFtcbiAgICAgICAgICB0YWJsZS5wYXNzZWRUaW1lXG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2dhbWUtcGFnZSByZXN0YXJ0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiBcImJ0biBidG4tI3tAZGV0ZWN0Q29sb3IoKX0gZ2FtZS1wYWdlIHdpZGVcIiwgb25DbGljazogQG9uQ2xpY2tSZXN0YXJ0LCAkaW5jOiBbXG4gICAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246IEBkZXRlY3RGYWNlKCksIHNjYWxlOiAyIH1cbiAgICAgICAgICBdIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnZ2FtZS1wYWdlIHJlc3QnLCAkaW5jOiBbXG4gICAgICAgICAgdGFibGUucmVzdEJvbXNDb3VudFxuICAgICAgICBdIH1cbiAgICAgXSB9XG4gICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NsZWFyZml4JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuVGFibGUsIG1vZGVsOiBAcHJvcHMuY29uZmlnIH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdmb290ZXInLCAkY246ICdnYW1lLXBhZ2UgZm9vdGVyJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tc3VjY2VzcyBjb25mLXBhZ2UnLCBvbkNsaWNrOiBAb25DbGlja0JhY2ssICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdjaGV2cm9uLWNpcmNsZS1sZWZ0JyB9XG4gICAgICAgICAgJyDjgoLjganjgosnXG4gICAgICAgIF0gfVxuICAgICAgXSB9XG4gICAgXSB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgQHNpZCA9IHNldEludGVydmFsKCg9PlxuICAgICAgQGRpc3BhdGNoICd0aW1lcidcbiAgICApLCAxMDAwKVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxuICAgIGNsZWFySW50ZXJ2YWwoQHNpZClcblxuICBkZXRlY3RDb2xvcjogLT5cbiAgICBzd2l0Y2ggQHByb3BzLmNvbmZpZy5zdGF0ZVxuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLnBsYXlcbiAgICAgICAgJ2RlZmF1bHQnXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMud2luXG4gICAgICAgICdwcmltYXJ5J1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLmxvc2VcbiAgICAgICAgJ2RhbmdlcidcblxuICBkZXRlY3RGYWNlOiAtPlxuICAgIHN3aXRjaCBAcHJvcHMuY29uZmlnLnN0YXRlXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMucGxheVxuICAgICAgICAnbWVoLW8nXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMud2luXG4gICAgICAgICdzbWlsZS1vJ1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLmxvc2VcbiAgICAgICAgJ2Zyb3duLW8nXG5cbiAgb25DbGlja0JhY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoICdiYWNrJ1xuXG4gIG9uQ2xpY2tSZXN0YXJ0OiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAncmVzdGFydCdcbilcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBQcmVzZXQgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cblxuICByZW5kZXI6IC0+XG4gICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBwcmVzZXQnLCAkaW5jOiBbXG4gICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tcHJpbWFyeSBjb25mLXBhZ2Ugd2lkZScsIG9uQ2xpY2s6IEBvbkNsaWNrLCAkaW5jOiBAcHJvcHMucHJlc2V0Lm5hbWUgfVxuICAgIF0gfVxuXG4gIG9uQ2xpY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoKCdwcmVzZXQnLCBAcHJvcHMucHJlc2V0LmRhdClcbikiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6ICd1bCcsICRjbjogJ3RhYmxlJywgJGluYzogQGdlbkNlbGxzKCksIHN0eWxlOiBAZ2VuU3R5bGVzKCkgfVxuXG4gICAgZ2VuQ2VsbHM6IC0+XG4gICAgICBfKEBwcm9wcy5tb2RlbC5nZXRDZWxscygpKS5tYXAoKGNlbGwpLT5cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkNlbGwsIG1vZGVsOiBjZWxsIH1cbiAgICAgICkudmFsdWUoKVxuXG4gICAgZ2VuU3R5bGVzOiAtPlxuICAgICAgd2lkdGg6IEBwcm9wcy5tb2RlbC53aWR0aCAqIDMwXG4gIClcbiJdfQ==
