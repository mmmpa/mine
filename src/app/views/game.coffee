module.exports = Game = React.createClass(
  mixins: [Arda.mixin]
  render: ->
    ce { $el: 'div', $inc: [
      ce { $el: 'div', $cn: 'container', $inc: [
        ce { $el: 'div', $cn: 'col-sm-offset-3 col-sm-6 game-page clearfix', $inc: [
          ce { $el: 'div', $cn: 'col-sm-5 game-page time', $inc: [
            @props.config.passed
          ] }
          ce { $el: 'div', $cn: 'col-sm-2 game-page restart', $inc: [
            ce { $el: 'button', $cn: "btn btn-#{@buttonColor()} game-page wide", onClick: @onClickRestart, $inc: [
              ce { $el: App.View.Fa, icon: @buttonFace(), scale: 2 }
            ] }
          ] }
          ce { $el: 'div', $cn: 'col-sm-5 game-page rest', $inc: [
            @props.config.rest()
          ] }
        ] }
      ] }
      ce { $el: 'div', $cn: 'clearfix', $inc: [
        ce { $el: App.View.Table, model: @props.config }
      ] }
      ce { $el: 'div', $cn: 'container game-page bottom-area', $inc: [
        ce { $el: 'button', $cn: 'btn btn-success conf-page', onClick: @onClickBack, $inc: [
          ce { $el: App.View.Fa, icon: 'chevron-circle-left' }
          ' もどる'
        ] }
      ] }
    ] }

  componentDidMount: ->
    @sid = setInterval((=>
      @dispatch 'timer'
    ), 1000)

  componentWillUnmount: ->
    clearInterval(@sid)

  onClickRestart: (e)->
    e.preventDefault()
    @dispatch 'restart'

  onClickBack: (e)->
    e.preventDefault()
    @dispatch 'back'

  buttonFace: ->
    switch @props.config.state
      when @props.config.status.play
        'meh-o'
      when @props.config.status.clear
        'smile-o'
      when @props.config.status.die
        'frown-o'

  buttonColor: ->
    switch @props.config.state
      when @props.config.status.play
        'default'
      when @props.config.status.clear
        'primary'
      when @props.config.status.die
        'danger'
)
