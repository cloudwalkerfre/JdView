import React, { Component } from 'react';
import { Card } from 'antd';
import { lazyload } from 'react-lazyload';


@lazyload({
  once: true,
  offset: 200,
  overflow: true,
  width: 240,
  height: 260,
})
export default class Jpicbox extends Component{
  render(){
    const {state} = this.props;

    return (
      <Card className="picCard">
        <div className="custom-image">
          {state.img.org_src.map(
            (src) =>
              <img alt="example" width="100%" src={'http:' + src} />
          )}
        </div>
        <div className="custom-card">
          <h3>{state.title}</h3>
        </div>
      </Card>
    )
  }
}
