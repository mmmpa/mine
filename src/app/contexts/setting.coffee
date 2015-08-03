module.exports = class SettingContext extends Arda.Context
  component: React.createClass(
    render: ->
      ce { $el: App.View.Configuration, model: @props.config.table }
  )

  initState: (props) ->
    props

  expandComponentProps: (props, state) ->
    config: state.config

  delegate: (subscribe) ->
    super
    subscribe 'preset', (dat)=>
      @props.router.pushContext(App.Context.GameContext, {
        router: @props.router
        config: dat
      })
    subscribe 'freestyle', (dat)=>
      @props.router.pushContext(App.Context.GameContext, {
        router: @props.router
        config: dat
      })
