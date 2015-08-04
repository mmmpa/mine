module.exports = Cell = React.createClass(
  mixins: [Arda.mixin]

  render: ->
    ce { $el: 'li', $cn: @genClasses(), ref: 'cell', $inc: @genIncs() }

  componentDidMount: ->
    cell = React.findDOMNode(@refs.cell)
    cell.addEventListener("contextmenu", @onContextMenu)
    cell.addEventListener("mousedown", @onMouseDown)

    @setState(cell: cell)

  componentWillUnmount: ->
    cell = @state.cell
    cell.removeEventListener("contextmenu", @onContextMenu)
    cell.removeEventListener("mousedown", @onMouseDown)

  genClasses: ->
    classes = ['cell']
    classes.push('opened') if @props.model.isOpened()
    classes.join(' ')

  genIncs: ->
    return ce { $el: App.View.Fa, icon: @props.model.state } if not @props.model.isOpened()

    if @props.model.hasBomb()
      ce { $el: App.View.Fa, icon: 'bomb' }
    else
      count = @props.model.countBombsAround()
      if count == 0
        ''
      else
        count
  onContextMenu: (e)->
    e.preventDefault()

  onMouseDown: (e)->
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
