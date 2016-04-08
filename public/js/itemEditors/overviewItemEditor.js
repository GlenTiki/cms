import React, { Component } from 'react'

export class OverviewItemEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: this.props.item
    }
  }

  componentWillReceiveProps(next) {
    this.setState(next)
  }

  getValue () {
    return this.state.event
  }

  handleTextChange (e) {
    var value = e.target.value
    var next = this.state.item
    next.key = this.refs.key.value
    next.value = this.refs.value.value
    next.text = `<span style='font-size:2em'>${this.refs.key}:</span> ${this.refs.value}`
    this.setState({item: next})
  }

  render () {
    return (
      <div>
        <input
          ref='key'
          type="text"
          value={this.state.item.key}
          onChange={this.handleTextChange.bind(this)}
          />
        <input
          ref='value'
          type="text"
          value={this.state.item.value}
          onChange={this.handleTextChange.bind(this)}
          />
      </div>
    )
  }
}
