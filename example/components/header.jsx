"use strict";

var React = require('react');
var createReactClass = require('create-react-class');

var Header = createReactClass({
  render: function() {
    return (
      <header className="header">
        <h1 className="header__title">React Lazy Render</h1>
      </header>
    );
  }
});

module.exports = Header;
