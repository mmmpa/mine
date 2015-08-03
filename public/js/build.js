(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Context, WallContext, ce, init,
  slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Context = {};

ce = function() {
  var args, ref;
  args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  return (ref = App.Util).ce.apply(ref, args);
};

init = (function(_this) {
  return function() {
    return Context.WallContext = WallContext;
  };
})(this);

WallContext = (function(superClass) {
  extend(WallContext, superClass);

  function WallContext() {
    return WallContext.__super__.constructor.apply(this, arguments);
  }

  WallContext.prototype.component = React.createClass({
    render: function() {
      return ce({
        $el: App.View.Table,
        model: this.props.config.table
      });
    }
  });

  WallContext.prototype.initState = function(props) {
    return props;
  };

  WallContext.prototype.expandComponentProps = function(props, state) {
    return {
      config: state.config
    };
  };

  WallContext.prototype.delegate = function(subscribe) {
    WallContext.__super__.delegate.apply(this, arguments);
    subscribe('context:created', function() {
      return console.log('created');
    });
    return subscribe('cell:rightClick', (function(_this) {
      return function(cell) {
        cell.rotateMode();
        return _this.update(function(state) {
          return {
            config: state.config
          };
        });
      };
    })(this));
  };

  return WallContext;

})(Arda.Context);

init();



},{}],2:[function(require,module,exports){
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
  return router.pushContext(App.Context.WallContext, {
    config: {
      table: new App.Model.Table(5, 4)
    }
  });
};



}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./context":1,"./model":3,"./util":6,"./view":7}],3:[function(require,module,exports){
var Model;

module.exports = Model = {};

Model.Cell = require('./models/cell');

