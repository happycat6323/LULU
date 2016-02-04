
(function (window){

    var Sakri = window.Sakri || {};
    window.Sakri = window.Sakri || Sakri;

    Sakri.Geom = {};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    Sakri.Geom.Point = function (x,y){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    Sakri.Geom.Point.prototype.clone = function(){
        return new Sakri.Geom.Point(this.x,this.y);
    };

    Sakri.Geom.Point.prototype.update = function(x, y){
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    Sakri.Geom.Point.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y;
    };

    Sakri.Geom.Point.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+"}";
    };



    //==================================================
    //===================::RECTANGLE::==================
    //==================================================

    Sakri.Geom.Rectangle = function (x, y, width, height){
        this.update(x, y, width, height);
    };

    Sakri.Geom.Rectangle.prototype.update = function(x, y, width, height){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
        this.width = isNaN(width) ? 0 : width;
        this.height = isNaN(height) ? 0 : height;
    };


    Sakri.Geom.Rectangle.prototype.getRight = function(){
        return this.x + this.width;
    };

    Sakri.Geom.Rectangle.prototype.getBottom = function(){
        return this.y + this.height;
    };

    Sakri.Geom.Rectangle.prototype.getCenterX = function(){
        return this.x + this.width/2;
    };

    Sakri.Geom.Rectangle.prototype.getCenterY = function(){
        return this.y + this.height/2;
    };

    Sakri.Geom.Rectangle.prototype.containsPoint = function(x, y){
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };


    Sakri.Geom.Rectangle.prototype.clone = function(){
        return new Sakri.Geom.Rectangle(this.x, this.y, this.width, this.height);
    };

    Sakri.Geom.Rectangle.prototype.toString = function(){
        return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
    };

}(window));

(function (window){

    var Sakri = window.Sakri || {};
    window.Sakri = window.Sakri || Sakri;

    Sakri.CanvasTextUtil = {};

    //returns the biggest font size that best fits into rect
    Sakri.CanvasTextUtil.getFontSizeForWidth = function(string, fontProps, width, canvas, fillStyle, maxFontSize){
        if(!canvas){
            var canvas = document.createElement("canvas");
        }
        if(!fillStyle){
            fillStyle = "#000000";
        }
        if(isNaN(maxFontSize)){
            maxFontSize = 500;
        }
        var context = canvas.getContext('2d');
        context.font = fontProps.getFontString();
        context.textBaseline = "top";

        var copy = fontProps.clone();
        //console.log("getFontSizeForWidth() 1  : ", copy.fontSize);
        context.font = copy.getFontString();
        var textWidth = context.measureText(string).width;

        //SOME DISAGREEMENT WHETHER THIS SHOOULD BE WITH && or ||
        if(textWidth < width){
            while(context.measureText(string).width < width){
                copy.fontSize++;
                context.font = copy.getFontString();
                if(copy.fontSize > maxFontSize){
                    console.log("getFontSizeForWidth() max fontsize reached");
                    return null;
                }
            }
        }else if(textWidth > width){
            while(context.measureText(string).width > width){
                copy.fontSize--;
                context.font = copy.getFontString();
                if(copy.fontSize < 0){
                    console.log("getFontSizeForWidth() min fontsize reached");
                    return null;
                }
            }
        }
        //console.log("getFontSizeForWidth() 2  : ", copy.fontSize);
        return copy.fontSize;
    }



    //====================
    //======::CANVAS TEXT PROPERTIES::====
    //=======================

    Sakri.CanvasTextProperties = function(fontWeight, fontStyle, fontSize, fontFace){
        this.setFontWeight(fontWeight);
        this.setFontStyle(fontStyle);
        this.setFontSize(fontSize);
        this.fontFace = fontFace ? fontFace : "sans-serif";
    };

    Sakri.CanvasTextProperties.NORMAL = "normal";
    Sakri.CanvasTextProperties.BOLD = "bold";
    Sakri.CanvasTextProperties.BOLDER = "bolder";
    Sakri.CanvasTextProperties.LIGHTER = "lighter";

    Sakri.CanvasTextProperties.ITALIC = "italic";
    Sakri.CanvasTextProperties.OBLIQUE = "oblique";


    Sakri.CanvasTextProperties.prototype.setFontWeight = function(fontWeight){
        switch (fontWeight){
            case Sakri.CanvasTextProperties.NORMAL:
            case Sakri.CanvasTextProperties.BOLD:
            case Sakri.CanvasTextProperties.BOLDER:
            case Sakri.CanvasTextProperties.LIGHTER:
                this.fontWeight = fontWeight;
                break;
            default:
                this.fontWeight = Sakri.CanvasTextProperties.NORMAL;
        }
    };

    Sakri.CanvasTextProperties.prototype.setFontStyle = function(fontStyle){
        switch (fontStyle){
            case Sakri.CanvasTextProperties.NORMAL:
            case Sakri.CanvasTextProperties.ITALIC:
            case Sakri.CanvasTextProperties.OBLIQUE:
                this.fontStyle = fontStyle;
                break;
            default:
                this.fontStyle = Sakri.CanvasTextProperties.NORMAL;
        }
    };

    Sakri.CanvasTextProperties.prototype.setFontSize = function(fontSize){
        if(fontSize && fontSize.indexOf && fontSize.indexOf("px")>-1){
            var size = fontSize.split("px")[0];
            fontProperites.fontSize = isNaN(size) ? 24 : size;//24 is just an arbitrary number
            return;
        }
        this.fontSize = isNaN(fontSize) ? 24 : fontSize;//24 is just an arbitrary number
    };

    Sakri.CanvasTextProperties.prototype.clone = function(){
        return new Sakri.CanvasTextProperties(this.fontWeight, this.fontStyle, this.fontSize, this.fontFace);
    };

    Sakri.CanvasTextProperties.prototype.getFontString = function(){
        return this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFace;
    };

}(window));


