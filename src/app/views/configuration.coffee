module.exports = Configuration = React.createClass(
  mixins: [Arda.mixin]
  render: ->
    ce { $el: 'div', $cn: 'container conf-page', $inc: [
      ce { $el: 'div', $cn: 'col-sm-offset-4 col-sm-4', $inc: [
        ce { $el: 'h1', $cn: 'conf-page title', $inc: 'プリセット' }
        ce { $el: 'ul', $cn: 'conf-page preset-games', $inc: [
          ce { $el: App.View.Preset, model: { name: '初級', dat: { width: 9, height: 9, bombs: 10 } } }
          ce { $el: App.View.Preset, model: { name: '中級', dat: { width: 16, height: 16, bombs: 40 } } }
          ce { $el: App.View.Preset, model: { name: '上級', dat: { width: 30, height: 16, bombs: 99 } } }
        ] }
        ce { $el: 'h1', $cn: 'conf-page title', $inc: 'フリースタイル' }
        ce { $el: 'form', $cn: 'conf-page free-style conf-page', $inc: [
          ce { $el: 'div', $cn: 'row form-group', $inc: [
            ce { $el: 'label', $cn: 'col-sm-1 control-label conf-page', $inc: '横' }
            ce { $el: 'div', $cn: 'col-sm-3', $inc: [
              ce { $el: 'input', $cn: 'form-control conf-page', ref: 'width', value: 5, onClick: @onClick }
            ] }
            ce { $el: 'label', $cn: 'col-sm-1 control-label conf-page', $inc: '横' }
            ce { $el: 'div', $cn: 'col-sm-3', $inc: [
              ce { $el: 'input', $cn: 'form-control conf-page', ref: 'height', value: 4, onClick: @onClick }
            ] }
            ce { $el: 'label', $cn: 'col-sm-1 control-label conf-page', $inc: [
              ce { $el: App.View.Fa, icon: 'bomb', fixedWidth: true }
            ] }
            ce { $el: 'div', $cn: 'col-sm-3', $inc: [
              ce { $el: 'input', $cn: 'form-control conf-page', ref: 'bombs', value: 4, onClick: @onClick }
            ] }
          ] }
          ce { $el: 'button', $cn: 'btn btn-success conf-page wide', onClick: @onClickFreeStyle, $inc: 'スタート' }
        ] }
      ] }
    ] }
  onClickFreeStyle: (e)->
    e.preventDefault()
    @dispatch 'freestyle', {
      width: React.findDOMNode(@refs.width).value
      height: React.findDOMNode(@refs.height).value
      bombs: React.findDOMNode(@refs.bombs).value
    }
)