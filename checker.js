let iMessage, https = require('https'), fs = require('fs');

let PHONE_NUMBER;
try {
	PHONE_NUMBER = fs.readFileSync('.PHONE_NUMBER').toString();
} catch(e) {
	console.warn("ERROR: You didn't create a file named `.PHONE_NUMBER`!\n\nUse the command\n\techo \"[email/phone]\">.PHONE_NUMBER");
	process.exit();
}

try {
	iMessage = require('osa-imessage');
} catch(e) {
	console.warn("WARNING: npm module `osa-imessage` not installed, iMessage functionality will not work!")
	iMessage = {
		"send": (number, text)=>{
			console.warn("iMessage NOT SENT!!\n\tTo: " + number + "\n\tText: " + text);
		}
	};
};

let Electra = {
	"website": ["coolstar.org", "/electra/index.html"],
	"temp_directory": __dirname + "/etas0n_electra/",
	"filename": "cached.html",
	"doChecks": function(e = Electra, callback) {
		let request = https.request({
			"host": e.website[0],
			"path": e.website[1],
			"port": 443,
			"method": "GET",
			"headers": {
				"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
			}
		}, (req)=>{
			let data = '';
			req.on('data',(evt)=>data+=evt);
			req.on('end',()=>{
				let fileFromFs = '';
				try {
					fileFromFs = fs.readFileSync(e.temp_directory + e.filename);
				} catch(e) {
					fileFromFs = data;
				};
				if(data.length != fileFromFs.toString().length) {
					callback(true);
				} else if(	!data.includes('Coming soon: Electra for iOS 11.3.1') ||
					!data.includes('Electra is coming soon for iOS 11.3.1! All users not on iOS 11.0-11.1.2 are recommended to upgrade to 11.3.1.')) {
					callback(true);
				} else {
					callback(false);
				}
				fs.writeFileSync(e.temp_directory + e.filename, data);
			});
		});
		request.end();
	}
};
try {
	fs.mkdirSync(Electra.temp_directory)
} catch(e) {
	if(e.code == 'EEXIST') {
		console.log("Folder exists, picking up where previously left off...");
	};
}
Electra.doChecks(Electra, (s0n)=>{
	if(s0n) iMessage.send(PHONE_NUMBER, "etas0n jb iso 11.3.1\nElectra might've been released- They updated the website!");
});

if(process.argv.join(' ').includes(' --test') || process.argv.join(' ').includes( '-t')) {
	iMessage.send(PHONE_NUMBER, "Testing 1, 2, 3\nDid it work?");
	process.exit()
};


setInterval(()=>{
	Electra.doChecks(Electra, (s0n)=>{
		if(s0n) iMessage.send(PHONE_NUMBER, "etas0n jb iso 11.3.1\nElectra might've been released- They updated the website!");
	});
}, 1E4);