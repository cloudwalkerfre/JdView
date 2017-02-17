import React, { Component } from 'react';
import { Icon } from 'antd';
const remote = window.require("electron").remote;

export default class Jtitle extends Component{
  minimizeHandler(){
    remote.getCurrentWindow().minimize();
  }

  closeHandler(){
    remote.getCurrentWindow().close();
  }

  render(){
    // const {state} = this.props;
    // console.log(state);
    return (
      <div className="titlebar">
        <div id="title" >{this.props.title}</div>
        <Icon className="titlebar_icon" type="minus" id="minimize" onClick={this.minimizeHandler} />
        <Icon className="titlebar_icon" type="close" id="close" onClick={this.closeHandler} />
      </div>
    )
  }
}
