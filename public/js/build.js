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
        _this.props.table.time();
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

  Cell.prototype.flagged = function() {
    return this.state === this.status.flag;
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
    return this.state = (function() {
      switch (this.state) {
        case this.status.none:
          this.table.flag(true);
          return this.status.flag;
        case this.status.flag:
          this.table.flag(false);
          return this.status.question;
        case this.status.question:
          return this.status.none;
      }
    }).call(this);
  };

  Cell.prototype.open = function() {
    if (this.table.locked) {
      return;
    }
    if (this.opened || this.state !== this.status.none) {
      return true;
    }
    this.opened = true;
    this.state === this.status.open;
    return this.table.open(this);
  };

  return Cell;

})();



},{}],7:[function(require,module,exports){
var Table,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

module.exports = Table = (function() {
  Table.prototype.status = {
    play: 'play',
    clear: 'clear',
    die: 'die'
  };

  Table.prototype.state = null;

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
    this.flagged = 0;
    this.start = +new Date();
    this.passed = 0;
    this.opened = 0;
    this.must = this.cells.length - this.bombs.length;
    this.state = this.status.play;
  }

  Table.prototype.around = function(cell) {
    var x, y;
    return _.compact(_.flatten((function() {
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
    }).call(this)));
  };

  Table.prototype.cell = function(x, y) {
    if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) {
      return null;
    }
    return this.cells[y * this.width + x];
  };

  Table.prototype.countBombsAround = function(cell) {
    return _.filter(this.around(cell), function(picked) {
      return picked && picked.bombed;
    }).length;
  };

  Table.prototype.countFlagsAround = function(cell) {
    return _.filter(this.around(cell), function(picked) {
      return picked && picked.flagged();
    }).length;
  };

  Table.prototype.die = function() {
    this.time();
    this.state = this.status.die;
    _.each(this.bombs, (function(_this) {
      return function(position) {
        return _this.positionCell(position).open();
      };
    })(this));
    return this.locked = true;
  };

  Table.prototype.clear = function() {
    this.time();
    this.state = this.status.clear;
    return this.locked = true;
  };

  Table.prototype.flag = function(plus) {
    if (plus) {
      return this.flagged += 1;
    } else {
      return this.flagged -= 1;
    }
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

  Table.prototype.open = function(openCell) {
    if (openCell.bombed || this.locked) {
      return this.die();
    }
    this.opened += 1;
    if (this.must === this.opened) {
      return this.clear();
    }
    if (openCell.countBombsAround() === 0) {
      _.each(this.around(openCell), function(aroundCell) {
        return aroundCell.open();
      });
    }
    return true;
  };

  Table.prototype.openAround = function(cell) {
    return _.each(this.around(cell), function(aroundCell) {
      return aroundCell.open();
    });
  };

  Table.prototype.positionCell = function(position) {
    return this.cells[position];
  };

  Table.prototype.time = function() {
    if (this.locked) {
      return;
    }
    return this.passed = _.floor((+new Date() - this.start) / 1000);
  };

  Table.prototype.rest = function() {
    return this.bombs.length - this.flagged;
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
                  $inc: [this.props.config.passed]
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
                  $inc: [this.props.config.rest()]
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
      case this.props.config.status.play:
        return 'meh-o';
      case this.props.config.status.clear:
        return 'smile-o';
      case this.props.config.status.die:
        return 'frown-o';
    }
  },
  buttonColor: function() {
    switch (this.props.config.state) {
      case this.props.config.status.play:
        return 'default';
      case this.props.config.status.clear:
        return 'primary';
      case this.props.config.status.die:
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
    ref = this.props.model.cells;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvY29udGV4dHMvZ2FtZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC9jb250ZXh0cy9zZXR0aW5nLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2luZGV4LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy9jZWxsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL21vZGVscy90YWJsZS5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC91dGlsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXcuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvY2VsbC5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9jb25maWd1cmF0aW9uLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2ZhLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2dhbWUuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlld3MvcHJlc2V0LmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3RhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBQSxHQUFVOztBQUUzQixPQUFPLENBQUMsV0FBUixHQUFzQixPQUFBLENBQVEsaUJBQVI7O0FBQ3RCLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQUEsQ0FBUSxvQkFBUjs7Ozs7QUNIekIsSUFBQSxXQUFBO0VBQUE7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3dCQUNyQixTQUFBLEdBQVcsS0FBSyxDQUFDLFdBQU4sQ0FDVDtJQUFBLE1BQUEsRUFBUSxTQUFBO2FBQ04sRUFBQSxDQUFHO1FBQUUsR0FBQSxFQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBaEI7UUFBc0IsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBckM7T0FBSDtJQURNLENBQVI7R0FEUzs7d0JBS1gsU0FBQSxHQUFXLFNBQUMsS0FBRDtXQUNULEtBQUssQ0FBQyxLQUFOLEdBQWMsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFLLENBQUMsTUFBbkI7RUFETDs7d0JBR1gsb0JBQUEsR0FBc0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUNwQjtNQUFBLE1BQUEsRUFBUSxLQUFLLENBQUMsS0FBZDs7RUFEb0I7O3dCQUd0QixRQUFBLEdBQVUsU0FBQyxTQUFEO0lBQ1IsMkNBQUEsU0FBQTtJQUNBLFNBQUEsQ0FBVSxpQkFBVixFQUE2QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtRQUMzQixJQUFJLENBQUMsVUFBTCxDQUFBO2VBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxTQUFDLEtBQUQ7aUJBQVc7WUFBQSxNQUFBLEVBQVEsS0FBSyxDQUFD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Q0FBQyxDQUFDLGNBQUYsQ0FBQTtXQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUFvQixJQUFDLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFqQztFQUZPLENBTlQ7Q0FEd0I7Ozs7O0FDQTFCLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRSxLQUFBLEdBQVEsS0FBSyxDQUFDLFdBQU4sQ0FDTjtFQUFBLE1BQUEsRUFBUSxTQUFBO1dBQ04sRUFBQSxDQUFHO01BQUUsR0FBQSxFQUFLLElBQVA7TUFBYSxHQUFBLEVBQUssT0FBbEI7TUFBMkIsSUFBQSxFQUFNLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBakM7TUFBMkMsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBbEQ7S0FBSDtFQURNLENBQVI7RUFFQSxLQUFBLEVBQU8sU0FBQTtBQUNMLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O21CQUNFLEVBQUEsQ0FBRztRQUFFLEdBQUEsRUFBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQWhCO1FBQXNCLEtBQUEsRUFBTyxJQUE3QjtPQUFIO0FBREY7O0VBREssQ0FGUDtFQUtBLE1BQUEsRUFBUSxTQUFBO1dBQ047TUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBYixHQUFxQixFQUE1Qjs7RUFETSxDQUxSO0NBRE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0ID0ge31cblxuQ29udGV4dC5HYW1lQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dHMvZ2FtZSdcbkNvbnRleHQuU2V0dGluZ0NvbnRleHQgPSByZXF1aXJlICcuL2NvbnRleHRzL3NldHRpbmcnXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWVDb250ZXh0IGV4dGVuZHMgQXJkYS5Db250ZXh0XG4gIGNvbXBvbmVudDogUmVhY3QuY3JlYXRlQ2xhc3MoXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkdhbWUsIGNvbmZpZzogQHByb3BzLmNvbmZpZyB9XG4gIClcblxuICBpbml0U3RhdGU6IChwcm9wcykgLT5cbiAgICBwcm9wcy50YWJsZSA9IEBjcmVhdGVUYWJsZShwcm9wcy5jb25maWcpXG5cbiAgZXhwYW5kQ29tcG9uZW50UHJvcHM6IChwcm9wcywgc3RhdGUpIC0+XG4gICAgY29uZmlnOiBwcm9wcy50YWJsZVxuXG4gIGRlbGVnYXRlOiAoc3Vic2NyaWJlKSAtPlxuICAgIHN1cGVyXG4gICAgc3Vic2NyaWJlICdjZWxsOnJpZ2h0Q2xpY2snLCAoY2VsbCk9PlxuICAgICAgY2VsbC5yb3RhdGVNb2RlKClcbiAgICAgIEB1cGRhdGUoKHN0YXRlKSA9PiBjb25maWc6IHN0YXRlLmNvbmZpZylcbiAgICBzdWJzY3JpYmUgJ2NlbGw6bGVmdENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwub3BlbigpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG4gICAgc3Vic2NyaWJlICdjZWxsOmxlZnRSaWdodENsaWNrJywgKGNlbGwpPT5cbiAgICAgIGNlbGwub3BlbkFyb3VuZCgpXG4gICAgICBAdXBkYXRlKChzdGF0ZSkgPT4gY29uZmlnOiBzdGF0ZS5jb25maWcpXG4gICAgc3Vic2NyaWJlICdyZXN0YXJ0JywgPT5cbiAgICAgIEBwcm9wcy50YWJsZSA9IEBjcmVhdGVUYWJsZShAcHJvcHMuY29uZmlnKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuICAgIHN1YnNjcmliZSAndGltZXInLCA9PlxuICAgICAgQHByb3BzLnRhYmxlLnRpbWUoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuICAgIHN1YnNjcmliZSAnYmFjaycsID0+XG4gICAgICBAcHJvcHMucm91dGVyLnBvcENvbnRleHQoKVxuICBjcmVhdGVUYWJsZTogKGRhdCktPlxuICAgIG5ldyBBcHAuTW9kZWwuVGFibGUoZGF0LndpZHRoLCBkYXQuaGVpZ2h0LCBkYXQuYm9tYnMpIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTZXR0aW5nQ29udGV4dCBleHRlbmRzIEFyZGEuQ29udGV4dFxuICBjb21wb25lbnQ6IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5Db25maWd1cmF0aW9uLCBtb2RlbDogQHByb3BzLmNvbmZpZy50YWJsZSB9XG4gIClcblxuICBpbml0U3RhdGU6IChwcm9wcykgLT5cbiAgICBwcm9wc1xuXG4gIGV4cGFuZENvbXBvbmVudFByb3BzOiAocHJvcHMsIHN0YXRlKSAtPlxuICAgIGNvbmZpZzogc3RhdGUuY29uZmlnXG5cbiAgZGVsZWdhdGU6IChzdWJzY3JpYmUpIC0+XG4gICAgc3VwZXJcbiAgICBzdWJzY3JpYmUgJ3ByZXNldCcsIChkYXQpPT5cbiAgICAgIEBwcm9wcy5yb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuR2FtZUNvbnRleHQsIHtcbiAgICAgICAgcm91dGVyOiBAcHJvcHMucm91dGVyXG4gICAgICAgIGNvbmZpZzogZGF0XG4gICAgICB9KVxuICAgIHN1YnNjcmliZSAnZnJlZXN0eWxlJywgKGRhdCk9PlxuICAgICAgQHByb3BzLnJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5HYW1lQ29udGV4dCwge1xuICAgICAgICByb3V0ZXI6IEBwcm9wcy5yb3V0ZXJcbiAgICAgICAgY29uZmlnOiBkYXRcbiAgICAgIH0pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IEFwcCA9IHt9XG5pZiB3aW5kb3c/XG4gIHdpbmRvdy5BcHAgPSBBcHBcbiAgd2luZG93LmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5lbHNlXG4gIGdsb2JhbC5BcHAgPSBBcHBcbiAgZ2xvYmFsLmNlID0gKGFyZ3MuLi4pLT5cbiAgICBBcHAuVXRpbC5jZShhcmdzLi4uKVxuXG5BcHAuQ29udGV4dCA9IHJlcXVpcmUgJy4vY29udGV4dCdcbkFwcC5VdGlsID0gcmVxdWlyZSgnLi91dGlsJylcbkFwcC5Nb2RlbCA9IHJlcXVpcmUgJy4vbW9kZWwnXG5BcHAuVmlldyA9IHJlcXVpcmUgJy4vdmlldydcblxuY29uc29sZS5sb2cgJ2EnXG5cbkFwcC5zdGFydCA9IChub2RlKS0+XG4gIHJvdXRlciA9IG5ldyBBcmRhLlJvdXRlcihBcmRhLkRlZmF1bHRMYXlvdXQsIG5vZGUpXG4gIHJvdXRlci5wdXNoQ29udGV4dChBcHAuQ29udGV4dC5TZXR0aW5nQ29udGV4dCwgeyByb3V0ZXI6IHJvdXRlciwgY29uZmlnOiB7dGFibGU6IG5ldyBBcHAuTW9kZWwuVGFibGUoNSwgNCl9IH0pXG4gICNyb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuR2FtZUNvbnRleHQsIHsgcm91dGVyOiByb3V0ZXIsIGNvbmZpZzogeyB3aWR0aDogMTAsIGhlaWdodDogMTAsIGJvbWJzOiAxMCB9fSlcbiAgI1JlYWN0LnJlbmRlcigoY2UgeyAkZWw6IEFwcC5WaWV3LldhbGwsIG1vZGVsOiBuZXcgQXBwLk1vZGVsLlRhYmxlKDUsIDQpIH0pLCBub2RlKSIsIm1vZHVsZS5leHBvcnRzID0gTW9kZWwgPSB7fVxuXG5Nb2RlbC5DZWxsID0gcmVxdWlyZSAnLi9tb2RlbHMvY2VsbCdcbk1vZGVsLlRhYmxlID0gcmVxdWlyZSAnLi9tb2RlbHMvdGFibGUnXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIENlbGxcbiAgICBzdGF0dXM6XG4gICAgICBub25lOiAnbm9uZSdcbiAgICAgIGZsYWc6ICdmbGFnJ1xuICAgICAgcXVlc3Rpb246ICdxdWVzdGlvbidcbiAgICAgIG9wZW46ICdvcGVuJ1xuICAgIG9wZW5lZDogZmFsc2VcbiAgICBib21iZWQ6IGZhbHNlXG4gICAgc3RhdGU6IG51bGxcbiAgICBjb3VudGVkOiBudWxsXG5cbiAgICBjb25zdHJ1Y3RvcjogKEB0YWJsZSwgQHgsIEB5KSAtPlxuICAgICAgQHBvc2l0aW9uID0gQHRhYmxlLndpZHRoICogQHkgKyBAeFxuICAgICAgQHN0YXRlID0gQHN0YXR1cy5ub25lXG5cbiAgICBjb3VudEJvbWJzQXJvdW5kOiA9PlxuICAgICAgQGNvdW50ZWQgPz0gQHRhYmxlLmNvdW50Qm9tYnNBcm91bmQoQClcblxuICAgIGNvdW50RmxhZ3NBcm91bmQ6ID0+XG4gICAgICBAdGFibGUuY291bnRGbGFnc0Fyb3VuZChAKVxuXG4gICAgZmxhZ2dlZDogLT5cbiAgICAgIEBzdGF0ZSA9PSBAc3RhdHVzLmZsYWdcblxuICAgIG9wZW5Bcm91bmQ6IC0+XG4gICAgICByZXR1cm4gaWYgQHRhYmxlLmxvY2tlZFxuICAgICAgQHRhYmxlLm9wZW5Bcm91bmQoQCkgaWYgQG9wZW5lZCAmJiBAY291bnRCb21ic0Fyb3VuZCgpID09IEBjb3VudEZsYWdzQXJvdW5kKClcblxuICAgIHJvdGF0ZU1vZGU6IC0+XG4gICAgICByZXR1cm4gaWYgQG9wZW5lZCB8fCBAdGFibGUubG9ja2VkXG4gICAgICBAc3RhdGUgPSBzd2l0Y2ggQHN0YXRlXG4gICAgICAgIHdoZW4gQHN0YXR1cy5ub25lXG4gICAgICAgICAgQHRhYmxlLmZsYWcodHJ1ZSlcbiAgICAgICAgICBAc3RhdHVzLmZsYWdcbiAgICAgICAgd2hlbiBAc3RhdHVzLmZsYWdcbiAgICAgICAgICBAdGFibGUuZmxhZyhmYWxzZSlcbiAgICAgICAgICBAc3RhdHVzLnF1ZXN0aW9uXG4gICAgICAgIHdoZW4gQHN0YXR1cy5xdWVzdGlvblxuICAgICAgICAgIEBzdGF0dXMubm9uZVxuXG4gICAgb3BlbjogPT5cbiAgICAgIHJldHVybiBpZiBAdGFibGUubG9ja2VkXG4gICAgICByZXR1cm4gdHJ1ZSBpZiBAb3BlbmVkIHx8IEBzdGF0ZSAhPSBAc3RhdHVzLm5vbmVcbiAgICAgIEBvcGVuZWQgPSB0cnVlXG4gICAgICBAc3RhdGUgPT0gQHN0YXR1cy5vcGVuXG4gICAgICBAdGFibGUub3BlbihAKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUYWJsZVxuICBzdGF0dXM6XG4gICAgcGxheTogJ3BsYXknXG4gICAgY2xlYXI6ICdjbGVhcidcbiAgICBkaWU6ICdkaWUnXG4gIHN0YXRlOiBudWxsXG5cbiAgY29uc3RydWN0b3I6IChAd2lkdGgsIEBoZWlnaHQsIEBib21icyA9IDEpIC0+XG4gICAgdGhyb3cgJ25vIGJvbWJzJyBpZiBAYm9tYnMgPCAxXG5cbiAgICBAY2VsbHMgPSBAaW5pdENlbGxzKClcbiAgICBAYm9tYnMgPSBAaW5zdGFsbEJvbWIoQGJvbWJzKVxuICAgIEBmbGFnZ2VkID0gMFxuICAgIEBzdGFydCA9ICtuZXcgRGF0ZSgpXG4gICAgQHBhc3NlZCA9IDBcbiAgICBAb3BlbmVkID0gMFxuICAgIEBtdXN0ID0gQGNlbGxzLmxlbmd0aCAtIEBib21icy5sZW5ndGhcbiAgICBAc3RhdGUgPSBAc3RhdHVzLnBsYXlcbiAgYXJvdW5kOiAoY2VsbCktPlxuICAgIF8uY29tcGFjdChfLmZsYXR0ZW4oZm9yIHkgaW4gWyhjZWxsLnkgLSAxKS4uKGNlbGwueSArIDEpXVxuICAgICAgZm9yIHggaW4gWyhjZWxsLnggLSAxKS4uKGNlbGwueCArIDEpXVxuICAgICAgICBAY2VsbCh4LCB5KSkpXG5cbiAgY2VsbDogKHgsIHkpLT5cbiAgICByZXR1cm4gbnVsbCBpZiB4IDwgMCB8fCB5IDwgMCB8fCB4ID4gQHdpZHRoIC0gMSB8fCB5ID4gQGhlaWdodCAtIDFcbiAgICBAY2VsbHNbeSAqIEB3aWR0aCArIHhdXG5cbiAgY291bnRCb21ic0Fyb3VuZDogKGNlbGwpLT5cbiAgICBfLmZpbHRlcihAYXJvdW5kKGNlbGwpLCAocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmJvbWJlZFxuICAgICkubGVuZ3RoXG5cbiAgY291bnRGbGFnc0Fyb3VuZDogKGNlbGwpLT5cbiAgICBfLmZpbHRlcihAYXJvdW5kKGNlbGwpLCAocGlja2VkKS0+XG4gICAgICBwaWNrZWQgJiYgcGlja2VkLmZsYWdnZWQoKVxuICAgICkubGVuZ3RoXG5cbiAgZGllOiAtPlxuICAgIEB0aW1lKClcbiAgICBAc3RhdGUgPSBAc3RhdHVzLmRpZVxuICAgIF8uZWFjaChAYm9tYnMsIChwb3NpdGlvbik9PlxuICAgICAgQHBvc2l0aW9uQ2VsbChwb3NpdGlvbikub3BlbigpXG4gICAgKVxuICAgIEBsb2NrZWQgPSB0cnVlXG5cbiAgY2xlYXI6IC0+XG4gICAgQHRpbWUoKVxuICAgIEBzdGF0ZSA9IEBzdGF0dXMuY2xlYXJcbiAgICBAbG9ja2VkID0gdHJ1ZVxuXG4gIGZsYWc6IChwbHVzKS0+XG4gICAgaWYgcGx1c1xuICAgICAgQGZsYWdnZWQgKz0gMVxuICAgIGVsc2VcbiAgICAgIEBmbGFnZ2VkIC09IDFcblxuICBpbml0Q2VsbHM6ID0+XG4gICAgXy5mbGF0dGVuKGZvciB5IGluIFswLi4oQGhlaWdodCAtIDEpXVxuICAgICAgZm9yIHggaW4gWzAuLihAd2lkdGggLSAxKV1cbiAgICAgICAgbmV3IEFwcC5Nb2RlbC5DZWxsKEAsIHgsIHkpKVxuXG4gIGluc3RhbGxCb21iOiAoY291bnQpLT5cbiAgICBAaW5zdGFsbEJvbWJNYW51YWxseShfLnNodWZmbGUoXy5zaHVmZmxlKFswLi4oQGNlbGxzLmxlbmd0aCAtIDEpXSkpWzAuLihjb3VudCAtIDEpXS4uLilcblxuICBpbnN0YWxsQm9tYk1hbnVhbGx5OiAoYm9tYnMuLi4pLT5cbiAgICBmb3IgY2VsbCBpbiBAY2VsbHNcbiAgICAgIGNlbGwuYm9tYmVkID0gZmFsc2VcbiAgICBAYm9tYnMgPSBmb3IgcG9zaXRpb24gaW4gYm9tYnNcbiAgICAgIEBjZWxsc1twb3NpdGlvbl0uYm9tYmVkID0gdHJ1ZVxuICAgICAgcG9zaXRpb25cblxuICBvcGVuOiAob3BlbkNlbGwpIC0+XG4gICAgcmV0dXJuICBAZGllKCkgaWYgb3BlbkNlbGwuYm9tYmVkIHx8IEBsb2NrZWRcblxuICAgIEBvcGVuZWQgKz0gMVxuICAgIHJldHVybiBAY2xlYXIoKSBpZiBAbXVzdCA9PSBAb3BlbmVkXG5cbiAgICBpZiBvcGVuQ2VsbC5jb3VudEJvbWJzQXJvdW5kKCkgPT0gMFxuICAgICAgXy5lYWNoKEBhcm91bmQob3BlbkNlbGwpLCAoYXJvdW5kQ2VsbCktPiBhcm91bmRDZWxsLm9wZW4oKSlcbiAgICB0cnVlXG5cbiAgb3BlbkFyb3VuZDogKGNlbGwpLT5cbiAgICBfLmVhY2goQGFyb3VuZChjZWxsKSwgKGFyb3VuZENlbGwpLT4gYXJvdW5kQ2VsbC5vcGVuKCkpXG5cbiAgcG9zaXRpb25DZWxsOiAocG9zaXRpb24pIC0+XG4gICAgQGNlbGxzW3Bvc2l0aW9uXVxuXG4gIHRpbWU6IC0+XG4gICAgcmV0dXJuIGlmIEBsb2NrZWRcbiAgICBAcGFzc2VkID0gXy5mbG9vcigoK25ldyBEYXRlKCkgLSBAc3RhcnQpIC8gMTAwMClcblxuICByZXN0OiAtPlxuICAgIEBib21icy5sZW5ndGggLSBAZmxhZ2dlZCIsIm1vZHVsZS5leHBvcnRzID0gVXRpbCA9IHtcbiAgIyMjXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnTjgpLlpInlvaJcblxuICBjZShvYmplY3QpXG4gICAgb2JqZWN0LiRjbiAtPiBjbGFzc05hbWVcbiAgICBvYmplY3QuJGVsIC0+IOOCv+OCsOWQjVxuICAgIG9iamVjdC4kaW5jIC0+IOacq+WwvuW8leaVsOOAgeOBguOCi+OBhOOBr+WPr+WkiemVt+W8leaVsOOBqOOBl+OBpua4oeOBleOCjOOCi+WApFxuICAgIG9iamVjdCAtPiDlvJXmlbDjga/jgZ3jga7jgb7jgb5wcm9wc+OBqOOBl+OBpua4oeOBleOCjOOCi1xuXG4gIOaZrumAmlxuXG4gICAgIGNlIHskZWw6ICdkaXYnLCAkY246ICdzaG9ydCcsICRpbmM6ICd0ZXh0J31cblxuICAgICA8ZGl2IGNsYXNzTmFtZT1cInNob3J0XCI+XG4gICAgICAgdGV4dFxuICAgICA8L2Rpdj5cblxuICDlhaXjgozlrZBcblxuICAgICBJdGVtID0gUmVhY3RDbGFzc1xuICAgICAgIHJlbmRlcjogLT5cbiAgICAgICAgIGNlIHskZWw6ICdsaScsICRpbmM6ICdpdGVtJ31cblxuICAgICBjZSB7JGVsOiAndWwnLCAkaW5jOiBbSXRlbSwgSXRlbV19XG5cbiAgICAgPHVsPlxuICAgICAgIHtJdGVtfVxuICAgICAgIHtJdGVtfVxuICAgICA8L3VsPlxuICAjIyNcbiAgY2U6IChvYmplY3QpLT5cbiAgICBzd2l0Y2ggdHJ1ZVxuICAgICAgd2hlbiBvYmplY3Q/Lmhhc093blByb3BlcnR5KCckZWwnKVxuICAgICAgICBvYmplY3QuY2xhc3NOYW1lID0gb2JqZWN0LiRjblxuICAgICAgICBjaGlsZHJlbiA9IEBjZShvYmplY3QuJGluYylcbiAgICAgICAgaWYgXy5pc0FycmF5KGNoaWxkcmVuKVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbi4uLilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQob2JqZWN0LiRlbCwgb2JqZWN0LCBjaGlsZHJlbilcbiAgICAgIHdoZW4gXy5pc0FycmF5KG9iamVjdClcbiAgICAgICAgZm9yIGNoaWxkIGluIG9iamVjdFxuICAgICAgICAgIEBjZShjaGlsZClcbiAgICAgIHdoZW4gXy5pc1N0cmluZyhvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgd2hlbiBfLmlzTnVtYmVyKG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICB3aGVuIF8uaXNPYmplY3Qob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIGVsc2VcbiAgICAgICAgJydcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gVmlldyA9IHt9XG5cblZpZXcuVGFibGUgPSByZXF1aXJlICcuL3ZpZXdzL3RhYmxlJ1xuVmlldy5DZWxsID0gcmVxdWlyZSAnLi92aWV3cy9jZWxsJ1xuVmlldy5GYSA9IHJlcXVpcmUgJy4vdmlld3MvZmEnXG5WaWV3LkNvbmZpZ3VyYXRpb24gPSByZXF1aXJlICcuL3ZpZXdzL2NvbmZpZ3VyYXRpb24nXG5WaWV3LlByZXNldCA9IHJlcXVpcmUgJy4vdmlld3MvcHJlc2V0J1xuVmlldy5HYW1lID0gcmVxdWlyZSAnLi92aWV3cy9nYW1lJ1xuIiwibW9kdWxlLmV4cG9ydHMgPSBDZWxsID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG4gIHJlbmRlcjogLT5cbiAgICBjZSB7ICRlbDogJ2xpJywgJGNuOiBAY2xhc3NlcygpLCByZWY6ICdjZWxsJywgJGluYzogQGluYygpIH1cbiAgY2xhc3NlczogLT5cbiAgICBjbGFzc2VzID0gWydjZWxsJ11cbiAgICBjbGFzc2VzLnB1c2goJ29wZW5lZCcpIGlmIEBwcm9wcy5tb2RlbC5vcGVuZWRcbiAgICBjbGFzc2VzLmpvaW4oJyAnKVxuICBpbmM6IC0+XG4gICAgcmV0dXJuIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogQHByb3BzLm1vZGVsLnN0YXRlIH0gaWYgbm90IEBwcm9wcy5tb2RlbC5vcGVuZWRcblxuICAgIGlmIEBwcm9wcy5tb2RlbC5ib21iZWRcbiAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogJ2JvbWInIH1cbiAgICBlbHNlXG4gICAgICBjb3VudCA9IEBwcm9wcy5tb2RlbC5jb3VudEJvbWJzQXJvdW5kKClcbiAgICAgIGlmIGNvdW50ID09IDBcbiAgICAgICAgJydcbiAgICAgIGVsc2VcbiAgICAgICAgY291bnRcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBjZWxsID0gUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuY2VsbClcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZSktPiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbkNsaWNrSGFuZGxlcilcblxuICBvbkNsaWNrSGFuZGxlcjogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBpZiBlLmJ1dHRvbnM/XG4gICAgICBzd2l0Y2ggKGUuYnV0dG9ucylcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAyXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOnJpZ2h0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gM1xuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0UmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiA0XG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOm1pZGRsZUNsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgIGVsc2UgaWYgZS5idXR0b24/XG4gICAgICBzd2l0Y2ggKGUuYnV0dG9uKVxuICAgICAgICB3aGVuIDBcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bGVmdENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDFcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6bWlkZGxlQ2xpY2snLCBAcHJvcHMubW9kZWwpXG4gICAgICAgIHdoZW4gMlxuICAgICAgICAgIEBkaXNwYXRjaCgnY2VsbDpyaWdodENsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgIGVsc2VcbiAgICAgIEBkaXNwYXRjaCgnY2VsbDpsZWZ0Q2xpY2snLCBAcHJvcHMubW9kZWwpXG4pXG4iLCJtb2R1bGUuZXhwb3J0cyA9IENvbmZpZ3VyYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyIGNvbmYtcGFnZScsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29sLXNtLW9mZnNldC00IGNvbC1zbS00JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2gxJywgJGNuOiAnY29uZi1wYWdlIHRpdGxlJywgJGluYzogJ+ODl+ODquOCu+ODg+ODiCcgfVxuICAgICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAnY29uZi1wYWdlIHByZXNldC1nYW1lcycsICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBtb2RlbDogeyBuYW1lOiAn5Yid57SaJywgZGF0OiB7IHdpZHRoOiA5LCBoZWlnaHQ6IDksIGJvbWJzOiAxMCB9IH0gfVxuICAgICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5QcmVzZXQsIG1vZGVsOiB7IG5hbWU6ICfkuK3ntJonLCBkYXQ6IHsgd2lkdGg6IDE2LCBoZWlnaHQ6IDE2LCBib21iczogNDAgfSB9IH1cbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuUHJlc2V0LCBtb2RlbDogeyBuYW1lOiAn5LiK57SaJywgZGF0OiB7IHdpZHRoOiAzMCwgaGVpZ2h0OiAxNiwgYm9tYnM6IDk5IH0gfSB9XG4gICAgICAgIF0gfVxuICAgICAgICBjZSB7ICRlbDogJ2gxJywgJGNuOiAnY29uZi1wYWdlIHRpdGxlJywgJGluYzogJ+ODleODquODvOOCueOCv+OCpOODqycgfVxuICAgICAgICBjZSB7ICRlbDogJ2Zvcm0nLCAkY246ICdjb25mLXBhZ2UgZnJlZS1zdHlsZSBjb25mLXBhZ2UnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdyb3cgZm9ybS1ncm91cCcsICRpbmM6IFtcbiAgICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdjb2wtc20tMSBjb250cm9sLWxhYmVsIGNvbmYtcGFnZScsICRpbmM6ICfmqKonIH1cbiAgICAgICAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29sLXNtLTMnLCAkaW5jOiBbXG4gICAgICAgICAgICAgIGNlIHsgJGVsOiAnaW5wdXQnLCAkY246ICdmb3JtLWNvbnRyb2wgY29uZi1wYWdlJywgcmVmOiAnd2lkdGgnLCB2YWx1ZTogNSwgb25DbGljazogQG9uQ2xpY2sgfVxuICAgICAgICAgICAgXSB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2xhYmVsJywgJGNuOiAnY29sLXNtLTEgY29udHJvbC1sYWJlbCBjb25mLXBhZ2UnLCAkaW5jOiAn5qiqJyB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS0zJywgJGluYzogW1xuICAgICAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2hlaWdodCcsIHZhbHVlOiA0LCBvbkNsaWNrOiBAb25DbGljayB9XG4gICAgICAgICAgICBdIH1cbiAgICAgICAgICAgIGNlIHsgJGVsOiAnbGFiZWwnLCAkY246ICdjb2wtc20tMSBjb250cm9sLWxhYmVsIGNvbmYtcGFnZScsICRpbmM6IFtcbiAgICAgICAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkZhLCBpY29uOiAnYm9tYicsIGZpeGVkV2lkdGg6IHRydWUgfVxuICAgICAgICAgICAgXSB9XG4gICAgICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS0zJywgJGluYzogW1xuICAgICAgICAgICAgICBjZSB7ICRlbDogJ2lucHV0JywgJGNuOiAnZm9ybS1jb250cm9sIGNvbmYtcGFnZScsIHJlZjogJ2JvbWJzJywgdmFsdWU6IDQsIG9uQ2xpY2s6IEBvbkNsaWNrIH1cbiAgICAgICAgICAgIF0gfVxuICAgICAgICAgIF0gfVxuICAgICAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiAnYnRuIGJ0bi1zdWNjZXNzIGNvbmYtcGFnZSB3aWRlJywgb25DbGljazogQG9uQ2xpY2tGcmVlU3R5bGUsICRpbmM6ICfjgrnjgr/jg7zjg4gnIH1cbiAgICAgICAgXSB9XG4gICAgICBdIH1cbiAgICBdIH1cbiAgb25DbGlja0ZyZWVTdHlsZTogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2ggJ2ZyZWVzdHlsZScsIHtcbiAgICAgIHdpZHRoOiBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy53aWR0aCkudmFsdWVcbiAgICAgIGhlaWdodDogUmVhY3QuZmluZERPTU5vZGUoQHJlZnMuaGVpZ2h0KS52YWx1ZVxuICAgICAgYm9tYnM6IFJlYWN0LmZpbmRET01Ob2RlKEByZWZzLmJvbWJzKS52YWx1ZVxuICAgIH1cbikiLCJtb2R1bGUuZXhwb3J0cyA9XG4gIEZhID0gUmVhY3QuY3JlYXRlQ2xhc3MgKFxuICAgIHJlbmRlcjogLT5cbiAgICAgIGNsYXNzZXMgPSBbJ2ZhJ11cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLSN7QHByb3BzLmljb259XCIpXG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5zY2FsZX14XCIpIGlmIEBwcm9wcy5zY2FsZT9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtZncnKSBpZiBAcHJvcHMuZml4ZWRXaWR0aD9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtbGknKSBpZiBAcHJvcHMubGlzdD9cbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtYm9yZGVyJykgaWYgQHByb3BzLmJvcmRlcj9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLXB1bGwtI3tAcHJvcHMucHVsbH1cIikgaWYgQHByb3BzLnB1bGw/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5hbmltYXRpb24/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1yb3RhdGUtI3tAcHJvcHMucm90YXRlfVwiKSBpZiBAcHJvcHMucm90YXRlP1xuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtZmxpcC0je0Bwcm9wcy5hbmltYXRpb259XCIpIGlmIEBwcm9wcy5mbGlwP1xuXG4gICAgICBjZSB7ICRlbDogJ2knLCAkY246IGNsYXNzZXMuam9pbignICcpIH1cbiAgKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBHYW1lID0gUmVhY3QuY3JlYXRlQ2xhc3MoXG4gIG1peGluczogW0FyZGEubWl4aW5dXG4gIHJlbmRlcjogLT5cbiAgICBjZSB7ICRlbDogJ2RpdicsICRpbmM6IFtcbiAgICAgIGNlIHsgJGVsOiAnZGl2JywgJGNuOiAnY29udGFpbmVyJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NvbC1zbS1vZmZzZXQtMyBjb2wtc20tNiBnYW1lLXBhZ2UgY2xlYXJmaXgnLCAkaW5jOiBbXG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb2wtc20tNSBnYW1lLXBhZ2UgdGltZScsICRpbmM6IFtcbiAgICAgICAgICAgIEBwcm9wcy5jb25maWcucGFzc2VkXG4gICAgICAgICAgXSB9XG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb2wtc20tMiBnYW1lLXBhZ2UgcmVzdGFydCcsICRpbmM6IFtcbiAgICAgICAgICAgIGNlIHsgJGVsOiAnYnV0dG9uJywgJGNuOiBcImJ0biBidG4tI3tAYnV0dG9uQ29sb3IoKX0gZ2FtZS1wYWdlIHdpZGVcIiwgb25DbGljazogQG9uQ2xpY2tSZXN0YXJ0LCAkaW5jOiBbXG4gICAgICAgICAgICAgIGNlIHsgJGVsOiBBcHAuVmlldy5GYSwgaWNvbjogQGJ1dHRvbkZhY2UoKSwgc2NhbGU6IDIgfVxuICAgICAgICAgICAgXSB9XG4gICAgICAgICAgXSB9XG4gICAgICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb2wtc20tNSBnYW1lLXBhZ2UgcmVzdCcsICRpbmM6IFtcbiAgICAgICAgICAgIEBwcm9wcy5jb25maWcucmVzdCgpXG4gICAgICAgICAgXSB9XG4gICAgICAgIF0gfVxuICAgICAgXSB9XG4gICAgICBjZSB7ICRlbDogJ2RpdicsICRjbjogJ2NsZWFyZml4JywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuVGFibGUsIG1vZGVsOiBAcHJvcHMuY29uZmlnIH1cbiAgICAgIF0gfVxuICAgICAgY2UgeyAkZWw6ICdkaXYnLCAkY246ICdjb250YWluZXIgZ2FtZS1wYWdlIGJvdHRvbS1hcmVhJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogJ2J1dHRvbicsICRjbjogJ2J0biBidG4tc3VjY2VzcyBjb25mLXBhZ2UnLCBvbkNsaWNrOiBAb25DbGlja0JhY2ssICRpbmM6IFtcbiAgICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246ICdjaGV2cm9uLWNpcmNsZS1sZWZ0JyB9XG4gICAgICAgICAgJyDjgoLjganjgosnXG4gICAgICAgIF0gfVxuICAgICAgXSB9XG4gICAgXSB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgQHNpZCA9IHNldEludGVydmFsKCg9PlxuICAgICAgQGRpc3BhdGNoICd0aW1lcidcbiAgICApLCAxMDAwKVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxuICAgIGNsZWFySW50ZXJ2YWwoQHNpZClcblxuICBvbkNsaWNrUmVzdGFydDogKGUpLT5cbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBAZGlzcGF0Y2ggJ3Jlc3RhcnQnXG5cbiAgb25DbGlja0JhY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoICdiYWNrJ1xuXG4gIGJ1dHRvbkZhY2U6IC0+XG4gICAgc3dpdGNoIEBwcm9wcy5jb25maWcuc3RhdGVcbiAgICAgIHdoZW4gQHByb3BzLmNvbmZpZy5zdGF0dXMucGxheVxuICAgICAgICAnbWVoLW8nXG4gICAgICB3aGVuIEBwcm9wcy5jb25maWcuc3RhdHVzLmNsZWFyXG4gICAgICAgICdzbWlsZS1vJ1xuICAgICAgd2hlbiBAcHJvcHMuY29uZmlnLnN0YXR1cy5kaWVcbiAgICAgICAgJ2Zyb3duLW8nXG5cbiAgYnV0dG9uQ29sb3I6IC0+XG4gICAgc3dpdGNoIEBwcm9wcy5jb25maWcuc3RhdGVcbiAgICAgIHdoZW4gQHByb3BzLmNvbmZpZy5zdGF0dXMucGxheVxuICAgICAgICAnZGVmYXVsdCdcbiAgICAgIHdoZW4gQHByb3BzLmNvbmZpZy5zdGF0dXMuY2xlYXJcbiAgICAgICAgJ3ByaW1hcnknXG4gICAgICB3aGVuIEBwcm9wcy5jb25maWcuc3RhdHVzLmRpZVxuICAgICAgICAnZGFuZ2VyJ1xuKVxuIiwibW9kdWxlLmV4cG9ydHMgPSBQcmVzZXQgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgbWl4aW5zOiBbQXJkYS5taXhpbl1cbiAgcmVuZGVyOiAtPlxuICAgIGNlIHsgJGVsOiAnbGknLCAkY246ICdjb25mLXBhZ2UgcHJlc2V0JywgJGluYzogW1xuICAgICAgY2UgeyAkZWw6ICdidXR0b24nLCAkY246ICdidG4gYnRuLXByaW1hcnkgY29uZi1wYWdlIHdpZGUnLCBvbkNsaWNrOiBAb25DbGljaywgJGluYzogQHByb3BzLm1vZGVsLm5hbWUgfVxuICAgIF0gfVxuXG4gIG9uQ2xpY2s6IChlKS0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgQGRpc3BhdGNoKCdwcmVzZXQnLCBAcHJvcHMubW9kZWwuZGF0KVxuKSIsIm1vZHVsZS5leHBvcnRzID1cbiAgVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgICByZW5kZXI6IC0+XG4gICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAndGFibGUnLCAkaW5jOiBAY2VsbHMoKSwgc3R5bGU6IEBzdHlsZXMoKSB9XG4gICAgY2VsbHM6IC0+XG4gICAgICBmb3IgY2VsbCBpbiBAcHJvcHMubW9kZWwuY2VsbHNcbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkNlbGwsIG1vZGVsOiBjZWxsIH1cbiAgICBzdHlsZXM6IC0+XG4gICAgICB3aWR0aDogQHByb3BzLm1vZGVsLndpZHRoICogMzBcbiAgKVxuIl19
