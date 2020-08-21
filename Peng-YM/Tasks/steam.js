/**
 * 查询游戏的中国区Steam价格。
 * @author: Peng-YM
 * 更新地址：https://raw.githubusercontent.com/Peng-YM/QuanX/master/Tasks/steam.js
 * 配置方法：
 * 1. 浏览器打开steam网站：https://store.steampowered.com/，搜索你想添加的游戏。
 * 2. 以GTA5为例，GTA5的STEAM商店链接为：https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/。
 * 3. id中填写271590即可, name中填写名字。
 *
 * 📌 注意 https://steamdb.info 需要直连访问，将下面的配置加到分流规则中：
 * 1. QX
 * host, steamdb.info, direct
 * 2. Loon & Surge
 * domain, steamdb.info, DIRECT
 */
let games = [
    {
        id: 271590,
        name: "GTA V",
    },
    {
        id: 814380,
        name: "只狼：影逝二度",
    },
    {
        id: 292030,
        name: "巫师 3：狂猎",
    },
];

const $ = API("steam");
if ($.read('games') !== undefined) {
    games = JSON.parse($.read('games'));
}

Promise.all(games.map(async (item) => check(item))).then(() => $.done());

async function check(item) {
    const { id, name } = item;
    $.log(`正在检查：${item.id}...`);

    await $.get({ url: `https://api.xiaoheihe.cn/game/get_game_detail/?&steam_appid=${id}` }).delay(1000).then(
        (response) => {
            const obj = JSON.parse(response.body);
            if (obj.status == 'ok') {
                let name_en = obj.result.name_en;
                let prices = obj.result.price;
                let publisher = obj.result.publishers[0].value;
                let rating = obj.result.positive_desc;
                let inGame = obj.result.user_num.game_data[0].value;
                let desc = obj.result.about_the_game;

                $.log(JSON.stringify(response.body));

                $.notify(
                    `🎮 [Steam 日报] ${name}`,
                    `${name_en}`,
                    `💰 [价格]：\n📉 历史最低：${prices.lowest_price}元\n📌 当前价格：${prices.current}元\n💡 [基本信息]：\n🎩 发行商：${publisher}\n❤️ ${rating}\n🤖 在线人数：${inGame}\n📝 简介：${desc}...`,
                    {
                        'media-url': obj.result.image,
                        'open-url': `https://store.steampowered.com/app/${id}`
                    }
                );
            } else {
                $.log(JSON.stringify(response.body));

                $.notify(
                    `🎮 [Steam 日报] ${name}`,
                    '获取失败',
                    JSON.stringify(response.body)
                );
            }
            
        }
    );
}


// prettier-ignore
/*********************************** API *************************************/
function API(t = "untitled", s = !1) { return new class { constructor(t, s) { this.name = t, this.debug = s, this.isQX = "undefined" != typeof $task, this.isLoon = "undefined" != typeof $loon, this.isSurge = "undefined" != typeof $httpClient && !this.isLoon, this.isNode = "function" == typeof require, this.isJSBox = this.isNode && "undefined" != typeof $jsbox, this.node = (() => this.isNode ? { request: "undefined" != typeof $request ? void 0 : require("request"), fs: require("fs") } : null)(), this.cache = this.initCache(), this.log(`INITIAL CACHE:\n${JSON.stringify(this.cache)}`), Promise.prototype.delay = function (t) { return this.then(function (s) { return ((t, s) => new Promise(function (e) { setTimeout(e.bind(null, s), t) }))(t, s) }) } } get(t) { return this.isQX ? ("string" == typeof t && (t = { url: t, method: "GET" }), $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.get(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } post(t) { return this.isQX ? ("string" == typeof t && (t = { url: t }), t.method = "POST", $task.fetch(t)) : new Promise((s, e) => { this.isLoon || this.isSurge ? $httpClient.post(t, (t, i, o) => { t ? e(t) : s({ status: i.status, headers: i.headers, body: o }) }) : this.node.request.post(t, (t, i, o) => { t ? e(t) : s({ ...i, status: i.statusCode, body: o }) }) }) } initCache() { if (this.isQX) return JSON.parse($prefs.valueForKey(this.name) || "{}"); if (this.isLoon || this.isSurge) return JSON.parse($persistentStore.read(this.name) || "{}"); if (this.isNode) { const t = `${this.name}.json`; return this.node.fs.existsSync(t) ? JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(t, JSON.stringify({}), { flag: "wx" }, t => console.log(t)), {}) } } persistCache() { const t = JSON.stringify(this.cache); this.log(`FLUSHING DATA:\n${t}`), this.isQX && $prefs.setValueForKey(t, this.name), (this.isLoon || this.isSurge) && $persistentStore.write(t, this.name), this.isNode && this.node.fs.writeFileSync(`${this.name}.json`, t, { flag: "w" }, t => console.log(t)) } write(t, s) { this.log(`SET ${s} = ${JSON.stringify(t)}`), this.cache[s] = t, this.persistCache() } read(t) { return this.log(`READ ${t} ==> ${JSON.stringify(this.cache[t])}`), this.cache[t] } delete(t) { this.log(`DELETE ${t}`), delete this.cache[t], this.persistCache() } notify(t, s, e, i) { const o = "string" == typeof i ? i : void 0, n = e + (null == o ? "" : `\n${o}`); this.isQX && (void 0 !== o ? $notify(t, s, e, { "open-url": o }) : $notify(t, s, e, i)), this.isSurge && $notification.post(t, s, n), this.isLoon && $notification.post(t, s, e), this.isNode && (this.isJSBox ? require("push").schedule({ title: t, body: s ? s + "\n" + e : e }) : console.log(`${t}\n${s}\n${n}\n\n`)) } log(t) { this.debug && console.log(t) } info(t) { console.log(t) } error(t) { console.log("ERROR: " + t) } wait(t) { return new Promise(s => setTimeout(s, t)) } done(t = {}) { this.isQX || this.isLoon || this.isSurge ? $done(t) : this.isNode && !this.isJSBox && "undefined" != typeof $context && ($context.headers = t.headers, $context.statusCode = t.statusCode, $context.body = t.body) } }(t, s) }
/*****************************************************************************/

