module.exports = class Table
  @status:
    play: 'play'
    win: 'win'
    lose: 'lose'
  state: null

  constructor: (@width, @height, @_bombsCount = 1) ->
    throw 'no bombs' if @_bombsCount < 1
    throw 'over bombs' if @_bombsCount >= @width * @height

    @_cells = @initCells()
    @_bombCellPositions = @installBombs(@_bombsCount)
    @_startedTime = +new Date()
    @passedTime = 0
    @restBomsCount = @_bombsCount
    @_blankCellsCount = @_cells.length - @_bombsCount
    @state = Table.status.play

  computeTime: ->
    return if @isLocked()
    @passedTime = _((+new Date() - @_startedTime) / 1000).floor()

  countBombsAround: (cell)->
    _(@getAroundUnopenedCells(cell)).filter((picked)->
      picked.hasBomb()
    ).value().length

  countFlagsAround: (cell)->
    _(@getAroundUnopenedCells(cell)).filter((picked)->
      picked.isFlagged()
    ).value().length

  countFlaggedCell: ->
    _(@_cells).filter((picked)->
      picked.isFlagged()
    ).value().length

  countOpenedCell: ->
    _(@_cells).filter((picked)->
      picked.isOpened()
    ).value().length

  countRestBombs: ->
    @_bombsCount - @countFlaggedCell()

  computeRestBombsCount: ->
    @restBomsCount = @countRestBombs()

  getAroundCellsBase: (cell)->
    _([(cell.y - 1)..(cell.y + 1)]).map((y)=>
      _([(cell.x - 1)..(cell.x + 1)]).map((x)=>
        @getPointCell(x, y)
      ).value()
    ).flatten().compact()

  getAroundCells: (cell)->
    @getAroundCellsBase(cell).value()


  getAroundUnopenedCells: (cell)->
    @getAroundCellsBase(cell).select((cell)->
      not cell.isOpened()
    ).value()

  getCells: ->
    @_cells

  getPointCell: (x, y)->
    return null if x < 0 || y < 0 || x > @width - 1 || y > @height - 1
    @getPositionCell(y * @width + x)

  getPositionCell: (position) ->
    @_cells[position]

  initCells: =>
    _([0..(@height - 1)]).map((y)=>
      _([0..(@width - 1)]).map((x)=>
        new App.Model.Cell(@, x, y)
      ).value()
    ).flatten().value()

  installBombs: (count)->
    bombPositions = _([0..(@_cells.length - 1)]).shuffle().shuffle().value()[0..(count - 1)]
    @installBombsManually(bombPositions...)

  installBombsManually: (bombs...)->
    _(@_cells).each((cell)->
      cell.uninstallBomb()
    ).value()

    _(bombs).map((position)=>
      @getPositionCell(position).installBomb()
      position
    ).value()

  isLocked: ->
    @locked

  lock: ->
    @locked = true

  lose: ->
    @computeTime()
    @state = Table.status.lose
    _(@_bombsCount).each((position)=> @getPositionCell(position).open())
    @lock()

  open: (opened) ->
    return if @isLocked()
    return @lose() if opened.hasBomb()
    return @win() if @_blankCellsCount == @countOpenedCell()

    if opened.countBombsAround() == 0
      @openAround(opened)

  openAround: (cell)->
    _(@getAroundUnopenedCells(cell)).each((around)-> around.open()).value()

  unlock: ->
    @locked = false

  win: ->
    @computeTime()
    @state = Table.status.win
    @lock()

