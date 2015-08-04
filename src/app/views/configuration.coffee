module.exports = Configuration = React.createClass(
  mixins: [Arda.mixin]

  initialState:
    width: 9
    height: 9
    bombs: 10

  getInitialState: ->
    @initialState

  render: ->
    ce { $el: 'div', $cn: 'container conf-page', $inc: [
      ce { $el: 'h1', $cn: 'main-title', $inc: 'No Mines Land' }
      ce { $el: 'h1', $cn: 'conf-page title', $inc: 'プリセット' }
      ce { $el: 'ul', $cn: 'conf-page preset-games', $inc: [
        ce { $el: App.View.Preset, preset: { name: '初級', dat: { width: 9, height: 9, bombs: 10 } } }
        ce { $el: App.View.Preset, preset: { name: '中級', dat: { width: 16, height: 16, bombs: 40 } } }
        ce { $el: App.View.Preset, preset: { name: '上級', dat: { width: 30, height: 16, bombs: 99 } } }
      ] }
      ce { $el: 'h1', $cn: 'conf-page title', $inc: 'フリースタイル' }
      ce { $el: 'ul', $cn: 'conf-page form-layout', $inc: [
        ce { $el: 'li', $cn: 'conf-page input-title-layout', $inc: [
          ce { $el: 'label', $cn: 'input-title conf-page', $inc: '横' }
        ] }
        ce { $el: 'li', $cn: 'conf-page input-layout', $inc: [
          ce { $el: 'input', $cn: 'form-control conf-page', ref: 'width', value: @state.width, onChange: @genOnChangeValue('width') }
        ] }
        ce { $el: 'li', $cn: 'conf-page input-title-layout', $inc: [
          ce { $el: 'label', $cn: 'input-title conf-page', $inc: '縦' }
        ] }
        ce { $el: 'li', $cn: 'conf-page input-layout', $inc: [
          ce { $el: 'input', $cn: 'form-control conf-page', ref: 'height', value: @state.height, onChange: @genOnChangeValue('height') }
        ] }
        ce { $el: 'li', $cn: 'conf-page input-title-layout', $inc: [
          ce { $el: 'label', $cn: 'input-title conf-page', $inc: [
            ce { $el: App.View.Fa, icon: 'bomb', fixedWidth: true }
          ] }
        ] }
        ce { $el: 'li', $cn: 'conf-page input-layout', $inc: [
          ce { $el: 'input', $cn: 'form-control conf-page', ref: 'bombs', value: @state.bombs, onChange: @genOnChangeValue('bombs') }
        ] }
      ] }
      ce { $el: 'button', $cn: 'btn btn-success conf-page wide', onClick: @onClickFreeStyle, $inc: 'スタート' }
    ] }

  genOnChangeValue: (target)->
    (e)=>
      state = {}
      value = +e.target.value

      state[target] = switch true
        when _.isNaN(value)
          @initialState[target]
        when value < 1
          @initialState[target]
        when _.isNumber(value)
          value
        else
          @initialState[target]

      @setState(state)

  onClickFreeStyle: (e)->
    e.preventDefault()
    @dispatch 'freestyle', {
      width: React.findDOMNode(@refs.width).value
      height: React.findDOMNode(@refs.height).value
      bombs: React.findDOMNode(@refs.bombs).value
    }
)