var spriteSheetSource = "data:image/png;base64,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ffBkHkRAfhh9JQkYKD2KPk0COuS7EUh5Hc5jcTC99YQxuGTJo1jwVqwz0Re3IO5X75pSk2pQnGaCLVOHboMdtxs6MGQWayAlD8btG+E+swHd2niE9ccQFt33qD9EV348/Gnb4Dixerhy17L3zSsWfw1f3xnrPPSf237tmhVZEjMqr2pxQ7z/h6u9uFXnx4ChEY0HjkO/8RUxD7aI3g/hhvIIOhT/gC9jN5zn1ytrP1z1VPEm3vO/xL5TVOQszcy4jpwkHeokSoRyyx6ENZaRcGFFtONC3oj372dH7Pt3RZuPbx7zpW6/2Zi2o8h+Zcf66yfWLVBtXBrr30//vR+lZzX2Xr2iR/65HNRfkHr9qfkvd6QXxnVLKl4ayWh8KXAg7cXy1373yvXD6x6vOLXpq+lvvxnr30xERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERPT/4t9HYlowIi2PoAAAeUhta0JU+s7K/gB/DFMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHic7H0HeFNXl61sQwjpAQIhJARCKAkltAAhEHpvoffeW+i9mt5MN72aarAxNi649yZX2eq9d1ty715v32sy7595M+9/M/O+3/BP+LIjWZaupLP2Xnutc8+55gDg/BX/6WhA0Qi49slwDqcJh8PZuGXASMz9sR8Gf9MLk3uMwbIRC7FnyubqixsPvRJGJawoNmiaFfMFH1dHBdf3Z/8r/mvRWHPhx76J5xcsvb938/ME7wf+UQ+exHsdu5F169hd3Yu7wQh+moDwF6kIepYEcZYKdn0+zGoLiqwFxeXFJYLqwqK4aodtb02+6Ycqo7a+v89f8X+PD4DqOfnhdw68vrjVM/TG0YQkL6/SII8b8Pa4g6TQFGikWliNTlSU4f/6r7q2BlWVtW/u16KqvNJcU1ziU+Ow/15pMdX39/wr/s/4pYz3JDn9+hE83rsf/pdvQ5YihE3lgM1chPLy6v8Q61rU/rs/lxSUoryknL1fUVXLBmqqq2rKqri1pTXnqgsrugpjc13f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UPcz/VTeI6/036gdZ/+u8EofH9b5bA4gHmXk/SfvPYrW+D+FzZhv6ef5boDtsWH26+yb9L18NxiNFfk+mv0/x5D0VZYlyzur7xKPoq38jy/xbfa1nk5/L+jjSY612fdm81HWg/x6e8jxPNNkzOk26WSZbvk76K/ayv+lslG+A5Zt+3t79zXtJP3A+wRp0aZ45hT/ZzzGJPIizV6+JT3q/K+UUkoppZ5Tl9rnzXTvZS/51pTrIJewYX0bzb5r+vfUX7X2ebU/rDnUmslszXqN0v99bSO/80ff/EtrIayb9PNrKMs56kf84zG7v5Te6HqW1yytUb8m7mzNaVbmv4r9stz7I1/WPPKc9sIzuc6ebST3XjlnDZd7OSawd7MmvNs6y5nriXWP9WbWmvq6UoX3Ota9TCttV8f0GZBXXqMep8R6JfdJl73upTKfo+6XbG+j/s9aG7ZmP75rNPZXvNzHLegjrPOtCT9WL+yXY17/tyH3IRB7GXXMtcq0VabZ8xrZt/8TQZzR/ZH/R2U+R33+P8X/GX/2/pB24py9GY74M//JWBN+ar36nJd7Avh6VKf0QbdPXs/yyrDRPhP3sz9znXmPynyutvB/30cpn1CmPC8x1jF+MpbRnteGn1Ivwhg3+I8AG9O+EHNt938fc3KP8pj/+X8i8yj1+93/szKfq2P+z7kdO/R+knUt9fEpfYO/iMs8tlX4MbtnGLbk/TrnYcZw4mLntDV7nfgz9yiPlYN/a/EhbSdtyp7ZyP+jMp/zLsh+W9YpfUffzrpij9FYRdxMr+fX/dn7wZpwwpbqlWHUg7mk+zfn8tE3GM/350Z59TDaQN+LTBsTP/Oelbn3tUtoab1APb70v1JKKaWUUkoppZRSSl1NOxERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRO+Qfh5eOatk7jpwAAAFTbWtCVPrOyv4Af6WFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4nO3W4WmDYBSGUQdxEQdxEBdxEAdxEQexvIELt6Yh/4oJ54FDm0/7601szlOSJEmSJEmSJEmSJEmS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cmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+wMZAZwAAIABJREFUeJzsvXe0XVd17/9Za+12+u1NuuqyqmULd9xwBQebFghgCBDyQk9PCOS9QcgjgZTfI+ElkACBBEICoZiAwdjGBctVsiVbVr8qV1fS1e3t9F3WWu+PfSSc8lKMXvBPYo2xxz1l7z3umXPuWb9zLmGt5SfreS0HPq1uEu/y7wPn16+6+S3js+U/Ga3EtHf10NnVQ2+hk94lbfrGV1z/vSVrBu9krnpHMDkSqutuqfy4//nnLvETIfiPr2P/e0PmhL1406Hpro0rz9/8sihyvBPHKx0Rbr6jv7cryBQXu55LlGhWru6nq7tEksTksgFu1qk5xoygmzPCJveaZvwNp39w34/7N8FPhODfWTo7d98XX7Vt397VImjvKQSDF8xNNV9UxckMblzPouUDZPJFSu0lvODfuIs12ETguAJtLTZKkEk8Qdx4REfxl9yevn/8r/tN/3L9RAj+L6v57Feu2PPE4Y8PHY8uz/UtZf3FV9DW2w8Zh0JbBt9X/+p1FotA/Iv39XID5Uj8rE+UpDT3pMFENhFWPm2S5NGhp4c+v+6ajXsA81/xG0+tnwjBv1h/rY5+V/3czEzzz8drBb9v40VsuGQ5QeA+5xwNVmASiTYWbRJA4ygHx3Na5xhAYqwG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";
var spriteSheetImage = new Image();
spriteSheetImage.src = spriteSheetSource;

