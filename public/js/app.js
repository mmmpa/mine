(function() {
  var App, MS, MineComponent, MineContext,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  App = (function() {
    function App() {}

    App.start = function() {
      var router;
      console.log('start');
      router = new Arda.Router(Arda.DefaultLayout, document.body);
      return router.pushContext(MineContext, {});
    };

    return App;

  })();

  MineComponent = (function() {
    function MineComponent() {}

    MineComponent.Mine = React.createClass({
      mixins: [Arda.mixin],
      render: function() {
        return MS.ce({
          $el: 'div',
          $cn: 'field',
          $inc: 'field'
        });
      }
    });

    return MineComponent;

  })();

  MineContext = (function(superClass) {
    extend(MineContext, superClass);

    function MineContext() {
      return MineContext.__super__.constructor.apply(this, arguments);
    }

    MineContext.prototype.component = MineComponent.Mine;

    MineContext.prototype.delegate = function(subscribe) {
      MineContext.__super__.delegate.apply(this, arguments);
      return subscribe('context:created', function() {
        return console.log('created');
      });
    };

    return MineContext;

  })(Arda.Context);

  MS = (function() {
    function MS() {}


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

    MS.ce = function(object) {
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
    };

    return MS;

  })();

  window.addEventListener('DOMContentLoaded', function() {
    return App.start();
  });

}).call(this);
