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
    it 'table._cells.length == 20', ->
      table = new @Table(5, 4)
      assert(eval(@test.title))
      
    it 'table._cells.length == 20', ->
      table = new @Table(5, 4)
      assert(eval(@test.title))
    
    it 'table1._cells.length == 20 && table2._cells.length == 24', ->
      table1 = new @Table(5, 4)
      table2 = new @Table(6, 4)
      assert(eval(@test.title))

  describe 'cellPosition1', ->
    it "cell.x == 2 && cell.y == 0", ->
      table1 = new @Table(5, 4)
      cell = table1.getPositionCell(2)
      assert(eval(@test.title))

  describe 'bombsManually', ->
    it "result == 4", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(0, 1, 2, 3)
      result = _.filter(table._cells, (cell)-> cell.hasBomb()).length
      assert(eval(@test.title))

  describe 'bombsCheck', ->
    it "table.getPositionCell(7).hasBomb() == true", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(7)
      assert(eval(@test.title))

    it "result.join() == [true, true, true].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(7, 3, 19)
      result = _.map([7, 3, 19], (position)->
        table.getPositionCell(position).hasBomb()
      )
      assert(eval(@test.title))

  describe 'bombsCount', ->
    it "table.getPositionCell(1).countBombsAround() == 1", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(7)
      assert(eval(@test.title))
    it "[
        table.getPositionCell(0).countBombsAround(),
        table.getPositionCell(5).countBombsAround(),
        table.getPositionCell(10).countBombsAround(),
        table.getPositionCell(11).countBombsAround(),
        table.getPositionCell(12).countBombsAround(),
        table.getPositionCell(13).countBombsAround(),
        table.getPositionCell(14).countBombsAround(),
        table.getPositionCell(9).countBombsAround(),
        table.getPositionCell(4).countBombsAround()
      ].join() == [2, 2, 1, 2, 3, 2, 1, 2, 2].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(1, 2, 3, 6, 7, 8)

      assert(eval(@test.title))
    it "[
        table.getPositionCell(6).countBombsAround(),
        table.getPositionCell(12).countBombsAround(),
        table.getPositionCell(10).countBombsAround(),
        table.getPositionCell(18).countBombsAround()
      ].join() == [3, 4, 1, 2].join()", ->
      table = new @Table(5, 4, 1)
      table.installBombsManually(1, 7, 11, 17, 13)
      assert(eval(@test.title))
  describe 'bombs', ->
    it "table._cells.length == 20", ->
      table = new @Table(5, 4, 1)
      result = _.filter(table._cells, (cell)-> cell.hasBomb()).length
      assert(eval(@test.title))
    it "result == 6", ->
      table = new @Table(5, 4, 6)
      result = _.filter(table._cells, (cell)-> cell.hasBomb()).length
      assert(eval(@test.title))
    it "result == 18", ->
      table = new @Table(5, 4, 18)
      result = _.filter(table._cells, (cell)-> cell.hasBomb()).length
      assert(eval(@test.title))
  describe 'around', ->
    it "result.join(',') == [1, 2, 3, 6, 7, 8, 11, 12, 13].join(',')", ->
      table = new @Table(5, 4)
      cell = table.getPointCell(2, 1)
      result = _.map(table.getAroundCells(cell), (cell)-> cell.position)
      assert(eval(@test.title))
    it "result.join(',') == [0, 1, 5, 6].join(',')", ->
      table = new @Table(5, 4)
      cell = table.getPointCell(0, 0)
      result = _.map(table.getAroundCells(cell), (cell)-> cell?.position)
      assert(eval(@test.title))
    it "result.join(',') == [3, 4, 8, 9].join(',')", ->
      table = new @Table(5, 4)
      cell = table.getPointCell(4, 0)
      result = _.map(table.getAroundCells(cell), (cell)-> cell?.position)
      assert(eval(@test.title))
