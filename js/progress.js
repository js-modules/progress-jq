;(function(window,document,undefined,$){
    $.fn.leafProgress = function(option){
        var opts = $.extend({},$.fn.leafProgress.methods,$.fn.leafProgress.defaults,option);
        opts.init($(this),opts);
        return opts;
    };
    $.fn.leafProgress.methods = {
        sliderWidth:0,
        init:function(that,opts){
            opts.template(that,opts);
            opts.sliderWidth = opts.width;
            opts.events(that,opts);
            opts.setProgress(that,opts);
        },
        template:function(that,opts){
            var html = "<span class='percent'></span>"+
                "	<span class='progress-bar'></span>";
            that.append(html);
            that.addClass("progress");
        },
        setProgress:function(that,opts){
            if(opts.width){
                var width = (that.width()-that.find(".progress-bar").width()) * (parseInt(opts.width)/100);
                opts.changeProgress(that,width);
            }
        },
        events:function(that,opts){
            if(opts.flag){
                that.find(".progress-bar").mousedown(function(e){
                    var x = getXY(e).x;
                    var left =  $(this).offset().left - $(this).offsetParent().offset().left;
                    var maxW = that.width() - $(this).width();
                    var nx = 0;
                    var nleft = 0;
                    $(document).mousemove(function(e){
                        nx = getXY(e).x;
                        nleft = left + (nx-x);
                        if(nleft<0)nleft=0;
                        if(nleft>maxW)nleft=maxW;
                        opts.changeProgress(that,nleft);
                        opts.setSliderWidth(that,opts,nleft);
                        window.getSelection ? window.getSelection().removeAllRanges() : window.selection.empty();
                    });
                    $(document).mouseup(function(){
                        $(this).off("mousemove");
                        $(this).off("mousedown");
                        opts.callback && opts.callback(opts);
                    });
                });
                that.mousedown(function (e) {
                    var left = that.offset().left;
                    var barw = that.find(".progress-bar").width();
                    var nl = getXY(e).x - left - (barw/2);
                    var max = that.width() - barw;
                    if(nl<0)nl=0;
                    if(nl>max)nl=max;
                    opts.changeProgress(that,nl);
                    opts.setSliderWidth(that,opts,nl);
                    opts.callback && opts.callback(opts);
                });
            }
        },
        changeProgress:function (that,x) {
            that.find(".percent").css({width:Math.max(0,x)});
            that.find(".progress-bar").css({left:x});
        },
        setSliderWidth:function(that,opts,value){
            var w = that.width() - that.find(".progress-bar").width();
            var percent = (value/w);
            opts.sliderWidth = percent;
        }
    };
    $.fn.leafProgress.defaults = {
        flag:true
    };
})(window,document,undefined,jQuery);

function getXY(e){
    var ev = e || window.event;
    var sleft = document.body.scrollLeft || document.documentElement.scrollLeft;
    var stop = document.body.scrollTop || document.documentElement.scrollTop;
    var x = ev.pageX || (ev.clientX + sleft);
    var y = ev.pageY || (ev.clientY + stop);
    return {x:x,y:y};
}