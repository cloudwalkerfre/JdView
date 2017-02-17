import { observable, computed, action } from 'mobx';
const ipcRenderer = window.require('electron').ipcRenderer;

const preRequestNumber = 30;
let cumus = {page: preRequestNumber, pic: preRequestNumber, ooxx: preRequestNumber};

class stateManager{
  @observable page = [];
  @observable pic = [];
  @observable ooxx = [];

  constructor(){

    let msg = [
      ipcRenderer.sendSync('synchronous-message', ['page', 0, preRequestNumber]),
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
    cumus[type] += preRequestNumber;
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
  // popBack(){
  //   this.states.pop();
  // }
}

export default stateManager;
