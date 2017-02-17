// import DevTools from 'mobx-react-devtools';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Layout } from 'antd';

import Jtab from '../tab/tab_icon';
import Jtitle from '../titlebar/titlebar';

const { Sider, Header, Content } = Layout;

@observer
export default class Container extends Component{
  constructor(props) {
    super(props);

    this.state = {
        showTitileBar: 'none',
    };
  }

  positionRN(e){
    // console.log(e.pageX, e.pageY);
    if(e.pageY < 30){
      this.setState({showTitileBar: 'block'})
    }else{
      this.setState({showTitileBar: 'none'})
    }
  }

  render(){
    const { main } = this.props;

    return(
      <Layout style={{height:680}} onMouseMove={this.positionRN.bind(this)}>
        {/* 隐藏标题栏 */}
        <Header style={{height:20, display:this.state.showTitileBar}}>
          <Jtitle title='JdView' />
        </Header>
        <Layout>
          {/* 侧边栏 */}
          <Sider collapsed={true} className='Jside'>
            <Jtab />
          </Sider>
          <Layout className='Jmain'>
            {/* Content正文 */}
            <Content>
              {main}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
