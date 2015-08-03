module.exports = Cell = React.createClass(
  mixins: [Arda.mixin]
  render: ->
    ce { $el: 'li', $cn: @classes(), ref: 'cell', $inc: @inc() }
  classes: ->
    classes = ['cell']
    classes.push('opened') if @props.model.opened
    classes.join(' ')
  inc: ->
    return ce { $el: App.View.Fa, icon: @props.model.state } if not @props.model.opened

    if @props.model.bombed
      ce { $el: App.View.Fa, icon: 'bomb' }
    else
      count = @props.model.countBombsAround()
      if count == 0
        ''
      else
        count

  componentDidMount: ->
    cell = React.findDOMNode(@refs.cell)
    cell.addEventListener("contextmenu", (e)-> e.preventDefault())
    cell.addEventListener("mousedown", @onClickHandler)

  onClickHandler: (e)->
    e.preventDefault()
    if e.buttons?
      switch (e.buttons)
        when 1
          @dispatch('cell:leftClick', @props.model)
        when 2
          @dispatch('cell:rightClick', @props.model)
        when 3
          @dispatch('cell:leftRightClick', @props.model)
        when 4
          @dispatch('cell:middleClick', @props.model)
    else if e.button?
      switch (e.button)
        when 0
          @dispatch('cell:leftClick', @props.model)
        when 1
          @dispatch('cell:middleClick', @props.model)
        when 2
          @dispatch('cell:rightClick', @props.model)
    else
      @dispatch('cell:leftClick', @props.model)
)
