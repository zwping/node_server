const koa = require('koa');
const app = new koa();
const cryptoJs = require('crypto-js')

app.use( async(ctx)=>{
    if (ctx.url === '/' && ctx.method === 'GET') {
        ctx.body = 'hello koa';
    }else if (ctx.url === '/' && ctx.method === 'POST') {
        let postData = await parsePostData(ctx);
        let requestBody = parseQueryStr(postData)
        ctx.body = dec(requestBody['data'])
    } else {
        ctx.body = '404'
    }
});

function parsePostData(ctx){
    return  new Promise((resolve,reject)=>{
        try {
            let postdata = '';
            ctx.req.addListener('data',(data)=>{
                postdata += data;
            });
            ctx.req.on("end",function(){
                resolve(postdata);
            })
        } catch (error) {
            reject(error);
        }
    });
}

function parseQueryStr(queryStr){
    let queryData = {};
    let queryList = queryStr.split('&');
    for(let [index,queryStr] of queryList.entries()){
        let itemArr = queryStr.split("=");
        queryData[itemArr[0]] = decodeURIComponent(itemArr[1]); //转码
    }
    return queryData;
}

// 解析四库一平台加密的响应数据
function dec(data) {
    if (!data) {
        return '' // '缺少参数'
    }
    let u = cryptoJs.enc.Utf8.parse('jo8j9wGw%6HbxfFn'),
        d = cryptoJs.enc.Utf8.parse('0123456789ABCDEF')
    let e = cryptoJs.enc.Hex.parse(data)
    let n = cryptoJs.enc.Base64.stringify(e)
    return cryptoJs.AES.decrypt(n, u, {
        iv: d,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7,
    }).toString(cryptoJs.enc.Utf8)
}

app.listen(3000, () => {
    console.log('node server starting success')
});