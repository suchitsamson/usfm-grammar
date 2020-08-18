const http = require('http')
const fs = require('fs')
const formidable = require('formidable')
const grammar = require('usfm-grammar')

console.log('server up...listening to 8000')


var html_tmplt = ''

var usfm_val = '\\id HAB 45HABGNT92.usfm, Good News Translation, June 2003\n\\c 3\n\\s1 A Prayer of Habakkuk\n\\p\n\\v 1 This is a prayer of the prophet Habakkuk:\n\\b\n\\q1\n\\v 2 O \\nd Lord\\nd*, I have heard of what you have done,\n\\q2 and I am filled with awe.\n\\q1 Now do again in our times\n\\q2 the great deeds you used to do.\n\\q1 Be merciful, even when you are angry.'
var json_val = '{}'
var csv_val = ''
var tsv_val = ''
var rhs_error = ''
var lhs_error = ''
var selectedTab = 'toJSON'
var selectedScripture = 'A'
var selectedType= 'N'


fs.readFile('index.html', function (err, data) {
  if (err) {
    throw err
  }
  html_tmplt = data
})

http.createServer(function (req, res) {
  switch (req.url) {

    case '/':
      let html_data = eval('`' + html_tmplt + '`');
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(html_data)

      res.end()
      break

    case '/fileuploadUSFM':
      let form1 = new formidable.IncomingForm()
      form1.parse(req, function (err, fields, files) {
        if (err) { throw err }
        fs.readFile(files.filepath.path, 'utf-8', function (err, data) {
          if (err) { throw err }
          selectedTab = 'toJSON'
          if (data === '') {
            rhs_error = 'File Empty!!!'
          } else {
            usfm_val = data
            rhs_error = ''
            lhs_error = ''
          }
          let html_data = eval('`' + html_tmplt + '`');
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(html_data)

          res.end()

        })
      })
      break

    case '/fileuploadJSON':
      let form2 = new formidable.IncomingForm()
      form2.parse(req, function (err, fields, files) {
        if (err) { throw err }
        fs.readFile(files.filepath.path, 'utf-8', function (err, data) {
          if (err) { throw err }
          selectedTab = 'toJSON'
          if (data === '') {
            lhs_error = 'File Empty!!!'
          } else {
            json_val = data
            rhs_error = ''
            lhs_error = ''
          }
          let html_data = eval('`' + html_tmplt + '`');
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(html_data)

          res.end()

        })
      })
      break

    case '/convertJSON':
      if (global.gc) { global.gc(); }
      let form3 = new formidable.IncomingForm()
      form3.parse(req, function (err, fields, files) {
        if (err) { throw err }
        let data = fields.inputText
        usfm_val = data
        csv_val = ''
        tsv_val = ''
        rhs_error = ''
        lhs_error = ''
        selectedType = fields.parseType
        selectedScripture = fields.parseSelect
        selectedTab = 'toJSON'
        if (data === '') {
          rhs_error = 'Text Empty!!!'
        } else {
          let newParser, jsonOject
          try {
            if(fields.parseType == 'R')
              newParser = new grammar.USFMParser(data, grammar.LEVEL.RELAXED)
            else
              newParser = new grammar.USFMParser(data)

            if(fields.parseSelect == 'S')
              jsonOject = newParser.toJSON(grammar.FILTER.SCRIPTURE)
            else
              jsonOject = newParser.toJSON()

            if (jsonOject.ERROR){
              rhs_error = jsonOject.ERROR
              json_val = '{}'
            }
            else
              json_val = JSON.stringify(jsonOject, null, 4)
          }
          catch(error){
            rhs_error = error
            json_val = '{}'
          }
        }
        let html_data = eval('`' + html_tmplt + '`')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html_data)

        res.end()
      })
      break

    case '/convertUSFM':
      if (global.gc) { global.gc(); }
      let form4 = new formidable.IncomingForm()
      form4.parse(req, function (err, fields, files) {
        if (err) { throw err }
        let data = fields.inputTextJSON
        json_val = data
        selectedTab = 'toJSON'
        if (data === '') {
          lhs_error = 'Text Empty!!!'
          usfm_val = ''
        } else {
          try {
            const myJsonParser = new grammar.JSONParser(JSON.parse(data));
            usfm_val = myJsonParser.toUSFM();
          }
          catch(error){
            lhs_error = error
            usfm_val = ''
          }
        }
        let html_data = eval('`' + html_tmplt + '`')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html_data)

        res.end()
      })
      break

    case '/convertCSV':
      if (global.gc) { global.gc(); }
      selectedTab = 'toCSV'
      if (csv_val == '') {
        let form5 = new formidable.IncomingForm()
        form5.parse(req, function (err, fields, files) {
          if (err) { throw err }
          let data = fields.inputTextCSV
          usfm_val = data
          if (data === '') {
            rhs_error = 'Text Empty!!!'
          } else {
            try {
              let newParser = new grammar.USFMParser(data)
              let csvOject = newParser.toCSV()
              if (csvOject.ERROR)
                rhs_error = csvOject.ERROR
              else
                csv_val = csvOject
            }
            catch(error){
              rhs_error = error
            }
          }

          let html_data = eval('`' + html_tmplt + '`')
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(html_data)

          res.end()
        })
      } else {
        let html_data = eval('`' + html_tmplt + '`')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html_data)

        res.end()
      }
      break

    case '/convertTSV':
      if (global.gc) { global.gc(); }
      selectedTab = 'toTSV'
      if (tsv_val == '') {
        let form6 = new formidable.IncomingForm()
        form6.parse(req, function (err, fields, files) {
          if (err) { throw err }
          let data = fields.inputTextTSV
          usfm_val = data
          if (data === '') {
            rhs_error = 'Text Empty!!!'
          } else {
            try {
              let newParser = new grammar.USFMParser(data)
              let tsvOject = newParser.toTSV()
              if (tsvOject.ERROR)
                rhs_error = tsvOject.ERROR
              else
                tsv_val = tsvOject
            }
            catch(error){
              rhs_error = error
            }
          }
          let html_data = eval('`' + html_tmplt + '`')
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(html_data)

          res.end()
        })
      } else {
        let html_data = eval('`' + html_tmplt + '`')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(html_data)

        res.end()
      }
      break

    case '/json-viewer/jquery.json-viewer.js':
      fs.readFile('json-viewer/jquery.json-viewer.js', function (err, data) {
        if (err) {
          throw err
        }
        res.writeHead(200, { 'Content-Type': 'text/javascript' })
        res.write(data)
        res.end()
      })
      break

    case '/json-viewer/jquery.json-viewer.css':
      fs.readFile('json-viewer/jquery.json-viewer.css', function (err, data) {
        if (err) {
          throw err
        }
        res.writeHead(200, { 'Content-Type': 'text/css' })
        res.write(data)
        res.end()
      })
      break

    case '/img/bcs_logo.png':
      fs.readFile('img/bcs_logo.png', function (err, data) {
        if (err) {
          throw err
        }
        res.writeHead(200, { 'Content-Type': 'image/png' })
        res.write(data)
        res.end()
      })
      break
    
    case '/ui/usfm-grammar.js':
      fs.readFile('ui/usfm-grammar.js', function (err, data) {
        if (err) {
          throw err
        }
        res.writeHead(200, { 'Content-Type': 'text/javascript' })
        res.write(data)
        res.end()
      })
      break
    
    case '/ui/usfm-grammar.css':
      fs.readFile('ui/usfm-grammar.css', function (err, data) {
        if (err) {
          throw err
        }
        res.writeHead(200, { 'Content-Type': 'text/css' })
        res.write(data)
        res.end()
      })
      break

    default:
      res.writeHead(404)
      res.write('<center><h1>Wrong URL!!!</h1></center>')
      res.end()
  }
}).listen(8000)
