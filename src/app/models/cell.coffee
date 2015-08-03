module.exports =
  class Cell
    status:
      none: 'none'
      flag: 'flag'
      question: 'question'
    opened: false
    bombed: false
    state: null
    constructor: (@table, @x, @y) ->
      @position = @table.width * @y + @x
      @state = @status.none
    countBombsAround: =>
      @table.countBombsAround(@)
    rotateMode: ->
      @state = switch @state
        when @status.none
          @status.flag
        when @status.flag
          @status.question
        when @status.question
          @status.none
    open: =>
      return true if @opened
      @opened = true
      @table.open(@)
