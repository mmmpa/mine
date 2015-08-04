module.exports =
  class Cell
    status:
      none: 'none'
      flag: 'flag'
      question: 'question'
      open: 'open'
    opened: false
    bombed: false
    state: null
    counted: null

    constructor: (@table, @x, @y) ->
      @position = @table.width * @y + @x
      @state = @status.none

    countBombsAround: =>
      @counted ?= @table.countBombsAround(@)

    countFlagsAround: =>
      @table.countFlagsAround(@)

    isFlagged: ->
      @state == @status.flag

    isOpened: ->
      @opened

    isOpenable:->
      @state != @status.none
    hasBomb: ->
      @bombed

    openAround: ->
      return if @table.locked
      @table.openAround(@) if @opened && @countBombsAround() == @countFlagsAround()

    rotateMode: ->
      return if @opened || @table.locked
      @state = switch @state
        when @status.none
          @status.flag
        when @status.flag
          @status.question
        when @status.question
          @status.none
      @table.computeRestBombsCount()
      @state
    open: =>
      return if @table.isLocked()
      return true if @isOpened() || @isOpenable()
      @opened = true
      @state = @status.open
      @table.open(@)
