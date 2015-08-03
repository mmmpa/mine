module.exports = Context = {}

ce = (args...)->
  App.Util.ce(args...)

init = =>
  Context.WallContext = WallContext

class WallContext extends Arda.Context
  component: React.createClass(
    render: ->
      ce { $el: App.View.Table, model: @props.config.table}
  )

  initState: (props) ->
    props

  expandComponentProps: (props, state) ->
    config: state.config

  delegate: (subscribe) ->
    super
    subscribe 'context:created', -> console.log 'created'
    subscribe 'cell:rightClick', (cell)=>
      cell.rotateMode()
      @update((state) => config: state.config)
init()