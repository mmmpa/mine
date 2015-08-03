module.exports =
  Cell = React.createClass(
    mixins: [Arda.mixin]
    render: ->
      ce { $el: 'li', $cn: 'cell', ref: 'cell', $inc: [
        ce { $el: App.View.Fa, icon: @props.model.state }
      ] }
    componentDidMount: ->
      cell = React.findDOMNode(@refs.cell)
      cell.addEventListener("contextmenu", (e)-> e.preventDefault())
      cell.addEventListener("mousedown", @onClickHandler)
    onClickHandler: (e)->
      e.preventDefault()
      switch (e.button)
        when 0
          @dispatch('cell:leftClick', @props.model)
        when 1
          @dispatch('cell:middleClick', @props.model)
        when 2
          @dispatch('cell:rightClick', @props.model)
  )
