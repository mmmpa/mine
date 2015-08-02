class App
  @start: ->
    console.log 'start'
    router = new Arda.Router(Arda.DefaultLayout, document.body)
    router.pushContext(MineContext, {})

class MineComponent
  @Mine = React.createClass
    mixins: [Arda.mixin]
    render: ->
      MS.ce({$el: 'div', $cn: 'field', $inc: 'field'})


class MineContext extends Arda.Context
  component: MineComponent.Mine
  delegate: (subscribe) ->
    super
    subscribe 'context:created', -> console.log 'created'

#
# 短縮
#
class MS
  ###
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
  ###
  @ce: (object)->
    switch true
      when object?.hasOwnProperty('$el')
        object.className = object.$cn
        children = @ce(object.$inc)
        if _.isArray(children)
          React.createElement(object.$el, object, children...)
        else
          React.createElement(object.$el, object, children)
      when _.isArray(object)
        for child in object
          @ce(child)
      when _.isString(object)
        object
      when _.isNumber(object)
        object
      when _.isObject(object)
        object
      else
        ''

window.addEventListener 'DOMContentLoaded', ->
  App.start()
