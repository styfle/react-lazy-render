"use strict";

var React = require('react');
var createReactClass = require('create-react-class');
var CodeSnippet = require('./code-snippet.jsx');

var Install = createReactClass({
  render: function() {
    return (
      <div className="install">
        <h2>Install</h2>
        <CodeSnippet language="bash" toggle={false}>
          npm install react-lazy-render
        </CodeSnippet>
      </div>
    );
  }
});

module.exports = Install;
