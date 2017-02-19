// node-fetch遇到了不能解决的socket hang up错误，改用got
// import fetch from 'node-fetch';
import got from 'got';
// import FormData from 'form-data';
import cheerio from 'cheerio';
import dateFormat from 'dateformat';

// const form = new FormData();
const defaultMaxLookingBackNumber = 5;
let cumusCrawlMore = [1, 1, 1]; //page, pic, ooxx

/*
  爬取文章
*/
async function page(url, db){
  //--------------
  // console.log('starting', url);
  //--------------
  let date = new Date(/(\/\d+){3}/.exec(url)[0]).valueOf()/100000;

  // 当天（date）的最后更新文章的index
  let cumu;
  let iter = 0;

  let data = await got(url).then(res => {return res.body});
  let $ = cheerio.load(data);
  // console.log(data);

  //目标元素列表
  const elementList = $('#content').find('.post ', 'f');

  //文章 - 当页第一个元素做是否已经爬取过的判断
  let pageFirstEl_id = elementList.eq(0).find('h2').find('a').eq(0).attr('href');
  db.find({ _id: pageFirstEl_id}, (err, doc) => {
    if(doc.length === 0){
      //获取当天已入库的累计index
      db.find({date_group: date}).sort({index:-1}).limit(1).exec(function(err, doc){
        cumu = (doc.length === 0 ? 0 : doc[0].index + 1);
      });

      // reverse： 越新的文章，index值越大
      $(elementList.get().reverse()).map(function(){
        let id = $(this).find('h2').find('a').eq(0).attr('href');
        db.find({ _id: id}, (err, doc) => {
          if(doc.length === 0){
            let pit = {
              _id: id,
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

            pit.index = iter + cumu;
            iter++;

            db.insert(pit, (err) => {
              // console.log(err)
            });
          }else{
            //
          }
        });
        // return pit;
      });
    }
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

  //目标元素列表
  const elementList = $('.commentlist').find('li[id^="comment"]');

  //图片 - 当页最后一个元素做是否已经爬取过的判断
  let pageLastEl_id = elementList.eq(-1).attr('id').replace('comment-', '');
  db.find({ _id: pageLastEl_id}, (err, doc) => {
    if(doc.length === 0){

      elementList.map(function(){
        //判断当前元素是否重复
        let id = $(this).attr('id').replace('comment-', '');
        db.find({ _id: id}, (err, doc) => {
          if(doc.length === 0){
            let oA = [];
            let fA = [];
            let pit = {
              _id : id,
              title : $(this).find('.text').find('p')[0].childNodes[0].data,
              author:{
                name: $(this).find('.author').find('strong').text(),
                uid: $(this).find('.author').find('strong').attr('title')
              },
              img: {
                org_src : oA,
                fit_src : fA
              },
              // 可能有多图
              ooxx:{
                oo: $(this).find('.text').find('span[id^=cos_support]').text(),
                xx: $(this).find('.text').find('span[id^=cos_unsupport]').text()
              },
            }
            $(this).find('.text').find('.view_img_link').map((i, v) => { oA.push($(v).attr('href'))}),
            $(this).find('.text').find('img').map((i, v) => { fA.push($(v).attr('src'))})

            //插入db
            db.insert(pit, err => {
              // console.log(err)
            });
          }else{
            //
          }
        });
      })
    }
  });


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


  init(db){
    const StartTime = new Date();
    this.dirtyPage(db.page);
    this.dirtyPic(db.pic);
    this.dirtyOOXX(db.ooxx);
    console.log('crawler time consuming:', new Date() - StartTime, 'maxLookingBackNumber:', defaultMaxLookingBackNumber);
  }

  crawlMore(type, db){
    const StartTime = new Date();
    switch (type) {
      case 'page':
        cumusCrawlMore[0] ++;
        this.dirtyPage(db.page);
        break;
      case 'pic':
        cumusCrawlMore[1] ++;
        this.dirtyPic(db.pic);
        break;
      case 'ooxx':
        cumusCrawlMore[2] ++;
        this.dirtyOOXX(db.ooxx);
        break;
    }
    console.log('crawlMore type:', type, 'crawlMore time consuming:', new Date() - StartTime, 'maxLookingBackNumber:',
    defaultMaxLookingBackNumber, 'cumusCrawl:', cumusCrawlMore);
  }

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

      for(let i = (cumusCrawlMore[1] - 1) * defaultMaxLookingBackNumber; i < cumusCrawlMore[1] * defaultMaxLookingBackNumber; i++){
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

      for(let i = (cumusCrawlMore[2] - 1) * defaultMaxLookingBackNumber; i < cumusCrawlMore[2] * defaultMaxLookingBackNumber; i++){
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
    for(let i = (cumusCrawlMore[0] - 1) * defaultMaxLookingBackNumber; i < cumusCrawlMore[0] * defaultMaxLookingBackNumber; i++){
      urls.push('http://jandan.net/' + dateFormat((today - i * 86400000), "yyyy/mm/dd"))
    }

    // console.log(urls);

    urls.forEach(url => {
      page(url, db);
    });

    // console.log('dealing with page costs:', new Date() - time);
  }
}
