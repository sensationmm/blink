import React, { Component } from 'react';

/**
 * componentMock
 * Dummy component for tests
 * @param {object} props - props object (for jsdoc)
 * @return {JSXElement} componentMock
 */
class componentMock extends Component {
  constructor(props) {
    super(props);
    this.init = null;
  }
  render() {
    return (
      <div>Hi</div>
    );
  }
}

export default componentMock;
