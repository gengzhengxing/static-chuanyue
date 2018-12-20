const express = require('express');
const static = require('express-static');
const ejs = require('ejs');
const port = 90;
const url = require('url');
const mysql = require('mysql');
const server = express();

var db = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'admin',
	database:'newslist'
});
// 传悦首页的接口
server.get("/",(request,response)=>{
	ejs.renderFile("chuanyue/index.html",(error,data)=>{
		if(error){
			console.log(error);
		}else{
			response.end(data);
		}
	});
});
// 传悦观点列表的接口
server.get("/viewpoint",(request,response)=>{
	db.query(`select * from newslist1`,(error,result)=>{
		ejs.renderFile("chuanyue/solution_viewpoint.html",{data:result},(error,data)=>{
			if(error){
				console.log(error);
			}else{
				response.end(data);
			}
		});
	});
});
// 传悦观点详情页接口
server.get("/dbDetails",(request,response)=>{
	var newsId = url.parse(request.url,true).query.newsId;
	db.query(`select * from newslist1 where id=${newsId}`,(error,result)=>{
		if(!error){
			ejs.renderFile("chuanyue/solution.html",{data:result[0]},(error,data)=>{
				if(error){
					console.log(error);
				}else{
					response.end(data);
				}
			});
		}
	});
});
// 获取新闻列表的接口
server.get("/newsData",(request,response)=>{
	db.query(`select * from newslist1`,(error,data)=>{
		if(error){
			console.log(error)
		}else{
			response.end(JSON.stringify(data))
		}
	})
});
// 添加一条新闻的接口
server.get("/addNews",(request,response)=>{
	var title = url.parse(request.url,true).query.title;
	var details = url.parse(request.url,true).query.details;
	if(title){
		db.query(`insert into newslist1 (title,details) values ("${title}","${details}")`,(error,data)=>{
			if(error){
				console.log(error)
			}else{
				// console.log('seccess')
				response.end('seccess')
			}
		})
	}
});
server.get("/updateNews",(request,response)=>{
	var newsId = url.parse(request.url,true).query.id;
	// console.log(newsId)
	var title = url.parse(request.url,true).query.title;
	var details = url.parse(request.url,true).query.details;
	if(title){
		db.query(`update newslist1 set title="${title}",details="${details}" where id=${newsId}`,(error,data)=>{
			if(error){
				console.log(error)
			}else{
				// console.log('seccess')
				response.end('seccess')
			}
		})
	}
});
// 删除一条新闻的接口
server.get("/deleteNews",(request,response)=>{
	var newsId = url.parse(request.url,true).query.newsId;
	db.query(`delete from newslist1 where id=${newsId}`,(error,data)=>{
		if(error){
			console.log(error)
		}else{
			// console.log('seccess')
			response.end('seccess')
		}
	})
});
server.use(static(__dirname + "/chuanyue"));
server.listen(port);