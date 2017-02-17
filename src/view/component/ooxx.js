import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Spin } from 'antd';
import Jpicbox from './picBox';
import Waypoint from 'react-waypoint';

@inject("stateM") @observer
export default class Jooxx extends Component{
  render(){
    const {stateM} = this.props;

    return (
      <Row gutter={24}>
        {stateM.ooxxNum > 0 ? stateM.ooxx.map(
          (state) =>
            <Col span="8">
              <Jpicbox state={state} key={state._id} />
            </Col>
          ) : console.log('no DATA!')}
          <Waypoint onEnter={() => stateM.loadMore('ooxx')}>
            <div className="loader-bottom">
              <Spin/>
            </div>
          </Waypoint>
      </Row>
    )
  }
}
