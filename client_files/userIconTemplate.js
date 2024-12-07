(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['userIcon'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"User\">\n    <div class = \"user_icon\">\n        <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"iconURL") || (depth0 != null ? lookupProperty(depth0,"iconURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconURL","hash":{},"data":data,"loc":{"start":{"line":3,"column":18},"end":{"line":3,"column":29}}}) : helper)))
    + "\">\n    </div>\n    <div class = \"user_name\">\n        <h4>"
    + alias4(((helper = (helper = lookupProperty(helpers,"userName") || (depth0 != null ? lookupProperty(depth0,"userName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userName","hash":{},"data":data,"loc":{"start":{"line":6,"column":12},"end":{"line":6,"column":24}}}) : helper)))
    + "</h4>\n    </div>\n\n</div>";
},"useData":true});
})();