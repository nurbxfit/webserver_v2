module.exports = () =>{
	const length = 12;
	const charsets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	var password = "";
	for(var i=0, n = charsets.length; i < length; i++){
		password +=	charsets.charAt(Math.floor(Math.random()*n));
	}
	return password;
}