module.exports = App = {}
App.Context = require './context'
App.Model = require './model'
App.View = require './view'
App.EasyTestCase = require './test'


App.EasyTestCase.start(App.Model.Table)
