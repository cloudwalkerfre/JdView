import React, { Component } from 'react';

export default class JdetailPage extends Component{
  constructor(props) {
    super(props);

    const id = this.props.params.id;
    const ipcRenderer = window.require('electron').ipcRenderer;

    this.state = {
      __html: ipcRenderer.sendSync('synchronous-message', ['detailPage', id])
    }
    // console.log(this.state.msg);
  }

  render(){
    return (
      <div className='detailPage' dangerouslySetInnerHTML={this.state}/ >
    )
  }
}
