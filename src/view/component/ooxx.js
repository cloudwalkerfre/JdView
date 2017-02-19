import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'antd';
import Jpicbox from './picBox';
import JloadMore from './loadMore';

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
        <JloadMore loadMoreType='ooxx' stateM={stateM} />
      </Row>
    )
  }
}
