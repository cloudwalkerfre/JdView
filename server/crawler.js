// node-fetch遇到了不能解决的socket hang up错误，改用got
// import fetch from 'node-fetch';
import got from 'got';
// import FormData from 'form-data';
import cheerio from 'cheerio';
import dateFormat from 'dateformat';

// const form = new FormData();
const defaultMaxLookingBackNumber = 5;

/*
  爬取文章
*/
async function page(url, db){
  //--------------
  // console.log('starting', url);
  //--------------
  let date = new Date(/(\/\d+){3}/.exec(url)[0]).valueOf()/100000;
  let iter = 0;
  // 当天（date）的最后更新文章的index
  let cumu;
  // let data;

  // try {
    let data = await got(url).then(res => {return res.body});
  // } catch (e) {
  //   console.log(e);
  // }

  let $ = cheerio.load(data);
  // console.log(data);

  db.find({date_group: date}).sort({index:-1}).limit(1).exec(function(err, doc){
    cumu = (doc.length === 0 ? 0 : doc[0].index + 1);
  });

  $($('#content').find('.post ', 'f').get().reverse()).map(function(){
    let pit = {
      _id: $(this).find('h2').find('a').eq(0).attr('href'),
      title: $(this).find('h2').find('a[target="_blank"]').eq(0).text(),
      img: 'http:' + $(this).find('img').attr('data-original').replace(/square/, 'custom'),
      author: {
        name: $(this).find('a[href*="author"]').eq(0).text(),
        link: $(this).find('a[href*="author"]').eq(0).attr('href')
      },
      tag: $(this).find('a[rel="tag"]').eq(0).text(),
      bref: $(this).find('.indexs')[0].childNodes[5].data.trim(),
      date_group: date
    }

    db.find({ _id: pit._id}, (err, doc) => {
      if(doc.length === 0){
        pit.index = iter + cumu;
        iter++;

        db.insert(pit, (err) => {
          // console.log(err)
        });
      }
    });
    // return pit;
  });
}

/*
  爬取无聊图/妹子图
*/
async function pic(url, db){
  //--------------
  // console.log('starting', url);
  //--------------

  let data = await got(url).then(res => {return res.body});
  // console.log(data);


  let $ = cheerio.load(data);
  $('.commentlist').find('li[id^="comment"]').map(function(){
    let oA = [];
    let fA = [];
    let pit = {
  		_id : $(this).attr('id').replace('comment-', ''),
  		title : $(this).find('.text').find('p')[0].childNodes[0].data,
  		author:{
  			name: $(this).find('.author').find('strong').text(),
  			uid: $(this).find('.author').find('strong').attr('title')
      },
      img: {
        org_src : oA,
        fit_src : fA
      },
      ooxx:{
        oo: $(this).find('.text').find('span[id^=cos_support]').text(),
        xx: $(this).find('.text').find('span[id^=cos_unsupport]').text()
      },
  	}
    // 可能有多图
    $(this).find('.text').find('.view_img_link').map((i, v) => { oA.push($(v).attr('href'))}),
    $(this).find('.text').find('img').map((i, v) => { fA.push($(v).attr('src'))})

    db.find({ _id: pit._id}, (err, doc) => {
      if(doc.length === 0){
        db.insert(pit, err => {
          // console.log(err)
        });
      }else{
        // console.log(err);
      }
    });
  })

}


async function getDetailPage(url){
  //--------------
  // console.log('starting', url);
  //--------------
  const atob = require('atob');
  return await got(atob(url)).then(res => {
    let $ = cheerio.load(res.body);

    let HTML = '';
    const le = $('div.post.f')[0].childNodes.length;
    $('div.post.f')[0].children.forEach((it, n) => {
      if(n === 7 ){
        HTML += '<h2>' + $(it).text() + '</h2>';
      }
      if(n > 8 && n < le - 14){
        if(['SCRIPT', '#text'].indexOf(it.nodeName) === -1){
          HTML += ($(it).wrap('<p/>').parent().html());
        }
      }
    })

    return HTML.replace(/data-original=\"\/\/tankr/g,'src="http://tankr').replace(/data-original=\"/g,'src="');
  });
}


export default class crawler{

  detailPage(url){
    return getDetailPage(url);
  }

  dirtyPic(db){
    // const time = new Date();

    let urls = [];

    got('http://jandan.net/pic').then(res => {return res.body}).then(data => {
      // console.log(data);
      let $ = cheerio.load(data);

      // 获取当前最新页数
      let currentLatestPage = $('.current-comment-page').text().match(/\d+/)[0];
      // console.log('currentLatestPage:', currentLatestPage);

      for(let i = 0; i < defaultMaxLookingBackNumber; i++){
        urls.push('http://jandan.net/pic/page-' + (currentLatestPage - i))
      }

      // console.log(urls);

      urls.forEach(url => {
        pic(url, db);
      });

    });

    // console.log('dealing with pic costs:', new Date() - time);

  }


  dirtyOOXX(db){
    // const time = new Date();

    let urls = [];

    got('http://jandan.net/ooxx').then(res => {return res.body}).then(data => {
      // console.log(data);
      let $ = cheerio.load(data);

      // 获取当前最新页数
      let currentLatestPage = $('.current-comment-page').text().match(/\d+/)[0];
      // console.log('currentLatestPage:', currentLatestPage);

      for(let i = 0; i < defaultMaxLookingBackNumber; i++){
        urls.push('http://jandan.net/ooxx/page-' + (currentLatestPage - i))
      }

      // console.log(urls);

      urls.forEach(url => {
        pic(url, db);
      });

    });

    // console.log('dealing with pic costs:', new Date() - time);

  }




  dirtyPage(db){
    // const time = new Date();

    let urls = [];
    // let latestDate;
    const today = new Date(dateFormat(new Date(), "yyyy/mm/dd")).valueOf();

    // db.find({}).sort({date_group:-1}).limit(1).exec(function(err, doc){
    //   latestDate = (doc.length === 0 ? 0 : doc[0].date_group);
    // });

    // let MissedDate = (today - latestDate)/864;
    // console.log(MissedDate, latestDate);

    // for(let i = 0; i < (MissedDate > defaultMaxLookingBackNumber ? defaultMaxLookingBackNumber : MissedDate); i++){
    for(let i = 0; i < defaultMaxLookingBackNumber; i++){
      urls.push('http://jandan.net/' + dateFormat((today - i * 86400000), "yyyy/mm/dd"))
    }

    // console.log(urls);

    urls.forEach(url => {
      page(url, db);
    });

    // console.log('dealing with page costs:', new Date() - time);
  }
}
