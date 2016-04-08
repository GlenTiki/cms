import React, { Component } from 'react'
import {OverviewItemEditor} from './itemEditors/overviewItemEditor.js'
var templateBuilder = require('./templateBuilder')
var createOverviewSection = templateBuilder.createOverviewSection

export class EventEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      event: this.props.event
    }
  }

  componentWillReceiveProps(next) {
    this.setState({event: next.event})
  }

  getValue () {
    return this.state.event
  }

  handleNameChange (e) {
    var value = e.target.value
    var next = this.state.event
    next.name = value
    next.nameLowercase = value.toLowerCase()
    next.overview.data[0].text = value
    this.setState({event: next})
  }

  handleSubtitleChange (e) {
    var value = e.target.value
    var next = this.state.event
    next.overview.data[1].text = value
    this.setState({event: next})
  }

  addOverviewSection () {
    var event = this.state.event
    event.overview.data.push(createOverviewSection(event.overview.data.length))
    this.setState({event: event})
  }

  deleteOverviewSection () {
    var event = this.state.event
    if (event.overview.data.length > 2)
      event.overview.data.pop()
    this.setState({event: event})
  }

  handleOverviewMetaChange (e) {
    var next = this.state.event.overview.meta
    next.css = this.refs['overviewMetaCss'].value
    next.style = this.refs['overviewMetaCss'].value
    var event = this.state.event
    event.overview.meta = next
    this.setState({event: event})
  }

  render () {
    var that = this
    var event = this.state.event

    var titleEditor = (
      <label>
        Title
        <input
          type="text"
          value={event.name}
          onChange={this.handleNameChange.bind(this)}
          />
      </label>
    )

    var subtitleEditor = (
      <label>
        SubTitle
        <input
          type="text"
          value={event.overview.data[1].text}
          onChange={this.handleSubtitleChange.bind(this)}
          />
      </label>
    )

    var overviewMeta = event.overview.meta
    var overviewMetaEditor = (
      <div>
        <label>
          Meta
        </label>
        <input
          ref="overviewMetaCss"
          type="text"
          placeholder="css"
          value={event.overview.meta.css}
          onChange={this.handleOverviewMetaChange.bind(this)}
          />
        <input
          ref="overviewMetaStyle"
          type="text"
          value={event.overview.meta.style}
          placeholder="style"
          onChange={this.handleOverviewMetaChange.bind(this)}
          />
        </div>
    )

    var overviewItems = this.state.event.overview.data.slice()
    overviewItems.splice(0, 2)

    var overviewNodes =  overviewItems.map(function (n, i) {
      var handleOverviewTextChange = function (e) {
        var next = n
        next.key = that.refs['onkey'+i].value
        next.value = that.refs['onvalue'+i].value
        next.text = `<span style='font-size:2em'>${next.key}:</span> ${next.value}`
        next.css = that.refs['oncss'+i].value
        next.style = that.refs['onstyle'+i].value
        var event = that.state.event
        event.overview.data[i+2] = next
        that.setState({event: event})
      }

      if(!n.key || !n.value) {
        var parser = new DOMParser()
        var htmlDoc=parser.parseFromString(n.text, "text/html")
        var span = htmlDoc.querySelector('span')
        var body = htmlDoc.querySelector('body').innerHTML
        var key = span.innerHTML.replace(':', '')
        var value = body.replace(span.outerHTML, '')
        n.key = key
        n.value = value
      }

      return (
        <div key={i} className="callout">
          <input
            ref={'onkey'+i}
            type="text"
            value={n.key}
            onChange={handleOverviewTextChange}
            placeholder="Label"
            />

          <input
            ref={'onvalue'+i}
            type="text"
            value={n.value}
            onChange={handleOverviewTextChange}
            placeholder="details"
            />

          <input
            ref={'oncss'+i}
            type="text"
            value={n.css}
            onChange={handleOverviewTextChange}
            placeholder="css"
            />

          <input
            ref={'onstyle'+i}
            type="text"
            value={n.style}
            onChange={handleOverviewTextChange}
            placeholder="style"
            />
          </div>
        )
    })

    return (
      <div>
        <h2> Overview Section </h2>
        <div className="callout">
          {titleEditor}
          {subtitleEditor}
          {overviewMetaEditor}
        </div>
        <div className="row">
          {/*Now, allow variable numbers of fields...*/}
          <button type="button" className="success button" style={{float:'right'}} onClick={ this.addOverviewSection.bind(this) } > + </button>
          <button type="button" className="alert button" style={{float:'right'}} onClick={ this.deleteOverviewSection.bind(this) } > - </button>
          <h3 style={{float:'right'}}>Modify Overview Details:</h3>
        </div>
        { overviewNodes }
      </div>
    )
  }
}
