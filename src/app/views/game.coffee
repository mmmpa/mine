module.exports = Game = React.createClass(
  mixins: [Arda.mixin]
  render: ->
    table = @props.config
    ce { $el: 'div', $inc: [
      ce { $el: 'div', $cn: 'container', $inc: [
        ce { $el: 'div', $cn: 'col-sm-offset-3 col-sm-6 game-page clearfix', $inc: [
          ce { $el: 'div', $cn: 'col-sm-5 game-page time', $inc: [
            table.passedTime
          ] }
          ce { $el: 'div', $cn: 'col-sm-2 game-page restart', $inc: [
            ce { $el: 'button', $cn: "btn btn-#{@buttonColor()} game-page wide", onClick: @onClickRestart, $inc: [
              ce { $el: App.View.Fa, icon: @buttonFace(), scale: 2 }
            ] }
          ] }
          ce { $el: 'div', $cn: 'col-sm-5 game-page rest', $inc: [
            table.restBomsCount
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
      when App.Model.Table.status.play
        'meh-o'
      when App.Model.Table.status.win
        'smile-o'
      when App.Model.Table.status.lose
        'frown-o'

  buttonColor: ->
    switch @props.config.state
      when App.Model.Table.status.play
        'default'
      when App.Model.Table.status.win
        'primary'
      when App.Model.Table.status.lose
        'danger'
)
