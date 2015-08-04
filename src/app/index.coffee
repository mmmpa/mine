module.exports = App = {}
if window?
  window.App = App
  window.ce = (args...)->
    App.Util.ce(args...)

else
  global.App = App
  global.ce = (args...)->
    App.Util.ce(args...)

App.Context = require './context'
App.Util = require './util'
App.Model = require './model'
App.View = require './view'

console.log 'a'

App.start = (node)->
  router = new Arda.Router(Arda.DefaultLayout, node)
  router.pushContext(App.Context.SettingContext, { router: router })
