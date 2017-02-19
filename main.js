import { app, BrowserWindow } from 'electron';
import path from 'path';
import Datastore from "nedb";
import crawler from './server/crawler';
import {ipcMain} from 'electron';

const CL = new crawler();

/*
  nedb need to be setup in main
  DB: 文章、无聊图、妹子图

  db与render，要么通过koa走一个本地server，做一个restAPI通信，
  要么直接用electron内置的ipc通信
*/
const db = {};

db.page = new Datastore({filename: getDatabasePath('page'), autoload: true});
db.pic = new Datastore({filename: getDatabasePath('pic'), autoload: true});
db.ooxx = new Datastore({filename: getDatabasePath('ooxx'), autoload: true});

/*
  ensureIndex 有一定的性能提升
*/
db.page.ensureIndex({ fieldName: '_id', unique: true }, function (err) {
  if(err) console.log(err)
});

db.pic.ensureIndex({ fieldName: '_id', unique: true }, function (err) {
  if(err) console.log(err)
});

db.ooxx.ensureIndex({ fieldName: '_id', unique: true }, function (err) {
  if(err) console.log(err)
});

function getDatabasePath(name){
  return path.join(__dirname, 'data', name + '.db');
}

// not palnning to build on win32, it's 2017 ....
// if (handleSquirrelCommand()) return;

let win = null;

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
console.log(process.env.NODE_ENV);

const shouldQuit = app.makeSingleInstance(function(otherInstArgv, otherInstWorkingDir){
  if(win != null){
    if(win.isMinimized()){
      win.restore();
    }
    win.focus();
  }
});

if(shouldQuit) app.quit();

function createWindow(){
  console.log('create Electron Window ...');
  // app.server = require('./server/app.js');

  CL.init(db);

  /*
    all the custom below is targeted on MAC, other platform never tested
  */
  win = new BrowserWindow(
    {
      useContentSize: true, width:1000, height: 680, backgroundColor: '#2e2c29', resizable: false, title: "JdView",
      frame: false, darkTheme: true, vibrancy: 'dark', scrollBounce: true, type: 'textured', fullscreen: false,

    }
  );
  win.loadURL('file://' + __dirname + '/index.html');
  // win.webContents.openDevTools();
  win.on('closed', () => { win = null;});

  /*
  set state through ipcMain
  */
  ipcMain.on('synchronous-message', (event, arg) => {
    // console.log(arg);

    // arg[0] is string, define type of action here, arg[1] is params
    switch (arg[0]) {
      case 'page':
        db.page.find({}).sort({date_group:-1, index:-1}).skip(arg[1]).limit(arg[2]).exec((err, doc) => {
          event.returnValue = doc;
        });
        // checking if need to update
        db.page.find({}).sort({date_group:-1, index:-1}).exec((err, doc) => {
          if(doc.length - arg[2] < 1.5 * (arg[2] - arg[1])){
            CL.crawlMore('page', db)
          }
        });
        break;

      case 'pic':
        db.pic.find({}).sort({_id:-1}).skip(arg[1]).limit(arg[2]).exec((err, doc) => {
          event.returnValue = doc;
        });
        db.pic.find({}).sort({_id:-1}).exec((err, doc) => {
          if(doc.length - arg[2] < 1.5 * (arg[2] - arg[1])){
            CL.crawlMore('pic', db)
          }
        });
        break;

      case 'ooxx':
        db.ooxx.find({}).sort({_id:-1}).skip(arg[1]).limit(arg[2]).exec((err, doc) => {
          event.returnValue = doc;
        });
        db.ooxx.find({}).sort({_id:-1}).exec((err, doc) => {
          if(doc.length - arg[2] < 1.5 * (arg[2] - arg[1])){
            CL.crawlMore('ooxx', db)
          }
        });
        break;

      case 'detailPage':
        CL.detailPage(arg[1]).then(res => {
          // console.log('res:', res[0]);
          event.returnValue = res;
        }).catch(e => {
          console.log(e);
        });
        break;
    }
  })
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform != 'darwin') app.quit();
});

app.on('active', () =>{
    if(win == null) createWindow();
})

// function handleSquirrelCommand() {
//     if (process.platform != 'win32') return false; // only applies to Windows (win32 is both 32- & 64-bit)
//
//     const command = process.argv[1];
//     const target = path.basename(process.execPath);
//
//     switch (command) {
//         case '--squirrel-install':
//         case '--squirrel-updated':
//             update(['--createShortcut=' + target + ''], app.quit);
//             return true;
//         case '--squirrel-uninstall':
//             update(['--removeShortcut=' + target + ''], app.quit);
//             return true;
//         case '--squirrel-obsolete':
//             app.quit();
//             return true;
//     }
//
//     return false;
// }

// function update(argsm, done){
//   const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
//   spawn(updateExe, args, { detached: true}).on('close', done);
// }
