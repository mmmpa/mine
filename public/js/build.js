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
    subscribe('timer', (function(_this) {
      return function() {
        _this.props.table.computeTime();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
    return subscribe('back', (function(_this) {
      return function() {
        return _this.props.router.popContext();
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
        $el: App.View.Configuration,
        model: this.props.config.table
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
    router: router,
    config: {
      table: new App.Model.Table(5, 4)
    }
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
  Cell.prototype.status = {
    none: 'none',
    flag: 'flag',
    question: 'question',
    open: 'open'
  };

  Cell.prototype.opened = false;

  Cell.prototype.bombed = false;

  Cell.prototype.state = null;

  Cell.prototype.counted = null;

  function Cell(table, x, y) {
    this.table = table;
    this.x = x;
    this.y = y;
    this.open = bind(this.open, this);
    this.countFlagsAround = bind(this.countFlagsAround, this);
    this.countBombsAround = bind(this.countBombsAround, this);
    this.position = this.table.width * this.y + this.x;
    this.state = this.status.none;
  }

  Cell.prototype.countBombsAround = function() {
    return this.counted != null ? this.counted : this.counted = this.table.countBombsAround(this);
  };

  Cell.prototype.countFlagsAround = function() {
    return this.table.countFlagsAround(this);
  };

  Cell.prototype.isFlagged = function() {
    return this.state === this.status.flag;
  };

  Cell.prototype.isOpened = function() {
    return this.opened;
  };

  Cell.prototype.isOpenable = function() {
    return this.state !== this.status.none;
  };

  Cell.prototype.hasBomb = function() {
    return this.bombed;
  };

  Cell.prototype.openAround = function() {
    if (this.table.locked) {
      return;
    }
    if (this.opened && this.countBombsAround() === this.countFlagsAround()) {
      return this.table.openAround(this);
    }
  };

  Cell.prototype.rotateMode = function() {
    if (this.opened || this.table.locked) {
      return;
    }
    this.state = (function() {
      switch (this.state) {
        case this.status.none:
          return this.status.flag;
        case this.status.flag:
          return this.status.question;
        case this.status.question:
          return this.status.none;
      }
    }).call(this);
    this.table.computeRestBombsCount();
    return this.state;
  };

  Cell.prototype.open = function() {
    if (this.table.isLocked()) {
      return;
    }
    if (this.isOpened() || this.isOpenable()) {
      return true;
    }
    this.opened = true;
    this.state = this.status.open;
    return this.table.open(this);
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
    this._cells = this.initCells();
    this._bombCellPositions = this.installBomb(this._bombsCount);
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
    var x, y;
    return _.flatten((function() {
      var i, ref, results;
      results = [];
      for (y = i = 0, ref = this.height - 1; 0 <= ref ? i <= ref : i >= ref; y = 0 <= ref ? ++i : --i) {
        results.push((function() {
          var j, ref1, results1;
          results1 = [];
          for (x = j = 0, ref1 = this.width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; x = 0 <= ref1 ? ++j : --j) {
            results1.push(new App.Model.Cell(this, x, y));
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
      for (var i = 0, ref = this._cells.length - 1; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this))).slice(0, +(count - 1) + 1 || 9e9));
  };

  Table.prototype.installBombManually = function() {
    var bombs, cell, i, j, len, len1, position, ref, results;
    bombs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    ref = this._cells;
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      cell.bombed = false;
    }
    results = [];
    for (j = 0, len1 = bombs.length; j < len1; j++) {
      position = bombs[j];
      this._cells[position].bombed = true;
      results.push(position);
    }
    return results;
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
      $cn: this.classes(),
      ref: 'cell',
      $inc: this.inc()
    });
  },
  classes: function() {
    var classes;
    classes = ['cell'];
    if (this.props.model.opened) {
      classes.push('opened');
    }
    return classes.join(' ');
  },
  inc: function() {
    var count;
    if (!this.props.model.opened) {
      return ce({
        $el: App.View.Fa,
        icon: this.props.model.state
      });
    }
    if (this.props.model.bombed) {
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
  componentDidMount: function() {
    var cell;
    cell = React.findDOMNode(this.refs.cell);
    cell.addEventListener("contextmenu", function(e) {
      return e.preventDefault();
    });
    return cell.addEventListener("mousedown", this.onClickHandler);
  },
  onClickHandler: function(e) {
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
  render: function() {
    return ce({
      $el: 'div',
      $cn: 'container conf-page',
      $inc: [
        ce({
          $el: 'div',
          $cn: 'col-sm-offset-4 col-sm-4',
          $inc: [
            ce({
              $el: 'h1',
              $cn: 'conf-page title',
              $inc: 'プリセット'
            }), ce({
              $el: 'ul',
              $cn: 'conf-page preset-games',
              $inc: [
                ce({
                  $el: App.View.Preset,
                  model: {
                    name: '初級',
                    dat: {
                      width: 9,
                      height: 9,
                      bombs: 10
                    }
                  }
                }), ce({
                  $el: App.View.Preset,
                  model: {
                    name: '中級',
                    dat: {
                      width: 16,
                      height: 16,
                      bombs: 40
                    }
                  }
                }), ce({
                  $el: App.View.Preset,
                  model: {
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
              $el: 'form',
              $cn: 'conf-page free-style conf-page',
              $inc: [
                ce({
                  $el: 'div',
                  $cn: 'row form-group',
                  $inc: [
                    ce({
                      $el: 'label',
                      $cn: 'col-sm-1 control-label conf-page',
                      $inc: '横'
                    }), ce({
                      $el: 'div',
                      $cn: 'col-sm-3',
                      $inc: [
                        ce({
                          $el: 'input',
                          $cn: 'form-control conf-page',
                          ref: 'width',
                          value: 5,
                          onClick: this.onClick
                        })
                      ]
                    }), ce({
                      $el: 'label',
                      $cn: 'col-sm-1 control-label conf-page',
                      $inc: '横'
                    }), ce({
                      $el: 'div',
                      $cn: 'col-sm-3',
                      $inc: [
                        ce({
                          $el: 'input',
                          $cn: 'form-control conf-page',
                          ref: 'height',
                          value: 4,
                          onClick: this.onClick
                        })
                      ]
                    }), ce({
                      $el: 'label',
                      $cn: 'col-sm-1 control-label conf-page',
                      $inc: [
                        ce({
                          $el: App.View.Fa,
                          icon: 'bomb',
                          fixedWidth: true
                        })
                      ]
                    }), ce({
                      $el: 'div',
                      $cn: 'col-sm-3',
                      $inc: [
                        ce({
                          $el: 'input',
                          $cn: 'form-control conf-page',
                          ref: 'bombs',
                          value: 4,
                          onClick: this.onClick
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
            })
          ]
        })
      ]
    });
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
    if (this.props.fixedWidth != null) {
      classes.push('fa-fw');
    }
    if (this.props.list != null) {
      classes.push('fa-li');
    }
    if (this.props.border != null) {
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
          $el: 'div',
          $cn: 'container',
          $inc: [
            ce({
              $el: 'div',
              $cn: 'col-sm-offset-3 col-sm-6 game-page clearfix',
              $inc: [
                ce({
                  $el: 'div',
                  $cn: 'col-sm-5 game-page time',
                  $inc: [table.passedTime]
                }), ce({
                  $el: 'div',
                  $cn: 'col-sm-2 game-page restart',
                  $inc: [
                    ce({
                      $el: 'button',
                      $cn: "btn btn-" + (this.buttonColor()) + " game-page wide",
                      onClick: this.onClickRestart,
                      $inc: [
                        ce({
                          $el: App.View.Fa,
                          icon: this.buttonFace(),
                          scale: 2
                        })
                      ]
                    })
                  ]
                }), ce({
                  $el: 'div',
                  $cn: 'col-sm-5 game-page rest',
                  $inc: [table.restBomsCount]
                })
              ]
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
          $el: 'div',
          $cn: 'container game-page bottom-area',
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
  onClickRestart: function(e) {
    e.preventDefault();
    return this.dispatch('restart');
  },
  onClickBack: function(e) {
    e.preventDefault();
    return this.dispatch('back');
  },
  buttonFace: function() {
    switch (this.props.config.state) {
      case App.Model.Table.status.play:
        return 'meh-o';
      case App.Model.Table.status.win:
        return 'smile-o';
      case App.Model.Table.status.lose:
        return 'frown-o';
    }
  },
  buttonColor: function() {
    switch (this.props.config.state) {
      case App.Model.Table.status.play:
        return 'default';
      case App.Model.Table.status.win:
        return 'primary';
      case App.Model.Table.status.lose:
        return 'danger';
    }
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
          $inc: this.props.model.name
        })
      ]
    });
  },
  onClick: function(e) {
    e.preventDefault();
    return this.dispatch('preset', this.props.model.dat);
  }
});



},{}],15:[function(require,module,exports){
var Table;

module.exports = Table = React.createClass({
  render: function() {
    return ce({
      $el: 'ul',
      $cn: 'table',
      $inc: this.cells(),
      style: this.styles()
    });
  },
  cells: function() {
    var cell, i, len, ref, results;
    ref = this.props.model.getCells();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      cell = ref[i];
      results.push(ce({
        $el: App.View.Cell,
        model: cell
      }));
    }
    return results;
  },
  styles: function() {
    return {
      width: this.props.model.width * 30
    };
  }
});



},{}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvY29udGV4dHMvZ2FtZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9jb250ZXh0cy9zZXR0aW5nLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2luZGV4LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy9jZWxsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy90YWJsZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC91dGlsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXcuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvY2VsbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9jb25maWd1cmF0aW9uLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2ZhLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2dhbWUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvcHJlc2V0LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3RhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUFVOztBQUUzQixPQUFPLENBQUMsV0FBUixHQUFzQixPQUFBLENBQVEsaUJBQVI7O0FBQ3RCLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7Ozs7QUNIekIsSUFBQSxXQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBckM7T0FBSDtJQURNLENBQVI7R0FEUzs7d0JBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNULEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFLLENBQUMsTUFBbkI7RUFETDs7d0JBR1gsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUNwQjtNQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsS0FBZDs7RUFEb0I7O3dCQUd0QixRQUFBLEdBQVUsU0FBQyxTQUFEO0lBQ1IsMkNBQUEsU0FBQTtJQUNBLFNBQUEsQ0FBVSxpQkFBVixFQUE2QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtRQUMzQixJQUFJLENBQUMsVUFBTCxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLEtBQUQ7aUJBQVc7WUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFD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QUEsRUFBSyxPQUFsQjtNQUEyQixJQUFBLEVBQU0sSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFqQztNQUEyQyxLQUFBLEVBQU8sSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFsRDtLQUFIO0VBRE0sQ0FBUjtFQUVBLEtBQUEsRUFBTyxTQUFBO0FBQ0wsUUFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTs7bUJBQ0UsRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsS0FBQSxFQUFPLElBQTdCO09BQUg7QUFERjs7RUFESyxDQUZQO0VBS0EsTUFBQSxFQUFRLFNBQUE7V0FDTjtNQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFiLEdBQXFCLEVBQTVCOztFQURNLENBTFI7Q0FETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IENvbnRleHQgPSB7fVxuXG5Db250ZXh0LkdhbWVDb250ZXh0ID0gcmVxdWlyZSAnLi9jb250ZXh0cy9nYW1lJ1xuQ29udGV4dC5TZXR0aW5nQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dHMvc2V0dGluZydcbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZUNvbnRleHQgZXh0ZW5kcyBBcmRhLkNvbnRleHRcbiAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgICByZW5kZXI6IC0+XG4gICAgICBjZSB7ICRlbDogQXBwLlZpZXcuR2FtZSwgY29uZmlnOiBAcHJvcHMuY29uZmlnIH1cbiAgKVxuXG4gIGluaXRTdGF0ZTogKHByb3BzKSAtPlxuICAgIHByb3BzLnRhYmxlID0gQGNyZWF0ZVRhYmxlKHByb3BzLmNvbmZpZylcblxuICBleHBhbmRDb21wb25lbnRQcm9wczogKHByb3BzLCBzdGF0ZSkgLT5cbiAgICBjb25maWc6IHByb3BzLnRhYmxlXG5cbiAgZGVsZWdhdGU6IChzdWJzY3JpYmUpIC0+XG4gICAgc3VwZXJcbiAgICBzdWJzY3JpYmUgJ2NlbGw6cmlnaHRDbGljaycsIChjZWxsKT0+XG4gICAgICBjZWxsLnJvdGF0ZU1vZGUoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuICAgIHN1YnNjcmliZSAnY2VsbDpsZWZ0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5vcGVuKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdFJpZ2h0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5vcGVuQXJvdW5kKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcbiAgICBzdWJzY3JpYmUgJ3Jlc3RhcnQnLCA9PlxuICAgICAgQHByb3BzLnRhYmxlID0gQGNyZWF0ZVRhYmxlKEBwcm9wcy5jb25maWcpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG4gICAgc3Vic2NyaWJlICd0aW1lcicsID0+XG4gICAgICBAcHJvcHMudGFibGUuY29tcHV0ZVRpbWUoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuICAgIHN1YnNjcmliZSAnYmFjaycsID0+XG4gICAgICBAcHJvcHMucm91dGVyLnBvcENvbnRleHQoKVxuICBjcmVhdGVUYWJsZTogKGRhdCktPlxuICAgIG5ldyBBcHAuTW9kZWwuVGFibGUoZGF0LndpZHRoLCBkYXQuaGVpZ2h0LCBkYXQuYm9tYnMpIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXR0aW5nQ29udGV4dCBleHRlbmRzIEFyZGEuQ29udGV4dFxuICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5Db25maWd1cmF0aW9uLCBtb2RlbDogQHByb3BzLmNvbmZpZy50YWJsZSB9XG4gIClcblxuICBpbml0U3RhdGU6IChwcm9wcykgLT5cbiAgICBwcm9wc1xuXG4gIGV4cGFuZENvbXBvbmVudFByb3BzOiAocHJvcHMsIHN0YXRlKSAtPlxuICAgIGNvbmZpZzogc3RhdGUuY29uZmlnXG5cbiAgZGVsZWdhdGU6IChzdWJzY3JpYmUpIC0+XG4gICAgc3VwZXJcbiAgICBzdWJzY3JpYmUgJ3ByZXNldCcsIChkYXQpPT5cbiAgICAgIEBwcm9wcy5yb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuR2FtZUNvbnRleHQsIHtcbiAgICAgICAgcm91dGVyOiBAcHJvcHMucm91dGVyXG4gICAgICAgIGNvbmZpZzogZGF0XG4gICAgICB9KVxuICAgIHN1YnNjcmliZSAnZnJlZXN0eWxlJywgKGRhdCk9PlxuICAgICAgQHByb3BzLnJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5HYW1lQ29udGV4dCwge1xuICAgICAgICByb3V0ZXI6IEBwcm9wcy5yb3V0ZXJcbiAgICAgICAgY29uZmlnOiBkYXRcbiAgICAgIH0pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFwcCA9IHt9XG5pZiB3aW5kb3c/XG4gIHdpbmRvdy5BcHAgPSBBcHBcbiAgd2luZG93LmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5lbHNlXG4gIGdsb2JhbC5BcHAgPSBBcHBcbiAgZ2xvYmFsLmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5BcHAuQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dCdcbkFwcC5VdGlsID0gcmVxdWlyZSAnLi91dGlsJ1xuQXBwLk1vZGVsID0gcmVxdWlyZSAnLi9tb2RlbCdcbkFwcC5WaWV3ID0gcmVxdWlyZSAnLi92aWV3J1xuXG5jb25zb2xlLmxvZyAnYSdcblxuQXBwLnN0YXJ0ID0gKG5vZGUpLT5cbiAgcm91dGVyID0gbmV3IEFyZGEuUm91dGVyKEFyZGEuRGVmYXVsdExheW91dCwgbm9kZSlcbiAgcm91dGVyLnB1c2hDb250ZXh0KEFwcC5Db250ZXh0LlNldHRpbmdDb250ZXh0LCB7IHJvdXRlcjogcm91dGVyLCBjb25maWc6IHt0YWJsZTogbmV3IEFwcC5Nb2RlbC5UYWJsZSg1LCA0KX0gfSlcbiAgI3JvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5HYW1lQ29udGV4dCwgeyByb3V0ZXI6IHJvdXRlciwgY29uZmlnOiB7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgYm9tYnM6IDEwIH19KVxuICAjUmVhY3QucmVuZGVyKChjZSB7ICRlbDogQXBwLlZpZXcuV2FsbCwgbW9kZWw6IG5ldyBBcHAuTW9kZWwuVGFibGUoNSwgNCkgfSksIG5vZGUpIiwibW9kdWxlLmV4cG9ydHMgPSBNb2RlbCA9IHt9XG5cbk1vZGVsLkNlbGwgPSByZXF1aXJlICcuL21vZGVscy9jZWxsJ1xuTW9kZWwuVGFibGUgPSByZXF1aXJlICcuL21vZGVscy90YWJsZSdcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgQ2VsbFxuICAgIHN0YXR1czpcbiAgICAgIG5vbmU6ICdub25lJ1xuICAgICAgZmxhZzogJ2ZsYWcnXG4gICAgICBxdWVzdGlvbjogJ3F1ZXN0aW9uJ1xuICAgICAgb3BlbjogJ29wZW4nXG4gICAgb3BlbmVkOiBmYWxzZVxuICAgIGJvbWJlZDogZmFsc2VcbiAgICBzdGF0ZTogbnVsbFxuICAgIGNvdW50ZWQ6IG51bGxcblxuICAgIGNvbnN0cnVjdG9yOiAoQHRhYmxlLCBAeCwgQHkpIC0+XG4gICAgICBAcG9zaXRpb24gPSBAdGFibGUud2lkdGggKiBAeSArIEB4XG4gICAgICBAc3RhdGUgPSBAc3RhdHVzLm5vbmVcblxuICAgIGNvdW50Qm9tYnNBcm91bmQ6ID0+XG4gICAgICBAY291bnRlZCA/PSBAdGFibGUuY291bnRCb21ic0Fyb3VuZChAKVxuXG4gICAgY291bnRGbGFnc0Fyb3VuZDogPT5cbiAgICAgIEB0YWJsZS5jb3VudEZsYWdzQXJvdW5kKEApXG5cbiAgICBpc0ZsYWdnZWQ6IC0+XG4gICAgICBAc3RhdGUgPT0gQHN0YXR1cy5mbGFnXG5cbiAgICBpc09wZW5lZDogLT5cbiAgICAgIEBvcGVuZWRcblxuICAgIGlzT3BlbmFibGU6LT5cbiAgICAgIEBzdGF0ZSAhPSBAc3RhdHVzLm5vbmVcbiAgICBoYXNCb21iOiAtPlxuICAgICAgQGJvbWJlZFxuXG4gICAgb3BlbkFyb3VuZDogLT5cbiAgICAgIHJldHVybiBpZiBAdGFibGUubG9ja2VkXG4gICAgICBAdGFibGUub3BlbkFyb3VuZChAKSBpZiBAb3BlbmVkICYmIEBjb3VudEJvbWJzQXJvdW5kKCkgPT0gQGNvdW50RmxhZ3NBcm91bmQoKVxuXG4gICAgcm90YXRlTW9kZTogLT5cbiAgICAgIHJldHVybiBpZiBAb3BlbmVkIHx8IEB0YWJsZS5sb2NrZWRcbiAgICAgIEBzdGF0ZSA9IHN3aXRjaCBAc3RhdGVcbiAgICAgICAgd2hlbiBAc3RhdHVzLm5vbmVcbiAgICAgICAgICBAc3RhdHVzLmZsYWdcbiAgICAgICAgd2hlbiBAc3RhdHVzLmZsYWdcbiAgICAgICAgICBAc3RhdHVzLnF1ZXN0aW9uXG4gICAgICAgIHdoZW4gQHN0YXR1cy5xdWVzdGlvblxuICAgICAgICAgIEBzdGF0dXMubm9uZVxuICAgICAgQHRhYmxlLmNvbXB1dGVSZXN0Qm9tYnNDb3VudCgpXG4gICAgICBAc3RhdGVcbiAgICBvcGVuOiA9PlxuICAgICAgcmV0dXJuIGlmIEB0YWJsZS5pc0xvY2tlZCgpXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBAaXNPcGVuZWQoKSB8fCBAaXNPcGVuYWJsZSgpXG4gICAgICBAb3BlbmVkID0gdHJ1ZVxuICAgICAgQHN0YXRlID0gQHN0YXR1cy5vcGVuXG4gICAgICBAdGFibGUub3BlbihAKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUYWJsZVxuICBAc3RhdHVzOlxuICAgIHBsYXk6ICdwbGF5J1xuICAgIHdpbjogJ3dpbidcbiAgICBsb3NlOiAnbG9zZSdcbiAgc3RhdGU6IG51bGxcblxuICBjb25zdHJ1Y3RvcjogKEB3aWR0aCwgQGhlaWdodCwgQF9ib21ic0NvdW50ID0gMSkgLT5cbiAgICB0aHJvdyAnbm8gYm9tYnMnIGlmIEBfYm9tYnNDb3VudCA8IDFcblxuICAgIEBfY2VsbHMgPSBAaW5pdENlbGxzKClcbiAgICBAX2JvbWJDZWxsUG9zaXRpb25zID0gQGluc3RhbGxCb21iKEBfYm9tYnNDb3VudClcbiAgICBAX3N0YXJ0ZWRUaW1lID0gK25ldyBEYXRlKClcbiAgICBAcGFzc2VkVGltZSA9IDBcbiAgICBAcmVzdEJvbXNDb3VudCA9IEBfYm9tYnNDb3VudFxuICAgIEBfYmxhbmtDZWxsc0NvdW50ID0gQF9jZWxscy5sZW5ndGggLSBAX2JvbWJzQ291bnRcbiAgICBAc3RhdGUgPSBUYWJsZS5zdGF0dXMucGxheVxuXG4gIGNvbXB1dGVUaW1lOiAtPlxuICAgIHJldHVybiBpZiBAaXNMb2NrZWQoKVxuICAgIEBwYXNzZWRUaW1lID0gXygoK25ldyBEYXRlKCkgLSBAX3N0YXJ0ZWRUaW1lKSAvIDEwMDApLmZsb29yKClcblxuICBjb3VudEJvbWJzQXJvdW5kOiAoY2VsbCktPlxuICAgIF8oQGdldEFyb3VuZENlbGxzKGNlbGwpKS5maWx0ZXIoKHBpY2tlZCktPlxuICAgICAgcGlja2VkICYmIHBpY2tlZC5oYXNCb21iKClcbiAgICApLnZhbHVlKCkubGVuZ3RoXG5cbiAgY291bnRGbGFnc0Fyb3VuZDogKGNlbGwpLT5cbiAgICBfKEBnZXRBcm91bmRDZWxscyhjZWxsKSkuZmlsdGVyKChwaWNrZWQpLT5cbiAgICAgIHBpY2tlZCAmJiBwaWNrZWQuaXNGbGFnZ2VkKClcbiAgICApLnZhbHVlKCkubGVuZ3RoXG5cbiAgY291bnRGbGFnZ2VkQ2VsbDogLT5cbiAgICBfKEBfY2VsbHMpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmlzRmxhZ2dlZCgpXG4gICAgKS52YWx1ZSgpLmxlbmd0aFxuXG4gIGNvdW50T3BlbmVkQ2VsbDogLT5cbiAgICBfKEBfY2VsbHMpLmZpbHRlcigocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmlzT3BlbmVkKClcbiAgICApLnZhbHVlKCkubGVuZ3RoXG5cbiAgY291bnRSZXN0Qm9tYnM6IC0+XG4gICAgQF9ib21ic0NvdW50IC0gQGNvdW50RmxhZ2dlZENlbGwoKVxuXG4gIGNvbXB1dGVSZXN0Qm9tYnNDb3VudDogLT5cbiAgICBAcmVzdEJvbXNDb3VudCA9IEBjb3VudFJlc3RCb21icygpXG5cbiAgZ2V0QXJvdW5kQ2VsbHM6IChjZWxsKS0+XG4gICAgXy5jb21wYWN0KF8uZmxhdHRlbihmb3IgeSBpbiBbKGNlbGwueSAtIDEpLi4oY2VsbC55ICsgMSldXG4gICAgICBmb3IgeCBpbiBbKGNlbGwueCAtIDEpLi4oY2VsbC54ICsgMSldXG4gICAgICAgIEBnZXRQb2ludENlbGwoeCwgeSkpKVxuXG4gIGdldENlbGxzOiAtPlxuICAgIEBfY2VsbHNcblxuICBnZXRQb2ludENlbGw6ICh4LCB5KS0+XG4gICAgcmV0dXJuIG51bGwgaWYgeCA8IDAgfHwgeSA8IDAgfHwgeCA+IEB3aWR0aCAtIDEgfHwgeSA+IEBoZWlnaHQgLSAxXG4gICAgQGdldFBvc2l0aW9uQ2VsbCh5ICogQHdpZHRoICsgeClcblxuICBnZXRQb3NpdGlvbkNlbGw6IChwb3NpdGlvbikgLT5cbiAgICBAX2NlbGxzW3Bvc2l0aW9uXVxuXG4gIGluaXRDZWxsczogPT5cbiAgICBfLmZsYXR0ZW4oZm9yIHkgaW4gWzAuLihAaGVpZ2h0IC0gMSldXG4gICAgICBmb3IgeCBpbiBbMC4uKEB3aWR0aCAtIDEpXVxuICAgICAgICBuZXcgQXBwLk1vZGVsLkNlbGwoQCwgeCwgeSkpXG5cbiAgaW5zdGFsbEJvbWI6IChjb3VudCktPlxuICAgIEBpbnN0YWxsQm9tYk1hbnVhbGx5KF8uc2h1ZmZsZShfLnNodWZmbGUoWzAuLihAX2NlbGxzLmxlbmd0aCAtIDEpXSkpWzAuLihjb3VudCAtIDEpXS4uLilcblxuICBpbnN0YWxsQm9tYk1hbnVhbGx5OiAoYm9tYnMuLi4pLT5cbiAgICBmb3IgY2VsbCBpbiBAX2NlbGxzXG4gICAgICBjZWxsLmJvbWJlZCA9IGZhbHNlXG4gICAgZm9yIHBvc2l0aW9uIGluIGJvbWJzXG4gICAgICBAX2NlbGxzW3Bvc2l0aW9uXS5ib21iZWQgPSB0cnVlXG4gICAgICBwb3NpdGlvblxuXG4gIGlzTG9ja2VkOiAtPlxuICAgIEBsb2NrZWRcblxuICBsb2NrOiAtPlxuICAgIEBsb2NrZWQgPSB0cnVlXG5cbiAgbG9zZTogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy5sb3NlXG4gICAgXyhAX2JvbWJzQ291bnQpLmVhY2goKHBvc2l0aW9uKT0+IEBnZXRQb3NpdGlvbkNlbGwocG9zaXRpb24pLm9wZW4oKSlcbiAgICBAbG9jaygpXG5cbiAgb3BlbjogKG9wZW5lZCkgLT5cbiAgICByZXR1cm4gaWYgQGlzTG9ja2VkKClcbiAgICByZXR1cm4gQGxvc2UoKSBpZiBvcGVuZWQuaGFzQm9tYigpXG4gICAgcmV0dXJuIEB3aW4oKSBpZiBAX2JsYW5rQ2VsbHNDb3VudCA9PSBAY291bnRPcGVuZWRDZWxsKClcblxuICAgIGlmIG9wZW5lZC5jb3VudEJvbWJzQXJvdW5kKCkgPT0gMFxuICAgICAgQG9wZW5Bcm91bmQob3BlbmVkKVxuXG4gIG9wZW5Bcm91bmQ6IChjZWxsKS0+XG4gICAgXyhAZ2V0QXJvdW5kQ2VsbHMoY2VsbCkpLmVhY2goKGFyb3VuZCktPiBhcm91bmQub3BlbigpKS52YWx1ZSgpXG5cbiAgdW5sb2NrOiAtPlxuICAgIEBsb2NrZWQgPSBmYWxzZVxuXG4gIHdpbjogLT5cbiAgICBAY29tcHV0ZVRpbWUoKVxuICAgIEBzdGF0ZSA9IFRhYmxlLnN0YXR1cy53aW5cbiAgICBAbG9jaygpXG5cbiIsIm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgIyMjXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnTjgpLlpInlvaJcblxuICBjZShvYmplY3QpXG4gICAgb2JqZWN0LiRjbiAtPiBjbGFzc05hbWVcbiAgICBvYmplY3QuJGVsIC0+IOOCv+OCsOWQjVxuICAgIG9iamVjdC4kaW5jIC0+IOacq+WwvuW8leaVsOOAgeOBguOCi+OBhOOBr+WPr+WkiemVt+W8leaVsOOBqOOBl+OBpua4oeOBleOCjOOCi+WApFxuICAgIG9iamVjdCAtPiDlvJXmlbDjga/jgZ3jga7jgb7jgb5wcm9wc+OBqOOBl+OBpua4oeOBleOCjOOCi1xuXG4gIOaZrumAmlxuXG4gICAgIGNlIHskZWw6ICdkaXYnLCAkY246ICdzaG9ydCcsICRpbmM6ICd0ZXh0J31cblxuICAgICA8ZGl2IGNsYXNzTmFtZT1cInNob3J0XCI+XG4gICAgICAgdGV4dFxuICAgICA8L2Rpdj5cblxuICDlhaXjgozlrZBcblxuICAgICBJdGVtID0gUmVhY3RDbGFzc1xuICAgICAgIHJlbmRlcjogLT5cbiAgICAgICAgIGNlIHskZWw6ICdsaScsICRpbmM6ICdpdGVtJ31cblxuICAgICBjZSB7JGVsOiAndWwnLCAkaW5jOiBbSXRlbSwgSXRlbV19XG5cbiAgICAgPHVsPlxuICAgICAgIHtJdGVtfVxuICAgICAgIHtJdGVtfVxuICAgICA8L3VsPlxuICAjIyNcbiAgY2U6IChvYmplY3QpLT5cbiAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgd2hlbiBvYmplY3Q/Lmhhc093blByb3BlcnR5KCckZWwnKVxuICAgICAgICBvYmplY3QuY2xhc3NOYW1lID0gb2JqZWN0LiRjblxuICAgICAgICBjaGlsZHJlbiA9IEBjZShvYmplY3QuJGluYylcbiAgICAgICAgaWYgXy5pc0FycmF5KGNoaWxkcmVuKVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbi4uLilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbilcbiAgICAgIHdoZW4gXy5pc0FycmF5KG9iamVjdClcbiAgICAgICAgZm9yIGNoaWxkIGluIG9iamVjdFxuICAgICAgICAgIEBjZShjaGlsZClcbiAgICAgIHdoZW4gXy5pc1N0cmluZyhvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgd2hlbiBfLmlzTnVtYmVyKG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICB3aGVuIF8uaXNPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIGVsc2VcbiAgICAgICAgJydcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gVmlldyA9IHt9XG5cblZpZXcuVGFibGUgPSByZXF1aXJlICcuL3ZpZXdzL3RhYmxlJ1xuVmlldy5DZWxsID0gcmVxdWlyZSAnLi92aWV3cy9jZWxsJ1xuVmlldy5GYSA9IHJlcXVpcmUgJy4vdmlld3MvZmEnXG5WaWV3LkNvbmZpZ3VyYXRpb24gPSByZXF1aXJlICcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24nXG5WaWV3LlByZXNldCA9IHJlcXVpcmUgJy4vdmlld3MvcHJlc2V0J1xuVmlldy5HYW1lID0gcmVxdWlyZSAnLi92aWV3cy9nYW1lJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBDZWxsID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG4gIHJlbmRlcjogLT5cbiAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiBAY2xhc3NlcygpLCByZWY6ICdjZWxsJywgJGluYzogQGluYygpIH1cbiAgY2xhc3NlczogLT5cbiAgICBjbGFzc2VzID0gWydjZWxsJ11cbiAgICBjbGFzc2VzLnB1c2goJ29wZW5lZCcpIGlmIEBwcm9wcy5tb2RlbC5vcGVuZWRcbiAgICBjbGFzc2VzLmpvaW4oJyAnKVxuICBpbmM6IC0+XG4gICAgcmV0dXJuIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogQHByb3BzLm1vZGVsLnN0YXRlIH0gaWYgbm90IEBwcm9wcy5tb2RlbC5vcGVuZWRcblxuICAgIGlmIEBwcm9wcy5tb2RlbC5ib21iZWRcbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogJ2JvbWInIH1cbiAgICBlbHNlXG4gICAgICBjb3VudCA9IEBwcm9wcy5tb2RlbC5jb3VudEJvbWJzQXJvdW5kKClcbiAgICAgIGlmIGNvdW50ID09IDBcbiAgICAgICAgJydcbiAgICAgIGVsc2VcbiAgICAgICAgY291bnRcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBjZWxsID0gUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuY2VsbClcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZSktPiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbkNsaWNrSGFuZGxlcilcblxuICBvbkNsaWNrSGFuZGxlcjogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiBlLmJ1dHRvbnM/XG4gICAgICBzd2l0Y2ggKGUuYnV0dG9ucylcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAyXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOnJpZ2h0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gM1xuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0UmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiA0XG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOm1pZGRsZUNsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgIGVsc2UgaWYgZS5idXR0b24/XG4gICAgICBzd2l0Y2ggKGUuYnV0dG9uKVxuICAgICAgICB3aGVuIDBcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bWlkZGxlQ2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpyaWdodENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgIGVsc2VcbiAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IENvbmZpZ3VyYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyIGNvbmYtcGFnZScsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29sLXNtLW9mZnNldC00IGNvbC1zbS00JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2gxJywgJGNuOiAnY29uZi1wYWdlIHRpdGxlJywgJGluYzogJ+ODl+ODquOCu+ODg+ODiCcgfVxuICAgICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAnY29uZi1wYWdlIHByZXNldC1nYW1lcycsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBtb2RlbDogeyBuYW1lOiAn5Yid57SaJywgZGF0OiB7IHdpZHRoOiA5LCBoZWlnaHQ6IDksIGJvbWJzOiAxMCB9IH0gfVxuICAgICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5QcmVzZXQsIG1vZGVsOiB7IG5hbWU6ICfkuK3ntJonLCBkYXQ6IHsgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2LCBib21iczogNDAgfSB9IH1cbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBtb2RlbDogeyBuYW1lOiAn5LiK57SaJywgZGF0OiB7IHdpZHRoOiAzMCwgaGVpZ2h0OiAxNiwgYm9tYnM6IDk5IH0gfSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2gxJywgJGNuOiAnY29uZi1wYWdlIHRpdGxlJywgJGluYzogJ+ODleODquODvOOCueOCv+OCpOODqycgfVxuICAgICAgICBjZSB7ICRlbDogJ2Zvcm0nLCAkY246ICdjb25mLXBhZ2UgZnJlZS1zdHlsZSBjb25mLXBhZ2UnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdyb3cgZm9ybS1ncm91cCcsICRpbmM6IFtcbiAgICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdjb2wtc20tMSBjb250cm9sLWxhYmVsIGNvbmYtcGFnZScsICRpbmM6ICfmqKonIH1cbiAgICAgICAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29sLXNtLTMnLCAkaW5jOiBbXG4gICAgICAgICAgICAgIGNlIHsgJGVsOiAnaW5wdXQnLCAkY246ICdmb3JtLWNvbnRyb2wgY29uZi1wYWdlJywgcmVmOiAnd2lkdGgnLCB2YWx1ZTogNSwgb25DbGljazogQG9uQ2xpY2sgfVxuICAgICAgICAgICAgXSB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2xhYmVsJywgJGNuOiAnY29sLXNtLTEgY29udHJvbC1sYWJlbCBjb25mLXBhZ2UnLCAkaW5jOiAn5qiqJyB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS0zJywgJGluYzogW1xuICAgICAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2hlaWdodCcsIHZhbHVlOiA0LCBvbkNsaWNrOiBAb25DbGljayB9XG4gICAgICAgICAgICBdIH1cbiAgICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdjb2wtc20tMSBjb250cm9sLWxhYmVsIGNvbmYtcGFnZScsICRpbmM6IFtcbiAgICAgICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnYm9tYicsIGZpeGVkV2lkdGg6IHRydWUgfVxuICAgICAgICAgICAgXSB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS0zJywgJGluYzogW1xuICAgICAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2JvbWJzJywgdmFsdWU6IDQsIG9uQ2xpY2s6IEBvbkNsaWNrIH1cbiAgICAgICAgICAgIF0gfVxuICAgICAgICAgIF0gfVxuICAgICAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiAnYnRuIGJ0bi1zdWNjZXNzIGNvbmYtcGFnZSB3aWRlJywgb25DbGljazogQG9uQ2xpY2tGcmVlU3R5bGUsICRpbmM6ICfjgrnjgr/jg7zjg4gnIH1cbiAgICAgICAgXSB9XG4gICAgICBdIH1cbiAgICBdIH1cbiAgb25DbGlja0ZyZWVTdHlsZTogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2ggJ2ZyZWVzdHlsZScsIHtcbiAgICAgIHdpZHRoOiBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy53aWR0aCkudmFsdWVcbiAgICAgIGhlaWdodDogUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuaGVpZ2h0KS52YWx1ZVxuICAgICAgYm9tYnM6IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLmJvbWJzKS52YWx1ZVxuICAgIH1cbikiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIEZhID0gUmVhY3QuY3JlYXRlQ2xhc3MgKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNsYXNzZXMgPSBbJ2ZhJ11cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLmljb259XCIpXG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5zY2FsZX14XCIpIGlmIEBwcm9wcy5zY2FsZT9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtZncnKSBpZiBAcHJvcHMuZml4ZWRXaWR0aD9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtbGknKSBpZiBAcHJvcHMubGlzdD9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtYm9yZGVyJykgaWYgQHByb3BzLmJvcmRlcj9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLXB1bGwtI3tAcHJvcHMucHVsbH1cIikgaWYgQHByb3BzLnB1bGw/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5hbmltYXRpb24/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1yb3RhdGUtI3tAcHJvcHMucm90YXRlfVwiKSBpZiBAcHJvcHMucm90YXRlP1xuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtZmxpcC0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5mbGlwP1xuXG4gICAgICBjZSB7ICRlbDogJ2knLCAkY246IGNsYXNzZXMuam9pbignICcpIH1cbiAgKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBHYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG4gIHJlbmRlcjogLT5cbiAgICB0YWJsZSA9IEBwcm9wcy5jb25maWdcbiAgICBjZSB7ICRlbDogJ2RpdicsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS1vZmZzZXQtMyBjb2wtc20tNiBnYW1lLXBhZ2UgY2xlYXJmaXgnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb2wtc20tNSBnYW1lLXBhZ2UgdGltZScsICRpbmM6IFtcbiAgICAgICAgICAgIHRhYmxlLnBhc3NlZFRpbWVcbiAgICAgICAgICBdIH1cbiAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS0yIGdhbWUtcGFnZSByZXN0YXJ0JywgJGluYzogW1xuICAgICAgICAgICAgY2UgeyAkZWw6ICdidXR0b24nLCAkY246IFwiYnRuIGJ0bi0je0BidXR0b25Db2xvcigpfSBnYW1lLXBhZ2Ugd2lkZVwiLCBvbkNsaWNrOiBAb25DbGlja1Jlc3RhcnQsICRpbmM6IFtcbiAgICAgICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiBAYnV0dG9uRmFjZSgpLCBzY2FsZTogMiB9XG4gICAgICAgICAgICBdIH1cbiAgICAgICAgICBdIH1cbiAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS01IGdhbWUtcGFnZSByZXN0JywgJGluYzogW1xuICAgICAgICAgICAgdGFibGUucmVzdEJvbXNDb3VudFxuICAgICAgICAgIF0gfVxuICAgICAgICBdIH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjbGVhcmZpeCcsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LlRhYmxlLCBtb2RlbDogQHByb3BzLmNvbmZpZyB9XG4gICAgICBdIH1cbiAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyIGdhbWUtcGFnZSBib3R0b20tYXJlYScsICRpbmM6IFtcbiAgICAgICAgY2UgeyAkZWw6ICdidXR0b24nLCAkY246ICdidG4gYnRuLXN1Y2Nlc3MgY29uZi1wYWdlJywgb25DbGljazogQG9uQ2xpY2tCYWNrLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnY2hldnJvbi1jaXJjbGUtbGVmdCcgfVxuICAgICAgICAgICcg44KC44Gp44KLJ1xuICAgICAgICBdIH1cbiAgICAgIF0gfVxuICAgIF0gfVxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIEBzaWQgPSBzZXRJbnRlcnZhbCgoPT5cbiAgICAgIEBkaXNwYXRjaCAndGltZXInXG4gICAgKSwgMTAwMClcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogLT5cbiAgICBjbGVhckludGVydmFsKEBzaWQpXG5cbiAgb25DbGlja1Jlc3RhcnQ6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoICdyZXN0YXJ0J1xuXG4gIG9uQ2xpY2tCYWNrOiAoZSktPlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIEBkaXNwYXRjaCAnYmFjaydcblxuICBidXR0b25GYWNlOiAtPlxuICAgIHN3aXRjaCBAcHJvcHMuY29uZmlnLnN0YXRlXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMucGxheVxuICAgICAgICAnbWVoLW8nXG4gICAgICB3aGVuIEFwcC5Nb2RlbC5UYWJsZS5zdGF0dXMud2luXG4gICAgICAgICdzbWlsZS1vJ1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLmxvc2VcbiAgICAgICAgJ2Zyb3duLW8nXG5cbiAgYnV0dG9uQ29sb3I6IC0+XG4gICAgc3dpdGNoIEBwcm9wcy5jb25maWcuc3RhdGVcbiAgICAgIHdoZW4gQXBwLk1vZGVsLlRhYmxlLnN0YXR1cy5wbGF5XG4gICAgICAgICdkZWZhdWx0J1xuICAgICAgd2hlbiBBcHAuTW9kZWwuVGFibGUuc3RhdHVzLndpblxuICAgICAgICAncHJpbWFyeSdcbiAgICAgIHdoZW4gQXBwLk1vZGVsLlRhYmxlLnN0YXR1cy5sb3NlXG4gICAgICAgICdkYW5nZXInXG4pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IFByZXNldCA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICBtaXhpbnM6IFtBcmRhLm1peGluXVxuICByZW5kZXI6IC0+XG4gICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NvbmYtcGFnZSBwcmVzZXQnLCAkaW5jOiBbXG4gICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tcHJpbWFyeSBjb25mLXBhZ2Ugd2lkZScsIG9uQ2xpY2s6IEBvbkNsaWNrLCAkaW5jOiBAcHJvcHMubW9kZWwubmFtZSB9XG4gICAgXSB9XG5cbiAgb25DbGljazogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2goJ3ByZXNldCcsIEBwcm9wcy5tb2RlbC5kYXQpXG4pIiwibW9kdWxlLmV4cG9ydHMgPVxuICBUYWJsZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiAndWwnLCAkY246ICd0YWJsZScsICRpbmM6IEBjZWxscygpLCBzdHlsZTogQHN0eWxlcygpIH1cbiAgICBjZWxsczogLT5cbiAgICAgIGZvciBjZWxsIGluIEBwcm9wcy5tb2RlbC5nZXRDZWxscygpXG4gICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5DZWxsLCBtb2RlbDogY2VsbCB9XG4gICAgc3R5bGVzOiAtPlxuICAgICAgd2lkdGg6IEBwcm9wcy5tb2RlbC53aWR0aCAqIDMwXG4gIClcbiJdfQ==
