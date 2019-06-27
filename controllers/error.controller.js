exports.notFound = function (req, res) {
	res.status(400);
	res.render("pages/errors/404", {title: "404: You've past beyond the observable universe."});
};

exports.serverError = function(error, req, res) {
	res.status(500);
	res.render("pages/errors/500", {title:"500: Synchronisation failure: ", error: error});
};