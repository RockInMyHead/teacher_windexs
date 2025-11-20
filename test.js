const http=require("http");const server=http.createServer((req,res)=>{console.log("Request:",req.url);res.end("OK")});server.listen(8080,()=>{console.log("Server listening on 8080")});
