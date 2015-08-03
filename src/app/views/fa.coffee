module.exports =
  Fa = React.createClass (
    render: ->
      classes = ['fa']
      classes.push("fa-#{@props.icon}")
      classes.push("fa-#{@props.scale}x") if @props.scale?
      classes.push('fa-fw') if @props.fixedWidth?
      classes.push('fa-li') if @props.list?
      classes.push('fa-border') if @props.border?
      classes.push("fa-pull-#{@props.pull}") if @props.pull?
      classes.push("fa-#{@props.animation}") if @props.animation?
      classes.push("fa-rotate-#{@props.rotate}") if @props.rotate?
      classes.push("fa-flip-#{@props.animation}") if @props.flip?

      ce { $el: 'i', $cn: classes.join(' ') }
  )
