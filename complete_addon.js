// CompletePlus addon
// @version 1.1
amplify.subscribe('Complete.Normal', function(obj){
    if (obj.syntax == "javascript") {
        if (codiad.CodeDocs.isAtEnd(obj.before, "@"+obj.prefix)) {
			var buf = [];
			$.each(jsdox.TAGS, function(i, item){
				buf.push(codiad.Complete.pluginParser(i, i, "@"+i));
			});
			if (buf.length !== 0) {
				codiad.Complete.pluginNormal(buf);
			}
		}
    }
});