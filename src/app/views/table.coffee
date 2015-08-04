module.exports =
  Table = React.createClass(
    render: ->
      ce { $el: 'ul', $cn: 'table', $inc: @genCells(), style: @genStyles() }

    genCells: ->
      _(@props.model.getCells()).map((cell)->
        ce { $el: App.View.Cell, model: cell }
      ).value()

    genStyles: ->
      width: @props.model.width * 30
  )