var persiesLoc = [];
persiesLoc[0] = {x:0, y:0, width:317, height:spriteSheetImage.height-25, offsetX:-215, offsetY:-25};
persiesLoc[1] = {x:317, y:0, width:243, height:spriteSheetImage.height, offsetX:-222, offsetY:-25};
persiesLoc[2] = {x:560, y:0, width:259, height:spriteSheetImage.height-70, offsetX:-235, offsetY:-25};
var ballLoc = {x:819, y:0, width:44, height:44, offsetX:-19, offsetY:-19};

window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        return function (callback, element) {
            var lastTime = element.__lastTime;
            if (lastTime === undefined) {
                lastTime = 0;
            }
            var currTime = Date.now();
            var timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
        };
    })();

var readyStateCheckInterval = setInterval( function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);

//========================
//general properties for demo set up
//========================

var canvas, context, canvasContainer, htmlBounds, bounds;
var minimumStageWidth = 300;
var minimumStageHeight = 300;
var maxStageWidth = 800;
var maxStageHeight = 1000;
var resizeTimeoutId = -1;
//var stats;
var persieImageDatas = [];
var ballImageData;


function updateImageDatas(){
    var ssCanvas = document.createElement("canvas");
    ssCanvas.width = spriteSheetImage.width;
    ssCanvas.height = spriteSheetImage.height;
    //console.log(spriteSheetImage.width, spriteSheetImage.height);
    var ssContext = ssCanvas.getContext("2d");
    var w = Math.floor(spriteSheetImage.width * gameScale);
    var h = Math.floor(spriteSheetImage.height * gameScale);
    ssContext.drawImage(spriteSheetImage, 0, 0, spriteSheetImage.width, spriteSheetImage.height, 0, 0, w, h);

    var i, loc;
    for(var i=0; i<3; i++){
        loc = persiesLoc[i];
        persieImageDatas[i] = ssContext.getImageData(loc.x * gameScale, loc.y * gameScale, loc.width * gameScale, loc.height * gameScale);
    }
    ballImageData = ssContext.getImageData(ballLoc.x * gameScale, ballLoc.y * gameScale, ballLoc.width * gameScale, ballLoc.height * gameScale);
    headRadius = 24 * gameScale;
    collisionDistance = 25 * gameScale;
    persieX  = 250 * gameScale;
    maxPerieX = 260 * gameScale;
    minPerieX = 230 * gameScale;
}

