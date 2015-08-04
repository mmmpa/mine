module.exports = Game = React.createClass(
  mixins: [Arda.mixin]

  render: ->
    table = @props.config

    ce { $el: 'div', $inc: [
      ce { $el: 'h1', $cn: 'main-title', $inc: 'No Mines Land' }
      ce { $el: 'header', $cn: 'game-page header', $inc: [
        ce { $el: 'div', $cn: 'game-page time', $inc: [
          table.passedTime
        ] }
        ce { $el: 'div', $cn: 'game-page restart', $inc: [
          ce { $el: 'button', $cn: "btn btn-#{@detectColor()} game-page wide", onClick: @onClickRestart, $inc: [
            ce { $el: App.View.Fa, icon: @detectFace(), scale: 2 }
          ] }
        ] }
        ce { $el: 'div', $cn: 'game-page rest', $inc: [
          table.restBomsCount
        ] }
     ] }
      ce { $el: 'div', $cn: 'clearfix', $inc: [
        ce { $el: App.View.Table, model: @props.config }
      ] }
      ce { $el: 'footer', $cn: 'game-page footer', $inc: [
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

  detectColor: ->
    switch @props.config.state
      when App.Model.Table.status.play
        'default'
      when App.Model.Table.status.win
        'primary'
      when App.Model.Table.status.lose
        'danger'

  detectFace: ->
    switch @props.config.state
      when App.Model.Table.status.play
        'meh-o'
      when App.Model.Table.status.win
        'smile-o'
      when App.Model.Table.status.lose
        'frown-o'

  onClickBack: (e)->
    e.preventDefault()
    @dispatch 'back'

  onClickRestart: (e)->
    e.preventDefault()
    @dispatch 'restart'
)

