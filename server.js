var hrtime= require("hrtime"),
  optimist= require("optimist")
  	.usage("Usage: $0 -s [ms] -target [target] -p [port]")
  	.options("target", {alias: "t", default: "127.0.0.1", describe: "Flume target host to send to."})
  	.options("port", {alias: "p", default: 37543, describe: "Port to send to."})
	.options("millis", {alias: "s", default: "254164", describe: "Delay between timestamps"})
	.options("help", {alias: "h", describe: "Show usage help."}),
  argv= optimist.argv,
  os= require("os")

if(argv.help) {
	optimist.showHelp()
	process.exit()
}

var flume= new (require("flume").FlumeLog)(argv.target,argv.port),
  hostname= os.hostname()

// modified from http://stackoverflow.com/a/2579363
function ISODateString(d){
	function pad(n){return n<10 ? '0'+n : n}
	var offset= d.getTimezoneOffset()/-60,
	  offhr= Math.floor(offset)
	  offremain= offset- offhr,
	  offmin= offremain?(":"+pad(Math.floor(offremain*60))):""
	return d.getFullYear()+'-'
	  + pad(d.getMonth()+1)+'-'
	  + pad(d.getDate())+'T'
	  + pad(d.getHours())+':'
	  + pad(d.getMinutes())+':'
	  + pad(d.getSeconds())+'Z' +
	  + offhr + offmin ; }

var interval= setInterval(function(){
	var time= hrtime.uptime(),
	  date= new Date(),
	  hostname= os.hostname()
	flume.log("nanotimelog",{"nanotime":time,"walltime":ISODateString(date),"host":hostname})
},argv.millis)