function getImageDataFromSpriteSheet(context, locRect, x, y){
    context.drawImage(spriteSheetImage, locRect.x, locRect.y, locRect.width, locRect.height, x, y, locRect.width, locRect.height);
}

function createImageDataFromSpriteSheet(locRect){
    context.drawImage(spriteSheetImage, locRect.x, locRect.y, locRect.width, locRect.height, 0, 0, locRect.width, locRect.height)
    return context.getImageData(0,0,locRect.width, locRect.height);
}

function init(){

    canvasContainer = document.getElementById("canvasContainer");
    window.onresize = resizeHandler;
    //stats = new Stats();
    //canvasContainer.appendChild( stats.getDisplayElement() );
    window.addEventListener( "keydown", keyUpEventHandler, false );
    commitResize();
}

function getWidth( element ){return Math.max(element.scrollWidth,element.offsetWidth,element.clientWidth );}
function getHeight( element ){return Math.max(element.scrollHeight,element.offsetHeight,element.clientHeight );}

//avoid running resize scripts repeatedly if a browser window is being resized by dragging
function resizeHandler(){
    context.clearRect(0,0,canvas.width, canvas.height);
    clearTimeout(resizeTimeoutId);
    clearTimeoutsAndIntervals();
    resizeTimeoutId = setTimeout(commitResize, 300 );
}

function commitResize(){
    if(canvas){
        canvasContainer.removeChild(canvas);
    }
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    htmlBounds = new Sakri.Geom.Rectangle(0,0, getWidth(canvasContainer) , getHeight(canvasContainer));
    if(htmlBounds.width >= maxStageWidth){
        canvas.width = maxStageWidth;
        canvas.style.left = htmlBounds.getCenterX() - (maxStageWidth/2)+"px";
    }else{
        canvas.width = htmlBounds.width;
        canvas.style.left ="0px";
    }
    if(htmlBounds.height > maxStageHeight){
        canvas.height = maxStageHeight;
        canvas.style.top = htmlBounds.getCenterY() - (maxStageHeight/2)+"px";
    }else{
        canvas.height = htmlBounds.height;
        canvas.style.top ="0px";
    }
    bounds = new Sakri.Geom.Rectangle(0,0, canvas.width, canvas.height);
    context.clearRect(0,0,canvas.width, canvas.height);

    if(bounds.width<minimumStageWidth || bounds.height<minimumStageHeight){
        stageTooSmallHandler();
        return;
    }

    gameScale = 1;
    if(bounds.width < maxStageWidth){
        gameScale = bounds.width / maxStageWidth;
    }

    updateImageDatas();

    startDemo();
}

function stageTooSmallHandler(){
    var warning = "Sorry, bigger screen required :(";
    context.font = "bold normal 24px sans-serif";
    context.fillText(warning, bounds.getCenterX() - context.measureText(warning).width/2, bounds.getCenterY()-12);
}




//========================
//Demo specific properties
//========================


var HOME = 0;
var GAME = 1;
var GAME_OVER = 2;
var gameState;
var scrollSpeed = 3;
var score;
var fontProperties = new Sakri.CanvasTextProperties(Sakri.CanvasTextProperties.BOLD, null, 100);
var gameScale = 1;

