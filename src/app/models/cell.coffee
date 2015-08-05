module.exports =
  class Cell
    @status:
      none: 'none'
      flag: 'flag'
      question: 'question'
      open: 'open'
    state: null
    _counted: 0
    blankMap: null
    paled: false
    constructor: (@table, @x, @y) ->
      @blankMap = [@]
      @position = @table.width * @y + @x
      @state = Cell.status.none
      @_bomb = false

    addAroundBlankCell: (cell)->
      @blankMap.push(cell)

    countBombsAround: =>
      @_counted ?= @table.countBombsAround(@)

    countFlagsAround: =>
      @table.countFlagsAround(@)

    getDownCell: ->
      @table.getPointCell(@x, @y + 1)

    getLeftCell: ->
      @table.getPointCell(@x - 1, @y)

    getRightCell: ->
      @table.getPointCell(@x + 1, @y)

    getUpCell: ->
      @table.getPointCell(@x, @y - 1)

    hasBomb: ->
      @_bomb

    hasNoPal: ->
      @blankMap.length == 1

    incrementAroundBombsCount: ->
      @_counted += 1

    isSafe: ->
      not @_bomb

    isBlank: ->
      @_counted == 0

    isFlagged: ->
      @state == Cell.status.flag

    isOpened: ->
      @state == Cell.status.open

    isOpenable: ->
      not @isOpened() && @state != Cell.status.none

    installBomb: ->
      @_bomb = true
      @informBombExistence()

    informBombExistence: ->
      @table.informBombExistence(@)

    pal: (cell)->
      @blankMap = cell.blankMap
      @blankMap.push(@)

    detectPaling: (cell)->
      if @isBlank()
        @palAround(cell)
      else
        @pal(cell)

    palAround: (cell)->
      return if @paled
      @paled = true
      @pal(cell) if cell

      d = @getDownCell()
      u = @getUpCell()
      l = @getLeftCell()
      r = @getRightCell()

      if l?.isBlank()
        l.palAround(@)
      else if l?.isSafe()
        l.pal(@)
        l.getUpCell()?.detectPaling(@)
        l.getDownCell()?.detectPaling(@)

      if r?.isBlank()
        r.palAround(@)
      else if r?.isSafe()
        r.pal(@)
        r.getUpCell()?.detectPaling(@)
        r.getDownCell()?.detectPaling(@)

      if d?.isBlank()
        d.palAround(@)
      else if d?.isSafe()
        d.pal(@)
        d.getLeftCell()?.detectPaling(@)
        d.getRightCell()?.detectPaling(@)

      if u?.isBlank()
        u.palAround(@)
      else if u?.isSafe()
        u.pal(@)
        u.getLeftCell()?.detectPaling(@)
        u.getRightCell()?.detectPaling(@)

    open: ->
      return if @table.isLocked()
      return true if @isOpened() || @isOpenable()
      @state = Cell.status.open
      @table.open(@)

    openAround: ->
      return if @table.isLocked()
      @table.openAround(@) if @isOpened() && @countBombsAround() == @countFlagsAround()

    rotateMode: ->
      return if @isOpened() || @table.locked
      @state = switch @state
        when Cell.status.none
          Cell.status.flag
        when Cell.status.flag
          Cell.status.question
        when Cell.status.question
          Cell.status.none
      @table.computeRestBombsCount()

    uninstallBomb: ->
      @_bomb = false
