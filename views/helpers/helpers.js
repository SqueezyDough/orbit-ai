var Handlebars = require("handlebars");

Handlebars.registerHelper("increment", function(value)
{
    return parseInt(value) + 1;
});