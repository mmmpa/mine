module.exports = class Table
  status:
    play: 'play'
    clear: 'clear'
    die: 'die'
  state: null

  constructor: (@width, @height, @bombs = 1) ->
    throw 'no bombs' if @bombs < 1

    @cells = @initCells()
    @bombs = @installBomb(@bombs)
    @flagged = 0
    @start = +new Date()
    @passed = 0
    @opened = 0
    @must = @cells.length - @bombs.length
    @state = @status.play
  around: (cell)->
    _.compact(_.flatten(for y in [(cell.y - 1)..(cell.y + 1)]
      for x in [(cell.x - 1)..(cell.x + 1)]
        @cell(x, y)))

  cell: (x, y)->
    return null if x < 0 || y < 0 || x > @width - 1 || y > @height - 1
    @cells[y * @width + x]

  countBombsAround: (cell)->
    _.filter(@around(cell), (picked)->
      picked && picked.bombed
    ).length

  countFlagsAround: (cell)->
    _.filter(@around(cell), (picked)->
      picked && picked.flagged()
    ).length

  die: ->
    @time()
    @state = @status.die
    _.each(@bombs, (position)=>
      @positionCell(position).open()
    )
    @locked = true

  clear: ->
    @time()
    @state = @status.clear
    @locked = true

  flag: (plus)->
    if plus
      @flagged += 1
    else
      @flagged -= 1

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
    return  @die() if openCell.bombed || @locked

    @opened += 1
    return @clear() if @must == @opened

    if openCell.countBombsAround() == 0
      _.each(@around(openCell), (aroundCell)-> aroundCell.open())
    true

  openAround: (cell)->
    _.each(@around(cell), (aroundCell)-> aroundCell.open())

  positionCell: (position) ->
    @cells[position]

  time: ->
    return if @locked
    @passed = _.floor((+new Date() - @start) / 1000)

  rest: ->
    @bombs.length - @flagged