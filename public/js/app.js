import React, { Component } from 'react'
import {default as PrettyDebug}  from  './prettyDebug.js'
import { EventEditor }  from  './eventEditor.js'

var request = require('superagent')
var templateBuilder = require('./templateBuilder')
var createEvent = templateBuilder.createEvent

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      original: [],
      currentlyViewing: -1
    }

    // // Bind callback methods to make `this` the correct context.
    // this.onRadChange = this.onRadChange.bind(this);
  }

  componentDidMount () {
    var that = this
    request
      .get('/data')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        that.setState({results: res.body.results, original: res.body.results}, function () {
          if(that.state.results.length > 0)
            that.setState({ currentlyViewing: that.state.results[0].id })
        })
      })
  }

  uploadSeminar () {
    var original = this.state.original

    var i = original.findIndex((e) => e.id == this.state.currentlyViewing)

    if (i > -1) original[i] = this.refs.editor.getValue()
    else original.push(this.refs.editor.getValue())

    var results = this.state.results
    results[results.findIndex((e) => e.id == this.state.currentlyViewing)] = this.refs.editor.getValue()

    request
      .post('/data')
      .send({ data: { results: original } })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err) this.setState({original: res.body.results, results: results}, this.reload)
      }.bind(this))
  }

  uploadAllSeminars () {
    var results = this.state.results // immutable data must be copied to mutate
    if(this.state.currentlyViewing > -1) // no need to update object which shouldn't exist
      results[results.findIndex((e) => e.id == this.state.currentlyViewing)] = this.refs.editor.getValue()

    request
      .post('/data')
      .send({ data: { results: results } })
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (!err) this.setState({original: res.body.results, results: results}, this.reload)
      }.bind(this))
  }

  reload () {
    var frame = this.refs.testframe.contentWindow.location.reload()
    this.refs.prettyDebug.onDataChange()
  }

  addMore () {
    //before change, update data structure
    var results = this.state.results // immutable data must be copied to mutate
    if(this.state.currentlyViewing > -1) results[results.findIndex((e) => e.id == this.state.currentlyViewing)] = this.refs.editor.getValue()

    var nextId = 0
    results.forEach((r) => nextId = r.id+1)
    results.push(createEvent(nextId))

    this.setState({results: results, currentlyViewing: nextId}, this.refs.prettyDebug.onDataChange)
  }

  deleteSeminar () {
    var nextId = -1
    this.state.results.some((e) => {
      if (e.id != this.state.currentlyViewing) {
        nextId = e.id
        return true
      }
    })
    var results = this.state.results
    results.splice(this.state.results.findIndex((e) => e.id == this.state.currentlyViewing), 1) //take it out
    this.setState({ results: results, currentlyViewing: nextId}, this.refs.prettyDebug.onDataChange)
  }

  onSelectChange (event) {
    //before change update, data structure
    var results = this.state.results
    results[results.findIndex((e) => e.id == this.state.currentlyViewing)] = this.refs.editor.getValue()
    this.setState({currentlyViewing: event.target.value, results: results}, this.refs.prettyDebug.onDataChange);
  }

  render () {
    var optionNodes = this.state.results.map(function(result) {
      return (
        <option value={result.id} key={result.id}>
          {result.name}
        </option>
      )
    })

    var chosenEvent = this.state.results.find((e) => e.id == this.state.currentlyViewing)
    return (
      <div>
        <div className="top-bar">
          <div className="top-bar-title"><h4>Data Editor</h4></div>
        </div>
        <div className="row">
          <div className="input-group">
            <span className="input-group-label">
              Edit Event:
            </span>
            <select value={this.state.currentlyViewing} onChange={this.onSelectChange.bind(this)}  className="input-group-field">
            {optionNodes}
            </select>
            <div className="input-group-button">
              <input type="submit" className="button" value="add another event" onClick={ this.addMore.bind(this) } />
            </div>
          </div>
          {
            this.state.currentlyViewing > -1
            ? <EventEditor ref='editor' event={chosenEvent} />
            : <h2> Nothing to see here. try add a new event </h2>
          }
          <br/>
          <div className="row">
            <button type="button" className="success button" style={{float:'right'}} onClick={ this.uploadAllSeminars.bind(this) } > save all changes </button>
            {
              this.state.currentlyViewing > -1
              ? <div>
                  <button type="button" className="success button" style={{float:'right'}}  onClick={ this.uploadSeminar.bind(this) } > save changes to this </button>
                  <button type="button" className="alert button" style={{float:'right'}} onClick={this.deleteSeminar.bind(this) } > delete this seminar </button>
                </div>
              : false
            }
          </div>
          <PrettyDebug ref="prettyDebug" data={this.state.results} />
          <button type="button" className="button expanded" style={{float:'right'}} onClick={ this.reload.bind(this) } > reload </button>
          <iframe src="/cms" ref="testframe" style={{height: "600px", width: "100%", marginTop: '-13px'}}></iframe>
        </div>
      </div>
    )
  }
}
