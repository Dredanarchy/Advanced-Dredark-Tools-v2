
const http = require('http');
var asciify = require('asciify-image');
const testFolder = './frames/';
const fs = require('fs');
const server = http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	console.log("server Started");
});
server.listen(3000);

const socket = require('socket.io');
const io = socket(server);

const puppeteer = require('puppeteer');

var x;
var y;




io.on('connection', socket => {
	console.log("client connected");

	socket.on("new-bot", (link) => {
		(async () => {
			const browser = await puppeteer.launch({
				headless: false,
				defaultViewport: null
			});
			const page = await browser.newPage();

			await page.goto(link);
			await setInterval(async () => {
				await page.mouse.move(x, y);
			}, 30);
			

			socket.on("keydown",(e)=>{
                page.keyboard.down(e);
            })

            socket.on("keyup",(e)=>{
                page.keyboard.up(e);
            })
			socket.on("mousemove", coords => {
				x = coords.x;
				y = coords.y;
			});

			socket.on("shoot", () => {
				page.mouse.down({
					button: 'left'
				});
			});

			socket.on("stop-shoot", () => {
				page.mouse.up({
					button: 'left'
				});
			});

			socket.on("kill-bots", () => {
				browser.close();
			});
		})();
	});
});
