import React, { Component } from 'react';
import { Card } from 'antd';
import { browserHistory } from 'react-router';
import { lazyload } from 'react-lazyload';


@lazyload({
  once: true,
  offset: 200,
  height: 260,
  width: 240,
  overflow: true
})
export default class Jpagebox extends Component{
  handleClick(e){
    browserHistory.push('detail/' + window.btoa(e));
  }
  render(){
    const {state} = this.props;

    return (
      <Card className="pageCard" onClick={() => this.handleClick(state._id)}>
        <div className="custom-image">
          <img alt="example" width="100%" src={state.img} />
        </div>
        <div className="custom-card">
          <h3>{state.title}</h3>
          <p>{state.bref}</p>
        </div>
      </Card>
    )
  }
}
