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

    isBlank: ->
      @_counted == 0

    isSafe: ->
      not @_bomb

    isSafeNotBlank: ->
      not @_bomb && not @isBlank()

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
      return if @blankMap == cell.blankMap

      if @blankMap.length == 1
        @blankMap = cell.blankMap
        @blankMap.push(@)
      else if cell.blankMap == 1
        @blankMap.push(cell)
        cell.blankMap = @blankMap
      else
        for myCell in @blankMap
          cell.blankMap.push(myCell)
          myCell.blankMap = cell.blankMap
        @blankMap = cell.blankMap

    detectPaling: (cell)->
      if @isBlank()
        @palAround(cell)
      else
        @pal(cell)

    palAround: (cell)->
      return if @paled
      @paled = true

      d = @getDownCell()
      u = @getUpCell()
      l = @getLeftCell()
      r = @getRightCell()

      @pal(cell) if cell?
      @pal(l) if l?.paled
      @pal(r) if r?.paled
      @pal(d) if d?.paled
      @pal(u) if u?.paled

      if l?.isSafeNotBlank()
        l.pal(@)
        l.getUpCell()?.detectPaling(@)
        l.getDownCell()?.detectPaling(@)

      if r?.isSafeNotBlank()
        r.pal(@)
        r.getUpCell()?.detectPaling(@)
        r.getDownCell()?.detectPaling(@)

      if d?.isSafeNotBlank()
        d.pal(@)
        d.getLeftCell()?.detectPaling(@)
        d.getRightCell()?.detectPaling(@)

      if u?.isSafeNotBlank()
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
