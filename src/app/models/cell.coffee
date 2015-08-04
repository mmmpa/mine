module.exports =
  class Cell
    @status:
      none: 'none'
      flag: 'flag'
      question: 'question'
      open: 'open'
    state: null

    constructor: (@table, @x, @y) ->
      @position = @table.width * @y + @x
      @state = Cell.status.none
      @_bomb = false

    countBombsAround: =>
      @_counted ?= @table.countBombsAround(@)

    countFlagsAround: =>
      @table.countFlagsAround(@)

    hasBomb: ->
      @_bomb

    isFlagged: ->
      @state == Cell.status.flag

    isOpened: ->
      @state == Cell.status.open

    isOpenable:->
      not @isOpened() && @state != Cell.status.none

    installBomb: ->
      @_bomb = true

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
