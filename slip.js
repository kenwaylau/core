/**
 * Created by way on 2014/06/02.
 * 作者 : 刘嘉威
 * 邮箱:425530758@qq.com
 *
 * 滑动手势
 * 更新时间:2015/01/12
 * 版本:v1.0.1
 *
 *
 *
 */


function slip(obj){
    var $root,
        that = this,
        $doc = document,
        eSlip = {},
        touch = {},
        startTime = 0,
        delay = false,
        isTouch = false;


    this.minDit = 50;
    this.minTime = 500;
    if (!obj){
        return
    }
    if (obj.ownerDocument === document){
        $root = this.root = obj
    }else{
        for(var i in obj){
            this[i] = obj[i];
        }
        $root = this.root;
    }



    $root.addEventListener('touchstart',function (e){
        var touch  = e.changedTouches[0]
        eSlip.startX = touch.pageX;
        eSlip.startY = touch.pageY;
        isTouch = true;
        startTime = new Date();
        creProperty(e);
        that.onStart(e);
    })

    $doc.addEventListener('touchmove',function (e){
        if (!isTouch){
            return
        }
        e.stopPropagation();
        e.preventDefault();
        creProperty(e);
        that.onMove(e);
    })

    $doc.addEventListener('touchend',function (e){
        var minDit,minTime
        if (!isTouch){
            return
        }
        minDit = that.minDit,
        minTime = that.minTime
        creProperty(e);
        that.onEnd(e);
        if (new Date() - startTime <= minTime){
            that.onMinTime(e);
        }
        if (eSlip.ax > minDit || eSlip.ay > minDit){
            that.onMinDit(e);
        }

        isTouch = false;
    })

    function creProperty(e){
        var px,py
        touch = e.changedTouches[0];
        px = touch.pageX;
        py = touch.pageY;
        eSlip.px = touch.pageX;
        eSlip.py = touch.pageY;
        eSlip.cx = touch.clientX;
        eSlip.cy = touch.clientX;
        eSlip.sx = px - eSlip.startX;
        eSlip.sy = py - eSlip.startY;
        eSlip.ax = Math.abs(eSlip.sx);
        eSlip.ay = Math.abs(eSlip.sy);
        eSlip.dx = px - eSlip.endX > 0 ? 'right' :  'left';
        eSlip.dy = py - eSlip.endY > 0  ? 'bottom' :  'top';
        eSlip.endX = px;
        eSlip.endY = py;
        e.slip = eSlip;
    }


}

slip.prototype.onStart = function (){}

slip.prototype.onMove = function (){}

slip.prototype.onEnd = function (){}

slip.prototype.onMinDit = function (){}
