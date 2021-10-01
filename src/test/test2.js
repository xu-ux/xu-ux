var http = require('http');
var url = require('url');
 
function get(action,callback){
	var options = {
	  hostname: 'www.wttr.in',
	  port: 80,
	  path: action,
	  method: 'GET',
	  headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'/* ,
		'Content-Length': send.length */
	  }
	};
	var req = http.request(options, function (res) {
		// console.log('STATUS: ' + res.statusCode);  
		// console.log('HEADERS: ' + JSON.stringify(res.headers));  
        // 定义了一个post变量，用于暂存请求体的信息
		var body="";
		res.setEncoding('utf8');
        // 通过res的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
		res.on('data', function (chunk) {
			// console.log('BODY: ' + chunk);
            body += chunk;
		});
        // 在res的end事件触发后，通过JSON.parse将post解析为真正的POST请求格式，然后调用传递过来的回调函数处理数据
		res.on('end', function(){
			console.log("body = "+body);
			callback(body);
		});
	});
	req.on('error', function (e) {
	  console.log('problem with request: ' + e.message);
	});
	req.write(''); //发送请求
	req.end();
}
 
//调用post函数在nodejs里发送post请求
get(encodeURI("/GuangZhou?format=%l+%c\n🌡%t+%h+moon:%m\n🌄%D+🌇%d&lang=zh-cn"),function(body){
	console.log(body);
});