function(context, args) { // t:#s.your.target, find:"one/all", rm:"user.loc from DB or 'all'" } 

// Tier 1 username scraper
// To use, pass t:#s.target.corp
// To go through previous results, use
	
	function say(x) {
		#s.chats.tell({to: "sferic", msg: x.toString()})
	}
	
	if (args.find) {
		var dbcall = args.find
		switch (dbcall) {
			case "one" :
				var dbout = ""
				var dbret = #db.f({script: "t1_scraper"},{_id: 0, loc: 1, acquired: 1}).sort({acquired: 1}).limit(1).array()
				
				dbout = "#s." + dbret[0].loc + "         " + dbret[0].acquired
				#db.r({loc: dbret[0].loc})
				return dbout
				
				break
				
			case "all" :
				var dbout = ""
				var dbret = #db.f({script: "t1_scraper"},{_id: 0, loc: 1, acquired: 1}).limit(50).array()
				
				var len = dbret.length	
				
				for (var i in dbret) {
					var ct = 50 - dbret[i].loc.length
					var sp = " ".repeat(ct)
					dbout = dbout + dbret[i].loc + sp + dbret[i].acquired + "\n"
				}
				
				return (dbout + "\n\nFound " + len + " entries.")
				
				break
			
			default:
				return {ok:false,msg:"Invalid DB call"}
		}
	}
	
	if (args.rm) {
		if (args.rm == "all") {
			
			var result = #db.r({script: "t1_scraper"})
			
			if (result[0].ok == 1) {
				return {ok: true, msg: "All scraped locs removed from DB."}
			}
		
		} else {
			var rm = args.rm
			
			rm = rm.trim()
			
			var result = #db.r({loc: rm})
			
			if ((result[0].ok == 1) && (result[0].n != 0)) {
				return {ok:true, msg: rm + " removed from DB."}
			} else if ((result[0].ok == 1) && (result[0].n == 0)) {
				return {ok:false, msg: rm + " could not be found in DB."}
			}
		}
		return {ok:false,msg:"Error removing entry"}
	}
	
	
	var _c = args.t.call
	var regfind = []
	var projects = []
	var passcmd = ["p","pass","password"]
	var password = ""
	var usersraw = []
	var users = []
	
	// RegEx Expressions
	var regx = [
		/\n(\w+)\s\|\s(\w+)\s\|/,
		/!*(\w+)!*:\+*"(\w+)"\+*$/,
	]
	var regx2 = [
		/Look for (\w+) in your mailbox/g,
		/developments on (\w+) progress/g,
		/release date for (\w+)\./g,
		/continues on (\w+),/g
	]
	var regx3 = /strategy (\w+) and/
	
	// Grabbing the needed argument keys and some values
	// Starting with main menu
	var ret = _c()
	var temp = ret.match(regx[0])
	
	if (!temp) {
		return {ok:0,msg: "Failed to get 1st keys!"}
	}
//	say(temp)
	
	var log = temp[1]
	var info = temp[2]
	
	// ...Then with empty argument
	var ret = _c({})
	var temp = ret.match(regx[1])
	
	if (!temp) {
		return {ok:0,msg: "Failed to get 2nd keys!"}
	}
//	say([ret, temp])
	
	var cmd = temp[1]
	var dir = temp[2]

	// Setting up our initial req
	var req = {}
	req[cmd] = log
		
	ret = _c(req)
	
	// Loop to execute all the regx2 expressions through the corp log
	for (var i in regx2) {
		
		regfind = regx2[i].exec(ret)
		
		if (regfind) {
			regfind.shift()
			delete regfind.index
			delete regfind.input
			
			for (var f in regfind) {
				projects.push(regfind[f])
			}
		}
	}
	if (!projects) {
		return {ok:0,msg:"Error parsing projects. Try again!"}
	}
//	say(projects)
	
	// Finding the password in the corp info page
	req[cmd] = info
	ret = _c(req)
	temp = ret.match(regx3)
	password = temp[1]
	
	req[cmd] = dir
	req.project = projects[0].toString()
	
	// Discovering the password argument key
	for (var i in passcmd) {
		
		req[passcmd[i]] = password
		ret = _c(req)
		
		if (!ret.includes("No p")) {
		
			break
		}		
	}
	
	// Scraping the projects for user.locs
	for (var i in projects) {
		
		req.project = projects[i].toString()
		ret = _c(req)
		
		if (!Array.isArray(ret)) {
			ret = ret.split("\n")
		}
		
		for (var j in ret) {
			users.push(ret[j])
			
		}
	}
	
	// Date processing
	var date = new Date()
	var src = args.t.name
	
	var usercount = 0
	
	// Give properties to each loc found
	for (var i in users) {
		
		if (#db.f({loc: users[i]}).count() < 1) {
			
			var working = {
				script: "t1_scraper",
				acquired: date,
				tier: 1,
				loc: users[i],
				source: src
			}
		
			#db.i(working)
			usercount++
		}
	}
	return {ok:true,msg:users +"\n\nHarvested " + usercount + " new NPC locs."}
}