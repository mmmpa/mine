module.exports =
  Table = React.createClass(
    render: ->
      ce { $el: 'ul', $cn: 'table', $inc: @cells(), style: @styles() }
    cells: ->
      for cell in @props.model.cells
        ce { $el: App.View.Cell, model: cell }
    styles: ->
      width: @props.model.width * 30
  )