var word = "SAKRI";

function startDemo(){

    canvas.addEventListener('touchstart', handleUserTap, false);
    canvas.addEventListener('mousedown', handleUserTap, false);

    var logoText = "LULU";
    if(!logoCanvas){
        logoCanvas = document.createElement("canvas");
        logoCanvasBG = document.createElement("canvas");
    }
    createLogo("LULU", logoCanvas, logoCanvasBG);
    if(!gameOverCanvas){
        gameOverCanvas = document.createElement("canvas");
        gameOverCanvasBG = document.createElement("canvas");
    }
    createLogo("GAME OVER", gameOverCanvas, gameOverCanvasBG);

    createGroundPattern();
    createTubes();
    createCityGraphic();
    persieY  = 220;
    score = 0;
    gameState = HOME;
    loop();
}

function loop(){
    switch(gameState){
        case HOME:
            renderHome();
            break;
        case GAME :
            renderGame();
            break;
        case GAME_OVER:
            renderGameOver();
            break;
    }
    //stats.tick();
}

function handleUserTap(event){
    switch(gameState){
        case HOME:
            persieIndex = 0;
            gameState = GAME;
            break;
        case GAME :
            birdYSpeed = -tapBoost;
            break;
        case GAME_OVER:
            commitResize();
            break;
    }
    if(event){
        event.preventDefault();
    }
}

function keyUpEventHandler(event){
    //event.keyCode == 32 -> Space
    if(event.keyCode == 38){
        handleUserTap(event);
    }
}

function renderHome(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderGroundPattern();
    renderLogo();
    renderInstructions();
    renderBirdHome();
    window.requestAnimationFrame(loop, canvas);
}

function renderGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateBird();
    renderBird();
    updateTubes();
    renderTubes();
    renderBall();
    renderGroundPattern();
    renderScore();
    window.requestAnimationFrame(loop, canvas);
}

function gameOverHandler(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameState = GAME_OVER;
    renderGameOver();
}

function renderGameOver(){

    //game over logo
    context.drawImage(gameOverCanvas, bounds.getCenterX() - logoCanvas.width/2, canvas.height *.2);

    var instruction = "Click, tap or press up key to flap again.";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width/2, canvas.height *.25 + gameOverCanvas.height);
    renderScore();

    //window.requestAnimationFrame(loop, canvas);
}

function renderLogo(){
    logoCurrentY += logoDirection;
    context.drawImage(logoCanvas, bounds.getCenterX() - logoCanvas.width/2, logoCurrentY);
    if(logoCurrentY <= logoY || logoCurrentY >= logoMaxY){
        logoDirection *= -1;
    }
}

function renderInstructions(){
    var instruction = "Click, tap or press up key to flap :)";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width/2, canvas.height *.2);
}

function renderScore(){
    context.font = fontProperties.getFontString();
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    var x = bounds.getCenterX() - context.measureText(score).width/2;
    var y = bounds.height*.1;
    context.fillText(score, x, y);
    context.strokeText(score, x, y);
}

//========================================================================
//========================:: LOGO ::======================================
//========================================================================

var logoCanvas;
var logoCanvasBG;

var gameOverCanvas;
var gameOverCanvasBG;

var logoY;
var logoCurrentY;
var logoMaxY;
var logoDirection;

function createLogo(logoText, logoCanvas, logoCanvassBG){
    logoCanvas.width = logoCanvasBG.width = canvas.width;
    logoCanvas.height = logoCanvasBG.height = canvas.height / 4;
    logoCurrentY = logoY = canvas.height * .25;
    logoMaxY = canvas.height * .35;
    logoDirection = 1;
    var logoContext = logoCanvas.getContext("2d");
    logoContext.textBaseline = "top";
    var textRect = new Sakri.Geom.Rectangle(0, 0, logoCanvas.width * .8, logoCanvas.height);
    var logoFontProps = fontProperties.clone();
    logoFontProps.fontSize = Sakri.CanvasTextUtil.getFontSizeForWidth(logoText, fontProperties, logoCanvas.width * .8, canvas);

    var logoBGContext = logoCanvasBG.getContext("2d");
    logoBGContext.fillStyle = "#f5eea5";
    logoBGContext.fillRect(0, 0, logoCanvasBG.width, logoCanvasBG.height);
    logoBGContext.fillStyle = "#9ce358";
    logoBGContext.fillRect(0, logoFontProps.fontSize/2, logoCanvasBG.width, logoCanvasBG.height);

    logoContext.font = logoFontProps.getFontString();
    logoContext.fillStyle = logoContext.createPattern(logoCanvasBG, "repeat-x");
    logoContext.strokeStyle = "#000000";
    logoContext.lineWidth = 3;
    var x = logoCanvas.width/2 - logoContext.measureText(logoText).width/2;
    var y = logoFontProps.fontSize/2;
    logoContext.fillText(logoText, x, 0);
    logoContext.strokeText(logoText, x, 0);
}

