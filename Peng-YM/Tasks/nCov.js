/**
 *  疫情日报，自动获取当前位置的疫情信息
 *  API来自 http://api.tianapi.com/txapi/ncov/
 *  @author: Peng-YM
 *  感谢 @Mazetsz 提供腾讯API接口Token
 *  更新地址: https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/nCov.js
 */

const $ = API("nCov");

const key = "NOUBZ-7BNHD-SZ64A-HUWCW-YBGZ7-DDBNK";
const headers = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36",
};

!(async () => {
    // get current location
    const province = await $.get(`https://apis.map.qq.com/ws/location/v1/ip?key=${key}`).then(resp => {
        const data = JSON.parse(resp.body);
        return data.result.ad_info.province;
    });
    $.log(province);
    console.log(province);
    const newslist = await $.get({
        url: "http://api.tianapi.com/txapi/ncov/index?key=5dcf1a3871f36bcc48c543c8193223fc",
        headers,
    }).then((resp) => JSON.parse(resp.body).newslist[0])
        .delay(1000);
    $.log(newslist);
    console.log(newslist);
    let desc = newslist.desc;
    let news = newslist.news[0];
    let title = "🗞【疫情信息概览】";
    let subtitle = `📅  ${formatTime()}`;
    let detail =
        "\n「全国数据」" +
        "\n\n    -新增确诊: " +
        desc.confirmedIncr +
        "\n    -现有确诊: " +
        desc.currentConfirmedCount +
        "\n    -累计确诊: " +
        desc.confirmedCount +
        "\n    -治愈: " +
        desc.curedCount +
        "\n    -死亡: " +
        desc.deadCount +
        "\n\n「疫情动态」\n\n     " +
        news.title +
        "\n\n「动态详情」\n\n     " +
        news.summary +
        "\n\n    发布时间：" +
        news.pubDateStr;
    $.notify(title, subtitle, detail);
})()
    .catch((err) => $.error(err))
    .finally(() => $.done());

function formatTime() {
    const date = new Date();
    return `${
        date.getMonth() + 1
    }月${date.getDate()}日 ${date.getHours()}时`;
}

function API(s="untitled",t=!1){return new class{constructor(s,t){this.name=s,this.debug=t,this.isQX="undefined"!=typeof $task,this.isLoon="undefined"!=typeof $loon,this.isSurge="undefined"!=typeof $httpClient&&!this.isLoon,this.isNode="function"==typeof require,this.isJSBox=this.isNode&&"undefined"!=typeof $jsbox,this.node=(()=>{if(this.isNode){return{request:"undefined"!=typeof $request?void 0:require("request"),fs:require("fs")}}return null})(),this.initCache();Promise.prototype.delay=function(s){return this.then(function(t){return((s,t)=>new Promise(function(e){setTimeout(e.bind(null,t),s)}))(s,t)})}}get(s){return this.isQX?("string"==typeof s&&(s={url:s,method:"GET"}),$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.get(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}post(s){return this.isQX?("string"==typeof s&&(s={url:s}),s.method="POST",$task.fetch(s)):new Promise((t,e)=>{this.isLoon||this.isSurge?$httpClient.post(s,(s,i,o)=>{s?e(s):t({status:i.status,headers:i.headers,body:o})}):this.node.request.post(s,(s,i,o)=>{s?e(s):t({...i,status:i.statusCode,body:o})})})}initCache(){if(this.isQX&&(this.cache=JSON.parse($prefs.valueForKey(this.name)||"{}")),(this.isLoon||this.isSurge)&&(this.cache=JSON.parse($persistentStore.read(this.name)||"{}")),this.isNode){let s="root.json";this.node.fs.existsSync(s)||this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.root={},s=`${this.name}.json`,this.node.fs.existsSync(s)?this.cache=JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)):(this.node.fs.writeFileSync(s,JSON.stringify({}),{flag:"wx"},s=>console.log(s)),this.cache={})}}persistCache(){const s=JSON.stringify(this.cache);this.isQX&&$prefs.setValueForKey(s,this.name),(this.isLoon||this.isSurge)&&$persistentStore.write(s,this.name),this.isNode&&(this.node.fs.writeFileSync(`${this.name}.json`,s,{flag:"w"},s=>console.log(s)),this.node.fs.writeFileSync("root.json",JSON.stringify(this.root),{flag:"w"},s=>console.log(s)))}write(s,t){this.log(`SET ${t}`),-1!==t.indexOf("#")?(t=t.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(s,t),this.isQX&&$prefs.setValueForKey(s,t),this.isNode&&(this.root[t]=s)):this.cache[t]=s,this.persistCache()}read(s){return this.log(`READ ${s}`),-1===s.indexOf("#")?this.cache[s]:(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.read(data,s),this.isQX?$prefs.valueForKey(s):this.isNode?this.root[s]:void 0)}delete(s){this.log(`DELETE ${s}`),delete this.cache[s],-1!==s.indexOf("#")?(s=s.substr(1),this.isSurge&this.isLoon&&$persistentStore.write(null,s),this.isQX&&$prefs.setValueForKey(null,s),this.isNode&&delete this.root[s]):this.cache[s]=data,this.persistCache()}notify(s,t="",e="",i={}){const o=i["open-url"],n=i["media-url"],r=e+(o?`\n点击跳转: ${o}`:"")+(n?`\n多媒体: ${n}`:"");if(this.isQX&&$notify(s,t,e,i),this.isSurge&&$notification.post(s,t,r),this.isLoon&&$notification.post(s,t,e,o),this.isNode)if(this.isJSBox){require("push").schedule({title:s,body:(t?t+"\n":"")+r})}else console.log(`${s}\n${t}\n${r}\n\n`)}log(s){this.debug&&console.log(s)}info(s){console.log(s)}error(s){console.log("ERROR: "+s)}wait(s){return new Promise(t=>setTimeout(t,s))}done(s={}){this.isQX||this.isLoon||this.isSurge?$done(s):this.isNode&&!this.isJSBox&&"undefined"!=typeof $context&&($context.headers=s.headers,$context.statusCode=s.statusCode,$context.body=s.body)}}(s,t)}

