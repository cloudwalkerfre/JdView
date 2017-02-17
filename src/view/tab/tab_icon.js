import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon, Badge } from 'antd';
import { browserHistory} from 'react-router';

const SubMenu = Menu.SubMenu;
import imgSrc from './JdViewIcon.png';

@observer
class Jtab extends Component{
  handleClick(e){
    browserHistory.push(e.key);
  }
  render(){
    return (
      <Menu
        theme = 'dark'
        onClick = {this.handleClick}
        mode = 'inline'
        defaultSelectedKeys={['main']}
        >
          <Menu.Item key='logo'><image src={imgSrc} /></Menu.Item>
          <Menu.Item key='page' >
            <span>
              <Icon type = 'home'/>
              <span>主页  </span>
              <Badge status="success" />
            </span>
          </Menu.Item>
          <Menu.Item key='pic' ><Icon type = 'like-o'/>无聊图</Menu.Item>
          <Menu.Item key='ooxx' ><Icon type = 'heart-o'/>妹子图</Menu.Item>
          <Menu.Item key='video' ><Icon type="play-circle-o" />小视频</Menu.Item>
          <Menu.Item key='setting' ><Icon type="setting" />设置</Menu.Item>
        </Menu>
    )

  //   const {stateManager} = this.props;
  //   return(
  //     <div className='tab'>
  //       Jtab: {stateManager.stateNum}
  //       <button onClick={this.add.bind(this)}>ADD</button>
  //       <button onClick={this.delete.bind(this)}>DELETE</button>
  //     </div>
  //   )
  }
  // add = () => {
  //   this.props.stateManager.addNew(Math.random());
  // }
  // delete = () => {
  //   this.props.stateManager.stateNum > 0 ?
  //   this.props.stateManager.popBack() : null;
  // }
}

export default Jtab;