//========================================================================
//========================:: BIRD ::==================================
//========================================================================

var birdYSpeed = 0;
var gravity = 1;
var tapBoost = 12;

function updateBird(){
    persieY += birdYSpeed;
    birdYSpeed += gravity;

    //floor
    if(persieY >= groundGraphicRect.y - headRadius*2){
        persieY = groundGraphicRect.y - headRadius*2;
        birdYSpeed = 0;
    }
    //celing
    if(persieY<=0){
        persieY = 1;
        birdYSpeed = 0;
    }


    if(checkCollision()){
        context.fillStyle = "#FFFFFF";
        context.fillRect(0,0,canvas.width, canvas.height);
    }
}

var currentTube;
var persieIndex = 0;

var headRadius = 24;
var persieX  = 250;
var maxPerieX = 260;
var minPerieX = 230;
var persieY  = 220;
var collisionDistance = 25;

function renderBird(){
    var index = 0;
    if(birdYSpeed<1){
        persieIndex++;
        persieIndex %= 12;
        index = Math.floor(persieIndex / 4);
    }

    persieX += (-1 + Math.random()*2);
    persieX = Math.min(maxPerieX, persieX);
    persieX = Math.max(minPerieX, persieX);

    var loc = persiesLoc[index];
    var img = persieImageDatas[index];
    context.putImageData(img, Math.round(persieX) + loc.offsetX*gameScale, persieY + loc.offsetY*gameScale );

}

function renderBirdHome(){
    var index = 0;
    persieIndex++;
    persieIndex %= 21;
    index = Math.floor(persieIndex / 7);

    persieX += (-1 + Math.random()*2);
    persieX = Math.min(maxPerieX, persieX);
    persieX = Math.max(minPerieX, persieX);

    var loc = persiesLoc[index];
    var img = persieImageDatas[index];
    context.putImageData(img, bounds.width/3, logoCurrentY + logoCanvas.height );

}

function distanceBetweenBallAndHead(){
    return Math.sqrt( Math.pow(ballX - persieX, 2) + Math.pow(ballY - persieY, 2) );
}

function checkCollision(){
    //console.log(distanceBetweenBallAndHead());
    if(distanceBetweenBallAndHead() < collisionDistance){
        ballSwitch = true;
        score++;
        for(var i=0;i<tubes.length;i++){
            if(tubes[i].topRect.x > currentTube.topRect.x){
                currentTube = tubes[i];
                return;
            }
        }
    }
}

//========================================================================
//========================:: BALL ::==================================
//========================================================================

var ballSwitch = false;
var ballX = 0, ballY = 0;

function renderBall(){
    var x = currentTube.topRect.x + currentTube.topRect.width/2;
    var y = currentTube.bottomRect.y - tubeGapHeight/2;
    if(ballSwitch){
        ballX += (x - ballX)/2;
        ballY += (y - ballY)/2;
        if(Math.abs(x-ballX)< 1 && Math.abs(y-ballY)< 1){
            ballSwitch = false;
        }
    }else{
        ballX =  x;
        ballY = y;
    }
    context.putImageData(ballImageData, ballX+ ballLoc.offsetX*gameScale , ballY + ballLoc.offsetY*gameScale);
    if(ballX < persieX){
        gameOverHandler();
    }
}

//========================================================================
//========================:: TUBES ::==================================
//========================================================================

var tubeGapHeight = 230;//needs some logic
var tubesGapWidth;
var tubes;
var tubeWidth = 100;//needs some logic
var minTubeHeight = 50;//needs some logic

function updateTubes(){
    for(var i= 0; i<tubes.length;i++){
        updateTube(tubes[i]);
    }
}

function updateTube(tube){
    tube.topRect.x -= scrollSpeed;
    tube.bottomRect.x = tube.topRect.x;
    if(tube.topRect.x <= -tubeWidth ){
        tube.topRect.x = tube.bottomRect.x = canvas.width;
        renderTube(tube);
    }
}


