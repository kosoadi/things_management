function runAllAccess(callback){
	console.log("11323q323212313");
	callback();
}

function wait10sec(){
    setTimeout(function(){
        runAllAccess(wait10sec);
    }, 10000);
}

runAllAccess(wait10sec);