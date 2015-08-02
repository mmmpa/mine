module.exports = Model = {}

init = ->
  Model.Cell = Cell
  Model.Table = Table

class Cell
  opened: false
  bombed: false
  constructor: (@table, @x, @y) ->
    @position = @table.width * @y + @x
  open: =>
    return true if @opened
    @opened = true
    @table.open(@)
  countBombsAround: =>
    @table.countBombsAround(@)

class Table
  constructor: (@width, @height, @bombs = 1) ->
    throw 'no bombs' if @bombs < 1

    @cells = @initCells()
    @bombs = @installBomb(@bombs)

  initCells: =>
    _.flatten(for y in [0..(@height - 1)]
      for x in [0..(@width - 1)]
        new Cell(@, x, y))
  installBomb: (count)->
    @installBombManually(_.shuffle(_.shuffle([0..(@cells.length - 1)]))[0..(count - 1)]...)
  installBombManually: (bombs...)->
    for cell in @cells
      cell.bombed = false
    @bombs = for position in bombs
      @cells[position].bombed = true
      position
  around: (cell)->
    _.flatten(for y in [(cell.y - 1)..(cell.y + 1)]
      for x in [(cell.x - 1)..(cell.x + 1)]
        @cell(x, y))
  cell: (x, y)->
    return null if x < 0 || y < 0 || x > @width - 1 || y > @height - 1
    @cells[y * @width + x]
  positionCell: (position) ->
    @cells[position]
  open: (openCell) ->
    _.find(@cells, (cell)-> cell == openCell)
    not openCell.bombed
  countBombsAround: (cell)->
    _.filter(@around(cell), (picked)->
      picked && picked.bombed
    ).length
  @tests:
    cellCount: =>
      table = new @(5, 4)
      table.cells.length == 20
    cellCount2: =>
      table1 = new @(5, 4)
      table2 = new @(6, 4)
      table1.cells.length == 20 && table2.cells.length == 24
    cellPosition1: =>
      table1 = new @(5, 4)
      cell = table1.positionCell(2)
      [
        cell.x == 2 && cell.y == 0
        cell
      ]
    bombsManually: =>
      table = new @(5, 4, 1)
      table.installBombManually(0, 1, 2, 3)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      [
        result == 4
        result
      ]
    bombsCheck1: =>
      table = new @(5, 4, 1)
      table.installBombManually(7)
      table.open(table.positionCell(7)) == false
    bombsCheck2: =>
      table = new @(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([7, 3, 19], (position)->
        table.open(table.positionCell(position))
      )
      [
        result.join() == [false, false, false].join()
        result
      ]
    bombsCheck3: =>
      table = new @(5, 4, 1)
      table.installBombManually(7)
      table.positionCell(7).open() == false
    bombsCheck4: =>
      table = new @(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([7, 3, 19], (position)->
        table.positionCell(position).open()
      )
      [
        result.join() == [false, false, false].join()
        result
      ]
    bombsCheck4: =>
      table = new @(5, 4, 1)
      table.installBombManually(7)
      result = _.map([6, 8], (position)->
        table.positionCell(position).open()
      )
      [
        result.join() == [true, true].join()
        result
      ]
    bombsCheck5: =>
      table = new @(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([6, 8, 2, 4, 18], (position)->
        table.positionCell(position).open()
      )
      [
        result.join() == [true, true, true, true, true].join()
        result
      ]
    bombsCount1: =>
      table = new @(5, 4, 1)
      table.installBombManually(7)
      table.positionCell(1).countBombsAround() == 1
    bombsCount2: =>
      table = new @(5, 4, 1)
      table.installBombManually(1, 2, 3, 6, 7, 8)
      [
        table.positionCell(0).countBombsAround()
        table.positionCell(5).countBombsAround()
        table.positionCell(10).countBombsAround()
        table.positionCell(11).countBombsAround()
        table.positionCell(12).countBombsAround()
        table.positionCell(13).countBombsAround()
        table.positionCell(14).countBombsAround()
        table.positionCell(9).countBombsAround()
        table.positionCell(4).countBombsAround()
      ].join() == [2, 2, 1, 2, 3, 2, 1, 2, 2].join()
    bombsCount3: =>
      table = new @(5, 4, 1)
      table.installBombManually(1, 7, 11, 17, 13)
      [
        table.positionCell(6).countBombsAround()
        table.positionCell(12).countBombsAround()
        table.positionCell(10).countBombsAround()
        table.positionCell(18).countBombsAround()
      ].join() == [3, 4, 1, 2].join()
    bombs1: =>
      table = new @(5, 4, 1)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      [
        table.cells.length == 20
        result == 1
        result
      ]
    bombs2: =>
      table = new @(5, 4, 6)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      [
        result == 6
        result
      ]
    bombs3: =>
      table = new @(5, 4, 18)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      [
        result == 18
        result
      ]
    around1: =>
      table = new @(5, 4)
      cell = table.cell(2, 1)
      result = _.map(table.around(cell), (cell)-> cell.position)
      [
        result.join(',') == [1, 2, 3, 6, 7, 8, 11, 12, 13].join(',')
        result
      ]
    around2: =>
      table = new @(5, 4)
      cell = table.cell(0, 0)
      result = _.map(table.around(cell), (cell)-> cell?.position)
      [
        result.join(',') == [null, null, null, null, 0, 1, null, 5, 6].join(',')
        result
      ]
    around3: =>
      table = new @(5, 4)
      cell = table.cell(4, 0)
      result = _.map(table.around(cell), (cell)-> cell?.position)
      [
        result.join(',') == [null, null, null, 3, 4, null, 8, 9, null].join(',')
        result
      ]

init()