function renderTubes(){
    for(var i= 0; i<tubes.length;i++){
        context.drawImage(tubes[i].canvas, tubes[i].bottomRect.x, 0);
    }
}

function createTubes(){
    tubes = [];
    var totalTubes = 2;
    tubesGapWidth = Math.floor(canvas.width/totalTubes);

    for(var i = 0; i < totalTubes; i++){
        tubes[i] = {};
        tubes[i].canvas = document.createElement("canvas");
        tubes[i].topRect = new Sakri.Geom.Rectangle(canvas.width+(i * tubesGapWidth));
        tubes[i].bottomRect = new Sakri.Geom.Rectangle(canvas.width+(i * tubesGapWidth));
        renderTube(tubes[i]);
    }
    currentTube = tubes[0];
}

var tubeOutlineColor = "#534130";
var tubeMainColor = "#75be2f";
var tubeCapHeight = 40;

function renderTube(tube){
    tube.canvas.width = tubeWidth;
    tube.canvas.height = groundGraphicRect.y;

    tube.bottomRect.width = tube.topRect.width = tubeWidth;
    tube.topRect.y = 0;
    tube.topRect.height = minTubeHeight + Math.round(Math.random()*(groundGraphicRect.y-tubeGapHeight-minTubeHeight*2));

    tube.bottomRect.y = tube.topRect.getBottom() + tubeGapHeight;
    tube.bottomRect.height = groundGraphicRect.y - tube.bottomRect.y - 1;//minus one for stroke

    var tubeContext = tube.canvas.getContext("2d");
    tubeContext.lineWidth = 2;
    //top tube
    renderTubeElement(tubeContext , 3, 0, tubeWidth-6, tube.topRect.height);
    renderTubeElement(tubeContext , 1, tube.topRect.getBottom() - tubeCapHeight, tubeWidth-2, tubeCapHeight);

    //bottom tube
    renderTubeElement(tubeContext , 3, tube.bottomRect.y, tubeWidth-6, tube.bottomRect.height);
    renderTubeElement(tubeContext , 1, tube.bottomRect.y, tubeWidth-2, tubeCapHeight);
}

function renderTubeElement(ctx, x, y, width, height){
    ctx.fillStyle = tubeMainColor;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#9de85a";
    ctx.fillRect(x, y, width*.25, height);

    ctx.fillStyle = "#d9f881";
    ctx.fillRect(x+width *.05, y, width *.05, height);

    ctx.fillStyle = "#547e25";
    ctx.fillRect(x+width- width * .1, y, width *.1, height);
    ctx.fillRect(x+width- width * .2, y, width *.05, height);

    ctx.strokeRect(x, y, width, height);
}


//========================================================================
//========================:: CITY BG ::==================================
//========================================================================

var cityGraphicCanvas;

function getRandomNumberInRange(min, max){
    return min + Math.random() * (max - min);
};

