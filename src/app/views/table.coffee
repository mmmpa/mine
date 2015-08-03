module.exports =
  Table = React.createClass(
    render: ->
      ce { $el: 'ul', $cn: 'table', $inc: @cells() }
    cells: ->
      for cell in @props.model.cells
        ce { $el: App.View.Cell, model: cell }
  )
