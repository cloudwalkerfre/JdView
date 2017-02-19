import { observable, computed, action } from 'mobx';
const ipcRenderer = window.require('electron').ipcRenderer;

const preRequestNumber = 50;
let cumus = {page: preRequestNumber/2, pic: preRequestNumber, ooxx: preRequestNumber};

class stateManager{
  @observable.shallow page = [];
  @observable.shallow pic = [];
  @observable.shallow ooxx = [];

  constructor(){

    let msg = [
      ipcRenderer.sendSync('synchronous-message', ['page', 0, preRequestNumber/2]), // 文章数本身少，初始化比图少一点
      ipcRenderer.sendSync('synchronous-message', ['pic', 0, preRequestNumber]),
      ipcRenderer.sendSync('synchronous-message', ['ooxx', 0, preRequestNumber])
    ];

    msg[0].forEach((i) => {
      if(this.page.indexOf(i) === -1){
        this.page.push(i);
      }
    });
    msg[1].forEach((i) => {
      if(this.pic.indexOf(i) === -1){
        this.pic.push(i);
      }
    });
    msg[2].forEach((i) => {
      if(this.ooxx.indexOf(i) === -1){
        this.ooxx.push(i);
      }
    });
  }
  @action loadMore(type){
    // console.log('loadmore...', cumus[type], preRequestNumber);
    let lres = ipcRenderer.sendSync('synchronous-message', [type, cumus[type], cumus[type] + preRequestNumber]);
    cumus[type] += lres.length;
    switch (type) {
      case 'page':
        lres.forEach(i => {
          if(this.page.indexOf(i) === -1)
            this.page.push(i);
        });
        break;
      case 'pic':
        lres.forEach(i => {
          if(this.pic.indexOf(i) === -1)
            this.pic.push(i);
        });
        break;
      case 'ooxx':
        lres.forEach(i => {
          if(this.ooxx.indexOf(i) === -1)
            this.ooxx.push(i);
        });
        break;
    }
  }
  @computed get pageNum(){
    return this.page.length;
  }
  @computed get ooxxNum(){
    return this.ooxx.length;
  }
  @computed get picNum(){
    return this.pic.length;
  }
}

export default stateManager;