function createCityGraphic(){

    if(cityGraphicCanvas){
        canvasContainer.removeChild(cityGraphicCanvas);
    }
    cityGraphicCanvas = document.createElement("canvas");
    cityGraphicCanvas.style.position = "absolute";
    cityGraphicCanvas.style.left = canvas.style.left;
    cityGraphicCanvas.style.top = canvas.style.top;
    cityGraphicCanvas.width = canvas.width;
    cityGraphicCanvas.height = canvas.height;
    var cgContext = cityGraphicCanvas.getContext("2d");
    var cityGraphicHeight = canvas.height * .25;

    //fill with blue sky
    cgContext.fillStyle = "#71c5cf";
    cgContext.fillRect(0, 0, canvas.width, canvas.height);

    cgContext.fillStyle = "#e9fad8";

    cgContext.save();
    cgContext.translate(0, groundGraphicRect.y - cityGraphicHeight);

    //CLOUDS
    var maxCloudRadius = cityGraphicHeight * .4;
    var minCloudRadius = maxCloudRadius * .5;

    for(iterator=0; iterator<canvas.width; iterator+=minCloudRadius){
        cgContext.beginPath();
        cgContext.arc( iterator , maxCloudRadius, getRandomNumberInRange(minCloudRadius, maxCloudRadius), 0, Math.PI*2);
        cgContext.closePath();
        cgContext.fill();
    }

    cgContext.fillRect(0,maxCloudRadius, canvas.width, cityGraphicHeight );

    //HOUSES
    var houseWidth;
    var houseHeight;
    cgContext.fillStyle = "#deefcb";
    for(iterator=0; iterator<canvas.width; iterator+=(houseWidth+8)){
        houseWidth = 20 + Math.floor(Math.random()*30);
        houseHeight = getRandomNumberInRange(cityGraphicHeight *.5 , cityGraphicHeight - maxCloudRadius *.8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    cgContext.fillStyle = "#dff1c4";
    cgContext.strokeStyle = "#9fd5d5";
    cgContext.lineWidth = 3;
    for(iterator=0; iterator<canvas.width; iterator+=(houseWidth+8)){
        houseWidth = 20 + Math.floor(Math.random()*30);
        houseHeight = getRandomNumberInRange(cityGraphicHeight *.5 , cityGraphicHeight - maxCloudRadius *.8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
        cgContext.strokeRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    //TREES
    var maxTreeRadius = cityGraphicHeight * .3;
    var minTreeRadius = maxTreeRadius * .5;
    var radius;
    var strokeStartRadian = Math.PI + Math.PI/4;
    var strokeEndRadian = Math.PI + Math.PI/4;
    cgContext.fillStyle = "#81e18b";
    cgContext.strokeStyle = "#72c887";
    for(iterator=0; iterator<canvas.width; iterator+=minTreeRadius){
        cgContext.beginPath();
        radius = getRandomNumberInRange(minCloudRadius, maxCloudRadius)
        cgContext.arc( iterator , cityGraphicHeight, radius, 0, Math.PI*2);
        cgContext.closePath();
        cgContext.fill();

        cgContext.beginPath();
        cgContext.arc( iterator , cityGraphicHeight, radius, strokeStartRadian, strokeEndRadian);
        cgContext.closePath();
        cgContext.stroke();
    }

    cgContext.restore();
    //sand
    cgContext.fillStyle = sand;
    cgContext.fillRect(0,groundGraphicRect.y, canvas.width, canvas.height);

    canvasContainer.insertBefore(cityGraphicCanvas, canvasContainer.firstChild);
}


//========================================================================
//========================:: GROUND ::==================================
//========================================================================

var groundX = 0;
function renderGroundPattern(){
    context.drawImage(groundPatternCanvas, groundX, groundGraphicRect.y);
    groundX -= scrollSpeed;
    groundX %= 16;
}


//colors
var groundLightGreen = "#97e556";
var groundDarkGreen = "#73be29";
var groundDarkerGreen = "#4b7e19";
var groundShadow = "#d1a649";
var groundBorder = "#4c3f48";
var sand = "#dcd795";
var groundGraphicRect = new Sakri.Geom.Rectangle();
var groundPatternCanvas;

function createGroundPattern(){
    groundGraphicRect.y = canvas.height*.85;
    if(!groundPatternCanvas){
        groundPatternCanvas = document.createElement("canvas");
    }
    groundPatternCanvas.width = 16;
    groundPatternCanvas.height = 16;
    var groundContext = groundPatternCanvas.getContext("2d");
    groundContext.fillStyle = groundLightGreen;
    groundContext.fillRect(0,0,16,16);

    //diagonal graphic
    groundContext.fillStyle = groundDarkGreen;
    groundContext.beginPath();
    groundContext.moveTo(8,3);
    groundContext.lineTo(16,3);
    groundContext.lineTo(8,13);
    groundContext.lineTo(0,13);
    groundContext.closePath();
    groundContext.fill();

    //top border
    groundContext.fillStyle = groundBorder;
    groundContext.globalAlpha = .2;
    groundContext.fillRect(0,0,16,1);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0,1,16,1);
    groundContext.globalAlpha = .6;
    groundContext.fillRect(0,2,16,1);

    //hilite
    groundContext.fillStyle = "#FFFFFF";
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0,3,16,2);

    //bottom border
    groundContext.fillStyle = groundDarkerGreen;
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0,10,16,3);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0,11,16,1);

    //shadow
    groundContext.fillStyle = groundShadow;
    groundContext.fillRect(0,13,16,3);

    var groundPattern = context.createPattern(groundPatternCanvas, "repeat-x");

    groundPatternCanvas.width = canvas.width + 16;
    groundPatternCanvas.height = 16;

    groundContext.fillStyle = groundPattern;
    groundContext.fillRect(0, 0, groundPatternCanvas.width, 16);

}

function clearTimeoutsAndIntervals(){
    gameState = -1;
}


function showInfo(){
    document.getElementById("infoScreen").style.display = "block";
}
function hideInfo(){
    document.getElementById("infoScreen").style.display = "none";
}