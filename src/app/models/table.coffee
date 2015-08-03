module.exports =
  class Table
    constructor: (@width, @height, @bombs = 1) ->
      throw 'no bombs' if @bombs < 1

      @cells = @initCells()
      @bombs = @installBomb(@bombs)

    around: (cell)->
      _.flatten(for y in [(cell.y - 1)..(cell.y + 1)]
        for x in [(cell.x - 1)..(cell.x + 1)]
          @cell(x, y))

    cell: (x, y)->
      return null if x < 0 || y < 0 || x > @width - 1 || y > @height - 1
      @cells[y * @width + x]

    countBombsAround: (cell)->
      _.filter(@around(cell), (picked)->
        picked && picked.bombed
      ).length

    initCells: =>
      _.flatten(for y in [0..(@height - 1)]
        for x in [0..(@width - 1)]
          new App.Model.Cell(@, x, y))

    installBomb: (count)->
      @installBombManually(_.shuffle(_.shuffle([0..(@cells.length - 1)]))[0..(count - 1)]...)

    installBombManually: (bombs...)->
      for cell in @cells
        cell.bombed = false
      @bombs = for position in bombs
        @cells[position].bombed = true
        position

    open: (openCell) ->
      _.find(@cells, (cell)-> cell == openCell)
      not openCell.bombed

    positionCell: (position) ->
      @cells[position]
