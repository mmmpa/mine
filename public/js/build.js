(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

console.log('a');

App.start = function(node) {
  var router;
  router = new Arda.Router(Arda.DefaultLayout, node);
  return router.pushContext(App.Context.SettingContext, {
    router: router
  });
};



}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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

  function Cell(table, x, y) {
    this.table = table;
    this.x = x;
    this.y = y;
    this.countFlagsAround = bind(this.countFlagsAround, this);
    this.countBombsAround = bind(this.countBombsAround, this);
    this.position = this.table.width * this.y + this.x;
    this.state = Cell.status.none;
    this._bomb = false;
  }

  Cell.prototype.countBombsAround = function() {
    return this._counted != null ? this._counted : this._counted = this.table.countBombsAround(this);
  };

  Cell.prototype.countFlagsAround = function() {
    return this.table.countFlagsAround(this);
  };

  Cell.prototype.hasBomb = function() {
    return this._bomb;
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
    return this._bomb = true;
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
    this._bombCellPositions = this.installBombs(this._bombsCount);
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
    return _(this.getAroundCells(cell)).filter(function(picked) {
      return picked && picked.hasBomb();
    }).value().length;
  };

  Table.prototype.countFlagsAround = function(cell) {
    return _(this.getAroundCells(cell)).filter(function(picked) {
      return picked && picked.isFlagged();
    }).value().length;
  };

  Table.prototype.countFlaggedCell = function() {
    return _(this._cells).filter(function(picked) {
      return picked && picked.isFlagged();
    }).value().length;
  };

  Table.prototype.countOpenedCell = function() {
    return _(this._cells).filter(function(picked) {
      return picked && picked.isOpened();
    }).value().length;
  };

  Table.prototype.countRestBombs = function() {
    return this._bombsCount - this.countFlaggedCell();
  };

  Table.prototype.computeRestBombsCount = function() {
    return this.restBomsCount = this.countRestBombs();
  };

  Table.prototype.getAroundCells = function(cell) {
    var x, y;
    return _.compact(_.flatten((function() {
      var i, ref, ref1, results;
      results = [];
      for (y = i = ref = cell.y - 1, ref1 = cell.y + 1; ref <= ref1 ? i <= ref1 : i >= ref1; y = ref <= ref1 ? ++i : --i) {
        results.push((function() {
          var j, ref2, ref3, results1;
          results1 = [];
          for (x = j = ref2 = cell.x - 1, ref3 = cell.x + 1; ref2 <= ref3 ? j <= ref3 : j >= ref3; x = ref2 <= ref3 ? ++j : --j) {
            results1.push(this.getPointCell(x, y));
          }
          return results1;
        }).call(this));
      }
      return results;
    }).call(this)));
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
    }).apply(this)).shuffle().shuffle().value().slice(0, +(count - 1) + 1 || 9e9);
    return this.installBombsManually.apply(this, bombPositions);
  };

  Table.prototype.installBombsManually = function() {
    var bombs;
    bombs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    _(this._cells).each(function(cell) {
      return cell.uninstallBomb();
    }).value();
    return _(bombs).map((function(_this) {
      return function(position) {
        _this.getPositionCell(position).installBomb();
        return position;
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
    _(this._bombsCount).each((function(_this) {
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
    if (opened.countBombsAround() === 0) {
      return this.openAround(opened);
    }
  };

  Table.prototype.openAround = function(cell) {
    return _(this.getAroundCells(cell)).each(function(around) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvY29udGV4dHMvZ2FtZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9jb250ZXh0cy9zZXR0aW5nLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2luZGV4LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy9jZWxsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy90YWJsZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC91dGlsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXcuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvY2VsbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9jb25maWd1cmF0aW9uLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2ZhLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2dhbWUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvcHJlc2V0LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3RhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUFVOztBQUUzQixPQUFPLENBQUMsV0FBUixHQUFzQixPQUFBLENBQVEsaUJBQVI7O0FBQ3RCLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7Ozs7QUNIekIsSUFBQSxXQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBckM7T0FBSDtJQURNLENBQVI7R0FEUzs7d0JBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNULEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFLLENBQUMsTUFBbkI7RUFETDs7d0JBR1gsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUNwQjtNQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsS0FBZDs7RUFEb0I7O3dCQUd0QixRQUFBLEdBQVUsU0FBQyxTQUFEO0lBQ1IsMkNBQUEsU0FBQTtJQUVBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUNoQixLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFkLENBQUE7TUFEZ0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBR0EsU0FBQSxDQUFV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U0FBQTtXQUNSLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFiLENBQUEsQ0FBRixDQUEwQixDQUFDLEdBQTNCLENBQStCLFNBQUMsSUFBRDthQUM3QixFQUFBLENBQUc7UUFBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFoQjtRQUFzQixLQUFBLEVBQU8sSUFBN0I7T0FBSDtJQUQ2QixDQUEvQixDQUVDLENBQUMsS0FGRixDQUFBO0VBRFEsQ0FIVjtFQVFBLFNBQUEsRUFBVyxTQUFBO1dBQ1Q7TUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixFQUE1Qjs7RUFEUyxDQVJYO0NBRE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0ID0ge31cblxuQ29udGV4dC5HYW1lQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dHMvZ2FtZSdcbkNvbnRleHQuU2V0dGluZ0NvbnRleHQgPSByZXF1aXJlICcuL2NvbnRleHRzL3NldHRpbmcnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWVDb250ZXh0IGV4dGVuZHMgQXJkYS5Db250ZXh0XG4gIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkdhbWUsIGNvbmZpZzogQHByb3BzLmNvbmZpZyB9XG4gIClcblxuICBpbml0U3RhdGU6IChwcm9wcykgLT5cbiAgICBwcm9wcy50YWJsZSA9IEBjcmVhdGVUYWJsZShwcm9wcy5jb25maWcpXG5cbiAgZXhwYW5kQ29tcG9uZW50UHJvcHM6IChwcm9wcywgc3RhdGUpIC0+XG4gICAgY29uZmlnOiBwcm9wcy50YWJsZVxuXG4gIGRlbGVnYXRlOiAoc3Vic2NyaWJlKSAtPlxuICAgIHN1cGVyXG5cbiAgICBzdWJzY3JpYmUgJ2JhY2snLCA9PlxuICAgICAgQHByb3BzLnJvdXRlci5wb3BDb250ZXh0KClcblxuICAgIHN1YnNjcmliZSAnY2VsbDpyaWdodENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwucm90YXRlTW9kZSgpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG5cbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwub3BlbigpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG5cbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdFJpZ2h0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5vcGVuQXJvdW5kKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAncmVzdGFydCcsID0+XG4gICAgICBAcHJvcHMudGFibGUgPSBAY3JlYXRlVGFibGUoQHByb3BzLmNvbmZpZylcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAndGltZXInLCA9PlxuICAgICAgQHByb3BzLnRhYmxlLmNvbXB1dGVUaW1lKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICBjcmVhdGVUYWJsZTogKGRhdCktPlxuICAgIG5ldyBBcHAuTW9kZWwuVGFibGUoZGF0LndpZHRoLCBkYXQuaGVpZ2h0LCBkYXQuYm9tYnMpIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXR0aW5nQ29udGV4dCBleHRlbmRzIEFyZGEuQ29udGV4dFxuICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5Db25maWd1cmF0aW9uIH1cbiAgKVxuXG4gIGluaXRTdGF0ZTogKHByb3BzKSAtPlxuICAgIHByb3BzXG5cbiAgZXhwYW5kQ29tcG9uZW50UHJvcHM6IChwcm9wcywgc3RhdGUpIC0+XG4gICAgY29uZmlnOiBzdGF0ZS5jb25maWdcblxuICBkZWxlZ2F0ZTogKHN1YnNjcmliZSkgLT5cbiAgICBzdXBlclxuXG4gICAgc3Vic2NyaWJlICdwcmVzZXQnLCAoZGF0KT0+XG4gICAgICBAcHJvcHMucm91dGVyLnB1c2hDb250ZXh0KEFwcC5Db250ZXh0LkdhbWVDb250ZXh0LCB7XG4gICAgICAgIHJvdXRlcjogQHByb3BzLnJvdXRlclxuICAgICAgICBjb25maWc6IGRhdFxuICAgICAgfSlcblxuICAgIHN1YnNjcmliZSAnZnJlZXN0eWxlJywgKGRhdCk9PlxuICAgICAgQHByb3BzLnJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5HYW1lQ29udGV4dCwge1xuICAgICAgICByb3V0ZXI6IEBwcm9wcy5yb3V0ZXJcbiAgICAgICAgY29uZmlnOiBkYXRcbiAgICAgIH0pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFwcCA9IHt9XG5pZiB3aW5kb3c/XG4gIHdpbmRvdy5BcHAgPSBBcHBcbiAgd2luZG93LmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5lbHNlXG4gIGdsb2JhbC5BcHAgPSBBcHBcbiAgZ2xvYmFsLmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5BcHAuQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dCdcbkFwcC5VdGlsID0gcmVxdWlyZSAnLi91dGlsJ1xuQXBwLk1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbCdcbkFwcC5WaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xuXG5jb25zb2xlLmxvZyAnYSdcblxuQXBwLnN0YXJ0ID0gKG5vZGUpLT5cbiAgcm91dGVyID0gbmV3IEFyZGEuUm91dGVyKEFyZGEuRGVmYXVsdExheW91dCwgbm9kZSlcbiAgcm91dGVyLnB1c2hDb250ZXh0KEFwcC5Db250ZXh0LlNldHRpbmdDb250ZXh0LCB7IHJvdXRlcjogcm91dGVyIH0pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IE1vZGVsID0ge31cblxuTW9kZWwuQ2VsbCA9IHJlcXVpcmUgJy4vbW9kZWxzL2NlbGwnXG5Nb2RlbC5UYWJsZSA9IHJlcXVpcmUgJy4vbW9kZWxzL3RhYmxlJ1xuIiwibW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBDZWxsXG4gICAgQHN0YXR1czpcbiAgICAgIG5vbmU6ICdub25lJ1xuICAgICAgZmxhZzogJ2ZsYWcnXG4gICAgICBxdWVzdGlvbjogJ3F1ZXN0aW9uJ1xuICAgICAgb3BlbjogJ29wZW4nXG4gICAgc3RhdGU6IG51bGxcblxuICAgIGNvbnN0cnVjdG9yOiAoQHRhYmxlLCBAeCwgQHkpIC0+XG4gICAgICBAcG9zaXRpb24gPSBAdGFibGUud2lkdGggKiBAeSArIEB4XG4gICAgICBAc3RhdGUgPSBDZWxsLnN0YXR1cy5ub25lXG4gICAgICBAX2JvbWIgPSBmYWxzZVxuXG4gICAgY291bnRCb21ic0Fyb3VuZDogPT5cbiAgICAgIEBfY291bnRlZCA/PSBAdGFibGUuY291bnRCb21ic0Fyb3VuZChAKVxuXG4gICAgY291bnRGbGFnc0Fyb3VuZDogPT5cbiAgICAgIEB0YWJsZS5jb3VudEZsYWdzQXJvdW5kKEApXG5cbiAgICBoYXNCb21iOiAtPlxuICAgICAgQF9ib21iXG5cbiAgICBpc0ZsYWdnZWQ6IC0+XG4gICAgICBAc3RhdGUgPT0gQ2VsbC5zdGF0dXMuZmxhZ1xuXG4gICAgaXNPcGVuZWQ6IC0+XG4gICAgICBAc3RhdGUgPT0gQ2VsbC5zdGF0dXMub3BlblxuXG4gICAgaXNPcGVuYWJsZTotPlxuICAgICAgbm90IEBpc09wZW5lZCgpICYmIEBzdGF0ZSAhPSBDZWxsLnN0YXR1cy5ub25lXG5cbiAgICBpbnN0YWxsQm9tYjogLT5cbiAgICAgIEBfYm9tYiA9IHRydWVcblxuICAgIG9wZW46IC0+XG4gICAgICByZXR1cm4gaWYgQHRhYmxlLmlzTG9ja2VkKClcbiAgICAgIHJldHVybiB0cnVlIGlmIEBpc09wZW5lZCgpIHx8IEBpc09wZW5hYmxlKClcbiAgICAgIEBzdGF0ZSA9IENlbGwuc3RhdHVzLm9wZW5cbiAgICAgIEB0YWJsZS5vcGVuKEApXG5cbiAgICBvcGVuQXJvdW5kOiAtPlxuICAgICAgcmV0dXJuIGlmIEB0YWJsZS5pc0xvY2tlZCgpXG4gICAgICBAdGFibGUub3BlbkFyb3VuZChAKSBpZiBAaXNPcGVuZWQoKSAmJiBAY291bnRCb21ic0Fyb3VuZCgpID09IEBjb3VudEZsYWdzQXJvdW5kKClcblxuICAgIHJvdGF0ZU1vZGU6IC0+XG4gICAgICByZXR1cm4gaWYgQGlzT3BlbmVkKCkgfHwgQHRhYmxlLmxvY2tlZFxuICAgICAgQHN0YXRlID0gc3dpdGNoIEBzdGF0ZVxuICAgICAgICB3aGVuIENlbGwuc3RhdHVzLm5vbmVcbiAgICAgICAgICBDZWxsLnN0YXR1cy5mbGFnXG4gICAgICAgIHdoZW4gQ2VsbC5zdGF0dXMuZmxhZ1xuICAgICAgICAgIENlbGwuc3RhdHVzLnF1ZXN0aW9uXG4gICAgICAgIHdoZW4gQ2VsbC5zdGF0dXMucXVlc3Rpb25cbiAgICAgICAgICBDZWxsLnN0YXR1cy5ub25lXG4gICAgICBAdGFibGUuY29tcHV0ZVJlc3RCb21ic0NvdW50KClcblxuICAgIHVuaW5zdGFsbEJvbWI6IC0+XG4gICAgICBAX2JvbWIgPSBmYWxzZVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUYWJsZVxuICBAc3RhdHVzOlxuICAgIHBsYXk6ICdwbGF5J1xuICAgIHdpbjogJ3dpbidcbiAgICBsb3NlOiAnbG9zZSdcbiAgc3RhdGU6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEB3aWR0aCwgQGhlaWdodCwgQF9ib21ic0NvdW50ID0gMSkgLT5cbiAgICB0aHJvdyAnbm8gYm9tYnMnIGlmIEBfYm9tYnNDb3VudCA8IDFcbiAgICB0aHJvdyAnb3ZlciBib21icycgaWYgQF9ib21ic0NvdW50ID49IEB3aWR0aCAqIEBoZWlnaHRcblxuICAgIEBfY2VsbHMgPSBAaW5pdENlbGxzKClcbiAgICBAX2JvbWJDZWxsUG9zaXRpb25zID0gQGluc3RhbGxCb21icyhAX2JvbWJzQ291bnQpXG4gICAgQF9zdGFydGVkVGltZSA9ICtuZXcgRGF0ZSgpXG4gICAgQHBhc3NlZFRpbWUgPSAwXG4gICAgQHJlc3RCb21zQ291bnQgPSBAX2JvbWJzQ291bnRcbiAgICBAX2JsYW5rQ2VsbHNDb3VudCA9IEBfY2VsbHMubGVuZ3RoIC0gQF9ib21ic0NvdW50XG4gICAgQHN0YXRlID0gVGFibGUuc3RhdHVzLnBsYXlcblxuICBjb21wdXRlVGltZTogLT5cbiAgICByZXR1cm4gaWYgQGlzTG9ja2VkKClcbiAgICBAcGFzc2VkVGltZSA9IF8oKCtuZXcgRGF0ZSgpIC0gQF9zdGFydGVkVGltZSkgLyAxMDAwKS5mbG9vcigpXG5cbiAgY291bnRCb21ic0Fyb3VuZDogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRDZWxscyhjZWxsKSkuZmlsdGVyKChwaWNrZWQpLT5cbiAgICAgIHBpY2tlZCAmJiBwaWNrZWQuaGFzQm9tYigpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50RmxhZ3NBcm91bmQ6IChjZWxsKS0+XG4gICAgXyhAZ2V0QXJvdW5kQ2VsbHMoY2VsbCkpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmlzRmxhZ2dlZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50RmxhZ2dlZENlbGw6IC0+XG4gICAgXyhAX2NlbGxzKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkICYmIHBpY2tlZC5pc0ZsYWdnZWQoKVxuICAgICkudmFsdWUoKS5sZW5ndGhcblxuICBjb3VudE9wZW5lZENlbGw6IC0+XG4gICAgXyhAX2NlbGxzKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkICYmIHBpY2tlZC5pc09wZW5lZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50UmVzdEJvbWJzOiAtPlxuICAgIEBfYm9tYnNDb3VudCAtIEBjb3VudEZsYWdnZWRDZWxsKClcblxuICBjb21wdXRlUmVzdEJvbWJzQ291bnQ6IC0+XG4gICAgQHJlc3RCb21zQ291bnQgPSBAY291bnRSZXN0Qm9tYnMoKVxuXG4gIGdldEFyb3VuZENlbGxzOiAoY2VsbCktPlxuICAgIF8uY29tcGFjdChfLmZsYXR0ZW4oZm9yIHkgaW4gWyhjZWxsLnkgLSAxKS4uKGNlbGwueSArIDEpXVxuICAgICAgZm9yIHggaW4gWyhjZWxsLnggLSAxKS4uKGNlbGwueCArIDEpXVxuICAgICAgICBAZ2V0UG9pbnRDZWxsKHgsIHkpKSlcblxuICBnZXRDZWxsczogLT5cbiAgICBAX2NlbGxzXG5cbiAgZ2V0UG9pbnRDZWxsOiAoeCwgeSktPlxuICAgIHJldHVybiBudWxsIGlmIHggPCAwIHx8IHkgPCAwIHx8IHggPiBAd2lkdGggLSAxIHx8IHkgPiBAaGVpZ2h0IC0gMVxuICAgIEBnZXRQb3NpdGlvbkNlbGwoeSAqIEB3aWR0aCArIHgpXG5cbiAgZ2V0UG9zaXRpb25DZWxsOiAocG9zaXRpb24pIC0+XG4gICAgQF9jZWxsc1twb3NpdGlvbl1cblxuICBpbml0Q2VsbHM6ID0+XG4gICAgXyhbMC4uKEBoZWlnaHQgLSAxKV0pLm1hcCgoeSk9PlxuICAgICAgXyhbMC4uKEB3aWR0aCAtIDEpXSkubWFwKCh4KT0+XG4gICAgICAgIG5ldyBBcHAuTW9kZWwuQ2VsbChALCB4LCB5KVxuICAgICAgKS52YWx1ZSgpXG4gICAgKS5mbGF0dGVuKCkudmFsdWUoKVxuXG4gIGluc3RhbGxCb21iczogKGNvdW50KS0+XG4gICAgYm9tYlBvc2l0aW9ucyA9IF8oWzAuLihAX2NlbGxzLmxlbmd0aCAtIDEpXSkuc2h1ZmZsZSgpLnNodWZmbGUoKS52YWx1ZSgpWzAuLihjb3VudCAtIDEpXVxuICAgIEBpbnN0YWxsQm9tYnNNYW51YWxseShib21iUG9zaXRpb25zLi4uKVxuXG4gIGluc3RhbGxCb21ic01hbnVhbGx5OiAoYm9tYnMuLi4pLT5cbiAgICBfKEBfY2VsbHMpLmVhY2goKGNlbGwpLT5cbiAgICAgIGNlbGwudW5pbnN0YWxsQm9tYigpXG4gICAgKS52YWx1ZSgpXG5cbiAgICBfKGJvbWJzKS5tYXAoKHBvc2l0aW9uKT0+XG4gICAgICBAZ2V0UG9zaXRpb25DZWxsKHBvc2l0aW9uKS5pbnN0YWxsQm9tYigpXG4gICAgICBwb3NpdGlvblxuICAgICkudmFsdWUoKVxuXG4gIGlzTG9ja2VkOiAtPlxuICAgIEBsb2NrZWRcblxuICBsb2NrOiAtPlxuICAgIEBsb2NrZWQgPSB0cnVlXG5cbiAgbG9zZTogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy5sb3NlXG4gICAgXyhAX2JvbWJzQ291bnQpLmVhY2goKHBvc2l0aW9uKT0+IEBnZXRQb3NpdGlvbkNlbGwocG9zaXRpb24pLm9wZW4oKSlcbiAgICBAbG9jaygpXG5cbiAgb3BlbjogKG9wZW5lZCkgLT5cbiAgICByZXR1cm4gaWYgQGlzTG9ja2VkKClcbiAgICByZXR1cm4gQGxvc2UoKSBpZiBvcGVuZWQuaGFzQm9tYigpXG4gICAgcmV0dXJuIEB3aW4oKSBpZiBAX2JsYW5rQ2VsbHNDb3VudCA9PSBAY291bnRPcGVuZWRDZWxsKClcblxuICAgIGlmIG9wZW5lZC5jb3VudEJvbWJzQXJvdW5kKCkgPT0gMFxuICAgICAgQG9wZW5Bcm91bmQob3BlbmVkKVxuXG4gIG9wZW5Bcm91bmQ6IChjZWxsKS0+XG4gICAgXyhAZ2V0QXJvdW5kQ2VsbHMoY2VsbCkpLmVhY2goKGFyb3VuZCktPiBhcm91bmQub3BlbigpKS52YWx1ZSgpXG5cbiAgdW5sb2NrOiAtPlxuICAgIEBsb2NrZWQgPSBmYWxzZVxuXG4gIHdpbjogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy53aW5cbiAgICBAbG9jaygpXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgIyMjXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnTjgpLlpInlvaJcblxuICBjZShvYmplY3QpXG4gICAgb2JqZWN0LiRjbiAtPiBjbGFzc05hbWVcbiAgICBvYmplY3QuJGVsIC0+IOOCv+OCsOWQjVxuICAgIG9iamVjdC4kaW5jIC0+IOacq+WwvuW8leaVsOOAgeOBguOCi+OBhOOBr+WPr+WkiemVt+W8leaVsOOBqOOBl+OBpua4oeOBleOCjOOCi+WApFxuICAgIG9iamVjdCAtPiDlvJXmlbDjga/jgZ3jga7jgb7jgb5wcm9wc+OBqOOBl+OBpua4oeOBleOCjOOCi1xuXG4gIOaZrumAmlxuXG4gICAgIGNlIHskZWw6ICdkaXYnLCAkY246ICdzaG9ydCcsICRpbmM6ICd0ZXh0J31cblxuICAgICA8ZGl2IGNsYXNzTmFtZT1cInNob3J0XCI+XG4gICAgICAgdGV4dFxuICAgICA8L2Rpdj5cblxuICDlhaXjgozlrZBcblxuICAgICBJdGVtID0gUmVhY3RDbGFzc1xuICAgICAgIHJlbmRlcjogLT5cbiAgICAgICAgIGNlIHskZWw6ICdsaScsICRpbmM6ICdpdGVtJ31cblxuICAgICBjZSB7JGVsOiAndWwnLCAkaW5jOiBbSXRlbSwgSXRlbV19XG5cbiAgICAgPHVsPlxuICAgICAgIHtJdGVtfVxuICAgICAgIHtJdGVtfVxuICAgICA8L3VsPlxuICAjIyNcbiAgY2U6IChvYmplY3QpLT5cbiAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgd2hlbiBvYmplY3Q/Lmhhc093blByb3BlcnR5KCckZWwnKVxuICAgICAgICBvYmplY3QuY2xhc3NOYW1lID0gb2JqZWN0LiRjblxuICAgICAgICBjaGlsZHJlbiA9IEBjZShvYmplY3QuJGluYylcbiAgICAgICAgaWYgXy5pc0FycmF5KGNoaWxkcmVuKVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbi4uLilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbilcbiAgICAgIHdoZW4gXy5pc0FycmF5KG9iamVjdClcbiAgICAgICAgZm9yIGNoaWxkIGluIG9iamVjdFxuICAgICAgICAgIEBjZShjaGlsZClcbiAgICAgIHdoZW4gXy5pc1N0cmluZyhvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgd2hlbiBfLmlzTnVtYmVyKG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICB3aGVuIF8uaXNPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIGVsc2VcbiAgICAgICAgJydcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gVmlldyA9IHt9XG5cblZpZXcuVGFibGUgPSByZXF1aXJlICcuL3ZpZXdzL3RhYmxlJ1xuVmlldy5DZWxsID0gcmVxdWlyZSAnLi92aWV3cy9jZWxsJ1xuVmlldy5GYSA9IHJlcXVpcmUgJy4vdmlld3MvZmEnXG5WaWV3LkNvbmZpZ3VyYXRpb24gPSByZXF1aXJlICcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24nXG5WaWV3LlByZXNldCA9IHJlcXVpcmUgJy4vdmlld3MvcHJlc2V0J1xuVmlldy5HYW1lID0gcmVxdWlyZSAnLi92aWV3cy9nYW1lJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBDZWxsID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnbGknLCAkY246IEBnZW5DbGFzc2VzKCksIHJlZjogJ2NlbGwnLCAkaW5jOiBAZ2VuSW5jcygpIH1cblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBjZWxsID0gUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuY2VsbClcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCBAb25Db250ZXh0TWVudSlcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgQG9uTW91c2VEb3duKVxuXG4gICAgQHNldFN0YXRlKGNlbGw6IGNlbGwpXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IC0+XG4gICAgY2VsbCA9IEBzdGF0ZS5jZWxsXG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgQG9uQ29udGV4dE1lbnUpXG4gICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bilcblxuICBnZW5DbGFzc2VzOiAtPlxuICAgIGNsYXNzZXMgPSBbJ2NlbGwnXVxuICAgIGNsYXNzZXMucHVzaCgnb3BlbmVkJykgaWYgQHByb3BzLm1vZGVsLmlzT3BlbmVkKClcbiAgICBjbGFzc2VzLmpvaW4oJyAnKVxuXG4gIGdlbkluY3M6IC0+XG4gICAgcmV0dXJuIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogQHByb3BzLm1vZGVsLnN0YXRlIH0gaWYgbm90IEBwcm9wcy5tb2RlbC5pc09wZW5lZCgpXG5cbiAgICBpZiBAcHJvcHMubW9kZWwuaGFzQm9tYigpXG4gICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdib21iJyB9XG4gICAgZWxzZVxuICAgICAgY291bnQgPSBAcHJvcHMubW9kZWwuY291bnRCb21ic0Fyb3VuZCgpXG4gICAgICBpZiBjb3VudCA9PSAwXG4gICAgICAgICcnXG4gICAgICBlbHNlXG4gICAgICAgIGNvdW50XG4gIG9uQ29udGV4dE1lbnU6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgb25Nb3VzZURvd246IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgZS5idXR0b25zP1xuICAgICAgc3dpdGNoIChlLmJ1dHRvbnMpXG4gICAgICAgIHdoZW4gMVxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpyaWdodENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDNcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdFJpZ2h0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gNFxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDptaWRkbGVDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICBlbHNlIGlmIGUuYnV0dG9uP1xuICAgICAgc3dpdGNoIChlLmJ1dHRvbilcbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOm1pZGRsZUNsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6cmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICBlbHNlXG4gICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdENsaWNrJywgQHByb3BzLm1vZGVsKVxuKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBDb25maWd1cmF0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgaW5pdGlhbFN0YXRlOlxuICAgIHdpZHRoOiA5XG4gICAgaGVpZ2h0OiA5XG4gICAgYm9tYnM6IDEwXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIEBpbml0aWFsU3RhdGVcblxuICByZW5kZXI6IC0+XG4gICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb250YWluZXIgY29uZi1wYWdlJywgJGluYzogW1xuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ21haW4tdGl0bGUnLCAkaW5jOiAnTm8gTWluZXMgTGFuZCcgfVxuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ2NvbmYtcGFnZSB0aXRsZScsICRpbmM6ICfjg5fjg6rjgrvjg4Pjg4gnIH1cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICdjb25mLXBhZ2UgcHJlc2V0LWdhbWVzJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBwcmVzZXQ6IHsgbmFtZTogJ+WInee0micsIGRhdDogeyB3aWR0aDogOSwgaGVpZ2h0OiA5LCBib21iczogMTAgfSB9IH1cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlByZXNldCwgcHJlc2V0OiB7IG5hbWU6ICfkuK3ntJonLCBkYXQ6IHsgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2LCBib21iczogNDAgfSB9IH1cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlByZXNldCwgcHJlc2V0OiB7IG5hbWU6ICfkuIrntJonLCBkYXQ6IHsgd2lkdGg6IDMwLCBoZWlnaHQ6IDE2LCBib21iczogOTkgfSB9IH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdoMScsICRjbjogJ2NvbmYtcGFnZSB0aXRsZScsICRpbmM6ICfjg5Xjg6rjg7zjgrnjgr/jgqTjg6snIH1cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICdjb25mLXBhZ2UgZm9ybS1sYXlvdXQnLCAkaW5jOiBbXG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiAn5qiqJyB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ3dpZHRoJywgdmFsdWU6IEBzdGF0ZS53aWR0aCwgb25DaGFuZ2U6IEBnZW5PbkNoYW5nZVZhbHVlKCd3aWR0aCcpIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiAn57imJyB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2hlaWdodCcsIHZhbHVlOiBAc3RhdGUuaGVpZ2h0LCBvbkNoYW5nZTogQGdlbk9uQ2hhbmdlVmFsdWUoJ2hlaWdodCcpIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgaW5wdXQtdGl0bGUtbGF5b3V0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdpbnB1dC10aXRsZSBjb25mLXBhZ2UnLCAkaW5jOiBbXG4gICAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdib21iJywgZml4ZWRXaWR0aDogdHJ1ZSB9XG4gICAgICAgICAgXSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2JvbWJzJywgdmFsdWU6IEBzdGF0ZS5ib21icywgb25DaGFuZ2U6IEBnZW5PbkNoYW5nZVZhbHVlKCdib21icycpIH1cbiAgICAgICAgXSB9XG4gICAgICBdIH1cbiAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiAnYnRuIGJ0bi1zdWNjZXNzIGNvbmYtcGFnZSB3aWRlJywgb25DbGljazogQG9uQ2xpY2tGcmVlU3R5bGUsICRpbmM6ICfjgrnjgr/jg7zjg4gnIH1cbiAgICBdIH1cblxuICBnZW5PbkNoYW5nZVZhbHVlOiAodGFyZ2V0KS0+XG4gICAgKGUpPT5cbiAgICAgIHN0YXRlID0ge31cbiAgICAgIHZhbHVlID0gK2UudGFyZ2V0LnZhbHVlXG5cbiAgICAgIHN0YXRlW3RhcmdldF0gPSBzd2l0Y2ggdHJ1ZVxuICAgICAgICB3aGVuIF8uaXNOYU4odmFsdWUpXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG4gICAgICAgIHdoZW4gdmFsdWUgPCAxXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG4gICAgICAgIHdoZW4gXy5pc051bWJlcih2YWx1ZSlcbiAgICAgICAgICB2YWx1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQGluaXRpYWxTdGF0ZVt0YXJnZXRdXG5cbiAgICAgIEBzZXRTdGF0ZShzdGF0ZSlcblxuICBvbkNsaWNrRnJlZVN0eWxlOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAnZnJlZXN0eWxlJywge1xuICAgICAgd2lkdGg6IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLndpZHRoKS52YWx1ZVxuICAgICAgaGVpZ2h0OiBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy5oZWlnaHQpLnZhbHVlXG4gICAgICBib21iczogUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuYm9tYnMpLnZhbHVlXG4gICAgfVxuKSIsIm1vZHVsZS5leHBvcnRzID1cbiAgRmEgPSBSZWFjdC5jcmVhdGVDbGFzcyAoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2xhc3NlcyA9IFsnZmEnXVxuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtI3tAcHJvcHMuaWNvbn1cIilcbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLnNjYWxlfXhcIikgaWYgQHByb3BzLnNjYWxlP1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1mdycpIGlmIEBwcm9wcy5maXhlZFdpZHRoXG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWxpJykgaWYgQHByb3BzLmxpc3RcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtYm9yZGVyJykgaWYgQHByb3BzLmJvcmRlclxuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtcHVsbC0je0Bwcm9wcy5wdWxsfVwiKSBpZiBAcHJvcHMucHVsbD9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLmFuaW1hdGlvbn1cIikgaWYgQHByb3BzLmFuaW1hdGlvbj9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLXJvdGF0ZS0je0Bwcm9wcy5yb3RhdGV9XCIpIGlmIEBwcm9wcy5yb3RhdGU/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1mbGlwLSN7QHByb3BzLmFuaW1hdGlvbn1cIikgaWYgQHByb3BzLmZsaXA/XG5cbiAgICAgIGNlIHsgJGVsOiAnaScsICRjbjogY2xhc3Nlcy5qb2luKCcgJykgfVxuICApXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEdhbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cblxuICByZW5kZXI6IC0+XG4gICAgdGFibGUgPSBAcHJvcHMuY29uZmlnXG5cbiAgICBjZSB7ICRlbDogJ2RpdicsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnaDEnLCAkY246ICdtYWluLXRpdGxlJywgJGluYzogJ05vIE1pbmVzIExhbmQnIH1cbiAgICAgIGNlIHsgJGVsOiAnaGVhZGVyJywgJGNuOiAnZ2FtZS1wYWdlIGhlYWRlcicsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdnYW1lLXBhZ2UgdGltZScsICRpbmM6IFtcbiAgICAgICAgICB0YWJsZS5wYXNzZWRUaW1lXG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2dhbWUtcGFnZSByZXN0YXJ0JywgJGluYzogW1xuICAgICAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiBcImJ0biBidG4tI3tAZGV0ZWN0Q29sb3IoKX0gZ2FtZS1wYWdlIHdpZGVcIiwgb25DbGljazogQG9uQ2xpY2tSZXN0YXJ0LCAkaW5jOiBbXG4gICAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246IEBkZXRlY3RGYWNlKCksIHNjYWxlOiAyIH1cbiAgICAgICAgICBdIH1cbiAgICAgICAgXSB9XG4gICAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnZ2FtZS1wYWdlIHJlc3QnLCAkaW5jOiBbXG4gICAgICAgICAgdGFibGUucmVzdEJvbXNDb3VudFxuICAgICAgICBdIH1cbiAgICAgXSB9XG4gICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NsZWFyZml4JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuVGFibGUsIG1vZGVsOiBAcHJvcHMuY29uZmlnIH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdmb290ZXInLCAkY246ICdnYW1lLXBhZ2UgZm9vdGVyJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tc3VjY2VzcyBjb25mLXBhZ2UnLCBvbkNsaWNrOiBAb25DbGlja0JhY2ssICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdjaGV2cm9uLWNpcmNsZS1sZWZ0JyB9XG4gICAgICAgICAgJyDjgoLjganjgosnXG4gICAgICAgIF0gfVxuICAgICAgXSB9XG4gICAgXSB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgQHNpZCA9IHNldEludGVydmFsKCg9PlxuICAgICAgQGRpc3BhdGNoICd0aW1lcidcbiAgICApLCAxMDAwKVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxuICAgIGNsZWFySW50ZXJ2YWwoQHNpZClcblxuICBkZXRlY3RDb2xvcjogLT5cbiAgICBzd2l0Y2ggQHByb3BzLmNvbmZpZy5zdGF0ZVxuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLnBsYXlcbiAgICAgICAgJ2RlZmF1bHQnXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMud2luXG4gICAgICAgICdwcmltYXJ5J1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLmxvc2VcbiAgICAgICAgJ2RhbmdlcidcblxuICBkZXRlY3RGYWNlOiAtPlxuICAgIHN3aXRjaCBAcHJvcHMuY29uZmlnLnN0YXRlXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMucGxheVxuICAgICAgICAnbWVoLW8nXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMud2luXG4gICAgICAgICdzbWlsZS1vJ1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLmxvc2VcbiAgICAgICAgJ2Zyb3duLW8nXG5cbiAgb25DbGlja0JhY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoICdiYWNrJ1xuXG4gIG9uQ2xpY2tSZXN0YXJ0OiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAncmVzdGFydCdcbilcblxuIiwibW9kdWxlLmV4cG9ydHMgPSBQcmVzZXQgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cblxuICByZW5kZXI6IC0+XG4gICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBwcmVzZXQnLCAkaW5jOiBbXG4gICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tcHJpbWFyeSBjb25mLXBhZ2Ugd2lkZScsIG9uQ2xpY2s6IEBvbkNsaWNrLCAkaW5jOiBAcHJvcHMucHJlc2V0Lm5hbWUgfVxuICAgIF0gfVxuXG4gIG9uQ2xpY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoKCdwcmVzZXQnLCBAcHJvcHMucHJlc2V0LmRhdClcbikiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIFRhYmxlID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6ICd1bCcsICRjbjogJ3RhYmxlJywgJGluYzogQGdlbkNlbGxzKCksIHN0eWxlOiBAZ2VuU3R5bGVzKCkgfVxuXG4gICAgZ2VuQ2VsbHM6IC0+XG4gICAgICBfKEBwcm9wcy5tb2RlbC5nZXRDZWxscygpKS5tYXAoKGNlbGwpLT5cbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkNlbGwsIG1vZGVsOiBjZWxsIH1cbiAgICAgICkudmFsdWUoKVxuXG4gICAgZ2VuU3R5bGVzOiAtPlxuICAgICAgd2lkdGg6IEBwcm9wcy5tb2RlbC53aWR0aCAqIDMwXG4gIClcbiJdfQ==
