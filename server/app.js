// import koa from 'koa';
// import router from 'koa-router';
// import handlebars from 'koa-handlebars';
// import cheerio from 'cheerio';
// import fetch from 'node-fetch';
// import serve from 'koa-static';
// import path from 'path';
// 
// const app = koa();
//
// app.use(handlebars({
//   extension: ['html', 'hbs', 'handlebars'],
//   root: __dirname,
//   viewsDir: '/'
// }));
//
// router.get('/', function*(){
//   const context = 'say something';
//   console.log('router.get /', context);
//
//   // yield this.render('../index.html');
// });
//
// app.use(serve(path.join(__dirname)));
// app.use(router.routes());
// app.listen(3000);
// console.log('listening on port 3000, app back-end is on ...');
