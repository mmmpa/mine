module.exports = class GameContext extends Arda.Context
  component: React.createClass(
    render: ->
      ce { $el: App.View.Game, config: @props.config }
  )

  initState: (props) ->
    props.table = @createTable(props.config)

  expandComponentProps: (props, state) ->
    config: props.table

  delegate: (subscribe) ->
    super
    subscribe 'cell:rightClick', (cell)=>
      cell.rotateMode()
      @update((state) => config: state.config)
    subscribe 'cell:leftClick', (cell)=>
      cell.open()
      @update((state) => config: state.config)
    subscribe 'cell:leftRightClick', (cell)=>
      cell.openAround()
      @update((state) => config: state.config)
    subscribe 'restart', =>
      @props.table = @createTable(@props.config)
      @update((state) => config: state.config)
    subscribe 'timer', =>
      @props.table.computeTime()
      @update((state) => config: state.config)
    subscribe 'back', =>
      @props.router.popContext()
  createTable: (dat)->
    new App.Model.Table(dat.width, dat.height, dat.bombs)