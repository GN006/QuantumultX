
/**
本任务脚本可查询实时货币汇率及换算，默认小数点后三位，兼容boxjs设置
注意澳门元为澳门帕塔卡，香港元为港币，台湾为新台币
～～～～～～～～～～～～～～～～
QX 1.0.6+ :

[task_local]
0 * * * * exchangeRate.js
# Remote 远程
0 10 * * * https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js, 实时货币换算
～～～～～～～～～～～～～～～～
Surge 4.0 :  
[Script]
实时汇率 = type=cron,cronexp=35 5 0 * * *,script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js,script-update-interval=0

～～～～～～～～～～～～～～～～～
Loon 2.1.0+
[Script]

cron "04 00 * * *" script-path=https://raw.githubusercontent.com/Sunert/Scripts/master/Task/exchangeRate.js, enabled=true, tag=实时汇率

-----------------

 */


const f ='人民币'  //使用币
const t = '港币'   //换算币
const ex = '10'   //兑换金额
const $ = new Env("实时汇率及换算")

let frommoney =$.getdata("froma")||f;   
let exchangemoney = $.getdata("toex")||t;
let moneynumb = $.getdata("numex")||ex; 
!(async () => {
  await code(),
  await rate()
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

function code() {
  return new Promise((resolve, reject) =>{
    const codeurl = {
    url: `http://www.40sishi.com/currency/rate`,
    method: 'GET',
};
    $.get(codeurl, (err,resp,data) => { 
      result = JSON.parse(data)
   //console.log('人民币汇率' + data)
    try{
      for (i= 0; i<result.data.length;i++){
       if(result.data[i].name==frommoney){
         fromcode= result.data[i].code
         fromsymbol=result.data[i].symbol
        };
       if(result.data[i].name==exchangemoney){
         exchangecode= result.data[i].code
         exchangesymbol = result.data[i].symbol
         cnTorate = result.data[i].rate
        }
       }
      USDTOCN = result.data[1].rate.toFixed(3)
      JPTOCN = result.data[2].rate.toFixed(3)
      HKTOCN = result.data[9].rate.toFixed(3)
      GBTOCN = result.data[3].rate.toFixed(3)
      EUTOCN = result.data[4].rate.toFixed(3)
      $.detail = "🇨🇳 "+result.data[0].code+ result.data[0].symbol+" 1 元 <==> 🇺🇸 "+ result.data[1].code+result.data[1].symbol+" "+USDTOCN+" 美元\n  约合 🇬🇧 "+result.data[3].code+ result.data[3].symbol+" "+GBTOCN+" 英镑\n  约合 🇩🇪 "+result.data[4].code+ result.data[4].symbol+" "+EUTOCN+" 欧元\n  约合 🇯🇵 "+result.data[2].code+ result.data[2].symbol+" "+JPTOCN+" 日元\n  约合 🇭🇰 "+ result.data[9].symbol+" "+GBTOCN+" 港币\n"
       $.subTitle = '美元兑人民币汇率: '+ (1/result.data[1].rate).toFixed(3)+'元'
     }
       catch (erro){
        $.msg('货币实时汇率换算失败', '请检查币种，币种详情请查看日志', erro)
        console.log(erro)
         return
         }
      resolve()
      })
   })
}

function rate() {
  return new Promise((resolve, reject) =>{
    const rateurl = {
    url: `https://api.jisuapi.com/exchange/single?appkey=177469794ec67f09&currency=${fromcode}`,
    method: 'GET',
};
   $.get(rateurl, (err,resp,data) => { 
       //console.log("外币汇率"+ data)
     let rateresult = JSON.parse(data)
  try{
      if (rateresult.msg == "ok"){
        rated = Number(rateresult.result.list[`${exchangecode}`].rate)
        $.detail += fromsymbol+" "+moneynumb+" "+frommoney+' = '+ exchangesymbol+" "+(moneynumb*rated).toFixed(3)+" "+exchangemoney+'  (各币种换算)\n'+'最后更新: '+rateresult.result.list[`${exchangecode}`].updatetime
       $.msg($.name, $.subTitle, $.detail)
        }
      }
      catch (erro){
         $.msg('货币实时汇率换算失败', '请检查币种，币种详情请查看日志', erro)
         }
       resolve()
      })
   })
}

function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}

