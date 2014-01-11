/*
* Copyright (c) Codiad & Andr3as, distributed
* as-is and without warranty under the MIT License.
* See http://opensource.org/licenses/MIT for more information.
* This information must remain intact.
*/

(function(global, $){
    
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.CodeDocs.init();
    });

    codiad.CodeDocs = {
        
        path: curpath,
        
        init: function() {
            var _this = this;
            $.getScript(this.path+"uglifyjs.js");
            $.getScript(this.path+"jsdox.js");
            // context menu
            // @version 1.0
            amplify.subscribe('context-menu.onShow', function(obj){
                var ext = _this.getExtension(obj.path);
                if (ext == "js") {
                    $('#context-menu').append('<hr class="file-only codeDocs">');
                    $('#context-menu').append('<a class="file-only codeDocs" onclick="codiad.CodeDocs.contextMenu($(\'#context-menu\').attr(\'data-path\'));"><span class="icon-doc-text"></span>Generate doc</a>');
                }
            });
            amplify.subscribe('context-menu.onHide', function(){
                $('.codeDocs').remove();
            });
            // load Complete addon
            if (typeof(codiad.Complete) !== 'undefined') {
                $.getScript(this.path+"complete_addon.js");
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Function to handle context menu click
        //
        //  Parameters:
        //
        //  path - {String} - Path of file
        //
        //////////////////////////////////////////////////////////
        contextMenu: function(path) {
            this.parse(path);
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Create documentation of file
        //
        //  Parameters:
        //
        //  path - {String} - Path of file
        //
        //////////////////////////////////////////////////////////
        parse: function(path) {
            var _this = this;
            var ext = this.getExtension(path);
            if (ext == "js") {
                $.get(this.path+"controller.php?action=getContent&path="+path, function(data){
                    var result = jsdox(data);
                    _this.saveDoc(path, result);
                });
            }
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Save documentation of file
        //
        //  Parameters:
        //
        //  path - {String} - Path of the original file
        //  result - {String} - Content of the documentation file
        //
        //////////////////////////////////////////////////////////
        saveDoc: function(path, result) {
            path = path.substring(0,path.lastIndexOf("."))+".md";
            $.post(this.path+"controller.php?action=saveDoc", {path: path, result: result}, function(data){
                json = JSON.parse(data);
                if (json.status == "error") {
                    codiad.message.error(json.message);
                } else {
                    codiad.message.success(json.message);
                    codiad.filemanager.rescan(path.substring(0,path.lastIndexOf("/")));
                }
            });
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Get extension of file
        //
        //  Parameters:
        //
        //  path - {String} - Path of the file
        //
        //////////////////////////////////////////////////////////
        getExtension: function(path) {
            return path.substring(path.lastIndexOf(".")+1);
        },
        
        //////////////////////////////////////////////////////////
        //
        //  Test if item is at the end of string
        //
        //  Parameters:
        //
        //  string - {String} - String to search in
        //  item - {String} - Item to search for
        //
        //////////////////////////////////////////////////////////
        isAtEnd: function(string, item) {
            var pos = string.lastIndexOf(item);
            if (pos != -1) {
                var part = string.substring(pos);
                if (part === item) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    };
})(this, jQuery);