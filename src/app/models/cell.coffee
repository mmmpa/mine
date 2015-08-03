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

    flagged: ->
      @state == @status.flag

    openAround: ->
      return if @table.locked
      @table.openAround(@) if @opened && @countBombsAround() == @countFlagsAround()

    rotateMode: ->
      return if @opened || @table.locked
      @state = switch @state
        when @status.none
          @table.flag(true)
          @status.flag
        when @status.flag
          @table.flag(false)
          @status.question
        when @status.question
          @status.none

    open: =>
      return if @table.locked
      return true if @opened || @state != @status.none
      @opened = true
      @state == @status.open
      @table.open(@)
