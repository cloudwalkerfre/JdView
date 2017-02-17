import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Spin } from 'antd';
import Jpagebox from './pageBox';
import Waypoint from 'react-waypoint';

@inject("stateM") @observer
export default class Jpage extends Component{
  render(){
    const {stateM} = this.props;

    return (
      <Row gutter={24}>
        {stateM.pageNum > 0 ? stateM.page.map(
          (state) =>
            <Col span="8">
              <Jpagebox state={state} key={state._id} />
            </Col>
          ) : console.log('no DATA!')}
          <Waypoint onEnter={() => stateM.loadMore('page')}>
            <div className="loader-bottom">
              <Spin/>
            </div>
          </Waypoint>
      </Row>
    )
  }
}
