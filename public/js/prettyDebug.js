import React from 'react'
var Inspector = require('react-json-inspector')

export default React.createClass({
    style: {
        display: 'block',
        textAlign: 'left',
        backgroundColor: '#1f4662',
        color: '#fff',
        fontSize: '12px',
        width: "100%",
        marginBottom: "20px"
    },

    headerStyle: {
        backgroundColor: '#193549',
        padding: '5px 10px',
        fontFamily: 'monospace',
        color: '#ffc600',
    },

    getInitialState: function() {
        return {
            show: false,
        };
    },

    onDataChange: function (cb) {
      if (this.isMounted()) {
        // dirty hack because inspector isn't updating on a deep data update.
        this.setState({ show: !this.state.show }, () => this.setState({ show: !this.state.show }, cb))
      }
    },

    toggle: function () {
        this.setState({
            show: !this.state.show,
        });
    },

    render: function () {
        return (
            <div style={this.style}>
                <div style={this.headerStyle} onClick={ this.toggle }>
                    <strong>{this.state.show ? "Click to hide state" : "Click to show state"}</strong>
                </div>
                { this.state.show ? <Inspector data={this.props.data} search={false}/> : false }
            </div>
        );
    }
});
