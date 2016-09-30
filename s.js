function(context, args) { //recipient:"message"

	var rec = Object.keys(args)
	var rec = rec[0]
	var m = args[rec]
	var success = true
	var ret = ""
	
	function t(x) {
		return #s.chats.tell(x)
	}
	
	function s(x) {
		return #s.chats.send(x)
	}

	if (rec.includes("@")) {
		rec = rec.replace("@","")
		
		ret = t({to: rec, msg: m })
		
		if (!ret["ok"]) {
						
			return {ok:false,msg:'User "' + rec + '" does not exist.'}
		}
		
	} else if (rec.includes("#")) {
		rec = rec.replace("#","")
		
		s({channel: rec, msg: m })
		
		if (!ret["ok"]) {
					
			return {ok:false,msg:'Channel "' + rec + '" does not exist.'}
		}
		
	} else {
		ret = s({channel: rec, msg: m })
		
		if (!ret["ok"]) {
			ret = t({to: rec, msg: m })
			
			if (!ret["ok"]) {
				
				return {ok:false,msg:'"' + rec + '" does not exist.'}
				
			}
		}
	}

	return {ok:success}
}