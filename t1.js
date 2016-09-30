function(context, a) { // t:"#s.no.quotes", auto:boolean

	var _c = a.t.call
	var ez = ["open","unlock","release"]
	var p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
	var col = ["red","orange","yellow","lime","green","cyan","blue","purple"]
	var i = 0
	var reg = /\!(\w+)\! lock\./	//RegEx for finding the next lock given by the return string
	var done = false
	var sol = {}
	var lock = []
	var ret = ""
	var unlk = "!LOCK_UNLOCKED!"
	var lke = "+LOCK_ERROR+"
	
	function say(arg) {				//echo
		return #s.chats.tell({to:"sferic", msg: arg})
	}
	
	//Main loop
	
	while (!done) {
		ret = _c(sol)
		lock = reg.exec(ret)

		//lock type selector
		a:
		switch (lock[1]) {
			case "EZ_21":			//EZ_21 Cracker
				for (i = 0; i < 3; i++) {
					sol["ez_21"] = ez[i]
					ret = _c(sol)
					
					if (ret.includes(unlk + " ez_21")) {
						say("Cracked EZ_21: " + ez[i])
						break a

					} else if (!ret.includes(lke)) {
						
						done = true
						break a
					}
				}
			break
				
			case "EZ_35":			//EZ_35 Cracker
				for (i = 0; i < 3; i++) {
					sol["ez_35"] = ez[i]
					ret = _c(sol)
						
					if (ret.includes("!digit!")) {
						for (i = 0; i < 10; i++) {
							sol["digit"] = i
							ret = _c(sol)
							
							if (ret.includes(unlk + " ez_35")) {
								say("Cracked EZ_35: " + ez[i] + " " + i)
								break a
								
							} else if (!ret.includes(lke)) {
								
								done = true
								break a
							}
						}
					}
				}
			break
			
			case "EZ_40":			//EZ_40 Cracker
				for (i = 0; i < 3; i++) {
					sol["ez_40"] = ez[i]
					ret = _c(sol)
					
					if (ret.includes("!ez_prime!")) {
						for (i = 0; i < 25; i++) {
							sol["ez_prime"] = p[i]
							ret = _c(sol)
							
							if (ret.includes(unlk + " ez_40")) {
								say("Cracked EZ_40: " + sol.ez_40 + " " + i)
								break a
								
							} else if (!ret.includes(lke)) {
								
								done = true
								break a
							}
						}
					}
				}
			break
					
			case "c001":			//c001 Cracker
				
				for (let i in col) {
					sol["c001"] = col[i]
					ret = _c(sol)
					
					if (ret.includes("!color_digit!")) {			
						for (i = 0; i < 10; i++) {
							sol["color_digit"] = i
							ret = _c(sol)
							
							if (ret.includes(unlk + " c001")) {
								say("Cracked c001: " + sol.c001 + " " + i)
								break a
								
							} else if (!ret.includes(lke)) {
								
								done = true
								break a
							}
						}
					}
				}
			break
			
			case "c002":			//c002 Cracker
				
				for (i = 0; i < 8; i++ ) {
					var j = (i + 4) % 8
					sol["c002"] = col[i]
					sol["c002_complement"] = col[j]
					ret = _c(sol)
					
					
					if (ret.includes(unlk + " c002")) {
						say("Cracked c002: " + col[i] + " " + col[j] )
						break a
						
					} else if (!ret.includes(lke)) {
						
						done = true
						break a
					}
				}
					
			break
			
			case "c003":			//c003 Cracker
				for (i = 0; i < 8; i++ ) {
					var j = (i + 5) % 8
					var k = (i + 3) % 8
					sol["c003"] = col[i]
					sol["c003_triad_1"] = col[j]
					sol["c003_triad_2"] = col[k]
					ret = _c(sol)
					
					
					if (ret.includes(unlk + " c003")) {
						say("Cracked c003: " + col[i] + " " + col[j] + " " + col[k])
						break a
						
					} else if (!ret.includes(lke)) {
						
						done = true
						break a
					}
				}
					
			break
			
			default:
				if (!done) {
					return {ok: false, msg: "Unsupported or invalid lock: " + lock[1]}
				}
			break
		}
	}
	
	if (a.auto) {
		var _t = a.t
		var _t = _t.substr(3)
		#s.sferic.t1_scraper.call({ rm: _t })
		#s.sferic.t1_scraper.call({ find: "one" })
	}
	
	return {ok: done, msg: sol }
}