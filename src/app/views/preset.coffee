module.exports = Preset = React.createClass(
  mixins: [Arda.mixin]
  render: ->
    ce { $el: 'li', $cn: 'conf-page preset', $inc: [
      ce { $el: 'button', $cn: 'btn btn-primary conf-page wide', onClick: @onClick, $inc: @props.model.name }
    ] }

  onClick: (e)->
    e.preventDefault()
    @dispatch('preset', @props.model.dat)
)