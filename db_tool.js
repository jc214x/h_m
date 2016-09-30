function(context, args) { // db:"#db command", a1:"db filter", a2:"db projection", c:"cursor command"
	
	var dbCmd = args.db
	var argCmd = {}
	argCmd = args.a1
	var argCmd2 = {}
	argCmd2 = args.a2
	var curCmd = (args.c || "")

	switch (dbCmd) {
		case "f" :
			if (curCmd){
				return #db.f(argCmd,argCmd2).curCmd
			} else {
				return #db.f(argCmd,argCmd2)
			}
			break
			
		case "r" :
			if (curCmd){
				return #db.r(argCmd).curCmd
			} else {
				return #db.r(argCmd)
			}
			break
			
		case "i" :
			if (curCmd){
				return #db.i(argCmd).curCmd
			} else {
				return #db.i(argCmd)
			}
			break
			
		default:
			return {ok:false,msg:"Unrecognized #db command!"}
	}
}