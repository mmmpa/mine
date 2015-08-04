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
    return _(this.getAroundUnopenedCells(cell)).filter(function(picked) {
      return picked && picked.hasBomb();
    }).value().length;
  };

  Table.prototype.countFlagsAround = function(cell) {
    return _(this.getAroundUnopenedCells(cell)).filter(function(picked) {
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
    return _(this.getAroundUnopenedCells(cell)).each(function(around) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvY29udGV4dHMvZ2FtZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9jb250ZXh0cy9zZXR0aW5nLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2luZGV4LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy9jZWxsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy90YWJsZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC91dGlsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXcuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvY2VsbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9jb25maWd1cmF0aW9uLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2ZhLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2dhbWUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvcHJlc2V0LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3RhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUFVOztBQUUzQixPQUFPLENBQUMsV0FBUixHQUFzQixPQUFBLENBQVEsaUJBQVI7O0FBQ3RCLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7Ozs7QUNIekIsSUFBQSxXQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBckM7T0FBSDtJQURNLENBQVI7R0FEUzs7d0JBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNULEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFLLENBQUMsTUFBbkI7RUFETDs7d0JBR1gsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUNwQjtNQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsS0FBZDs7RUFEb0I7O3dCQUd0QixRQUFBLEdBQVUsU0FBQyxTQUFEO0lBQ1IsMkNBQUEsU0FBQTtJQUVBLFNBQUEsQ0FBVSxNQUFWLEVBQWtCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUNoQixLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFkLENBQUE7TUFEZ0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBR0EsU0FBQSxDQUFVLGlCQUFWLEVBQTZCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxJQUFEO1FBQzNCLElBQUksQ0FBQyxVQUFMLENBQUE7ZUFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLFNBQUMsS0FBRDtpQkFBVztZQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsTUFBZDs7UUFBWCxDQUFSO01BRjJCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtJQUlBLFNBQUEsQ0FBVSxnQkFBVixFQUE0QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtRQUMxQixJQUFJLENBQUMsSUFBTCxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLEtBQUQ7aUJBQVc7WUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQWQ7O1FBQVgsQ0FBUjtNQUYwQjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUI7SUFJQSxTQUFBLENBQVUscUJBQVYsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLElBQUQ7UUFDL0IsSUFBSSxDQUFDLFVBQUwsQ0FBQTtlQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxLQUFEO2lCQUFXO1lBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxNQUFkOztRQUFYLENBQVI7TUFGK0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO0lBSUEsU0FBQSxDQUFVLFNBQVYsRUFBcUIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ25CLEtBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxHQUFlLEtBQUMsQ0FBQSxXQUFELENBQWEsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQUFwQjtlQUNmLEtBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxLQUFEO2lCQUFXO1lBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxNQUFkOztRQUFYLENBQVI7TUFGbUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO1dBSUEsU0FBQSxDQUFVLE9BQVYsRUFBbUIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ2pCLEtBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLFdBQWIsQ0FBQTtlQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxLQUFEO2lCQUFXO1lBQUEsTUFBQSxFQUFRLEtBQUssQ0FBQyxNQUFkOztRQUFYLENBQVI7TUFGaUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5CO0VBdEJROzt3QkEwQlYsV0FBQSxHQUFhLFNBQUMsR0FBRDtXQUNQLElBQUEsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFWLENBQWdCLEdBQUcsQ0FBQyxLQUFwQixFQUEyQixHQUFHLENBQUMsTUFBL0IsRUFBdUMsR0FBRyxDQUFDLEtBQTNDO0VBRE87Ozs7R0F0QzRCLElBQUksQ0FBQzs7Ozs7QUNBaEQsSUFBQSxjQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzJCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBaEI7T0FBSDtJQURNLENBQVI7R0FEUzs7MkJBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNUO0VBRFM7OzJCQUdYLG9CQUFBLEdBQXNCLFNBQUMsS0FBRCxFQUFRLEtBQVI7V0FDcEI7TUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQWQ7O0VBRG9COzsyQkFHdEIsUUFBQSxHQUFVLFNBQUMsU0FBRDtJQUNSLDhDQUFBLFNBQUE7SUFFQSxTQUFBLENBQVUsUUFBVixFQUFvQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsR0FBRDtlQUNsQixLQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFkLENBQTBCLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBdEMsRUFBbUQ7VUFDakQsTUFBQSxFQUFRLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFEa0M7VUFFakQsTUFBQSxFQUFRLEdBRnlDO1NBQW5EO01BRGtCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQjtXQU1BLFNBQUEsQ0FBVSxXQUFWLEVBQXVCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxHQUFEO2VBQ3JCLEtBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQWQsQ0FBMEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUF0QyxFQUFtRDtVQUNqRCxNQUFBLEVBQVEsS0FBQyxDQUFBLEtBQUssQ0FBQyxNQURrQztVQUVqRCxNQUFBLEVBQVEsR0FGeUM7U0FBbkQ7TUFEcUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0VBVFE7Ozs7R0Faa0MsSUFBSSxDQUFDOzs7OztBQ0FuRCxJQUFBLEdBQUE7RUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLEdBQU07O0FBRXZCLElBQUcsZ0RBQUg7RUFDRSxNQUFNLENBQUMsR0FBUCxHQUFhO0VBQ2IsTUFBTSxDQUFDLEVBQVAsR0FBWSxTQUFBO0FBQ1YsUUFBQTtJQURXO1dBQ1gsT0FBQSxHQUFHLENBQUMsSUFBSixDQUFRLENBQUMsRUFBVCxZQUFZLElBQVo7RUFEVSxFQUZkO0NBQUEsTUFBQTtFQUtFLE1BQU0sQ0FBQyxHQUFQLEdBQWE7RUFDYixNQUFNLENBQUMsRUFBUCxHQUFZLFNBQUE7QUFDVixRQUFBO0lBRFc7V0FDWCxPQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVEsQ0FBQyxFQUFULFlBQVksSUFBWjtFQURVLEVBTmQ7OztBQVNBLEdBQUcsQ0FBQyxPQUFKLEdBQWMsT0FBQSxDQUFRLFdBQVI7O0FBQ2QsR0FBRyxDQUFDLElBQUosR0FBVyxPQUFBLENBQVEsUUFBUjs7QUFDWCxHQUFHLENBQUMsS0FBSixHQUFZLE9BQUEsQ0FBUSxTQUFSOztBQUNaLEdBQUcsQ0FBQyxJQUFKLEdBQVcsT0FBQSxDQUFRLFFBQVI7O0FBRVgsR0FBRyxDQUFDLEtBQUosR0FBWSxTQUFDLElBQUQ7QUFDVixNQUFBO0VBQUEsTUFBQSxHQUFhLElBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBWSxJQUFJLENBQUMsYUFBakIsRUFBZ0MsSUFBaEM7U0FDYixNQUFNLENBQUMsV0FBUCxDQUFtQixHQUFHLENBQUMsT0FBTyxDQUFDLGNBQS9CLEVBQStDO0lBQUUsTUFBQSxFQUFRLE1BQVY7R0FBL0M7QUFGVTs7Ozs7OztBQ2hCWixJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsR0FBUTs7QUFFekIsS0FBSyxDQUFDLElBQU4sR0FBYSxPQUFBLENBQVEsZUFBUjs7QUFDYixLQUFLLENBQUMsS0FBTixHQUFjLE9BQUEsQ0FBUSxnQkFBUjs7Ozs7QUNIZCxJQUFBLElBQUE7RUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0VBQ0osSUFBQyxDQUFBLE1BQUQsR0FDRTtJQUFBLElBQUEsRUFBTSxNQUFOO0lBQ0EsSUFBQSxFQUFNLE1BRE47SUFFQSxRQUFBLEVBQVUsVUFGVjtJQUdBLElBQUEsRUFBTSxNQUhOOzs7aUJBSUYsS0FBQSxHQUFPOztFQUVNLGNBQUMsS0FBRCxFQUFTLENBQVQsRUFBYSxDQUFiO0lBQUMsSUFBQyxDQUFBLFFBQUQ7SUFBUSxJQUFDLENBQUEsSUFBRDtJQUFJLElBQUMsQ0FBQSxJQUFEOzs7SUFDeEIsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxJQUFDLENBQUEsQ0FBaEIsR0FBb0IsSUFBQyxDQUFBO0lBQ2pDLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixJQUFDLENBQUEsS0FBRCxHQUFTO0VBSEU7O2lCQUtiLGdCQUFBLEdBQWtCLFNBQUE7bUNBQ2hCLElBQUMsQ0FBQSxXQUFELElBQUMsQ0FBQSxXQUFZLElBQUMsQ0FBQSxLQUFLLENBQUMsZ0JBQVAsQ0FBd0IsSUFBeEI7RUFERzs7aUJBR2xCLGdCQUFBLEdBQWtCLFNBQUE7V0FDaEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxnQkFBUCxDQUF3QixJQUF4QjtFQURnQjs7aUJBR2xCLE9BQUEsR0FBUyxTQUFBO1dBQ1AsSUFBQyxDQUFBO0VBRE07O2lCQUdULFNBQUEsR0FBVyxTQUFBO1dBQ1QsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDO0VBRGI7O2lCQUdYLFFBQUEsR0FBVSxTQUFBO1dBQ1IsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDO0VBRGQ7O2lCQUdWLFVBQUEsR0FBVyxTQUFBO1dBQ1QsQ0FBSSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUosSUFBbUIsSUFBQyxDQUFBLEtBQUQsS0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDO0VBRGhDOztpQkFHWCxXQUFBLEdBQWEsU0FBQTtXQUNYLElBQUMsQ0FBQSxLQUFELEdBQVM7RUFERTs7aUJBR2IsSUFBQSxHQUFNLFNBQUE7SUFDSixJQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxDQUFBLENBQVY7QUFBQSxhQUFBOztJQUNBLElBQWUsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLElBQWUsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUE5QjtBQUFBLGFBQU8sS0FBUDs7SUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUM7V0FDckIsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWjtFQUpJOztpQkFNTixVQUFBLEdBQVksU0FBQTtJQUNWLElBQVUsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQUEsQ0FBVjtBQUFBLGFBQUE7O0lBQ0EsSUFBd0IsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLElBQWUsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBQSxLQUF1QixJQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUE5RDthQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxDQUFrQixJQUFsQixFQUFBOztFQUZVOztpQkFJWixVQUFBLEdBQVksU0FBQTtJQUNWLElBQVUsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLElBQWUsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFoQztBQUFBLGFBQUE7O0lBQ0EsSUFBQyxDQUFBLEtBQUQ7QUFBUyxjQUFPLElBQUMsQ0FBQSxLQUFSO0FBQUEsYUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLElBRFY7aUJBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUZQLGFBR0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUhWO2lCQUlMLElBQUksQ0FBQyxNQUFNLENBQUM7QUFKUCxhQUtGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFMVjtpQkFNTCxJQUFJLENBQUMsTUFBTSxDQUFDO0FBTlA7O1dBT1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxxQkFBUCxDQUFBO0VBVFU7O2lCQVdaLGFBQUEsR0FBZSxTQUFBO1dBQ2IsSUFBQyxDQUFBLEtBQUQsR0FBUztFQURJOzs7Ozs7Ozs7QUN4RG5CLElBQUEsS0FBQTtFQUFBOzs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtFQUNyQixLQUFDLENBQUEsTUFBRCxHQUNFO0lBQUEsSUFBQSxFQUFNLE1BQU47SUFDQSxHQUFBLEVBQUssS0FETDtJQUVBLElBQUEsRUFBTSxNQUZOOzs7a0JBR0YsS0FBQSxHQUFPOztFQUVNLGVBQUMsS0FBRCxFQUFTLE1BQVQsRUFBa0IsV0FBbEI7SUFBQyxJQUFDLENBQUEsUUFBRDtJQUFRLElBQUMsQ0FBQSxTQUFEO0lBQVMsSUFBQyxDQUFBLG9DQUFELGNBQWU7O0lBQzVDLElBQW9CLElBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBbkM7QUFBQSxZQUFNLFdBQU47O0lBQ0EsSUFBc0IsSUFBQyxDQUFBLFdBQUQsSUFBZ0IsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBaEQ7QUFBQSxZQUFNLGFBQU47O0lBRUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBQ1YsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFdBQWY7SUFDdEIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBSyxJQUFBLElBQUEsQ0FBQTtJQUNyQixJQUFDLENBQUEsVUFBRCxHQUFjO0lBQ2QsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBQyxDQUFBO0lBQ2xCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsSUFBQyxDQUFBO0lBQ3RDLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLE1BQU0sQ0FBQztFQVZYOztrQkFZYixXQUFBLEdBQWEsU0FBQTtJQUNYLElBQVUsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFWO0FBQUEsYUFBQTs7V0FDQSxJQUFDLENBQUEsVUFBRCxHQUFjLENBQUEsQ0FBRSxDQUFDLENBQUssSUFBQSxJQUFBLENBQUEsQ0FBTCxHQUFjLElBQUMsQ0FBQSxZQUFoQixDQUFBLEdBQWdDLElBQWxDLENBQXVDLENBQUMsS0FBeEMsQ0FBQTtFQUZIOztrQkFJYixnQkFBQSxHQUFrQixTQUFDLElBQUQ7V0FDaEIsQ0FBQSxDQUFFLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUF4QixDQUFGLENBQWdDLENBQUMsTUFBakMsQ0FBd0MsU0FBQyxNQUFEO2FBQ3RDLE1BQUEsSUFBVSxNQUFNLENBQUMsT0FBUCxDQUFBO0lBRDRCLENBQXhDLENBRUMsQ0FBQyxLQUZGLENBQUEsQ0FFUyxDQUFDO0VBSE07O2tCQUtsQixnQkFBQSxHQUFrQixTQUFDLElBQUQ7V0FDaEIsQ0FBQSxDQUFFLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUF4QixDQUFGLENBQWdDLENBQUMsTUFBakMsQ0FBd0MsU0FBQyxNQUFEO2FBQ3RDLE1BQUEsSUFBVSxNQUFNLENBQUMsU0FBUCxDQUFBO0lBRDRCLENBQXhDLENBRUMsQ0FBQyxLQUZGLENBQUEsQ0FFUyxDQUFDO0VBSE07O2tCQUtsQixnQkFBQSxHQUFrQixTQUFBO1dBQ2hCLENBQUEsQ0FBRSxJQUFDLENBQUEsTUFBSCxDQUFVLENBQUMsTUFBWCxDQUFrQixTQUFDLE1BQUQ7YUFDaEIsTUFBQSxJQUFVLE1BQU0sQ0FBQyxTQUFQLENBQUE7SUFETSxDQUFsQixDQUVDLENBQUMsS0FGRixDQUFBLENBRVMsQ0FBQztFQUhNOztrQkFLbEIsZUFBQSxHQUFpQixTQUFBO1dBQ2YsQ0FBQSxDQUFFLElBQUMsQ0FBQSxNQUFILENBQVUsQ0FBQyxNQUFYLENBQWtCLFNBQUMsTUFBRDthQUNoQixNQUFBLElBQVUsTUFBTSxDQUFDLFFBQVAsQ0FBQTtJQURNLENBQWxCLENBRUMsQ0FBQyxLQUZGLENBQUEsQ0FFUyxDQUFDO0VBSEs7O2tCQUtqQixjQUFBLEdBQWdCLFNBQUE7V0FDZCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0VBREQ7O2tCQUdoQixxQkFBQSxHQUF1QixTQUFBO1dBQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxjQUFELENBQUE7RUFESTs7a0JBR3ZCLGtCQUFBLEdBQW9CLFNBQUMsSUFBRDtBQUNsQixRQUFBO1dBQUEsQ0FBQSxDQUFFOzs7O2tCQUFGLENBQStCLENBQUMsR0FBaEMsQ0FBb0MsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDbEMsWUFBQTtlQUFBLENBQUEsQ0FBRTs7OztzQkFBRixDQUErQixDQUFDLEdBQWhDLENBQW9DLFNBQUMsQ0FBRDtpQkFDbEMsS0FBQyxDQUFBLFlBQUQsQ0FBYyxDQUFkLEVBQWlCLENBQWpCO1FBRGtDLENBQXBDLENBRUMsQ0FBQyxLQUZGLENBQUE7TUFEa0M7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLENBSUMsQ0FBQyxPQUpGLENBQUEsQ0FJVyxDQUFDLE9BSlosQ0FBQTtFQURrQjs7a0JBT3BCLGNBQUEsR0FBZ0IsU0FBQyxJQUFEO1dBQ2QsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQXBCLENBQXlCLENBQUMsS0FBMUIsQ0FBQTtFQURjOztrQkFHaEIsc0JBQUEsR0FBd0IsU0FBQyxJQUFEO1dBQ3RCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixDQUF5QixDQUFDLE1BQTFCLENBQWlDLFNBQUMsSUFBRDthQUMvQixDQUFJLElBQUksQ0FBQyxRQUFMLENBQUE7SUFEMkIsQ0FBakMsQ0FFQyxDQUFDLEtBRkYsQ0FBQTtFQURzQjs7a0JBS3hCLFFBQUEsR0FBVSxTQUFBO1dBQ1IsSUFBQyxDQUFBO0VBRE87O2tCQUdWLFlBQUEsR0FBYyxTQUFDLENBQUQsRUFBSSxDQUFKO0lBQ1osSUFBZSxDQUFBLEdBQUksQ0FBSixJQUFTLENBQUEsR0FBSSxDQUFiLElBQWtCLENBQUEsR0FBSSxJQUFDLENBQUEsS0FBRCxHQUFTLENBQS9CLElBQW9DLENBQUEsR0FBSSxJQUFDLENBQUEsTUFBRCxHQUFVLENBQWpFO0FBQUEsYUFBTyxLQUFQOztXQUNBLElBQUMsQ0FBQSxlQUFELENBQWlCLENBQUEsR0FBSSxJQUFDLENBQUEsS0FBTCxHQUFhLENBQTlCO0VBRlk7O2tCQUlkLGVBQUEsR0FBaUIsU0FBQyxRQUFEO1dBQ2YsSUFBQyxDQUFBLE1BQU8sQ0FBQSxRQUFBO0VBRE87O2tCQUdqQixTQUFBLEdBQVcsU0FBQTtBQUNULFFBQUE7V0FBQSxDQUFBLENBQUU7Ozs7a0JBQUYsQ0FBcUIsQ0FBQyxHQUF0QixDQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsQ0FBRDtBQUN4QixZQUFBO2VBQUEsQ0FBQSxDQUFFOzs7O3NCQUFGLENBQW9CLENBQUMsR0FBckIsQ0FBeUIsU0FBQyxDQUFEO2lCQUNuQixJQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBVixDQUFlLEtBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7UUFEbUIsQ0FBekIsQ0FFQyxDQUFDLEtBRkYsQ0FBQTtNQUR3QjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FJQyxDQUFDLE9BSkYsQ0FBQSxDQUlXLENBQUMsS0FKWixDQUFBO0VBRFM7O2tCQU9YLFlBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixRQUFBO0lBQUEsYUFBQSxHQUFnQixDQUFBLENBQUU7Ozs7a0JBQUYsQ0FBNEIsQ0FBQyxPQUE3QixDQUFBLENBQXNDLENBQUMsT0FBdkMsQ0FBQSxDQUFnRCxDQUFDLEtBQWpELENBQUEsQ0FBeUQ7V0FDekUsSUFBQyxDQUFBLG9CQUFELGFBQXNCLGFBQXRCO0VBRlk7O2tCQUlkLG9CQUFBLEdBQXNCLFNBQUE7QUFDcEIsUUFBQTtJQURxQjtJQUNyQixDQUFBLENBQUUsSUFBQyxDQUFBLE1BQUgsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsU0FBQyxJQUFEO2FBQ2QsSUFBSSxDQUFDLGFBQUwsQ0FBQTtJQURjLENBQWhCLENBRUMsQ0FBQyxLQUZGLENBQUE7V0FJQSxDQUFBLENBQUUsS0FBRixDQUFRLENBQUMsR0FBVCxDQUFhLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxRQUFEO1FBQ1gsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsUUFBakIsQ0FBMEIsQ0FBQyxXQUEzQixDQUFBO2VBQ0E7TUFGVztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBYixDQUdDLENBQUMsS0FIRixDQUFBO0VBTG9COztrQkFVdEIsUUFBQSxHQUFVLFNBQUE7V0FDUixJQUFDLENBQUE7RUFETzs7a0JBR1YsSUFBQSxHQUFNLFNBQUE7V0FDSixJQUFDLENBQUEsTUFBRCxHQUFVO0VBRE47O2tCQUdOLElBQUEsR0FBTSxTQUFBO0lBQ0osSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUN0QixDQUFBLENBQUUsSUFBQyxDQUFBLFdBQUgsQ0FBZSxDQUFDLElBQWhCLENBQXFCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxRQUFEO2VBQWEsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsUUFBakIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFBO01BQWI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCO1dBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtFQUpJOztrQkFNTixJQUFBLEdBQU0sU0FBQyxNQUFEO0lBQ0osSUFBVSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVY7QUFBQSxhQUFBOztJQUNBLElBQWtCLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBbEI7QUFBQSxhQUFPLElBQUMsQ0FBQSxJQUFELENBQUEsRUFBUDs7SUFDQSxJQUFpQixJQUFDLENBQUEsZ0JBQUQsS0FBcUIsSUFBQyxDQUFBLGVBQUQsQ0FBQSxDQUF0QztBQUFBLGFBQU8sSUFBQyxDQUFBLEdBQUQsQ0FBQSxFQUFQOztJQUVBLElBQUcsTUFBTSxDQUFDLGdCQUFQLENBQUEsQ0FBQSxLQUE2QixDQUFoQzthQUNFLElBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQURGOztFQUxJOztrQkFRTixVQUFBLEdBQVksU0FBQyxJQUFEO1dBQ1YsQ0FBQSxDQUFFLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUF4QixDQUFGLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsU0FBQyxNQUFEO2FBQVcsTUFBTSxDQUFDLElBQVAsQ0FBQTtJQUFYLENBQXRDLENBQStELENBQUMsS0FBaEUsQ0FBQTtFQURVOztrQkFHWixNQUFBLEdBQVEsU0FBQTtXQUNOLElBQUMsQ0FBQSxNQUFELEdBQVU7RUFESjs7a0JBR1IsR0FBQSxHQUFLLFNBQUE7SUFDSCxJQUFDLENBQUEsV0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDO1dBQ3RCLElBQUMsQ0FBQSxJQUFELENBQUE7RUFIRzs7Ozs7Ozs7O0FDekhQLElBQUEsSUFBQTtFQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsR0FBTzs7QUFDdEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQThCQSxFQUFBLEVBQUksU0FBQyxNQUFEO0FBQ0YsUUFBQTtBQUFBLFlBQU8sSUFBUDtBQUFBLDRCQUNPLE1BQU0sQ0FBRSxjQUFSLENBQXVCLEtBQXZCLFVBRFA7UUFFSSxNQUFNLENBQUMsU0FBUCxHQUFtQixNQUFNLENBQUM7UUFDMUIsUUFBQSxHQUFXLElBQUMsQ0FBQSxFQUFELENBQUksTUFBTSxDQUFDLElBQVg7UUFDWCxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBVixDQUFIO2lCQUNFLEtBQUssQ0FBQyxhQUFOLGNBQW9CLENBQUEsTUFBTSxDQUFDLEdBQVAsRUFBWSxNQUFRLFNBQUEsV0FBQSxRQUFBLENBQUEsQ0FBeEMsRUFERjtTQUFBLE1BQUE7aUJBR0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsTUFBTSxDQUFDLEdBQTNCLEVBQWdDLE1BQWhDLEVBQXdDLFFBQXhDLEVBSEY7O0FBSEc7QUFEUCxXQVFPLENBQUMsQ0FBQyxPQUFGLENBQVUsTUFBVixDQVJQO0FBU0k7YUFBQSx3Q0FBQTs7dUJBQ0UsSUFBQyxDQUFBLEVBQUQsQ0FBSSxLQUFKO0FBREY7O0FBREc7QUFSUCxXQVdPLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxDQVhQO2VBWUk7QUFaSixXQWFPLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxDQWJQO2VBY0k7QUFkSixXQWVPLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxDQWZQO2VBZ0JJO0FBaEJKO2VBa0JJO0FBbEJKO0VBREUsQ0EvQmtCOzs7Ozs7QUNBeEIsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLEdBQU87O0FBRXhCLElBQUksQ0FBQyxLQUFMLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0FBQ2IsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFBLENBQVEsY0FBUjs7QUFDWixJQUFJLENBQUMsRUFBTCxHQUFVLE9BQUEsQ0FBUSxZQUFSOztBQUNWLElBQUksQ0FBQyxhQUFMLEdBQXFCLE9BQUEsQ0FBUSx1QkFBUjs7QUFDckIsSUFBSSxDQUFDLE1BQUwsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0FBQ2QsSUFBSSxDQUFDLElBQUwsR0FBWSxPQUFBLENBQVEsY0FBUjs7Ozs7QUNQWixJQUFBOztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsR0FBTyxLQUFLLENBQUMsV0FBTixDQUN0QjtFQUFBLE1BQUEsRUFBUSxDQUFDLElBQUksQ0FBQyxLQUFOLENBQVI7RUFFQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEVBQUEsQ0FBRztNQUFFLEdBQUEsRUFBSyxJQUFQO01BQWEsR0FBQSxFQUFLLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBbEI7TUFBaUMsR0FBQSxFQUFLLE1BQXRDO01BQThDLElBQUEsRUFBTSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQXBEO0tBQUg7RUFETSxDQUZSO0VBS0EsaUJBQUEsRUFBbUIsU0FBQTtBQUNqQixRQUFBO0lBQUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxXQUFOLENBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBeEI7SUFDUCxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBQyxDQUFBLGFBQXRDO0lBQ0EsSUFBSSxDQUFDLGdCQUFMLENBQXNCLFdBQXRCLEVBQW1DLElBQUMsQ0FBQSxXQUFwQztXQUVBLElBQUMsQ0FBQSxRQUFELENBQVU7TUFBQSxJQUFBLEVBQU0sSUFBTjtLQUFWO0VBTGlCLENBTG5CO0VBWUEsb0JBQUEsRUFBc0IsU0FBQTtBQUNwQixRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFDZCxJQUFJLENBQUMsbUJBQUwsQ0FBeUIsYUFBekIsRUFBd0MsSUFBQyxDQUFBLGFBQXpDO1dBQ0EsSUFBSSxDQUFDLG1CQUFMLENBQXlCLFdBQXpCLEVBQXNDLElBQUMsQ0FBQSxXQUF2QztFQUhvQixDQVp0QjtFQWlCQSxVQUFBLEVBQVksU0FBQTtBQUNWLFFBQUE7SUFBQSxPQUFBLEdBQVUsQ0FBQyxNQUFEO0lBQ1YsSUFBMEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBYixDQUFBLENBQTFCO01BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLEVBQUE7O1dBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiO0VBSFUsQ0FqQlo7RUFzQkEsT0FBQSxFQUFTLFNBQUE7QUFDUCxRQUFBO0lBQUEsSUFBNEQsQ0FBSSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFiLENBQUEsQ0FBaEU7QUFBQSxhQUFPLEVBQUEsQ0FBRztRQUFFLEdBQUEsRUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWhCO1FBQW9CLElBQUEsRUFBTSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUF2QztPQUFILEVBQVA7O0lBRUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFiLENBQUEsQ0FBSDthQUNFLEVBQUEsQ0FBRztRQUFFLEdBQUEsRUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWhCO1FBQW9CLElBQUEsRUFBTSxNQUExQjtPQUFILEVBREY7S0FBQSxNQUFBO01BR0UsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFiLENBQUE7TUFDUixJQUFHLEtBQUEsS0FBUyxDQUFaO2VBQ0UsR0FERjtPQUFBLE1BQUE7ZUFHRSxNQUhGO09BSkY7O0VBSE8sQ0F0QlQ7RUFpQ0EsYUFBQSxFQUFlLFNBQUMsQ0FBRDtXQUNiLENBQUMsQ0FBQyxjQUFGLENBQUE7RUFEYSxDQWpDZjtFQW9DQSxXQUFBLEVBQWEsU0FBQyxDQUFEO0lBQ1gsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtJQUNBLElBQUcsaUJBQUg7QUFDRSxjQUFRLENBQUMsQ0FBQyxPQUFWO0FBQUEsYUFDTyxDQURQO2lCQUVJLElBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFuQztBQUZKLGFBR08sQ0FIUDtpQkFJSSxJQUFDLENBQUEsUUFBRCxDQUFVLGlCQUFWLEVBQTZCLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBcEM7QUFKSixhQUtPLENBTFA7aUJBTUksSUFBQyxDQUFBLFFBQUQsQ0FBVSxxQkFBVixFQUFpQyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQXhDO0FBTkosYUFPTyxDQVBQO2lCQVFJLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQVYsRUFBOEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFyQztBQVJKLE9BREY7S0FBQSxNQVVLLElBQUcsZ0JBQUg7QUFDSCxjQUFRLENBQUMsQ0FBQyxNQUFWO0FBQUEsYUFDTyxDQURQO2lCQUVJLElBQUMsQ0FBQSxRQUFELENBQVUsZ0JBQVYsRUFBNEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFuQztBQUZKLGFBR08sQ0FIUDtpQkFJSSxJQUFDLENBQUEsUUFBRCxDQUFVLGtCQUFWLEVBQThCLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBckM7QUFKSixhQUtPLENBTFA7aUJBTUksSUFBQyxDQUFBLFFBQUQsQ0FBVSxpQkFBVixFQUE2QixJQUFDLENBQUEsS0FBSyxDQUFDLEtBQXBDO0FBTkosT0FERztLQUFBLE1BQUE7YUFTSCxJQUFDLENBQUEsUUFBRCxDQUFVLGdCQUFWLEVBQTRCLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBbkMsRUFURzs7RUFaTSxDQXBDYjtDQURzQjs7Ozs7QUNBeEIsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixhQUFBLEdBQWdCLEtBQUssQ0FBQyxXQUFOLENBQy9CO0VBQUEsTUFBQSxFQUFRLENBQUMsSUFBSSxDQUFDLEtBQU4sQ0FBUjtFQUVBLFlBQUEsRUFDRTtJQUFBLEtBQUEsRUFBTyxDQUFQO0lBQ0EsTUFBQSxFQUFRLENBRFI7SUFFQSxLQUFBLEVBQU8sRUFGUDtHQUhGO0VBT0EsZUFBQSxFQUFpQixTQUFBO1dBQ2YsSUFBQyxDQUFBO0VBRGMsQ0FQakI7RUFVQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEVBQUEsQ0FBRztNQUFFLEdBQUEsRUFBSyxLQUFQO01BQWMsR0FBQSxFQUFLLHFCQUFuQjtNQUEwQyxJQUFBLEVBQU07UUFDakQsRUFBQSxDQUFHO1VBQUUsR0FBQSxFQUFLLElBQVA7VUFBYSxHQUFBLEVBQUssWUFBbEI7VUFBZ0MsSUFBQSxFQUFNLGVBQXRDO1NBQUgsQ0FEaUQsRUFFakQsRUFBQSxDQUFHO1VBQUUsR0FBQSxFQUFLLElBQVA7VUFBYSxHQUFBLEVBQUssaUJBQWxCO1VBQXFDLElBQUEsRUFBTSxPQUEzQztTQUFILENBRmlELEVBR2pELEVBQUEsQ0FBRztVQUFFLEdBQUEsRUFBSyxJQUFQO1VBQWEsR0FBQSxFQUFLLHdCQUFsQjtVQUE0QyxJQUFBLEVBQU07WUFDbkQsRUFBQSxDQUFHO2NBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBaEI7Y0FBd0IsTUFBQSxFQUFRO2dCQUFFLElBQUEsRUFBTSxJQUFSO2dCQUFjLEdBQUEsRUFBSztrQkFBRSxLQUFBLEVBQU8sQ0FBVDtrQkFBWSxNQUFBLEVBQVEsQ0FBcEI7a0JBQXVCLEtBQUEsRUFBTyxFQUE5QjtpQkFBbkI7ZUFBaEM7YUFBSCxDQURtRCxFQUVuRCxFQUFBLENBQUc7Y0FBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFoQjtjQUF3QixNQUFBLEVBQVE7Z0JBQUUsSUFBQSxFQUFNLElBQVI7Z0JBQWMsR0FBQSxFQUFLO2tCQUFFLEtBQUEsRUFBTyxFQUFUO2tCQUFhLE1BQUEsRUFBUSxFQUFyQjtrQkFBeUIsS0FBQSxFQUFPLEVBQWhDO2lCQUFuQjtlQUFoQzthQUFILENBRm1ELEVBR25ELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQWhCO2NBQXdCLE1BQUEsRUFBUTtnQkFBRSxJQUFBLEVBQU0sSUFBUjtnQkFBYyxHQUFBLEVBQUs7a0JBQUUsS0FBQSxFQUFPLEVBQVQ7a0JBQWEsTUFBQSxFQUFRLEVBQXJCO2tCQUF5QixLQUFBLEVBQU8sRUFBaEM7aUJBQW5CO2VBQWhDO2FBQUgsQ0FIbUQ7V0FBbEQ7U0FBSCxDQUhpRCxFQVFqRCxFQUFBLENBQUc7VUFBRSxHQUFBLEVBQUssSUFBUDtVQUFhLEdBQUEsRUFBSyxpQkFBbEI7VUFBcUMsSUFBQSxFQUFNLFNBQTNDO1NBQUgsQ0FSaUQsRUFTakQsRUFBQSxDQUFHO1VBQUUsR0FBQSxFQUFLLElBQVA7VUFBYSxHQUFBLEVBQUssdUJBQWxCO1VBQTJDLElBQUEsRUFBTTtZQUNsRCxFQUFBLENBQUc7Y0FBRSxHQUFBLEVBQUssSUFBUDtjQUFhLEdBQUEsRUFBSyw4QkFBbEI7Y0FBa0QsSUFBQSxFQUFNO2dCQUN6RCxFQUFBLENBQUc7a0JBQUUsR0FBQSxFQUFLLE9BQVA7a0JBQWdCLEdBQUEsRUFBSyx1QkFBckI7a0JBQThDLElBQUEsRUFBTSxHQUFwRDtpQkFBSCxDQUR5RDtlQUF4RDthQUFILENBRGtELEVBSWxELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxJQUFQO2NBQWEsR0FBQSxFQUFLLHdCQUFsQjtjQUE0QyxJQUFBLEVBQU07Z0JBQ25ELEVBQUEsQ0FBRztrQkFBRSxHQUFBLEVBQUssT0FBUDtrQkFBZ0IsR0FBQSxFQUFLLHdCQUFyQjtrQkFBK0MsR0FBQSxFQUFLLE9BQXBEO2tCQUE2RCxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUEzRTtrQkFBa0YsUUFBQSxFQUFVLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixDQUE1RjtpQkFBSCxDQURtRDtlQUFsRDthQUFILENBSmtELEVBT2xELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxJQUFQO2NBQWEsR0FBQSxFQUFLLDhCQUFsQjtjQUFrRCxJQUFBLEVBQU07Z0JBQ3pELEVBQUEsQ0FBRztrQkFBRSxHQUFBLEVBQUssT0FBUDtrQkFBZ0IsR0FBQSxFQUFLLHVCQUFyQjtrQkFBOEMsSUFBQSxFQUFNLEdBQXBEO2lCQUFILENBRHlEO2VBQXhEO2FBQUgsQ0FQa0QsRUFVbEQsRUFBQSxDQUFHO2NBQUUsR0FBQSxFQUFLLElBQVA7Y0FBYSxHQUFBLEVBQUssd0JBQWxCO2NBQTRDLElBQUEsRUFBTTtnQkFDbkQsRUFBQSxDQUFHO2tCQUFFLEdBQUEsRUFBSyxPQUFQO2tCQUFnQixHQUFBLEVBQUssd0JBQXJCO2tCQUErQyxHQUFBLEVBQUssUUFBcEQ7a0JBQThELEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQTVFO2tCQUFvRixRQUFBLEVBQVUsSUFBQyxDQUFBLGdCQUFELENBQWtCLFFBQWxCLENBQTlGO2lCQUFILENBRG1EO2VBQWxEO2FBQUgsQ0FWa0QsRUFhbEQsRUFBQSxDQUFHO2NBQUUsR0FBQSxFQUFLLElBQVA7Y0FBYSxHQUFBLEVBQUssOEJBQWxCO2NBQWtELElBQUEsRUFBTTtnQkFDekQsRUFBQSxDQUFHO2tCQUFFLEdBQUEsRUFBSyxPQUFQO2tCQUFnQixHQUFBLEVBQUssdUJBQXJCO2tCQUE4QyxJQUFBLEVBQU07b0JBQ3JELEVBQUEsQ0FBRztzQkFBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFoQjtzQkFBb0IsSUFBQSxFQUFNLE1BQTFCO3NCQUFrQyxVQUFBLEVBQVksSUFBOUM7cUJBQUgsQ0FEcUQ7bUJBQXBEO2lCQUFILENBRHlEO2VBQXhEO2FBQUgsQ0Fia0QsRUFrQmxELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxJQUFQO2NBQWEsR0FBQSxFQUFLLHdCQUFsQjtjQUE0QyxJQUFBLEVBQU07Z0JBQ25ELEVBQUEsQ0FBRztrQkFBRSxHQUFBLEVBQUssT0FBUDtrQkFBZ0IsR0FBQSxFQUFLLHdCQUFyQjtrQkFBK0MsR0FBQSxFQUFLLE9BQXBEO2tCQUE2RCxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUEzRTtrQkFBa0YsUUFBQSxFQUFVLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixDQUE1RjtpQkFBSCxDQURtRDtlQUFsRDthQUFILENBbEJrRDtXQUFqRDtTQUFILENBVGlELEVBK0JqRCxFQUFBLENBQUc7VUFBRSxHQUFBLEVBQUssUUFBUDtVQUFpQixHQUFBLEVBQUssZ0NBQXRCO1VBQXdELE9BQUEsRUFBUyxJQUFDLENBQUEsZ0JBQWxFO1VBQW9GLElBQUEsRUFBTSxNQUExRjtTQUFILENBL0JpRDtPQUFoRDtLQUFIO0VBRE0sQ0FWUjtFQTZDQSxnQkFBQSxFQUFrQixTQUFDLE1BQUQ7V0FDaEIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLENBQUQ7QUFDRSxZQUFBO1FBQUEsS0FBQSxHQUFRO1FBQ1IsS0FBQSxHQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVsQixLQUFNLENBQUEsTUFBQSxDQUFOO0FBQWdCLGtCQUFPLElBQVA7QUFBQSxpQkFDVCxDQUFDLENBQUMsS0FBRixDQUFRLEtBQVIsQ0FEUztxQkFFWixJQUFDLENBQUEsWUFBYSxDQUFBLE1BQUE7QUFGRixpQkFHVCxLQUFBLEdBQVEsQ0FIQztxQkFJWixJQUFDLENBQUEsWUFBYSxDQUFBLE1BQUE7QUFKRixpQkFLVCxDQUFDLENBQUMsUUFBRixDQUFXLEtBQVgsQ0FMUztxQkFNWjtBQU5ZO3FCQVFaLElBQUMsQ0FBQSxZQUFhLENBQUEsTUFBQTtBQVJGOztlQVVoQixLQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7TUFkRjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7RUFEZ0IsQ0E3Q2xCO0VBOERBLGdCQUFBLEVBQWtCLFNBQUMsQ0FBRDtJQUNoQixDQUFDLENBQUMsY0FBRixDQUFBO1dBQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxXQUFWLEVBQXVCO01BQ3JCLEtBQUEsRUFBTyxLQUFLLENBQUMsV0FBTixDQUFrQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQXhCLENBQThCLENBQUMsS0FEakI7TUFFckIsTUFBQSxFQUFRLEtBQUssQ0FBQyxXQUFOLENBQWtCLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxLQUZuQjtNQUdyQixLQUFBLEVBQU8sS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUF4QixDQUE4QixDQUFDLEtBSGpCO0tBQXZCO0VBRmdCLENBOURsQjtDQUQrQjs7Ozs7QUNBakMsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFLEVBQUEsR0FBSyxLQUFLLENBQUMsV0FBTixDQUNIO0VBQUEsTUFBQSxFQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsT0FBQSxHQUFVLENBQUMsSUFBRDtJQUNWLE9BQU8sQ0FBQyxJQUFSLENBQWEsS0FBQSxHQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBMUI7SUFDQSxJQUF1Qyx3QkFBdkM7TUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLEtBQUEsR0FBTSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQWIsR0FBbUIsR0FBaEMsRUFBQTs7SUFDQSxJQUF5QixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQWhDO01BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFiLEVBQUE7O0lBQ0EsSUFBeUIsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFoQztNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFBOztJQUNBLElBQTZCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBcEM7TUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFdBQWIsRUFBQTs7SUFDQSxJQUEwQyx1QkFBMUM7TUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFVBQUEsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQS9CLEVBQUE7O0lBQ0EsSUFBMEMsNEJBQTFDO01BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFBLEdBQU0sSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUExQixFQUFBOztJQUNBLElBQThDLHlCQUE5QztNQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBQSxHQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBakMsRUFBQTs7SUFDQSxJQUErQyx1QkFBL0M7TUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFVBQUEsR0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQS9CLEVBQUE7O1dBRUEsRUFBQSxDQUFHO01BQUUsR0FBQSxFQUFLLEdBQVA7TUFBWSxHQUFBLEVBQUssT0FBTyxDQUFDLElBQVIsQ0FBYSxHQUFiLENBQWpCO0tBQUg7RUFaTSxDQUFSO0NBREc7Ozs7O0FDRFAsSUFBQTs7QUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLEdBQU8sS0FBSyxDQUFDLFdBQU4sQ0FDdEI7RUFBQSxNQUFBLEVBQVEsQ0FBQyxJQUFJLENBQUMsS0FBTixDQUFSO0VBRUEsTUFBQSxFQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUM7V0FFZixFQUFBLENBQUc7TUFBRSxHQUFBLEVBQUssS0FBUDtNQUFjLElBQUEsRUFBTTtRQUNyQixFQUFBLENBQUc7VUFBRSxHQUFBLEVBQUssSUFBUDtVQUFhLEdBQUEsRUFBSyxZQUFsQjtVQUFnQyxJQUFBLEVBQU0sZUFBdEM7U0FBSCxDQURxQixFQUVyQixFQUFBLENBQUc7VUFBRSxHQUFBLEVBQUssUUFBUDtVQUFpQixHQUFBLEVBQUssa0JBQXRCO1VBQTBDLElBQUEsRUFBTTtZQUNqRCxFQUFBLENBQUc7Y0FBRSxHQUFBLEVBQUssS0FBUDtjQUFjLEdBQUEsRUFBSyxnQkFBbkI7Y0FBcUMsSUFBQSxFQUFNLENBQzVDLEtBQUssQ0FBQyxVQURzQyxDQUEzQzthQUFILENBRGlELEVBSWpELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxLQUFQO2NBQWMsR0FBQSxFQUFLLG1CQUFuQjtjQUF3QyxJQUFBLEVBQU07Z0JBQy9DLEVBQUEsQ0FBRztrQkFBRSxHQUFBLEVBQUssUUFBUDtrQkFBaUIsR0FBQSxFQUFLLFVBQUEsR0FBVSxDQUFDLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBRCxDQUFWLEdBQTBCLGlCQUFoRDtrQkFBa0UsT0FBQSxFQUFTLElBQUMsQ0FBQSxjQUE1RTtrQkFBNEYsSUFBQSxFQUFNO29CQUNuRyxFQUFBLENBQUc7c0JBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBaEI7c0JBQW9CLElBQUEsRUFBTSxJQUFDLENBQUEsVUFBRCxDQUFBLENBQTFCO3NCQUF5QyxLQUFBLEVBQU8sQ0FBaEQ7cUJBQUgsQ0FEbUc7bUJBQWxHO2lCQUFILENBRCtDO2VBQTlDO2FBQUgsQ0FKaUQsRUFTakQsRUFBQSxDQUFHO2NBQUUsR0FBQSxFQUFLLEtBQVA7Y0FBYyxHQUFBLEVBQUssZ0JBQW5CO2NBQXFDLElBQUEsRUFBTSxDQUM1QyxLQUFLLENBQUMsYUFEc0MsQ0FBM0M7YUFBSCxDQVRpRDtXQUFoRDtTQUFILENBRnFCLEVBZXJCLEVBQUEsQ0FBRztVQUFFLEdBQUEsRUFBSyxLQUFQO1VBQWMsR0FBQSxFQUFLLFVBQW5CO1VBQStCLElBQUEsRUFBTTtZQUN0QyxFQUFBLENBQUc7Y0FBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFoQjtjQUF1QixLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFyQzthQUFILENBRHNDO1dBQXJDO1NBQUgsQ0FmcUIsRUFrQnJCLEVBQUEsQ0FBRztVQUFFLEdBQUEsRUFBSyxRQUFQO1VBQWlCLEdBQUEsRUFBSyxrQkFBdEI7VUFBMEMsSUFBQSxFQUFNO1lBQ2pELEVBQUEsQ0FBRztjQUFFLEdBQUEsRUFBSyxRQUFQO2NBQWlCLEdBQUEsRUFBSywyQkFBdEI7Y0FBbUQsT0FBQSxFQUFTLElBQUMsQ0FBQSxXQUE3RDtjQUEwRSxJQUFBLEVBQU07Z0JBQ2pGLEVBQUEsQ0FBRztrQkFBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFoQjtrQkFBb0IsSUFBQSxFQUFNLHFCQUExQjtpQkFBSCxDQURpRixFQUVqRixNQUZpRjtlQUFoRjthQUFILENBRGlEO1dBQWhEO1NBQUgsQ0FsQnFCO09BQXBCO0tBQUg7RUFITSxDQUZSO0VBK0JBLGlCQUFBLEVBQW1CLFNBQUE7V0FDakIsSUFBQyxDQUFBLEdBQUQsR0FBTyxXQUFBLENBQVksQ0FBQyxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFDbEIsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWO01BRGtCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFELENBQVosRUFFSixJQUZJO0VBRFUsQ0EvQm5CO0VBb0NBLG9CQUFBLEVBQXNCLFNBQUE7V0FDcEIsYUFBQSxDQUFjLElBQUMsQ0FBQSxHQUFmO0VBRG9CLENBcEN0QjtFQXVDQSxXQUFBLEVBQWEsU0FBQTtBQUNYLFlBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBckI7QUFBQSxXQUNPLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUQ5QjtlQUVJO0FBRkosV0FHTyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FIOUI7ZUFJSTtBQUpKLFdBS08sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBTDlCO2VBTUk7QUFOSjtFQURXLENBdkNiO0VBZ0RBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsWUFBTyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFyQjtBQUFBLFdBQ08sR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBRDlCO2VBRUk7QUFGSixXQUdPLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUg5QjtlQUlJO0FBSkosV0FLTyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFMOUI7ZUFNSTtBQU5KO0VBRFUsQ0FoRFo7RUF5REEsV0FBQSxFQUFhLFNBQUMsQ0FBRDtJQUNYLENBQUMsQ0FBQyxjQUFGLENBQUE7V0FDQSxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVY7RUFGVyxDQXpEYjtFQTZEQSxjQUFBLEVBQWdCLFNBQUMsQ0FBRDtJQUNkLENBQUMsQ0FBQyxjQUFGLENBQUE7V0FDQSxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQVY7RUFGYyxDQTdEaEI7Q0FEc0I7Ozs7O0FDQXhCLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUFTLEtBQUssQ0FBQyxXQUFOLENBQ3hCO0VBQUEsTUFBQSxFQUFRLENBQUMsSUFBSSxDQUFDLEtBQU4sQ0FBUjtFQUVBLE1BQUEsRUFBUSxTQUFBO1dBQ04sRUFBQSxDQUFHO01BQUUsR0FBQSxFQUFLLElBQVA7TUFBYSxHQUFBLEVBQUssa0JBQWxCO01BQXNDLElBQUEsRUFBTTtRQUM3QyxFQUFBLENBQUc7VUFBRSxHQUFBLEVBQUssUUFBUDtVQUFpQixHQUFBLEVBQUssZ0NBQXRCO1VBQXdELE9BQUEsRUFBUyxJQUFDLENBQUEsT0FBbEU7VUFBMkUsSUFBQSxFQUFNLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQS9GO1NBQUgsQ0FENkM7T0FBNUM7S0FBSDtFQURNLENBRlI7RUFPQSxPQUFBLEVBQVMsU0FBQyxDQUFEO0lBQ1AsQ0FBQyxDQUFDLGNBQUYsQ0FBQTtXQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUFvQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFsQztFQUZPLENBUFQ7Q0FEd0I7Ozs7O0FDQTFCLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRSxLQUFBLEdBQVEsS0FBSyxDQUFDLFdBQU4sQ0FDTjtFQUFBLE1BQUEsRUFBUSxTQUFBO1dBQ04sRUFBQSxDQUFHO01BQUUsR0FBQSxFQUFLLElBQVA7TUFBYSxHQUFBLEVBQUssT0FBbEI7TUFBMkIsSUFBQSxFQUFNLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBakM7TUFBOEMsS0FBQSxFQUFPLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBckQ7S0FBSDtFQURNLENBQVI7RUFHQSxRQUFBLEVBQVUsU0FBQTtXQUNSLENBQUEsQ0FBRSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFiLENBQUEsQ0FBRixDQUEwQixDQUFDLEdBQTNCLENBQStCLFNBQUMsSUFBRDthQUM3QixFQUFBLENBQUc7UUFBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFoQjtRQUFzQixLQUFBLEVBQU8sSUFBN0I7T0FBSDtJQUQ2QixDQUEvQixDQUVDLENBQUMsS0FGRixDQUFBO0VBRFEsQ0FIVjtFQVFBLFNBQUEsRUFBVyxTQUFBO1dBQ1Q7TUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixFQUE1Qjs7RUFEUyxDQVJYO0NBRE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0ID0ge31cblxuQ29udGV4dC5HYW1lQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dHMvZ2FtZSdcbkNvbnRleHQuU2V0dGluZ0NvbnRleHQgPSByZXF1aXJlICcuL2NvbnRleHRzL3NldHRpbmcnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWVDb250ZXh0IGV4dGVuZHMgQXJkYS5Db250ZXh0XG4gIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkdhbWUsIGNvbmZpZzogQHByb3BzLmNvbmZpZyB9XG4gIClcblxuICBpbml0U3RhdGU6IChwcm9wcykgLT5cbiAgICBwcm9wcy50YWJsZSA9IEBjcmVhdGVUYWJsZShwcm9wcy5jb25maWcpXG5cbiAgZXhwYW5kQ29tcG9uZW50UHJvcHM6IChwcm9wcywgc3RhdGUpIC0+XG4gICAgY29uZmlnOiBwcm9wcy50YWJsZVxuXG4gIGRlbGVnYXRlOiAoc3Vic2NyaWJlKSAtPlxuICAgIHN1cGVyXG5cbiAgICBzdWJzY3JpYmUgJ2JhY2snLCA9PlxuICAgICAgQHByb3BzLnJvdXRlci5wb3BDb250ZXh0KClcblxuICAgIHN1YnNjcmliZSAnY2VsbDpyaWdodENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwucm90YXRlTW9kZSgpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG5cbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwub3BlbigpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG5cbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdFJpZ2h0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5vcGVuQXJvdW5kKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAncmVzdGFydCcsID0+XG4gICAgICBAcHJvcHMudGFibGUgPSBAY3JlYXRlVGFibGUoQHByb3BzLmNvbmZpZylcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICAgIHN1YnNjcmliZSAndGltZXInLCA9PlxuICAgICAgQHByb3BzLnRhYmxlLmNvbXB1dGVUaW1lKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcblxuICBjcmVhdGVUYWJsZTogKGRhdCktPlxuICAgIG5ldyBBcHAuTW9kZWwuVGFibGUoZGF0LndpZHRoLCBkYXQuaGVpZ2h0LCBkYXQuYm9tYnMpIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXR0aW5nQ29udGV4dCBleHRlbmRzIEFyZGEuQ29udGV4dFxuICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5Db25maWd1cmF0aW9uIH1cbiAgKVxuXG4gIGluaXRTdGF0ZTogKHByb3BzKSAtPlxuICAgIHByb3BzXG5cbiAgZXhwYW5kQ29tcG9uZW50UHJvcHM6IChwcm9wcywgc3RhdGUpIC0+XG4gICAgY29uZmlnOiBzdGF0ZS5jb25maWdcblxuICBkZWxlZ2F0ZTogKHN1YnNjcmliZSkgLT5cbiAgICBzdXBlclxuXG4gICAgc3Vic2NyaWJlICdwcmVzZXQnLCAoZGF0KT0+XG4gICAgICBAcHJvcHMucm91dGVyLnB1c2hDb250ZXh0KEFwcC5Db250ZXh0LkdhbWVDb250ZXh0LCB7XG4gICAgICAgIHJvdXRlcjogQHByb3BzLnJvdXRlclxuICAgICAgICBjb25maWc6IGRhdFxuICAgICAgfSlcblxuICAgIHN1YnNjcmliZSAnZnJlZXN0eWxlJywgKGRhdCk9PlxuICAgICAgQHByb3BzLnJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5HYW1lQ29udGV4dCwge1xuICAgICAgICByb3V0ZXI6IEBwcm9wcy5yb3V0ZXJcbiAgICAgICAgY29uZmlnOiBkYXRcbiAgICAgIH0pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFwcCA9IHt9XG5cbmlmIHdpbmRvdz9cbiAgd2luZG93LkFwcCA9IEFwcFxuICB3aW5kb3cuY2UgPSAoYXJncy4uLiktPlxuICAgIEFwcC5VdGlsLmNlKGFyZ3MuLi4pXG5lbHNlXG4gIGdsb2JhbC5BcHAgPSBBcHBcbiAgZ2xvYmFsLmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5BcHAuQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dCdcbkFwcC5VdGlsID0gcmVxdWlyZSAnLi91dGlsJ1xuQXBwLk1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbCdcbkFwcC5WaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xuXG5BcHAuc3RhcnQgPSAobm9kZSktPlxuICByb3V0ZXIgPSBuZXcgQXJkYS5Sb3V0ZXIoQXJkYS5EZWZhdWx0TGF5b3V0LCBub2RlKVxuICByb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuU2V0dGluZ0NvbnRleHQsIHsgcm91dGVyOiByb3V0ZXIgfSlcbiIsIm1vZHVsZS5leHBvcnRzID0gTW9kZWwgPSB7fVxuXG5Nb2RlbC5DZWxsID0gcmVxdWlyZSAnLi9tb2RlbHMvY2VsbCdcbk1vZGVsLlRhYmxlID0gcmVxdWlyZSAnLi9tb2RlbHMvdGFibGUnXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIENlbGxcbiAgICBAc3RhdHVzOlxuICAgICAgbm9uZTogJ25vbmUnXG4gICAgICBmbGFnOiAnZmxhZydcbiAgICAgIHF1ZXN0aW9uOiAncXVlc3Rpb24nXG4gICAgICBvcGVuOiAnb3BlbidcbiAgICBzdGF0ZTogbnVsbFxuXG4gICAgY29uc3RydWN0b3I6IChAdGFibGUsIEB4LCBAeSkgLT5cbiAgICAgIEBwb3NpdGlvbiA9IEB0YWJsZS53aWR0aCAqIEB5ICsgQHhcbiAgICAgIEBzdGF0ZSA9IENlbGwuc3RhdHVzLm5vbmVcbiAgICAgIEBfYm9tYiA9IGZhbHNlXG5cbiAgICBjb3VudEJvbWJzQXJvdW5kOiA9PlxuICAgICAgQF9jb3VudGVkID89IEB0YWJsZS5jb3VudEJvbWJzQXJvdW5kKEApXG5cbiAgICBjb3VudEZsYWdzQXJvdW5kOiA9PlxuICAgICAgQHRhYmxlLmNvdW50RmxhZ3NBcm91bmQoQClcblxuICAgIGhhc0JvbWI6IC0+XG4gICAgICBAX2JvbWJcblxuICAgIGlzRmxhZ2dlZDogLT5cbiAgICAgIEBzdGF0ZSA9PSBDZWxsLnN0YXR1cy5mbGFnXG5cbiAgICBpc09wZW5lZDogLT5cbiAgICAgIEBzdGF0ZSA9PSBDZWxsLnN0YXR1cy5vcGVuXG5cbiAgICBpc09wZW5hYmxlOi0+XG4gICAgICBub3QgQGlzT3BlbmVkKCkgJiYgQHN0YXRlICE9IENlbGwuc3RhdHVzLm5vbmVcblxuICAgIGluc3RhbGxCb21iOiAtPlxuICAgICAgQF9ib21iID0gdHJ1ZVxuXG4gICAgb3BlbjogLT5cbiAgICAgIHJldHVybiBpZiBAdGFibGUuaXNMb2NrZWQoKVxuICAgICAgcmV0dXJuIHRydWUgaWYgQGlzT3BlbmVkKCkgfHwgQGlzT3BlbmFibGUoKVxuICAgICAgQHN0YXRlID0gQ2VsbC5zdGF0dXMub3BlblxuICAgICAgQHRhYmxlLm9wZW4oQClcblxuICAgIG9wZW5Bcm91bmQ6IC0+XG4gICAgICByZXR1cm4gaWYgQHRhYmxlLmlzTG9ja2VkKClcbiAgICAgIEB0YWJsZS5vcGVuQXJvdW5kKEApIGlmIEBpc09wZW5lZCgpICYmIEBjb3VudEJvbWJzQXJvdW5kKCkgPT0gQGNvdW50RmxhZ3NBcm91bmQoKVxuXG4gICAgcm90YXRlTW9kZTogLT5cbiAgICAgIHJldHVybiBpZiBAaXNPcGVuZWQoKSB8fCBAdGFibGUubG9ja2VkXG4gICAgICBAc3RhdGUgPSBzd2l0Y2ggQHN0YXRlXG4gICAgICAgIHdoZW4gQ2VsbC5zdGF0dXMubm9uZVxuICAgICAgICAgIENlbGwuc3RhdHVzLmZsYWdcbiAgICAgICAgd2hlbiBDZWxsLnN0YXR1cy5mbGFnXG4gICAgICAgICAgQ2VsbC5zdGF0dXMucXVlc3Rpb25cbiAgICAgICAgd2hlbiBDZWxsLnN0YXR1cy5xdWVzdGlvblxuICAgICAgICAgIENlbGwuc3RhdHVzLm5vbmVcbiAgICAgIEB0YWJsZS5jb21wdXRlUmVzdEJvbWJzQ291bnQoKVxuXG4gICAgdW5pbnN0YWxsQm9tYjogLT5cbiAgICAgIEBfYm9tYiA9IGZhbHNlXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRhYmxlXG4gIEBzdGF0dXM6XG4gICAgcGxheTogJ3BsYXknXG4gICAgd2luOiAnd2luJ1xuICAgIGxvc2U6ICdsb3NlJ1xuICBzdGF0ZTogbnVsbFxuXG4gIGNvbnN0cnVjdG9yOiAoQHdpZHRoLCBAaGVpZ2h0LCBAX2JvbWJzQ291bnQgPSAxKSAtPlxuICAgIHRocm93ICdubyBib21icycgaWYgQF9ib21ic0NvdW50IDwgMVxuICAgIHRocm93ICdvdmVyIGJvbWJzJyBpZiBAX2JvbWJzQ291bnQgPj0gQHdpZHRoICogQGhlaWdodFxuXG4gICAgQF9jZWxscyA9IEBpbml0Q2VsbHMoKVxuICAgIEBfYm9tYkNlbGxQb3NpdGlvbnMgPSBAaW5zdGFsbEJvbWJzKEBfYm9tYnNDb3VudClcbiAgICBAX3N0YXJ0ZWRUaW1lID0gK25ldyBEYXRlKClcbiAgICBAcGFzc2VkVGltZSA9IDBcbiAgICBAcmVzdEJvbXNDb3VudCA9IEBfYm9tYnNDb3VudFxuICAgIEBfYmxhbmtDZWxsc0NvdW50ID0gQF9jZWxscy5sZW5ndGggLSBAX2JvbWJzQ291bnRcbiAgICBAc3RhdGUgPSBUYWJsZS5zdGF0dXMucGxheVxuXG4gIGNvbXB1dGVUaW1lOiAtPlxuICAgIHJldHVybiBpZiBAaXNMb2NrZWQoKVxuICAgIEBwYXNzZWRUaW1lID0gXygoK25ldyBEYXRlKCkgLSBAX3N0YXJ0ZWRUaW1lKSAvIDEwMDApLmZsb29yKClcblxuICBjb3VudEJvbWJzQXJvdW5kOiAoY2VsbCktPlxuICAgIF8oQGdldEFyb3VuZFVub3BlbmVkQ2VsbHMoY2VsbCkpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmhhc0JvbWIoKVxuICAgICkudmFsdWUoKS5sZW5ndGhcblxuICBjb3VudEZsYWdzQXJvdW5kOiAoY2VsbCktPlxuICAgIF8oQGdldEFyb3VuZFVub3BlbmVkQ2VsbHMoY2VsbCkpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmlzRmxhZ2dlZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50RmxhZ2dlZENlbGw6IC0+XG4gICAgXyhAX2NlbGxzKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkICYmIHBpY2tlZC5pc0ZsYWdnZWQoKVxuICAgICkudmFsdWUoKS5sZW5ndGhcblxuICBjb3VudE9wZW5lZENlbGw6IC0+XG4gICAgXyhAX2NlbGxzKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkICYmIHBpY2tlZC5pc09wZW5lZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50UmVzdEJvbWJzOiAtPlxuICAgIEBfYm9tYnNDb3VudCAtIEBjb3VudEZsYWdnZWRDZWxsKClcblxuICBjb21wdXRlUmVzdEJvbWJzQ291bnQ6IC0+XG4gICAgQHJlc3RCb21zQ291bnQgPSBAY291bnRSZXN0Qm9tYnMoKVxuXG4gIGdldEFyb3VuZENlbGxzQmFzZTogKGNlbGwpLT5cbiAgICBfKFsoY2VsbC55IC0gMSkuLihjZWxsLnkgKyAxKV0pLm1hcCgoeSk9PlxuICAgICAgXyhbKGNlbGwueCAtIDEpLi4oY2VsbC54ICsgMSldKS5tYXAoKHgpPT5cbiAgICAgICAgQGdldFBvaW50Q2VsbCh4LCB5KVxuICAgICAgKS52YWx1ZSgpXG4gICAgKS5mbGF0dGVuKCkuY29tcGFjdCgpXG5cbiAgZ2V0QXJvdW5kQ2VsbHM6IChjZWxsKS0+XG4gICAgQGdldEFyb3VuZENlbGxzQmFzZShjZWxsKS52YWx1ZSgpXG5cbiAgZ2V0QXJvdW5kVW5vcGVuZWRDZWxsczogKGNlbGwpLT5cbiAgICBAZ2V0QXJvdW5kQ2VsbHNCYXNlKGNlbGwpLnNlbGVjdCgoY2VsbCktPlxuICAgICAgbm90IGNlbGwuaXNPcGVuZWQoKVxuICAgICkudmFsdWUoKVxuXG4gIGdldENlbGxzOiAtPlxuICAgIEBfY2VsbHNcblxuICBnZXRQb2ludENlbGw6ICh4LCB5KS0+XG4gICAgcmV0dXJuIG51bGwgaWYgeCA8IDAgfHwgeSA8IDAgfHwgeCA+IEB3aWR0aCAtIDEgfHwgeSA+IEBoZWlnaHQgLSAxXG4gICAgQGdldFBvc2l0aW9uQ2VsbCh5ICogQHdpZHRoICsgeClcblxuICBnZXRQb3NpdGlvbkNlbGw6IChwb3NpdGlvbikgLT5cbiAgICBAX2NlbGxzW3Bvc2l0aW9uXVxuXG4gIGluaXRDZWxsczogPT5cbiAgICBfKFswLi4oQGhlaWdodCAtIDEpXSkubWFwKCh5KT0+XG4gICAgICBfKFswLi4oQHdpZHRoIC0gMSldKS5tYXAoKHgpPT5cbiAgICAgICAgbmV3IEFwcC5Nb2RlbC5DZWxsKEAsIHgsIHkpXG4gICAgICApLnZhbHVlKClcbiAgICApLmZsYXR0ZW4oKS52YWx1ZSgpXG5cbiAgaW5zdGFsbEJvbWJzOiAoY291bnQpLT5cbiAgICBib21iUG9zaXRpb25zID0gXyhbMC4uKEBfY2VsbHMubGVuZ3RoIC0gMSldKS5zaHVmZmxlKCkuc2h1ZmZsZSgpLnZhbHVlKClbMC4uKGNvdW50IC0gMSldXG4gICAgQGluc3RhbGxCb21ic01hbnVhbGx5KGJvbWJQb3NpdGlvbnMuLi4pXG5cbiAgaW5zdGFsbEJvbWJzTWFudWFsbHk6IChib21icy4uLiktPlxuICAgIF8oQF9jZWxscykuZWFjaCgoY2VsbCktPlxuICAgICAgY2VsbC51bmluc3RhbGxCb21iKClcbiAgICApLnZhbHVlKClcblxuICAgIF8oYm9tYnMpLm1hcCgocG9zaXRpb24pPT5cbiAgICAgIEBnZXRQb3NpdGlvbkNlbGwocG9zaXRpb24pLmluc3RhbGxCb21iKClcbiAgICAgIHBvc2l0aW9uXG4gICAgKS52YWx1ZSgpXG5cbiAgaXNMb2NrZWQ6IC0+XG4gICAgQGxvY2tlZFxuXG4gIGxvY2s6IC0+XG4gICAgQGxvY2tlZCA9IHRydWVcblxuICBsb3NlOiAtPlxuICAgIEBjb21wdXRlVGltZSgpXG4gICAgQHN0YXRlID0gVGFibGUuc3RhdHVzLmxvc2VcbiAgICBfKEBfYm9tYnNDb3VudCkuZWFjaCgocG9zaXRpb24pPT4gQGdldFBvc2l0aW9uQ2VsbChwb3NpdGlvbikub3BlbigpKVxuICAgIEBsb2NrKClcblxuICBvcGVuOiAob3BlbmVkKSAtPlxuICAgIHJldHVybiBpZiBAaXNMb2NrZWQoKVxuICAgIHJldHVybiBAbG9zZSgpIGlmIG9wZW5lZC5oYXNCb21iKClcbiAgICByZXR1cm4gQHdpbigpIGlmIEBfYmxhbmtDZWxsc0NvdW50ID09IEBjb3VudE9wZW5lZENlbGwoKVxuXG4gICAgaWYgb3BlbmVkLmNvdW50Qm9tYnNBcm91bmQoKSA9PSAwXG4gICAgICBAb3BlbkFyb3VuZChvcGVuZWQpXG5cbiAgb3BlbkFyb3VuZDogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRVbm9wZW5lZENlbGxzKGNlbGwpKS5lYWNoKChhcm91bmQpLT4gYXJvdW5kLm9wZW4oKSkudmFsdWUoKVxuXG4gIHVubG9jazogLT5cbiAgICBAbG9ja2VkID0gZmFsc2VcblxuICB3aW46IC0+XG4gICAgQGNvbXB1dGVUaW1lKClcbiAgICBAc3RhdGUgPSBUYWJsZS5zdGF0dXMud2luXG4gICAgQGxvY2soKVxuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFV0aWwgPSB7XG4gICMjI1xuICBSZWFjdC5jcmVhdGVFbGVtZW5044KS5aSJ5b2iXG5cbiAgY2Uob2JqZWN0KVxuICAgIG9iamVjdC4kY24gLT4gY2xhc3NOYW1lXG4gICAgb2JqZWN0LiRlbCAtPiDjgr/jgrDlkI1cbiAgICBvYmplY3QuJGluYyAtPiDmnKvlsL7lvJXmlbDjgIHjgYLjgovjgYTjga/lj6/lpInplbflvJXmlbDjgajjgZfjgabmuKHjgZXjgozjgovlgKRcbiAgICBvYmplY3QgLT4g5byV5pWw44Gv44Gd44Gu44G+44G+cHJvcHPjgajjgZfjgabmuKHjgZXjgozjgotcblxuICDmma7pgJpcblxuICAgICBjZSB7JGVsOiAnZGl2JywgJGNuOiAnc2hvcnQnLCAkaW5jOiAndGV4dCd9XG5cbiAgICAgPGRpdiBjbGFzc05hbWU9XCJzaG9ydFwiPlxuICAgICAgIHRleHRcbiAgICAgPC9kaXY+XG5cbiAg5YWl44KM5a2QXG5cbiAgICAgSXRlbSA9IFJlYWN0Q2xhc3NcbiAgICAgICByZW5kZXI6IC0+XG4gICAgICAgICBjZSB7JGVsOiAnbGknLCAkaW5jOiAnaXRlbSd9XG5cbiAgICAgY2UgeyRlbDogJ3VsJywgJGluYzogW0l0ZW0sIEl0ZW1dfVxuXG4gICAgIDx1bD5cbiAgICAgICB7SXRlbX1cbiAgICAgICB7SXRlbX1cbiAgICAgPC91bD5cbiAgIyMjXG4gIGNlOiAob2JqZWN0KS0+XG4gICAgc3dpdGNoIHRydWVcbiAgICAgIHdoZW4gb2JqZWN0Py5oYXNPd25Qcm9wZXJ0eSgnJGVsJylcbiAgICAgICAgb2JqZWN0LmNsYXNzTmFtZSA9IG9iamVjdC4kY25cbiAgICAgICAgY2hpbGRyZW4gPSBAY2Uob2JqZWN0LiRpbmMpXG4gICAgICAgIGlmIF8uaXNBcnJheShjaGlsZHJlbilcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KG9iamVjdC4kZWwsIG9iamVjdCwgY2hpbGRyZW4uLi4pXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KG9iamVjdC4kZWwsIG9iamVjdCwgY2hpbGRyZW4pXG4gICAgICB3aGVuIF8uaXNBcnJheShvYmplY3QpXG4gICAgICAgIGZvciBjaGlsZCBpbiBvYmplY3RcbiAgICAgICAgICBAY2UoY2hpbGQpXG4gICAgICB3aGVuIF8uaXNTdHJpbmcob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIHdoZW4gXy5pc051bWJlcihvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgd2hlbiBfLmlzT2JqZWN0KG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICBlbHNlXG4gICAgICAgICcnXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFZpZXcgPSB7fVxuXG5WaWV3LlRhYmxlID0gcmVxdWlyZSAnLi92aWV3cy90YWJsZSdcblZpZXcuQ2VsbCA9IHJlcXVpcmUgJy4vdmlld3MvY2VsbCdcblZpZXcuRmEgPSByZXF1aXJlICcuL3ZpZXdzL2ZhJ1xuVmlldy5Db25maWd1cmF0aW9uID0gcmVxdWlyZSAnLi92aWV3cy9jb25maWd1cmF0aW9uJ1xuVmlldy5QcmVzZXQgPSByZXF1aXJlICcuL3ZpZXdzL3ByZXNldCdcblZpZXcuR2FtZSA9IHJlcXVpcmUgJy4vdmlld3MvZ2FtZSdcbiIsIm1vZHVsZS5leHBvcnRzID0gQ2VsbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICBtaXhpbnM6IFtBcmRhLm1peGluXVxuXG4gIHJlbmRlcjogLT5cbiAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiBAZ2VuQ2xhc3NlcygpLCByZWY6ICdjZWxsJywgJGluYzogQGdlbkluY3MoKSB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgY2VsbCA9IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLmNlbGwpXG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgQG9uQ29udGV4dE1lbnUpXG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bilcblxuICAgIEBzZXRTdGF0ZShjZWxsOiBjZWxsKVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxuICAgIGNlbGwgPSBAc3RhdGUuY2VsbFxuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNvbnRleHRtZW51XCIsIEBvbkNvbnRleHRNZW51KVxuICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBAb25Nb3VzZURvd24pXG5cbiAgZ2VuQ2xhc3NlczogLT5cbiAgICBjbGFzc2VzID0gWydjZWxsJ11cbiAgICBjbGFzc2VzLnB1c2goJ29wZW5lZCcpIGlmIEBwcm9wcy5tb2RlbC5pc09wZW5lZCgpXG4gICAgY2xhc3Nlcy5qb2luKCcgJylcblxuICBnZW5JbmNzOiAtPlxuICAgIHJldHVybiBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246IEBwcm9wcy5tb2RlbC5zdGF0ZSB9IGlmIG5vdCBAcHJvcHMubW9kZWwuaXNPcGVuZWQoKVxuXG4gICAgaWYgQHByb3BzLm1vZGVsLmhhc0JvbWIoKVxuICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnYm9tYicgfVxuICAgIGVsc2VcbiAgICAgIGNvdW50ID0gQHByb3BzLm1vZGVsLmNvdW50Qm9tYnNBcm91bmQoKVxuICAgICAgaWYgY291bnQgPT0gMFxuICAgICAgICAnJ1xuICAgICAgZWxzZVxuICAgICAgICBjb3VudFxuICBvbkNvbnRleHRNZW51OiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gIG9uTW91c2VEb3duOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIGUuYnV0dG9ucz9cbiAgICAgIHN3aXRjaCAoZS5idXR0b25zKVxuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6cmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAzXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRSaWdodENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDRcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bWlkZGxlQ2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgZWxzZSBpZiBlLmJ1dHRvbj9cbiAgICAgIHN3aXRjaCAoZS5idXR0b24pXG4gICAgICAgIHdoZW4gMFxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gMVxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDptaWRkbGVDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAyXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOnJpZ2h0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgZWxzZVxuICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbilcbiIsIm1vZHVsZS5leHBvcnRzID0gQ29uZmlndXJhdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICBtaXhpbnM6IFtBcmRhLm1peGluXVxuXG4gIGluaXRpYWxTdGF0ZTpcbiAgICB3aWR0aDogOVxuICAgIGhlaWdodDogOVxuICAgIGJvbWJzOiAxMFxuXG4gIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICBAaW5pdGlhbFN0YXRlXG5cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyIGNvbmYtcGFnZScsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnaDEnLCAkY246ICdtYWluLXRpdGxlJywgJGluYzogJ05vIE1pbmVzIExhbmQnIH1cbiAgICAgIGNlIHsgJGVsOiAnaDEnLCAkY246ICdjb25mLXBhZ2UgdGl0bGUnLCAkaW5jOiAn44OX44Oq44K744OD44OIJyB9XG4gICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAnY29uZi1wYWdlIHByZXNldC1nYW1lcycsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlByZXNldCwgcHJlc2V0OiB7IG5hbWU6ICfliJ3ntJonLCBkYXQ6IHsgd2lkdGg6IDksIGhlaWdodDogOSwgYm9tYnM6IDEwIH0gfSB9XG4gICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5QcmVzZXQsIHByZXNldDogeyBuYW1lOiAn5Lit57SaJywgZGF0OiB7IHdpZHRoOiAxNiwgaGVpZ2h0OiAxNiwgYm9tYnM6IDQwIH0gfSB9XG4gICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5QcmVzZXQsIHByZXNldDogeyBuYW1lOiAn5LiK57SaJywgZGF0OiB7IHdpZHRoOiAzMCwgaGVpZ2h0OiAxNiwgYm9tYnM6IDk5IH0gfSB9XG4gICAgICBdIH1cbiAgICAgIGNlIHsgJGVsOiAnaDEnLCAkY246ICdjb25mLXBhZ2UgdGl0bGUnLCAkaW5jOiAn44OV44Oq44O844K544K/44Kk44OrJyB9XG4gICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAnY29uZi1wYWdlIGZvcm0tbGF5b3V0JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LXRpdGxlLWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2xhYmVsJywgJGNuOiAnaW5wdXQtdGl0bGUgY29uZi1wYWdlJywgJGluYzogJ+aoqicgfVxuICAgICAgICBdIH1cbiAgICAgICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBpbnB1dC1sYXlvdXQnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdpbnB1dCcsICRjbjogJ2Zvcm0tY29udHJvbCBjb25mLXBhZ2UnLCByZWY6ICd3aWR0aCcsIHZhbHVlOiBAc3RhdGUud2lkdGgsIG9uQ2hhbmdlOiBAZ2VuT25DaGFuZ2VWYWx1ZSgnd2lkdGgnKSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LXRpdGxlLWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2xhYmVsJywgJGNuOiAnaW5wdXQtdGl0bGUgY29uZi1wYWdlJywgJGluYzogJ+e4picgfVxuICAgICAgICBdIH1cbiAgICAgICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBpbnB1dC1sYXlvdXQnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdpbnB1dCcsICRjbjogJ2Zvcm0tY29udHJvbCBjb25mLXBhZ2UnLCByZWY6ICdoZWlnaHQnLCB2YWx1ZTogQHN0YXRlLmhlaWdodCwgb25DaGFuZ2U6IEBnZW5PbkNoYW5nZVZhbHVlKCdoZWlnaHQnKSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiAnY29uZi1wYWdlIGlucHV0LXRpdGxlLWxheW91dCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2xhYmVsJywgJGNuOiAnaW5wdXQtdGl0bGUgY29uZi1wYWdlJywgJGluYzogW1xuICAgICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnYm9tYicsIGZpeGVkV2lkdGg6IHRydWUgfVxuICAgICAgICAgIF0gfVxuICAgICAgICBdIH1cbiAgICAgICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBpbnB1dC1sYXlvdXQnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdpbnB1dCcsICRjbjogJ2Zvcm0tY29udHJvbCBjb25mLXBhZ2UnLCByZWY6ICdib21icycsIHZhbHVlOiBAc3RhdGUuYm9tYnMsIG9uQ2hhbmdlOiBAZ2VuT25DaGFuZ2VWYWx1ZSgnYm9tYnMnKSB9XG4gICAgICAgIF0gfVxuICAgICAgXSB9XG4gICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tc3VjY2VzcyBjb25mLXBhZ2Ugd2lkZScsIG9uQ2xpY2s6IEBvbkNsaWNrRnJlZVN0eWxlLCAkaW5jOiAn44K544K/44O844OIJyB9XG4gICAgXSB9XG5cbiAgZ2VuT25DaGFuZ2VWYWx1ZTogKHRhcmdldCktPlxuICAgIChlKT0+XG4gICAgICBzdGF0ZSA9IHt9XG4gICAgICB2YWx1ZSA9ICtlLnRhcmdldC52YWx1ZVxuXG4gICAgICBzdGF0ZVt0YXJnZXRdID0gc3dpdGNoIHRydWVcbiAgICAgICAgd2hlbiBfLmlzTmFOKHZhbHVlKVxuICAgICAgICAgIEBpbml0aWFsU3RhdGVbdGFyZ2V0XVxuICAgICAgICB3aGVuIHZhbHVlIDwgMVxuICAgICAgICAgIEBpbml0aWFsU3RhdGVbdGFyZ2V0XVxuICAgICAgICB3aGVuIF8uaXNOdW1iZXIodmFsdWUpXG4gICAgICAgICAgdmFsdWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBpbml0aWFsU3RhdGVbdGFyZ2V0XVxuXG4gICAgICBAc2V0U3RhdGUoc3RhdGUpXG5cbiAgb25DbGlja0ZyZWVTdHlsZTogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2ggJ2ZyZWVzdHlsZScsIHtcbiAgICAgIHdpZHRoOiBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy53aWR0aCkudmFsdWVcbiAgICAgIGhlaWdodDogUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuaGVpZ2h0KS52YWx1ZVxuICAgICAgYm9tYnM6IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLmJvbWJzKS52YWx1ZVxuICAgIH1cbikiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIEZhID0gUmVhY3QuY3JlYXRlQ2xhc3MgKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNsYXNzZXMgPSBbJ2ZhJ11cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLmljb259XCIpXG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5zY2FsZX14XCIpIGlmIEBwcm9wcy5zY2FsZT9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtZncnKSBpZiBAcHJvcHMuZml4ZWRXaWR0aFxuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1saScpIGlmIEBwcm9wcy5saXN0XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWJvcmRlcicpIGlmIEBwcm9wcy5ib3JkZXJcbiAgICAgIGNsYXNzZXMucHVzaChcImZhLXB1bGwtI3tAcHJvcHMucHVsbH1cIikgaWYgQHByb3BzLnB1bGw/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5hbmltYXRpb24/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1yb3RhdGUtI3tAcHJvcHMucm90YXRlfVwiKSBpZiBAcHJvcHMucm90YXRlP1xuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtZmxpcC0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5mbGlwP1xuXG4gICAgICBjZSB7ICRlbDogJ2knLCAkY246IGNsYXNzZXMuam9pbignICcpIH1cbiAgKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBHYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgcmVuZGVyOiAtPlxuICAgIHRhYmxlID0gQHByb3BzLmNvbmZpZ1xuXG4gICAgY2UgeyAkZWw6ICdkaXYnLCAkaW5jOiBbXG4gICAgICBjZSB7ICRlbDogJ2gxJywgJGNuOiAnbWFpbi10aXRsZScsICRpbmM6ICdObyBNaW5lcyBMYW5kJyB9XG4gICAgICBjZSB7ICRlbDogJ2hlYWRlcicsICRjbjogJ2dhbWUtcGFnZSBoZWFkZXInLCAkaW5jOiBbXG4gICAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnZ2FtZS1wYWdlIHRpbWUnLCAkaW5jOiBbXG4gICAgICAgICAgdGFibGUucGFzc2VkVGltZVxuICAgICAgICBdIH1cbiAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdnYW1lLXBhZ2UgcmVzdGFydCcsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogXCJidG4gYnRuLSN7QGRldGVjdENvbG9yKCl9IGdhbWUtcGFnZSB3aWRlXCIsIG9uQ2xpY2s6IEBvbkNsaWNrUmVzdGFydCwgJGluYzogW1xuICAgICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiBAZGV0ZWN0RmFjZSgpLCBzY2FsZTogMiB9XG4gICAgICAgICAgXSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2dhbWUtcGFnZSByZXN0JywgJGluYzogW1xuICAgICAgICAgIHRhYmxlLnJlc3RCb21zQ291bnRcbiAgICAgICAgXSB9XG4gICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjbGVhcmZpeCcsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlRhYmxlLCBtb2RlbDogQHByb3BzLmNvbmZpZyB9XG4gICAgICBdIH1cbiAgICAgIGNlIHsgJGVsOiAnZm9vdGVyJywgJGNuOiAnZ2FtZS1wYWdlIGZvb3RlcicsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6ICdidXR0b24nLCAkY246ICdidG4gYnRuLXN1Y2Nlc3MgY29uZi1wYWdlJywgb25DbGljazogQG9uQ2xpY2tCYWNrLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnY2hldnJvbi1jaXJjbGUtbGVmdCcgfVxuICAgICAgICAgICcg44KC44Gp44KLJ1xuICAgICAgICBdIH1cbiAgICAgIF0gfVxuICAgIF0gfVxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIEBzaWQgPSBzZXRJbnRlcnZhbCgoPT5cbiAgICAgIEBkaXNwYXRjaCAndGltZXInXG4gICAgKSwgMTAwMClcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogLT5cbiAgICBjbGVhckludGVydmFsKEBzaWQpXG5cbiAgZGV0ZWN0Q29sb3I6IC0+XG4gICAgc3dpdGNoIEBwcm9wcy5jb25maWcuc3RhdGVcbiAgICAgIHdoZW4gQXBwLk1vZGVsLlRhYmxlLnN0YXR1cy5wbGF5XG4gICAgICAgICdkZWZhdWx0J1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLndpblxuICAgICAgICAncHJpbWFyeSdcbiAgICAgIHdoZW4gQXBwLk1vZGVsLlRhYmxlLnN0YXR1cy5sb3NlXG4gICAgICAgICdkYW5nZXInXG5cbiAgZGV0ZWN0RmFjZTogLT5cbiAgICBzd2l0Y2ggQHByb3BzLmNvbmZpZy5zdGF0ZVxuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLnBsYXlcbiAgICAgICAgJ21laC1vJ1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLndpblxuICAgICAgICAnc21pbGUtbydcbiAgICAgIHdoZW4gQXBwLk1vZGVsLlRhYmxlLnN0YXR1cy5sb3NlXG4gICAgICAgICdmcm93bi1vJ1xuXG4gIG9uQ2xpY2tCYWNrOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAnYmFjaydcblxuICBvbkNsaWNrUmVzdGFydDogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2ggJ3Jlc3RhcnQnXG4pXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gUHJlc2V0ID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG5cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgcHJlc2V0JywgJGluYzogW1xuICAgICAgY2UgeyAkZWw6ICdidXR0b24nLCAkY246ICdidG4gYnRuLXByaW1hcnkgY29uZi1wYWdlIHdpZGUnLCBvbkNsaWNrOiBAb25DbGljaywgJGluYzogQHByb3BzLnByZXNldC5uYW1lIH1cbiAgICBdIH1cblxuICBvbkNsaWNrOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCgncHJlc2V0JywgQHByb3BzLnByZXNldC5kYXQpXG4pIiwibW9kdWxlLmV4cG9ydHMgPVxuICBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICd0YWJsZScsICRpbmM6IEBnZW5DZWxscygpLCBzdHlsZTogQGdlblN0eWxlcygpIH1cblxuICAgIGdlbkNlbGxzOiAtPlxuICAgICAgXyhAcHJvcHMubW9kZWwuZ2V0Q2VsbHMoKSkubWFwKChjZWxsKS0+XG4gICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5DZWxsLCBtb2RlbDogY2VsbCB9XG4gICAgICApLnZhbHVlKClcblxuICAgIGdlblN0eWxlczogLT5cbiAgICAgIHdpZHRoOiBAcHJvcHMubW9kZWwud2lkdGggKiAzMFxuICApXG4iXX0=
