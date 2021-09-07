var fs = require("fs")

const thisYear = new Date().getFullYear()
const startTimeOfThisYear = new Date(`${thisYear}-01-01T00:00:00+00:00`).getTime()
const endTimeOfThisYear = new Date(`${thisYear}-12-31T23:59:59+00:00`).getTime()
const progressOfThisYear = (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear)
const progressBarOfThisYear = generateProgressBar()

function generateProgressBar() {
    const progressBarCapacity = 30
    const passedProgressBarIndex = parseInt(progressOfThisYear * progressBarCapacity)
    const progressBar =
      '🌕'.repeat(passedProgressBarIndex - 1) +'🌗'+'🌑'.repeat(progressBarCapacity - passedProgressBarIndex)
    return ` ${progressBar} `
}

const readme = `⏳ Year Progress ${progressBarOfThisYear} ${(progressOfThisYear * 100).toFixed(4)} %`

console.log(readme)
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
console.log(new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' ,hour12: false}))

// 同步读取
var file = fs.readFileSync('README.md',"UTF-8");
//var reger = new RegExp("(<!\-\-START_SECTION:progressBar\-\->\\s?)(.*)(\\s*)(<!\-\-END_SECTION:progressBar\-\->)","g");
var reger=new RegExp("⏳([.\\s\\S]*)%","g");

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace
function replacer(match, p1, offset, string) {
  //debugger
  return readme
}

var newData = file.toString().replace(reger,replacer)

fs.writeFileSync('README.md', newData);
