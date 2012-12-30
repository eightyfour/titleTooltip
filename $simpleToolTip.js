/**
 * e.g.:
 *  $(document).ready(function(){
 *      $("#mouseHoverMe").simpleToolTip({
 *          id: '#showMyContentInSimpleToolTip',
 *          extraClass: '.defineExtraClassForSpecialStyles'
 *      });
 *  });
 *
 *  Has only a Canvas triangle on bottom left and bottom center (no canvas supported browser has a graphic).
 * 
 */
(function($){
    function log(string){
        console.log(string);
    }
    var methods = {
        init : function(settings){
        },isMouseInField: function(top,left,width,height,e){
            // important when cursor is over the tooltip
            if(e.pageY < top || e.pageY > (top+height+20)){
                return false;
            }
            if(e.pageX < left || e.pageX > (left+width+20)){
                return false;
            }
            return true;
        },createFallbackArrow : function (){
            var element = $(document.createElement("div"));
            $(element).addClass('tooltip_sprite bottom triangle');
            return element;
        },drawCanvas : function(element){
            // if top bottom left right?
            var ctx = element.getContext("2d");
            //define the color of the line
            ctx.strokeStyle = "rgba(0,0,0,0.0)";
            //define the starting point of line1 (x1,y1)
            ctx.moveTo(0,0);
            ctx.lineTo(20,0);
            ctx.lineTo(10,12);
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur=4;
            ctx.shadowColor= 'rgba(0,0,0,0.3)';
            ctx.stroke();
            ctx.fillStyle="#fff";
            ctx.fill();
            return element;
        },setCanvasCss : function(settings,element){
            switch(settings.trianglePosition){
                case 'bottomCenter':methods.setTriangleBottomCenter(settings,element);break;
                case 'bottomLeft':
                default:
                    methods.setTriangleBottomLeft(settings,element);
            }
        },setTriangleBottomLeft : function(settings,element){
            $(element).css("background-color","transparent").css("bottom","-20px").css("position","absolute").css("left","20px");
        },setTriangleBottomCenter : function(settings,element){
            var widthTooltip = $('#simpleToolTip').outerWidth(true);
            var widthTriangle = $(element).outerWidth(true);
            var x = (widthTooltip/2)-(widthTriangle/2);
            $(element).css("background-color","transparent").css("bottom","-20px").css("position","absolute").css("left",x+"px");
        },setsimpleToolTipCss : function(settings,element){
            $(element).
                    css("width",settings.width).
                    css("position","absolute").
                    css("background-color","#ffffff").
                    css("z-index","200000").
                    css("box-shadow","2px 2px 7px 0 rgba(0, 0, 0, 0.75)");
            $(element).addClass("base border allBorderRadius");
        },browserCompatibleCSS : function(element){
            //            $(element).css("border","1px solid #ff0000");
            $(element).addClass("noCanvas");
        }
    }
    /**
     * Settings:
     *      html: pass directly html to html parameter like: html: '<p>Simple Tooltip'</p>
     *      id: define the id and the body content is displayed in the tooltip
     *          will ignore when html is set
     *      extraClass: give the parent element a css class
     *      width: define the width for the simple tooltip - default is auto
     *      trianglePosition: bottomLeft(default), bottomCenter
     * @param method
     */
    $.fn.simpleToolTip = function(method){
        var settings = $.extend({
            html: 'no',
            id: '',
            width: "auto",
            extraClass: '',
            trianglePosition: 'bottomLeft'
        },method);

        settings = $.extend({
            root: this
        },settings);

        this.bind({
            mouseenter: function(e){
                var height = 0;
                var arrow = document.createElement("canvas");

                var canvasSupport = false;
                if (arrow.getContext) {
                    arrow.setAttribute("id", "simpleToolTipCanvas");
                    arrow.setAttribute("width", "20");
                    arrow.setAttribute("height", "20");
                    canvasSupport = true;
                    arrow = methods.drawCanvas(arrow);
                    height = height-(arrow.height/2);
                }else{
                    arrow = methods.createFallbackArrow();
                    arrow.attr("id", "simpleToolTipCanvas");
                    height =  height -10;
                }

                var simpleToolTip = $('#simpleToolTip');
                if(simpleToolTip.length == 0){
                    simpleToolTip = $(document.createElement("div"));
                    simpleToolTip.attr("id", "simpleToolTip");
                    $('body').append(simpleToolTip);
                }
                if(settings.html != 'no'){
                    $(simpleToolTip).html(settings.html).prepend(arrow);
                } else {
                    $(simpleToolTip).prepend($(settings.id).html()).prepend(arrow);
                }
                $(simpleToolTip).addClass(settings.extraClass);

                methods.setsimpleToolTipCss(settings, "#simpleToolTip");
                // set position of canvas
                methods.setCanvasCss(settings, arrow);

                height = height+($(this).offset().top - ($(simpleToolTip).height())-7);
                height = height<0?0:height;
                switch(settings.trianglePosition){
                    case 'bottomCenter':
                        $(simpleToolTip).css({
                            "left":$(this).offset().left-($(simpleToolTip).outerWidth(true)/2)+($(this).width()/2),
                            "top": height,
                            "opacity":1
                        });break;
                    case 'bottomLeft':
                    default:
                        $(simpleToolTip).css("left",$(this).offset().left-10).css("top",height ).css("opacity","1");
                }

                if(!canvasSupport){
                    methods.browserCompatibleCSS('#simpleToolTip');
                }
            },mouseleave: function(e){
                $("#simpleToolTip").css("opacity","0").empty();
            }
        });
        // Method calling logic
        if ( methods[method] ) {
            // is calling when you pass a method in constructor $('div').tooltip('hide');
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            methods.init.apply(this,[settings]);
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
        return this;
    };
})(jQuery);