Model.Table = require('./models/table');



},{"./models/cell":4,"./models/table":5}],4:[function(require,module,exports){
var Cell,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = Cell = (function() {
  Cell.prototype.status = {
    none: 'none',
    flag: 'flag',
    question: 'question'
  };

  Cell.prototype.opened = false;

  Cell.prototype.bombed = false;

  Cell.prototype.state = null;

  function Cell(table, x, y) {
    this.table = table;
    this.x = x;
    this.y = y;
    this.open = bind(this.open, this);
    this.countBombsAround = bind(this.countBombsAround, this);
    this.position = this.table.width * this.y + this.x;
    this.state = this.status.none;
  }

  Cell.prototype.countBombsAround = function() {
    return this.table.countBombsAround(this);
  };

  Cell.prototype.rotateMode = function() {
    return this.state = (function() {
      switch (this.state) {
        case this.status.none:
          return this.status.flag;
        case this.status.flag:
          return this.status.question;
        case this.status.question:
          return this.status.none;
      }
    }).call(this);
  };

  Cell.prototype.open = function() {
    if (this.opened) {
      return true;
    }
    this.opened = true;
    return this.table.open(this);
  };

  return Cell;

})();



},{}],5:[function(require,module,exports){
var Table,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

module.exports = Table = (function() {
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

  Table.prototype.countBombsAround = function(cell) {
    return _.filter(this.around(cell), function(picked) {
      return picked && picked.bombed;
    }).length;
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
    _.find(this.cells, function(cell) {
      return cell === openCell;
    });
    return !openCell.bombed;
  };

  Table.prototype.positionCell = function(position) {
    return this.cells[position];
  };

  return Table;

})();



},{}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
var View;

module.exports = View = {};

View.Table = require('./views/table');

View.Cell = require('./views/cell');

View.Fa = require('./views/fa');



},{"./views/cell":8,"./views/fa":9,"./views/table":10}],8:[function(require,module,exports){
var Cell;

module.exports = Cell = React.createClass({
  mixins: [Arda.mixin],
  render: function() {
    return ce({
      $el: 'li',
      $cn: 'cell',
      ref: 'cell',
      $inc: [
        ce({
          $el: App.View.Fa,
          icon: this.props.model.state
        })
      ]
    });
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
    switch (e.button) {
      case 0:
        return this.dispatch('cell:leftClick', this.props.model);
      case 1:
        return this.dispatch('cell:middleClick', this.props.model);
      case 2:
        return this.dispatch('cell:rightClick', this.props.model);
    }
  }
});



},{}],9:[function(require,module,exports){
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



},{}],10:[function(require,module,exports){
var Table;

module.exports = Table = React.createClass({
  render: function() {
    return ce({
      $el: 'ul',
      $cn: 'table',
      $inc: this.cells()
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
  }
});



},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9ndWxwL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL2NvbnRleHQuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvaW5kZXguY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvbW9kZWwuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvbW9kZWxzL2NlbGwuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvbW9kZWxzL3RhYmxlLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3V0aWwuY29mZmVlIiwiL2hvbWUvdGVuL0Ryb3Bib3gvcHJvamVjdC9taW5lL3NyYy9hcHAvdmlldy5jb2ZmZWUiLCIvaG9tZS90ZW4vRHJvcGJveC9wcm9qZWN0L21pbmUvc3JjL2FwcC92aWV3cy9jZWxsLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL2ZhLmNvZmZlZSIsIi9ob21lL3Rlbi9Ecm9wYm94L3Byb2plY3QvbWluZS9zcmMvYXBwL3ZpZXdzL3RhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsOEJBQUE7RUFBQTs7OztBQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsR0FBVTs7QUFFM0IsRUFBQSxHQUFLLFNBQUE7QUFDSCxNQUFBO0VBREk7U0FDSixPQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVEsQ0FBQyxFQUFULFlBQVksSUFBWjtBQURH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QSxFQUFPLFNBQUE7QUFDTCxRQUFBO0FBQUE7QUFBQTtTQUFBLHFDQUFBOzttQkFDRSxFQUFBLENBQUc7UUFBRSxHQUFBLEVBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFoQjtRQUFzQixLQUFBLEVBQU8sSUFBN0I7T0FBSDtBQURGOztFQURLLENBRlA7Q0FETSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IENvbnRleHQgPSB7fVxuXG5jZSA9IChhcmdzLi4uKS0+XG4gIEFwcC5VdGlsLmNlKGFyZ3MuLi4pXG5cbmluaXQgPSA9PlxuICBDb250ZXh0LldhbGxDb250ZXh0ID0gV2FsbENvbnRleHRcblxuY2xhc3MgV2FsbENvbnRleHQgZXh0ZW5kcyBBcmRhLkNvbnRleHRcbiAgY29tcG9uZW50OiBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgICByZW5kZXI6IC0+XG4gICAgICBjZSB7ICRlbDogQXBwLlZpZXcuVGFibGUsIG1vZGVsOiBAcHJvcHMuY29uZmlnLnRhYmxlfVxuICApXG5cbiAgaW5pdFN0YXRlOiAocHJvcHMpIC0+XG4gICAgcHJvcHNcblxuICBleHBhbmRDb21wb25lbnRQcm9wczogKHByb3BzLCBzdGF0ZSkgLT5cbiAgICBjb25maWc6IHN0YXRlLmNvbmZpZ1xuXG4gIGRlbGVnYXRlOiAoc3Vic2NyaWJlKSAtPlxuICAgIHN1cGVyXG4gICAgc3Vic2NyaWJlICdjb250ZXh0OmNyZWF0ZWQnLCAtPiBjb25zb2xlLmxvZyAnY3JlYXRlZCdcbiAgICBzdWJzY3JpYmUgJ2NlbGw6cmlnaHRDbGljaycsIChjZWxsKT0+XG4gICAgICBjZWxsLnJvdGF0ZU1vZGUoKVxuICAgICAgQHVwZGF0ZSgoc3RhdGUpID0+IGNvbmZpZzogc3RhdGUuY29uZmlnKVxuaW5pdCgpIiwibW9kdWxlLmV4cG9ydHMgPSBBcHAgPSB7fVxuaWYgd2luZG93P1xuICB3aW5kb3cuQXBwID0gQXBwXG4gIHdpbmRvdy5jZSA9IChhcmdzLi4uKS0+XG4gICAgQXBwLlV0aWwuY2UoYXJncy4uLilcblxuZWxzZVxuICBnbG9iYWwuQXBwID0gQXBwXG4gIGdsb2JhbC5jZSA9IChhcmdzLi4uKS0+XG4gICAgQXBwLlV0aWwuY2UoYXJncy4uLilcblxuQXBwLkNvbnRleHQgPSByZXF1aXJlICcuL2NvbnRleHQnXG5BcHAuVXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG5BcHAuTW9kZWwgPSByZXF1aXJlICcuL21vZGVsJ1xuQXBwLlZpZXcgPSByZXF1aXJlICcuL3ZpZXcnXG5cbmNvbnNvbGUubG9nICdhJ1xuXG5BcHAuc3RhcnQgPSAobm9kZSktPlxuICByb3V0ZXIgPSBuZXcgQXJkYS5Sb3V0ZXIoQXJkYS5EZWZhdWx0TGF5b3V0LCBub2RlKVxuICByb3V0ZXIucHVzaENvbnRleHQoQXBwLkNvbnRleHQuV2FsbENvbnRleHQsIHsgY29uZmlnOiB7dGFibGU6IG5ldyBBcHAuTW9kZWwuVGFibGUoNSwgNCl9IH0pXG4gICNSZWFjdC5yZW5kZXIoKGNlIHsgJGVsOiBBcHAuVmlldy5XYWxsLCBtb2RlbDogbmV3IEFwcC5Nb2RlbC5UYWJsZSg1LCA0KSB9KSwgbm9kZSkiLCJtb2R1bGUuZXhwb3J0cyA9IE1vZGVsID0ge31cblxuTW9kZWwuQ2VsbCA9IHJlcXVpcmUgJy4vbW9kZWxzL2NlbGwnXG5Nb2RlbC5UYWJsZSA9IHJlcXVpcmUgJy4vbW9kZWxzL3RhYmxlJ1xuIiwibW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBDZWxsXG4gICAgc3RhdHVzOlxuICAgICAgbm9uZTogJ25vbmUnXG4gICAgICBmbGFnOiAnZmxhZydcbiAgICAgIHF1ZXN0aW9uOiAncXVlc3Rpb24nXG4gICAgb3BlbmVkOiBmYWxzZVxuICAgIGJvbWJlZDogZmFsc2VcbiAgICBzdGF0ZTogbnVsbFxuICAgIGNvbnN0cnVjdG9yOiAoQHRhYmxlLCBAeCwgQHkpIC0+XG4gICAgICBAcG9zaXRpb24gPSBAdGFibGUud2lkdGggKiBAeSArIEB4XG4gICAgICBAc3RhdGUgPSBAc3RhdHVzLm5vbmVcbiAgICBjb3VudEJvbWJzQXJvdW5kOiA9PlxuICAgICAgQHRhYmxlLmNvdW50Qm9tYnNBcm91bmQoQClcbiAgICByb3RhdGVNb2RlOiAtPlxuICAgICAgQHN0YXRlID0gc3dpdGNoIEBzdGF0ZVxuICAgICAgICB3aGVuIEBzdGF0dXMubm9uZVxuICAgICAgICAgIEBzdGF0dXMuZmxhZ1xuICAgICAgICB3aGVuIEBzdGF0dXMuZmxhZ1xuICAgICAgICAgIEBzdGF0dXMucXVlc3Rpb25cbiAgICAgICAgd2hlbiBAc3RhdHVzLnF1ZXN0aW9uXG4gICAgICAgICAgQHN0YXR1cy5ub25lXG4gICAgb3BlbjogPT5cbiAgICAgIHJldHVybiB0cnVlIGlmIEBvcGVuZWRcbiAgICAgIEBvcGVuZWQgPSB0cnVlXG4gICAgICBAdGFibGUub3BlbihAKVxuIiwibW9kdWxlLmV4cG9ydHMgPVxuICBjbGFzcyBUYWJsZVxuICAgIGNvbnN0cnVjdG9yOiAoQHdpZHRoLCBAaGVpZ2h0LCBAYm9tYnMgPSAxKSAtPlxuICAgICAgdGhyb3cgJ25vIGJvbWJzJyBpZiBAYm9tYnMgPCAxXG5cbiAgICAgIEBjZWxscyA9IEBpbml0Q2VsbHMoKVxuICAgICAgQGJvbWJzID0gQGluc3RhbGxCb21iKEBib21icylcblxuICAgIGFyb3VuZDogKGNlbGwpLT5cbiAgICAgIF8uZmxhdHRlbihmb3IgeSBpbiBbKGNlbGwueSAtIDEpLi4oY2VsbC55ICsgMSldXG4gICAgICAgIGZvciB4IGluIFsoY2VsbC54IC0gMSkuLihjZWxsLnggKyAxKV1cbiAgICAgICAgICBAY2VsbCh4LCB5KSlcblxuICAgIGNlbGw6ICh4LCB5KS0+XG4gICAgICByZXR1cm4gbnVsbCBpZiB4IDwgMCB8fCB5IDwgMCB8fCB4ID4gQHdpZHRoIC0gMSB8fCB5ID4gQGhlaWdodCAtIDFcbiAgICAgIEBjZWxsc1t5ICogQHdpZHRoICsgeF1cblxuICAgIGNvdW50Qm9tYnNBcm91bmQ6IChjZWxsKS0+XG4gICAgICBfLmZpbHRlcihAYXJvdW5kKGNlbGwpLCAocGlja2VkKS0+XG4gICAgICAgIHBpY2tlZCAmJiBwaWNrZWQuYm9tYmVkXG4gICAgICApLmxlbmd0aFxuXG4gICAgaW5pdENlbGxzOiA9PlxuICAgICAgXy5mbGF0dGVuKGZvciB5IGluIFswLi4oQGhlaWdodCAtIDEpXVxuICAgICAgICBmb3IgeCBpbiBbMC4uKEB3aWR0aCAtIDEpXVxuICAgICAgICAgIG5ldyBBcHAuTW9kZWwuQ2VsbChALCB4LCB5KSlcblxuICAgIGluc3RhbGxCb21iOiAoY291bnQpLT5cbiAgICAgIEBpbnN0YWxsQm9tYk1hbnVhbGx5KF8uc2h1ZmZsZShfLnNodWZmbGUoWzAuLihAY2VsbHMubGVuZ3RoIC0gMSldKSlbMC4uKGNvdW50IC0gMSldLi4uKVxuXG4gICAgaW5zdGFsbEJvbWJNYW51YWxseTogKGJvbWJzLi4uKS0+XG4gICAgICBmb3IgY2VsbCBpbiBAY2VsbHNcbiAgICAgICAgY2VsbC5ib21iZWQgPSBmYWxzZVxuICAgICAgQGJvbWJzID0gZm9yIHBvc2l0aW9uIGluIGJvbWJzXG4gICAgICAgIEBjZWxsc1twb3NpdGlvbl0uYm9tYmVkID0gdHJ1ZVxuICAgICAgICBwb3NpdGlvblxuXG4gICAgb3BlbjogKG9wZW5DZWxsKSAtPlxuICAgICAgXy5maW5kKEBjZWxscywgKGNlbGwpLT4gY2VsbCA9PSBvcGVuQ2VsbClcbiAgICAgIG5vdCBvcGVuQ2VsbC5ib21iZWRcblxuICAgIHBvc2l0aW9uQ2VsbDogKHBvc2l0aW9uKSAtPlxuICAgICAgQGNlbGxzW3Bvc2l0aW9uXVxuIiwibW9kdWxlLmV4cG9ydHMgPSBVdGlsID0ge1xuICAjIyNcbiAgUmVhY3QuY3JlYXRlRWxlbWVudOOCkuWkieW9olxuXG4gIGNlKG9iamVjdClcbiAgICBvYmplY3QuJGNuIC0+IGNsYXNzTmFtZVxuICAgIG9iamVjdC4kZWwgLT4g44K/44Kw5ZCNXG4gICAgb2JqZWN0LiRpbmMgLT4g5pyr5bC+5byV5pWw44CB44GC44KL44GE44Gv5Y+v5aSJ6ZW35byV5pWw44Go44GX44Gm5rih44GV44KM44KL5YCkXG4gICAgb2JqZWN0IC0+IOW8leaVsOOBr+OBneOBruOBvuOBvnByb3Bz44Go44GX44Gm5rih44GV44KM44KLXG5cbiAg5pmu6YCaXG5cbiAgICAgY2UgeyRlbDogJ2RpdicsICRjbjogJ3Nob3J0JywgJGluYzogJ3RleHQnfVxuXG4gICAgIDxkaXYgY2xhc3NOYW1lPVwic2hvcnRcIj5cbiAgICAgICB0ZXh0XG4gICAgIDwvZGl2PlxuXG4gIOWFpeOCjOWtkFxuXG4gICAgIEl0ZW0gPSBSZWFjdENsYXNzXG4gICAgICAgcmVuZGVyOiAtPlxuICAgICAgICAgY2UgeyRlbDogJ2xpJywgJGluYzogJ2l0ZW0nfVxuXG4gICAgIGNlIHskZWw6ICd1bCcsICRpbmM6IFtJdGVtLCBJdGVtXX1cblxuICAgICA8dWw+XG4gICAgICAge0l0ZW19XG4gICAgICAge0l0ZW19XG4gICAgIDwvdWw+XG4gICMjI1xuICBjZTogKG9iamVjdCktPlxuICAgIHN3aXRjaCB0cnVlXG4gICAgICB3aGVuIG9iamVjdD8uaGFzT3duUHJvcGVydHkoJyRlbCcpXG4gICAgICAgIG9iamVjdC5jbGFzc05hbWUgPSBvYmplY3QuJGNuXG4gICAgICAgIGNoaWxkcmVuID0gQGNlKG9iamVjdC4kaW5jKVxuICAgICAgICBpZiBfLmlzQXJyYXkoY2hpbGRyZW4pXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChvYmplY3QuJGVsLCBvYmplY3QsIGNoaWxkcmVuLi4uKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChvYmplY3QuJGVsLCBvYmplY3QsIGNoaWxkcmVuKVxuICAgICAgd2hlbiBfLmlzQXJyYXkob2JqZWN0KVxuICAgICAgICBmb3IgY2hpbGQgaW4gb2JqZWN0XG4gICAgICAgICAgQGNlKGNoaWxkKVxuICAgICAgd2hlbiBfLmlzU3RyaW5nKG9iamVjdClcbiAgICAgICAgb2JqZWN0XG4gICAgICB3aGVuIF8uaXNOdW1iZXIob2JqZWN0KVxuICAgICAgICBvYmplY3RcbiAgICAgIHdoZW4gXy5pc09iamVjdChvYmplY3QpXG4gICAgICAgIG9iamVjdFxuICAgICAgZWxzZVxuICAgICAgICAnJ1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBWaWV3ID0ge31cblxuVmlldy5UYWJsZSA9IHJlcXVpcmUgJy4vdmlld3MvdGFibGUnXG5WaWV3LkNlbGwgPSByZXF1aXJlICcuL3ZpZXdzL2NlbGwnXG5WaWV3LkZhID0gcmVxdWlyZSAnLi92aWV3cy9mYSdcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgQ2VsbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKFxuICAgIG1peGluczogW0FyZGEubWl4aW5dXG4gICAgcmVuZGVyOiAtPlxuICAgICAgY2UgeyAkZWw6ICdsaScsICRjbjogJ2NlbGwnLCByZWY6ICdjZWxsJywgJGluYzogW1xuICAgICAgICBjZSB7ICRlbDogQXBwLlZpZXcuRmEsIGljb246IEBwcm9wcy5tb2RlbC5zdGF0ZSB9XG4gICAgICBdIH1cbiAgICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICAgIGNlbGwgPSBSZWFjdC5maW5kRE9NTm9kZShAcmVmcy5jZWxsKVxuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGUpLT4gZS5wcmV2ZW50RGVmYXVsdCgpKVxuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIEBvbkNsaWNrSGFuZGxlcilcbiAgICBvbkNsaWNrSGFuZGxlcjogKGUpLT5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgc3dpdGNoIChlLmJ1dHRvbilcbiAgICAgICAgd2hlbiAwXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOmxlZnRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgICAgICAgd2hlbiAxXG4gICAgICAgICAgQGRpc3BhdGNoKCdjZWxsOm1pZGRsZUNsaWNrJywgQHByb3BzLm1vZGVsKVxuICAgICAgICB3aGVuIDJcbiAgICAgICAgICBAZGlzcGF0Y2goJ2NlbGw6cmlnaHRDbGljaycsIEBwcm9wcy5tb2RlbClcbiAgKVxuIiwibW9kdWxlLmV4cG9ydHMgPVxuICBGYSA9IFJlYWN0LmNyZWF0ZUNsYXNzIChcbiAgICByZW5kZXI6IC0+XG4gICAgICBjbGFzc2VzID0gWydmYSddXG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS0je0Bwcm9wcy5pY29ufVwiKVxuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtI3tAcHJvcHMuc2NhbGV9eFwiKSBpZiBAcHJvcHMuc2NhbGU/XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWZ3JykgaWYgQHByb3BzLmZpeGVkV2lkdGg/XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWxpJykgaWYgQHByb3BzLmxpc3Q/XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLWJvcmRlcicpIGlmIEBwcm9wcy5ib3JkZXI/XG4gICAgICBjbGFzc2VzLnB1c2goXCJmYS1wdWxsLSN7QHByb3BzLnB1bGx9XCIpIGlmIEBwcm9wcy5wdWxsP1xuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtI3tAcHJvcHMuYW5pbWF0aW9ufVwiKSBpZiBAcHJvcHMuYW5pbWF0aW9uP1xuICAgICAgY2xhc3Nlcy5wdXNoKFwiZmEtcm90YXRlLSN7QHByb3BzLnJvdGF0ZX1cIikgaWYgQHByb3BzLnJvdGF0ZT9cbiAgICAgIGNsYXNzZXMucHVzaChcImZhLWZsaXAtI3tAcHJvcHMuYW5pbWF0aW9ufVwiKSBpZiBAcHJvcHMuZmxpcD9cblxuICAgICAgY2UgeyAkZWw6ICdpJywgJGNuOiBjbGFzc2VzLmpvaW4oJyAnKSB9XG4gIClcbiIsIm1vZHVsZS5leHBvcnRzID1cbiAgVGFibGUgPSBSZWFjdC5jcmVhdGVDbGFzcyhcbiAgICByZW5kZXI6IC0+XG4gICAgICBjZSB7ICRlbDogJ3VsJywgJGNuOiAndGFibGUnLCAkaW5jOiBAY2VsbHMoKSB9XG4gICAgY2VsbHM6IC0+XG4gICAgICBmb3IgY2VsbCBpbiBAcHJvcHMubW9kZWwuY2VsbHNcbiAgICAgICAgY2UgeyAkZWw6IEFwcC5WaWV3LkNlbGwsIG1vZGVsOiBjZWxsIH1cbiAgKVxuIl19
