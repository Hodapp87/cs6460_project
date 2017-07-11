/*! skinny-bones-jekyll - v0.0.1 - 2014-08-27 */!function($){"use strict";$.fn.fitVids=function(options){var settings={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var head=document.head||document.getElementsByTagName("head")[0],css=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",div=document.createElement("div");div.innerHTML='<p>x</p><style id="fit-vids-style">'+css+"</style>",head.appendChild(div.childNodes[1])}return options&&$.extend(settings,options),this.each(function(){var selectors=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];settings.customSelector&&selectors.push(settings.customSelector);var ignoreList=".fitvidsignore";settings.ignore&&(ignoreList=ignoreList+", "+settings.ignore);var $allVideos=$(this).find(selectors.join(","));$allVideos=$allVideos.not("object object"),$allVideos=$allVideos.not(ignoreList),$allVideos.each(function(){var $this=$(this);if(!($this.parents(ignoreList).length>0||"embed"===this.tagName.toLowerCase()&&$this.parent("object").length||$this.parent(".fluid-width-video-wrapper").length)){$this.css("height")||$this.css("width")||!isNaN($this.attr("height"))&&!isNaN($this.attr("width"))||($this.attr("height",9),$this.attr("width",16));var height="object"===this.tagName.toLowerCase()||$this.attr("height")&&!isNaN(parseInt($this.attr("height"),10))?parseInt($this.attr("height"),10):$this.height(),width=isNaN(parseInt($this.attr("width"),10))?$this.width():parseInt($this.attr("width"),10),aspectRatio=height/width;if(!$this.attr("id")){var videoID="fitvid"+Math.floor(999999*Math.random());$this.attr("id",videoID)}$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*aspectRatio+"%"),$this.removeAttr("height").removeAttr("width")}})})}}(window.jQuery||window.Zepto),function($){var $w=$(window);$.fn.visible=function(partial,hidden,direction){if(!(this.length<1)){var $t=this.length>1?this.eq(0):this,t=$t.get(0),vpWidth=$w.width(),vpHeight=$w.height(),direction=direction?direction:"both",clientSize=hidden===!0?t.offsetWidth*t.offsetHeight:!0;if("function"==typeof t.getBoundingClientRect){var rec=t.getBoundingClientRect(),tViz=rec.top>=0&&rec.top<vpHeight,bViz=rec.bottom>0&&rec.bottom<=vpHeight,lViz=rec.left>=0&&rec.left<vpWidth,rViz=rec.right>0&&rec.right<=vpWidth,vVisible=partial?tViz||bViz:tViz&&bViz,hVisible=partial?lViz||lViz:lViz&&rViz;if("both"===direction)return clientSize&&vVisible&&hVisible;if("vertical"===direction)return clientSize&&vVisible;if("horizontal"===direction)return clientSize&&hVisible}else{var viewTop=$w.scrollTop(),viewBottom=viewTop+vpHeight,viewLeft=$w.scrollLeft(),viewRight=viewLeft+vpWidth,offset=$t.offset(),_top=offset.top,_bottom=_top+$t.height(),_left=offset.left,_right=_left+$t.width(),compareTop=partial===!0?_bottom:_top,compareBottom=partial===!0?_top:_bottom,compareLeft=partial===!0?_right:_left,compareRight=partial===!0?_left:_right;if("both"===direction)return!!clientSize&&viewBottom>=compareBottom&&compareTop>=viewTop&&viewRight>=compareRight&&compareLeft>=viewLeft;if("vertical"===direction)return!!clientSize&&viewBottom>=compareBottom&&compareTop>=viewTop;if("horizontal"===direction)return!!clientSize&&viewRight>=compareRight&&compareLeft>=viewLeft}}}}(jQuery),function($){$.fn.smoothScroller=function(options){options=$.extend({},$.fn.smoothScroller.defaults,options);var el=$(this);return $(options.scrollEl).animate({scrollTop:el.offset().top-$(options.scrollEl).position().top-options.offset},options.speed,options.ease,function(){var hash=el.attr("id");hash.length&&(history.pushState?history.pushState(null,null,"#"+hash):document.location.hash=hash),el.trigger("smoothScrollerComplete")}),this},$.fn.smoothScroller.defaults={speed:400,ease:"swing",scrollEl:"body",offset:0},$("body").on("click","[data-smoothscroller]",function(e){e.preventDefault();var href=$(this).attr("href");0===href.indexOf("#")&&$(href).smoothScroller()})}(jQuery),function($){var verboseIdCache={};$.fn.toc=function(options){var timeout,self=this,opts=$.extend({},jQuery.fn.toc.defaults,options),container=$(opts.container),headings=$(opts.selectors,container),headingOffsets=[],activeClassName=opts.activeClass,scrollTo=function(e,callback){if(opts.smoothScrolling&&"function"==typeof opts.smoothScrolling){e.preventDefault();var elScrollTo=$(e.target).attr("href");opts.smoothScrolling(elScrollTo,opts,callback)}$("li",self).removeClass(activeClassName),$(e.target).parent().addClass(activeClassName)},highlightOnScroll=function(){timeout&&clearTimeout(timeout),timeout=setTimeout(function(){for(var highlighted,top=$(window).scrollTop(),closest=Number.MAX_VALUE,index=0,i=0,c=headingOffsets.length;c>i;i++){var currentClosest=Math.abs(headingOffsets[i]-top);closest>currentClosest&&(index=i,closest=currentClosest)}$("li",self).removeClass(activeClassName),highlighted=$("li:eq("+index+")",self).addClass(activeClassName),opts.onHighlight(highlighted)},50)};return opts.highlightOnScroll&&($(window).bind("scroll",highlightOnScroll),highlightOnScroll()),this.each(function(){var el=$(this),ul=$(opts.listType);headings.each(function(i,heading){var $h=$(heading);headingOffsets.push($h.offset().top-opts.highlightOffset);var anchorName=opts.anchorName(i,heading,opts.prefix);if(heading.id!==anchorName){$("<span/>").attr("id",anchorName).insertBefore($h)}var a=$("<a/>").text(opts.headerText(i,heading,$h)).attr("href","#"+anchorName).bind("click",function(e){$(window).unbind("scroll",highlightOnScroll),scrollTo(e,function(){$(window).bind("scroll",highlightOnScroll)}),el.trigger("selected",$(this).attr("href"))}),li=$("<li/>").addClass(opts.itemClass(i,heading,$h,opts.prefix)).append(a);ul.append(li)}),el.html(ul)})},jQuery.fn.toc.defaults={container:"body",listType:"<ul/>",selectors:"h1,h2,h3",smoothScrolling:function(target,options,callback){$(target).smoothScroller({offset:options.scrollToOffset}).on("smoothScrollerComplete",function(){callback()})},scrollToOffset:0,prefix:"toc",activeClass:"toc-active",onHighlight:function(){},highlightOnScroll:!0,highlightOffset:100,anchorName:function(i,heading,prefix){if(heading.id.length)return heading.id;var candidateId=$(heading).text().replace(/[^a-z0-9]/gi," ").replace(/\s+/g,"-").toLowerCase();if(verboseIdCache[candidateId]){for(var j=2;verboseIdCache[candidateId+j];)j++;candidateId=candidateId+"-"+j}return verboseIdCache[candidateId]=!0,prefix+"-"+candidateId},headerText:function(i,heading,$heading){return $heading.text()},itemClass:function(i,heading,$heading,prefix){return prefix+"-"+$heading[0].tagName.toLowerCase()}}}(jQuery),$(document).ready(function(){$(".js-menu-trigger").on("click touchstart",function(e){$("body").toggleClass("no-scroll"),$(".js-menu, .js-menu-screen").toggleClass("is-visible"),$(".sliding-menu-button").toggleClass("slide close"),$("#masthead, #page-wrapper").toggleClass("slide"),e.preventDefault()}),$(".js-menu-screen").on("click touchstart",function(e){$("body").toggleClass("no-scroll"),$(".js-menu, .js-menu-screen").toggleClass("is-visible"),$(".sliding-menu-button").toggleClass("slide close"),$("#masthead, #page-wrapper").toggleClass("slide"),e.preventDefault()})}),$(document).ready(function(){$("#main").fitVids()});

function loadJSFile(filename){
    var fileref=document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

// Add startsWith
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

// Client side redirect to HTTPS
// Soonhok: This is not as good as server-side methods,
// however it seems that this is all we can do with github pages.
if (window.location.protocol != "https:" && window.location.hostname.indexOf("lean") >= 0) {
   if (!window.location.href.startsWith("http://localhost")) {
   window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
   }
}

function gup( name ){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) return "";
    else return results[1];
}

function elapsed_time_string(startTime) {
    var currentTime = new Date().getTime();
    return ((currentTime - startTime) / 1000.0) + "sec"
}

var myModule2 = (function() {
    // var lang = ace.require("ace/lib/lang");
    // var util = ace.require("ace/autocomplete/util")
    // var langTools = ace.require("ace/ext/language_tools");
    // var editor_main = ace.edit("editor_main");
    // editor_main.$blockScrolling = Infinity;
    // var Range = ace.require("ace/range").Range;
    // var editor_console = ace.edit("editor_console");
    // editor_console.$blockScrolling = Infinity;
    var livemode = location.search.match("(\\?|&)live") ? true : false;
    var tutorial_main_ratio = livemode ? 0.0 : 0.5;
    var main_console_ratio = (window.innerWidth > window.innerHeight) ? (livemode ? 0.5 : 0.8) : 0.5
    var menu_height = 40;
    var handle_width = 10;
    var theme = "ace/theme/subatomic";
    var lean_output_buffer = [];
    var default_filename = "input.lean";
    var codeText = gup("code");
    var url = gup("url");
    var seq_num = 0;
    var messages = [];
    var pocketgl = null;
    return {
        useHoTT: location.search.match("(\\?|&)hott") ? true : false,
        options: JSON.parse($.cookie("leanjs_options") || JSON.stringify({
            print_output_to_console: true,
            auto_compile: true,
            keyboard_mode: "ace"
        })),
        // editor_main: editor_main,
        // editor_console: editor_console,
        // Never used?
        push_output_buffer: function(text) {
            lean_output_buffer.push(text);
        },
        // Called in init_ace
        /*
        init_editor_main: function() {
            editor_main.session.setNewLineMode("unix");
            editor_main.setTheme(theme);
            editor_main.getSession().setMode("ace/mode/lean");
            editor_main.setShowPrintMargin(false);
            editor_main.setOption("scrollPastEnd", 0.7)
            editor_main.setOptions({enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: false,
                                    enableSnippets: true
                                   });
            editor_main.resize();
            this.syncDelay = lang.delayedCall(this.sync.bind(this), 200);
            editor_main.on('change',
                           function() {
                               myModule2.save_file(default_filename, editor_main.getValue());
                               if (myModule2.initialized && myModule2.options.auto_compile) {
                                   myModule2.syncDelay.delay();
                               }
                           });
            new TokenTooltip(editor_main);
        },
        // Called in init_ace
        init_editor_console: function() {
            editor_console.session.setNewLineMode("unix");
            editor_console.setTheme(theme);
            editor_console.setShowPrintMargin(false);
            editor_console.setOption("scrollPastEnd", 0.7)
            editor_console.setReadOnly(true);
            editor_console.getSession().setUseWrapMode(false);
            editor_console.renderer.setShowGutter(false);
            editor_console.resize();
        },
        */
        get_pocketgl: function() {
            return pocketgl;
        },
        set_pocketgl: function(x) {
            pocketgl = x;
        },
        // Called in sync
        get_tutorial_main_ratio: function() {
          return tutorial_main_ratio;
        },
        // Called in sync, and externally in consoleButton's click
        // listener (for #layout-button)
        set_tutorial_main_ratio: function(x) {
          tutorial_main_ratio = x;
        },
        // Called in sync
        get_main_console_ratio: function() {
          return main_console_ratio;
        },
        // Called in sync, and externally in consoleButton's click
        // listener (for #layout-button)
        set_main_console_ratio: function(x) {
          main_console_ratio = x;
        },
        // Called in init_resizable's callbacks, init_ace, and sync
        resize_editors: function () {
            var h = window.innerHeight;
            var w = window.innerWidth;
            var main_width, main_height, console_width, console_height, tutorial_width, tutorial_height;
            var main_top, main_left, console_top, console_left, tutorial_top, tutorial_left;
            if (livemode) {
                if (w >= h) {
                    // side by side + livemode
                    tutorial_width  = 0;
                    main_width      = Math.floor(w * main_console_ratio);
                    console_width   = w - main_width - handle_width;
                    tutorial_height = 0;
                    main_height     = (h - menu_height);
                    console_height  = main_height;

                    tutorial_top     = menu_height;
                    main_handle_top  = menu_height;
                    main_top         = menu_height;
                    console_top      = main_top;
                    sub_handle_top   = main_top;
                    tutorial_left    = 0;
                    main_handle_left = 0;
                    main_left        = 0;
                    sub_handle_left  = main_width;
                    console_left     = main_width + handle_width;

                    main_handle_background_image = "url(css/images/handle-h.png)";
                    main_handle_cursor = "row-resize";
                    sub_handle_background_image = "url(css/images/handle-v.png)";
                    sub_handle_cursor = "col-resize";

                    main_handle_width  = 2;
                    main_handle_height = 2;
                    sub_handle_width   = handle_width;
                    sub_handle_height  = console_height;
                } else {
                    // top & down + livemode
                    tutorial_width  = 0;
                    tutorial_height = 0;
                    main_width      = w;
                    main_height     = Math.floor((h - menu_height) * main_console_ratio);
                    console_width   = main_width;
                    console_height  = h - main_height - handle_width;

                    tutorial_top    = 0;
                    tutorial_left   = 0;
                    main_handle_top = menu_height;
                    main_handle_left = 0;

                    main_top        = menu_height;
                    main_left        = 0;
                    sub_handle_top  = main_top + main_height;
                    sub_handle_left  = main_left;
                    console_top     = main_top + main_height + handle_width;
                    console_left     = main_left;
                    main_handle_background_image = "url(css/images/handle-v.png)";
                    main_handle_cursor = "col-resize";
                    sub_handle_background_image = "url(css/images/handle-h.png)";
                    sub_handle_cursor = "row-resize";

                    main_handle_width  = 2;
                    main_handle_height = 2;
                    sub_handle_width   = console_width;
                    sub_handle_height  = handle_width;
                }
            } else {
                if (w >= h) {
                    // side by side, no livemode
                    tutorial_width  = Math.floor(w * tutorial_main_ratio);
                    main_width      = w - tutorial_width - handle_width;
                    console_width   = main_width;
                    tutorial_height = h - menu_height;
                    main_height     = Math.floor(tutorial_height * main_console_ratio);
                    console_height  = tutorial_height - main_height - handle_width;

                    tutorial_top    = menu_height;
                    main_handle_top = menu_height;
                    main_top        = tutorial_top;
                    sub_handle_top  = main_top + main_height;
                    console_top     = main_top + main_height + handle_width;

                    tutorial_left    = 0;
                    main_handle_left = tutorial_width;
                    main_left        = tutorial_width + handle_width;
                    sub_handle_left  = main_left;
                    console_left     = main_left;
                    main_handle_background_image = "url(css/images/handle-v.png)";
                    main_handle_cursor = "col-resize";
                    sub_handle_background_image = "url(css/images/handle-h.png)";
                    sub_handle_cursor = "row-resize";

                    main_handle_width  = handle_width;
                    main_handle_height = tutorial_height;
                    sub_handle_width   = console_width;
                    sub_handle_height  = handle_width;
                } else {
                    // top bottom, no livemode
                    tutorial_width  = w;
                    main_width      = Math.floor(w * main_console_ratio);
                    console_width   = w - main_width - handle_width;
                    tutorial_height = Math.floor((h - menu_height) * tutorial_main_ratio);
                    main_height     = (h - menu_height) - tutorial_height - handle_width;
                    console_height  = main_height;

                    tutorial_top     = menu_height;
                    main_handle_top  = tutorial_top + tutorial_height;
                    main_top         = tutorial_top + tutorial_height + handle_width;
                    console_top      = main_top;
                    sub_handle_top   = main_top;
                    tutorial_left    = 0;
                    main_handle_left = 0;
                    main_left        = 0;
                    sub_handle_left  = main_width;
                    console_left     = main_width + handle_width;

                    main_handle_background_image = "url(css/images/handle-h.png)";
                    main_handle_cursor = "row-resize";
                    sub_handle_background_image = "url(css/images/handle-v.png)";
                    sub_handle_cursor = "col-resize";

                    main_handle_width  = tutorial_width;
                    main_handle_height = handle_width;
                    sub_handle_width   = handle_width;
                    sub_handle_height  = console_height;
                }
            }
            main_handle_width  -= 2;
            main_handle_height -= 2;
            sub_handle_width   -= 2;
            sub_handle_height  -= 2;

            //$("#editor_console").css({position: "absolute", top: console_top, left: console_left,  width: console_width, height: console_height});
            $("#editor_main").css({position: "absolute", top: main_top, left:main_left, width: main_width, height: main_height});
            
            $("#resizable_handle_main").css({position: "absolute", top: main_handle_top, left:main_handle_left, width: main_handle_width, height: main_handle_height,
                                             "background-image": main_handle_background_image,
                                             "background-repeat": "no-repeat", cursor: main_handle_cursor,
                                             "background-position": "center",
                                             "border": "solid 1px #cccccc"
                                            });
            /*
            $("#resizable_handle_sub").css({position: "absolute", top: sub_handle_top, left:sub_handle_left, width: sub_handle_width, height: sub_handle_height,
                                             "background-image": sub_handle_background_image,
                                             "background-repeat": "no-repeat", cursor: sub_handle_cursor,
                                             "background-position": "center",
                                             "border": "solid 1px #cccccc"
                                           });
                                           */
            if (pocketgl !== null) {
                pocketgl.onWindowResize();
                if (pocketgl.editorFragment !== undefined &&
                    pocketgl.editorFragment !== null)
                {
                    pocketgl.editorFragment.resize();
                }
            }
            $("#tutorial_contents").css({position: "absolute", top: tutorial_top, left:tutorial_left, width: tutorial_width, height: tutorial_height});
            $("#setting_window").css({position: "absolute", top:tutorial_top, left:tutorial_left, width: tutorial_width, height: tutorial_height});
        },
        /*
        // Called in init_ace
        init_editor_keybindings: function() {
            var process_main_buffer_command = {
                name: 'run_lean',
                bindKey: {
                    win: 'shift-enter',
                    mac: 'shift-enter',
                    sender: 'editor|cli'
                },
                exec: function(env, args, request) {
                    myModule2.process_main_buffer();
                }
            };
            // editor_main.commands.addCommand(process_main_buffer_command);
            // editor_console.commands.addCommand(process_main_buffer_command);
            // editor_main.commands.bindKey("cmd-l", null);
            // editor_main.commands.bindKey("ctrl-l", null);
            // editor_console.commands.bindKey("cmd-l", null);
            // editor_console.commands.bindKey("ctrl-l", null);
        },
        */
        // Called in init_ace
        init_resizable: function() {
            $('#resizable_handle_main').mousedown(function(e){
                e.preventDefault();
                $(document).mousemove(function(event){
                    var h = window.innerHeight;
                    var w = window.innerWidth;
                    if (w >= h) {
                        // side by side
                        var x_pos = Math.min(w, event.clientX);
                        tutorial_main_ratio = x_pos / w;
                    } else {
                        // top and bottom
                        var y_pos = Math.max(menu_height, Math.min(event.clientY, h));
                        tutorial_main_ratio = (y_pos - menu_height) / (h - menu_height);
                    }
                    myModule2.resize_editors();
                });
            });
            /*
            $('#resizable_handle_sub').mousedown(function(e){
                e.preventDefault();
                $(document).mousemove(function(event){
                    var h = window.innerHeight;
                    var w = window.innerWidth;
                    if (livemode) {
                        if (w >= h) {
                            var x_pos = Math.min(w, event.pageX);
                            main_console_ratio = x_pos / w;
                        } else {
                            var y_pos = Math.max(menu_height, Math.min(event.pageY, h));
                            main_console_ratio = (y_pos - menu_height) / (h - menu_height);
                        }
                    } else {
                        if (w >= h) {
                            var y_pos = Math.max(menu_height, Math.min(event.pageY, h));
                            main_console_ratio = (y_pos - menu_height) / (h - menu_height);
                        } else {
                            var x_pos = Math.min(w, event.pageX);
                            main_console_ratio = x_pos / w;
                        }
                    }
                    myModule2.resize_editors();
                });
            });
            */
            $(document).mouseup(function(e){
                $(document).unbind('mousemove');
            });
        },
        // Called in init_ace
        /*
        init_autocomplete: function() {
            var leanCompleter = {
                getCompletions: function(editor, session, pos, prefix, callback) {
                    var popup = editor_main.completer.popup;
                    // TODO(soonhok): adjust the width automatically
                    if (popup)
                        popup.container.style.width=window.innerWidth * 0.8;
                    myModule2.sync();
                    myModule2.send({
                        command: "complete",
                        line: pos.row + 1,
                        column: pos.column
                    });
                    callback(null, myModule2.completions);
                },
                getDocTooltip: function(selected) {
                    if (!selected.docHTML)
                        selected.docHTML = "<tt>" + lang.escapeHTML(selected.meta) + "</tt>";
                }
            };
            langTools.setCompleters([leanCompleter]);
        },
        // Called in init_ace
        init_input_method: function() {
            editor_main.commands.on("afterExec", function (e) {
                if (e.command.name === "insertstring") {
                    if (e.args === " " || e.args === "\\") {
                        var pos = editor_main.getCursorPosition();
                        var line = editor_main.session.getLine(pos.row);
                        var place_to_search = e.args === " " ? pos.column -1 : pos.column - 2;
                        var index = index = line.lastIndexOf("\\", place_to_search) + 1
                        var match = line.substring(index, pos.column - 1);
                        if (index && corrections.hasOwnProperty(match)) {
                            var replaceText = corrections[match];
                            if (e.args === "\\") {
                                replaceText = replaceText + e.args;
                            }
                            editor_main.session.replace(
                                new Range(pos.row, index - 1, pos.row, pos.column),
                                replaceText
                            );
                        }
                    }
                }
            });
        },
        */
        // Called in init
        load_from_code: function() {
            if (codeText != "") {
                if(codeText.substr(-1) == '/') {
                    codeText = codeText.substr(0, codeText.length - 1);
                }
                var text = decodeURIComponent(escape(atob(codeText)));
                // editor_main.setValue(text, 1)
            }
        },
        // Called in init
        load_from_url: function() {
            if (url.match(/\.hlean$/)) {
                myModule2.useHoTT = true;
            }
            if (url.indexOf("://github.com/") > -1) {
                url = url.replace("://github.com", "://raw.githubusercontent.com");
                url = url.replace("/blob/", "/");
            } else if (url.indexOf("://gist.github.com") > -1) {
                url = url.replace("://gist.github.com", "://gist.githubusercontent.com");
                url = url + "/raw";
            }
            $.ajaxPrefilter(function(options) {
                if (options.url.match(/\.js$/)) {
                    return;
                } else if (options.crossDomain && jQuery.support.cors) {
                    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
                    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
                    //options.url = "http://cors.corsproxy.io/url=" + options.url;
                }
            });
            $.get(url, function(data) {
                // myModule2.editor_main.setValue(data, 1);
            });
        },
        // Called in editor_main's change callback
        save_file: function(filename, text) {
            //$.cookie("leanjs", myModule2.editor_main.getValue());
        },
        // Called in init
        init_ace: function() {
            //myModule2.init_editor_main();
            //myModule2.init_editor_console();
            // myModule2.init_editor_keybindings();
            myModule2.init_resizable();
            //myModule2.init_input_method();
            //myModule2.init_autocomplete();
            myModule2.resize_editors();
            window.onresize = function(event) { myModule2.resize_editors(); };
        },
        // Called in loadTutorial
        scrollTutorialTo: function(anchor) {
            setTimeout(function() {
                $('#tutorial_contents').ready(function() {
                    $('#tutorial_contents').animate({
                        scrollTop: $('#tutorial_contents').scrollTop() + $('#' + anchor).position().top
                    }, 'slow');
                })}, 50);
        },
        // Called in loadTutorial, init_nav
        file2title: function(filename) {
            return filename.split("_").join(" ").replace(".html", "");
        },
        // Called in init_nav
        title2file: function(title) {
            return title.split(" ").join("_") + ".html";
        },
        loadTutorial: function(filename, anchor) {
            // Load File
            $("#tutorial_contents").load(filename, function() {
                if (anchor) {
                    myModule2.scrollTutorialTo(anchor);
                }
                // save the file in hash & cookie
                location.hash = "#" + encodeURIComponent(filename);
                $.cookie("leanjs_tutorial_chapter_filename", filename);
            });
            // Set the right value for tutorialNav
            $('#tutorialNav').val(myModule2.file2title(filename));
            // Hide Setting
            $("#setting_window").hide();
        },
        // Called in init
        init_nav: function() {
            // Setup Navigation: note that the variable lean_nav_data
            // is loaded from 'js/nav_data.js' which is built by
            // 'build_nav_data' build target.
            $('#tutorialNav').hide();
            if (!livemode) {
                $.getScript("js/nav_data.js", function(){
                    $.each(lean_nav_data, function(key, value) {
                        // e.g. "02_Dependent_Type_Theory.html" => "02 Dependent Type Theory"
                        var title = myModule2.file2title(value);
                        $('#tutorialNav').append("<option>" + title + "</option>");
                    });
                    $('#tutorialNav').on('change', function (e) {
                        var fileName = myModule2.title2file(this.value);
                        myModule2.loadTutorial(fileName, null);
                    });
                    $('#tutorialNav').show();
                    // Load chapter (hash, cookie or default)
                    var saved_file = decodeURIComponent(location.hash.substr(1)) || $.cookie("leanjs_tutorial_chapter_filename");
                    if (saved_file && saved_file != "" && $.inArray(saved_file, lean_nav_data)) {
                        myModule2.loadTutorial(saved_file, null);
                    } else {
                        myModule2.loadTutorial(lean_nav_data[0], null);
                    }
                });
            }
        },
        // Called in init
        init_settings: function() {
            // Setting Window & Button
            $("#setting_window").hide();
            $("#close_setting_window").click(function(e) { $("#setting_window").hide(); });
            $("#setting_window").css({background: "white", opacity: 0.98});
            $("#setting_contents").css({ padding: 40});
            $('#print_output_to_console').prop("checked", myModule2.options.print_output_to_console);
            $('#print_output_to_console').on('change', function (e) {
                myModule2.options.print_output_to_console = this.checked;
                $.cookie("leanjs_options", JSON.stringify(myModule2.options));
            });
            $('#auto_compile').on('change', function (e) {
                myModule2.options.auto_compile = this.checked;
                $("#run-button").css("display", this.checked ? "none" : "block");
                $.cookie("leanjs_options", JSON.stringify(myModule2.options));
            });
            $('#auto_compile').prop("checked", myModule2.options.auto_compile).trigger("change");
            $('#keyboard_mode').on('change', function (e) {
                myModule2.options.keyboard_mode = this.value;
                //editor_main.setKeyboardHandler("ace/keyboard/" + this.value);
                $.cookie("leanjs_options", JSON.stringify(myModule2.options));
            });
            $('#keyboard_mode').val(myModule2.options.keyboard_mode).trigger("change");
            $(function () {
                var settingButton = document.querySelector("#setting-button");
                settingButton.addEventListener("click", function() {
                    $("#setting_window").toggle();
                });
            });
        },
        // Called at toplevel
        init: function() {
            myModule2.init_nav();
            myModule2.init_settings();
            this.append_console_nl("Lean.JS: running the Lean Theorem Prover in your browser");
            this.append_console("-- Initializing Ace Editor...     ");
            var start_time = new Date().getTime();
            myModule2.init_ace();
            myModule2.append_console("Done");
            myModule2.append_console_nl("(" + elapsed_time_string(start_time) + ")");
            if (codeText != "") {
                myModule2.load_from_code();
            } else if (url != "") {
                myModule2.load_from_url();
            } else {
                var cookie_contents = $.cookie("leanjs");
                if (cookie_contents && cookie_contents != "") {
                    //myModule2.editor_main.setValue(cookie_contents, 1);
                    myModule2.append_console_nl("-- Text loaded from cookie.");
                }
            }
        },
        // Called in process_main_buffer, presentErrorMessages
        clear_console: function() {
            //editor_console.setValue("", 1);
        },
        // Called throughout
        append_console: function(text) {
            //editor_console.setValue(editor_console.getValue() + text, 1);
        },
        // Called throughout
        append_console_nl: function(text) {
            this.append_console(text)
            this.append_console("\n")
        },
        // Called in Module's postRun
        init_lean: function() {
            var start_time = new Date().getTime();
            myModule2.append_console("-- Initializing Lean...           ");
            setTimeout(function() {
                //Module.lean_init();
                myModule2.append_console("Done");
                myModule2.append_console_nl("(" + elapsed_time_string(start_time) + ")");
            }, 5);
        },
        // Called from runButton (#run-button),
        // process_main_buffer_command keybinding
        process_main_buffer: function() {
            this.clear_console();
            myModule2.append_console_nl("-- Processing...");
            var start_time = new Date().getTime();
            setTimeout(function() {
                myModule2.sync();
                myModule2.append_console("-- Done");
                myModule2.append_console_nl("(" + elapsed_time_string(start_time) + ")");
            }, 1);
        },
        // Called in sync?
        send: function(msg) {
            /*
            if (!Module.lean_process_request)
                return;
            msg.seq_num = seq_num++;
            msg.file_name = default_filename;
            msg = JSON.stringify(msg);
            var len = Module.lengthBytesUTF8(msg) + 1;
            var msgPtr = Module._malloc(len);
            Module.stringToUTF8(msg, msgPtr, len);
            Module.lean_process_request(msgPtr);
            Module._free(msgPtr);
            */
        },
        // Called in Module postRun, possibly by Ace editor?
        sync: function() {
            var need_to_resize = false
            if (myModule2.get_main_console_ratio() == 1.0) {
                myModule2.set_main_console_ratio(0.8);
                need_to_resize = true;
            }
            if (myModule2.get_tutorial_main_ratio() == 1.0) {
                myModule2.set_tutorial_main_ratio(0.5);
                need_to_resize = true;
            }
            if (need_to_resize) {
                next_image = "square.svg";
                $("#layout-button>img")[0].src = "./images/" + next_image;
                myModule2.resize_editors();
            }
            var start_time = new Date().getTime();
            this.send({
                command: "sync",
                content: "", // editor_main.getValue()
            });
            if (this.initialized) {
                this.presentErrorMessages();
                myModule2.append_console("Done");
                myModule2.append_console_nl("(" + elapsed_time_string(start_time) + ")");
            }
        },
        // Called in processResponse
        processErrorMessage: function(msg) {
            var type = msg.severity;
            if (type == "information") {
                type = "info";
            }
            messages.push({
                row: msg.pos_line - 1,
                endRow: msg.pos_line,
                column: msg.pos_col,
                endColumn: msg.pos_col,
                text: msg.text,
                type: type
            });
        },
        // Called in sync
        presentErrorMessages: function() {
            this.clear_console();
            if (this.print_output_to_console) {
                for (var i = 0; i < messages.length; i++) {
                    var msg = messages[i];
                    this.append_console_nl((msg.row + 1) + ":" + msg.column + ":" + msg.type + ": " + msg.text);
                }
            }
            // editor_main.session.setAnnotations(messages);
        },
        // Called in Module 'print'
        processResponse: function(msg) {
            console.log(msg);
            switch (msg.response) {
            case "ok":
                if ("prefix" in msg) {
                    this.completions = msg.completions.map(function(compl) {
                        return {
                            value: compl.text,
                            meta:  compl.type
                        };
                    });
                } else if (msg.record) {
                    var marked = [];
                    var response = msg;
                    if (response.record['full-id']) {
                        var msg = response.record['full-id'] + ' : ' + response.record['type'];
                        marked.push(msg);
                    }
                    if (response.record.doc) {
                        marked.push(response.record.doc);
                    }
                    if (response.record.state && !marked.length) {
                        marked.push(response.record.state);
                    }
                    this.info = marked.join("\n");
                }
                break;
            case "additional_message":
                this.processErrorMessage(msg.msg);
                break;
            case "all_messages":
                messages = [];
                for (var i = 0; i < msg.msgs.length; i++)
                    this.processErrorMessage(msg.msgs[i]);
                break;
            default:
                console.log("Unknown response type: ", msg.response);
            }
        }
    };})();

// New Button
$(function () {
    var newButton = document.querySelector("#new-button");
    newButton.addEventListener("click", function() {
        //myModule2.editor_main.setValue("", 1);
    });
});
// Run Button
$(function () {
    var runButton = document.querySelector("#run-button");
    runButton.addEventListener("click", function() {
        myModule2.process_main_buffer();
    });
});
// Console Button
$(function () {
    var consoleButton = document.querySelector("#layout-button");
    consoleButton.addEventListener("click", function() {
        var h = window.innerHeight;
        var w = window.innerWidth;
        var current_image_url = $("#layout-button>img")[0].src;
        var current_image = current_image_url.split("/").pop();
        var next_image = "";
        var livemode = location.search.match("(\\?|&)live") ? true : false;
        if (w >= h) {
            if (current_image == "square.svg") {
                myModule2.set_tutorial_main_ratio(1.0);
                myModule2.set_main_console_ratio(1.0);
                next_image = "square-landscape-main-code.svg";
            } else if (current_image == "square-landscape-main-code.svg") {
                if (livemode) {
                    myModule2.set_main_console_ratio(0.5);
                    next_image = "square.svg";
                } else {
                    myModule2.set_tutorial_main_ratio(0.5);
                    myModule2.set_main_console_ratio(1.0);
                    next_image = "square-landscape-main-code-console.svg";
                }
            } else if (current_image == "square-landscape-main-code-console.svg") {
                myModule2.set_tutorial_main_ratio(0.5);
                myModule2.set_main_console_ratio(0.8);
                next_image = "square.svg";
            }
        } else {
            if (current_image == "square.svg") {
                myModule2.set_tutorial_main_ratio(1.0);
                myModule2.set_main_console_ratio(1.0);
                next_image = "square-portrait-main-code.svg";
            } else if (current_image == "square-portrait-main-code.svg") {
                if (livemode) {
                    myModule2.set_main_console_ratio(0.5);
                    next_image = "square.svg";
                } else {
                    myModule2.set_tutorial_main_ratio(0.5);
                    myModule2.set_main_console_ratio(1.0);
                    next_image = "square-portrait-main-code-console.svg";
                }
            } else if (current_image == "square-portrait-main-code-console.svg") {
                myModule2.set_tutorial_main_ratio(0.5);
                myModule2.set_main_console_ratio(0.8);
                next_image = "square.svg";
            }
        }
        $("#layout-button>img")[0].src = "./images/" + next_image;
        myModule2.resize_editors();
    });
});

myModule2.init();

// $.ajaxPrefilter(undefined);
// loadJSFile("https://cdn.rawgit.com/gportelli/pocket.gl/v1.2.3/dist/pocket.gl.min.js");
//loadJSFile("https://cdn.rawgit.com/Hodapp87/pocket.gl/2111d6ba/dist/pocket.gl.min.js");
loadJSFile("dist/pocket.gl.js");
//myModule2.append_console("-- Loading pocket.gl...            ");

params = {
    copyright: "CS6460 Draft",
    editorTheme: "dark",
    fluidWidth: true,
    fragmentShaderFile: "./spiral.glsl",
    fragmentShaderIncludeFiles: ["sphere_tracer.glsl", "lib.glsl"],
    uniforms: [
        {
            "type": "float",
            "value": 0.1,
            "min": -1,
            "max": 1,
            "name": "freq",
            "GUIName": "Freq1"
        },
        {
            "type": "float",
            "value": -0.19,
            "min": -1,
            "max": 1,
            "name": "freq2",
            "GUIName": "Freq2"
        },
        {
            "type": "float",
            "value": -0.04,
            "min": -1,
            "max": 1,
            "name": "f_rad",
            "GUIName": "Rad"
        },
        {
            "type": "float",
            "value": 0,
            "min": -5,
            "max": 5,
            "name": "f_inv",
            "GUIName": "Inv"
        },
        {
            "type": "float",
            "value": 5,
            "min": -10,
            "max": 10,
            "name": "f_sin",
            "GUIName": "SinAmp"
        },
        {
            "type": "float",
            "value": -0.22,
            "min": -1,
            "max": 1,
            "name": "a_sin",
            "GUIName": "SinFreq"
        },
        {
            "type": "float",
            "value": 1,
            "min": -10,
            "max": 10,
            "name": "f2_sin",
            "GUIName": "SinFreq2"
        }
    ],
    textures: [
        { 
            url: "grid.jpg", 
            wrap: "repeat", // repeat (default), clamp
            name: "texture"
        }
    ],
    animated: true,
}

window.addEventListener("load", function () { 
    myModule2.set_pocketgl(new PocketGL("editor_main", params));
});
