var fs = require("fs")
var {httpUtil,httpsUtil} = require("./httpUtil.js")

const thisYear = new Date().getFullYear()
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime()
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime()
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear)
const progressBarOfThisYear = generateProgressBar()

function generateProgressBar() {
 
    const progressBarCapacity = 30
    let passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity)
    let progressBar = ''
   
    if(passedProgressBarIndex == (progressBarCapacity -1)) {
        progressBar = '🌕'.repeat(passedProgressBarIndex) + '🌗'
    } 
    else if ( passedProgressBarIndex == progressBarCapacity) {
        progressBar = '🌕'.repeat(passedProgressBarIndex)
    }
    else if (passedProgressBarIndex == 0){
        progressBar = '🌑'.repeat(progressBarCapacity)
    }
    else{
        progressBar = '🌕'.repeat(passedProgressBarIndex - 1) +'🌗'+'🌑'.repeat(progressBarCapacity - passedProgressBarIndex)
    }
    return ` ${progressBar} `
}
// debugger

/**
 * 获取进度条
 */
var process = `⏳ Year Progress ${progressBarOfThisYear} ${(progressOfThisYear * 100).toFixed(4)} %`
console.log("进读条信息："+process)
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
console.log(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' ,hour12: false}))

// 同步读取
var file = fs.readFileSync('README.md',"UTF-8")
var fileStr = file.toString()

/**
 * 需要展示天气的城市列表
 */
const WEATHER_CITIES = ['GuangZhou', 'Wuhan'];

/**
 * 获取单个城市的天气（纯文本）
 * @param {String} city 城市名
 * @returns {String|null} 成功返回纯文本天气，失败/返回 HTML 时返回 null
 */
async function getWeather(city) {
    try {
        let content = await httpsUtil({
            host: 'www.wttr.in',
            path: encodeURI(`/${city}?m&format=%l+%c\n🌡%t+%h+moon:%m\n🌄%D+🌇%d&lang=zh-cn`),
            action: 'GET',
        });
        // 防线：wttr.in 对浏览器 User-Agent 会返回整页 HTML，只接受纯文本天气
        if (!content || /<\s*(!DOCTYPE|html|head|body)/i.test(content)) {
            console.warn(`${city} 天气接口返回了 HTML 或空数据，跳过该城市`);
            return null;
        }
        console.log(`${city} 天气信息：${content}`);
        return content.trim();
    } catch (e) {
        console.warn(`获取 ${city} 天气失败：${e.message}`);
        return null;
    }
}

/**
 * 修改文件
 */
async function updateMD() {

    let newDataA = convertProcess(process, fileStr);

    // 并发获取所有城市天气
    let weatherList = await Promise.all(WEATHER_CITIES.map(city => getWeather(city)));

    // 全部失败时保留原内容
    if (weatherList.every(w => w === null)) {
        console.warn("所有城市天气获取失败，保留原天气内容");
        fs.writeFileSync('README.md', newDataA);
        console.log("结束")
        return;
    }

    // 多个城市之间用空行分隔
    let content = weatherList.filter(w => w !== null).join('\n\n');

    let newDataB = convertWeather(content, newDataA);

    fs.writeFileSync('README.md', newDataB);
    console.log("结束")

}

updateMD();

/**
 * 转换天气
 * @param {String} content 
 * @returns String
 */
function convertWeather(content,fileStr){

    let regerB = new RegExp("(<!--START_WEATHER-->)(\\s|\\S{0,2})([.\\s\\S]*)(\\s|\\S{0,2})(<!--END_WEATHER-->)","g");
    let test = regerB.test( fileStr );
    function replacerB(match, p1,p2,p3,p4,p5, offset, string) {
        //   debugger
        return `<!--START_WEATHER-->\r\n${content}\r\n<!--END_WEATHER-->`;
    }
    let newDataB = fileStr.replace(regerB,replacerB)
    return newDataB;
}

/**
 * 转换进度条
 * @param {*String} process 
 * @param {*String} fileStr 
 * @returns  String
 */
function convertProcess(process,fileStr){
    // let reger = new RegExp("(<!\-\-START_SECTION:progressBar\-\->\\s?)(.*)(\\s*)(<!\-\-END_SECTION:progressBar\-\->)","g");
    let regerA = new RegExp("⏳([.\\s\\S]*\\d\\s%)","g") // ⏳([.\\s\\S]*\\d\\s%)\\n

    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
    function replacerA(match, p1, offset, string) {
        // debugger
        return process;
    }
    let newDataA = fileStr.replace(regerA,replacerA)
    return newDataA;

}

