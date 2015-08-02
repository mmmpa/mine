class EasyTestCase
  @start: (classes...)->
    _.flatten(for klass in classes
        for name, test of klass.tests
          result = test()
          if _.isArray(result)
            if result[0]
              console.log name, result...
            else
              console.error name, result...
          else
            if result
              console.log name, result
            else
              console.error name, result
    )
module.exports = EasyTestCase
