var fs = require("fs")
var httpUtil = require("./httpUtil.js")

const thisYear = new Date().getFullYear()
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime()
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime()
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear)
const progressBarOfThisYear = generateProgressBar()

function generateProgressBar() {
 
    const progressBarCapacity = 30
    let passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity)

    let progressBar = '🌕'.repeat(passedProgressBarIndex - 1) +'🌗'+'🌑'.repeat(progressBarCapacity - passedProgressBarIndex)
    if(passedProgressBarIndex == (progressBarCapacity -1)) {
        progressBar = '🌕'.repeat(passedProgressBarIndex) + '🌗'
    } 
    else if ( passedProgressBarIndex == progressBarCapacity) {
        progressBar = '🌕'.repeat(passedProgressBarIndex)
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
 * 修改文件
 */
async function updateMD(){

    // 获取天气信息
    let content = await httpUtil({
        host:'www.wttr.in',
        path:encodeURI('/GuangZhou?m&format=%l+%c\n🌡%t+%h+moon:%m\n🌄%D+🌇%d&lang=zh-cn'),
        action:'GET',
    });
    console.log("天气信息："+content);

    let newDataA = convertProcess(process,fileStr);

    let newDataB =convertWeather(content,newDataA);

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

