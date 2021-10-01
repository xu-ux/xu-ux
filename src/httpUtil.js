var http=require("http"); //导入需要的http库


const httpUtil = function (data){

    var promise = new Promise((resolve, reject) => {
    var option={ //设置请求头信息
        host:data.host, //域名
        path:data.path, //资源地址
        method:data.action, //请求方式
        headers:{ //请求头信息
            'Accept':'*/*',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36'
            }
        }
        HttpRequest(option,(success)=>{resolve(success)},(error)=>{reject(error)});
    });
    return promise;
}

module.exports = httpUtil;

function HttpRequest(option,callbackSuccess,callbackError){  //option设置请求的请求头，callback请求数据回调函数
    var con='';  //存放请求后的数据
    var req=http.request(option,function(res){  //http。request方法用于获取数据
        res.setEncoding('utf-8');  //设置响应字符集
        var resListener=setTimeout(function(){  //添加响应监听，20s后没有响应信息返回自动结束响应，并返回空数据
            res.destroy(); //结束响应
            con='';
            callback(con);
        },20000);
        res.on('data',function(chuck){ //响应返回数据，并接受
            if(chuck) con+=chuck;    
        }).on('end',function(){ //数据返回完毕
            clearTimeout(resListener);
            callbackSuccess(con);
        });
    });
    req.on('error',function(e){ //响应出错调用函数
        console.log('错误为：'+e.message);
        callbackError(e);
    });
    req.write(''); //发送请求
    req.end(); //结束请求
}