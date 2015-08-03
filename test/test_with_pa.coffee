global._ = require 'lodash'
global.React = require 'react'
global.Promise = require 'bluebird'
global.Arda = require 'arda'

assert = require 'power-assert'
App = require '../src/app/index'

describe 'array', ->
  beforeEach ->
    @Table = App.Model.Table
  describe 'cellCount', ->
    it 'table.cells.length == 20', ->
      table = new @Table(5, 4)
      assert(eval(@test.title))
    it 'table.cells.length == 20', ->
      table = new @Table(5, 4)
      assert(eval(@test.title))
    it 'table1.cells.length == 20 && table2.cells.length == 24', ->
      table1 = new @Table(5, 4)
      table2 = new @Table(6, 4)
      assert(eval(@test.title))
  describe 'cellPosition1', ->
    it "cell.x == 2 && cell.y == 0", ->
      table1 = new @Table(5, 4)
      cell = table1.positionCell(2)
      assert(eval(@test.title))
  describe 'bombsManually', ->
    it "result == 4", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(0, 1, 2, 3)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      assert(eval(@test.title))
  describe 'bombsCheck', ->
    it "table.open(table.positionCell(7)) == false", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7)
      assert(eval(@test.title))
    it "result.join() == [false, false, false].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([7, 3, 19], (position)->
        table.open(table.positionCell(position))
      )
      assert(eval(@test.title))
    it "table.positionCell(7).open() == false", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7)
      assert(eval(@test.title))
    it "result.join() == [false, false, false].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([7, 3, 19], (position)->
        table.positionCell(position).open()
      )
      assert(eval(@test.title))
    it "result.join() == [true, true].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7)
      result = _.map([6, 8], (position)->
        table.positionCell(position).open()
      )
      assert(eval(@test.title))
    it "result.join() == [true, true, true, true, true].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7, 3, 19)
      result = _.map([6, 8, 2, 4, 18], (position)->
        table.positionCell(position).open()
      )
      assert(eval(@test.title))
  describe 'bombsCount', ->
    it "table.positionCell(1).countBombsAround() == 1", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(7)
      assert(eval(@test.title))
    it "[
        table.positionCell(0).countBombsAround(),
        table.positionCell(5).countBombsAround(),
        table.positionCell(10).countBombsAround(),
        table.positionCell(11).countBombsAround(),
        table.positionCell(12).countBombsAround(),
        table.positionCell(13).countBombsAround(),
        table.positionCell(14).countBombsAround(),
        table.positionCell(9).countBombsAround(),
        table.positionCell(4).countBombsAround()
      ].join() == [2, 2, 1, 2, 3, 2, 1, 2, 2].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(1, 2, 3, 6, 7, 8)

      assert(eval(@test.title))
    it "[
        table.positionCell(6).countBombsAround(),
        table.positionCell(12).countBombsAround(),
        table.positionCell(10).countBombsAround(),
        table.positionCell(18).countBombsAround()
      ].join() == [3, 4, 1, 2].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombManually(1, 7, 11, 17, 13)
      assert(eval(@test.title))
  describe 'bombs', ->
    it "table.cells.length == 20", ->
      table = new @Table(5, 4, 1)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      assert(eval(@test.title))
    it "result == 6", ->
      table = new @Table(5, 4, 6)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      assert(eval(@test.title))
    it "result == 18", ->
      table = new @Table(5, 4, 18)
      result = _.filter(table.cells, (cell)-> cell.bombed).length
      assert(eval(@test.title))
  describe 'around', ->
    it "result.join(',') == [1, 2, 3, 6, 7, 8, 11, 12, 13].join(',')", ->
      table = new @Table(5, 4)
      cell = table.cell(2, 1)
      result = _.map(table.around(cell), (cell)-> cell.position)
      assert(eval(@test.title))
    it "result.join(',') == [null, null, null, null, 0, 1, null, 5, 6].join(',')", ->
      table = new @Table(5, 4)
      cell = table.cell(0, 0)
      result = _.map(table.around(cell), (cell)-> cell?.position)
      assert(eval(@test.title))
    it "result.join(',') == [null, null, null, 3, 4, null, 8, 9, null].join(',')", ->
      table = new @Table(5, 4)
      cell = table.cell(4, 0)
      result = _.map(table.around(cell), (cell)-> cell?.position)
      assert(eval(@test.title))
