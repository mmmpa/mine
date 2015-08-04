module.exports = class Table
  @status:
    play: 'play'
    win: 'win'
    lose: 'lose'
  state: null

  constructor: (@width, @height, @_bombsCount = 1) ->
    throw 'no bombs' if @_bombsCount < 1

    @_cells = @initCells()
    @_bombCellPositions = @installBomb(@_bombsCount)
    @_startedTime = +new Date()
    @passedTime = 0
    @restBomsCount = @_bombsCount
    @_blankCellsCount = @_cells.length - @_bombsCount
    @state = Table.status.play

  computeTime: ->
    return if @isLocked()
    @passedTime = _((+new Date() - @_startedTime) / 1000).floor()

  countBombsAround: (cell)->
    _(@getAroundCells(cell)).filter((picked)->
      picked && picked.hasBomb()
    ).value().length

  countFlagsAround: (cell)->
    _(@getAroundCells(cell)).filter((picked)->
      picked && picked.isFlagged()
    ).value().length

  countFlaggedCell: ->
    _(@_cells).filter((picked)->
      picked && picked.isFlagged()
    ).value().length

  countOpenedCell: ->
    _(@_cells).filter((picked)->
      picked && picked.isOpened()
    ).value().length

  countRestBombs: ->
    @_bombsCount - @countFlaggedCell()

  computeRestBombsCount: ->
    @restBomsCount = @countRestBombs()

  getAroundCells: (cell)->
    _.compact(_.flatten(for y in [(cell.y - 1)..(cell.y + 1)]
      for x in [(cell.x - 1)..(cell.x + 1)]
        @getPointCell(x, y)))

  getCells: ->
    @_cells

  getPointCell: (x, y)->
    return null if x < 0 || y < 0 || x > @width - 1 || y > @height - 1
    @getPositionCell(y * @width + x)

  getPositionCell: (position) ->
    @_cells[position]

  initCells: =>
    _.flatten(for y in [0..(@height - 1)]
      for x in [0..(@width - 1)]
        new App.Model.Cell(@, x, y))

  installBomb: (count)->
    @installBombManually(_.shuffle(_.shuffle([0..(@_cells.length - 1)]))[0..(count - 1)]...)

  installBombManually: (bombs...)->
    for cell in @_cells
      cell.bombed = false
    for position in bombs
      @_cells[position].bombed = true
      position

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
    _(@getAroundCells(cell)).each((around)-> around.open()).value()

  unlock: ->
    @locked = false

  win: ->
    @computeTime()
    @state = Table.status.win
    @lock()

