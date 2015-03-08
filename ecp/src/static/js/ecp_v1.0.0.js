/**
 * Created by way on 15/3/5.
 * 作者 : 刘嘉威
 * 邮箱:425530758@qq.com
 */

(function (){
    var ecp = {}
    ecp.eList = {};

    function _type(obj) {
        var type;
        if (obj == null) {
            type = String(obj);
        } else {
            type = toString.call(obj).toLowerCase();
            type = type.substring(8, type.length - 1);
        }
        return type;
    };
    
    function _isPlainObject(obj) {
        var key;
        if (!obj || _.type(obj) !== 'object' ||
            obj.nodeType || 'setInterval' in obj) {
            return false;
        }

        if (obj.constructor &&
            !hasOwn.call(obj, 'constructor') &&
            !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        for (key in obj) {}
        return key === undefined || hasOwn.call(obj, key);
    };

    function _extend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }

        if (typeof target !== 'object' && _type(target) !== 'function') {
            target = {};
        }

        if (length === i) {
            target = this;
            --i;
        }

        for (; i<length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (_isPlainObject(copy) || (copyIsArray = _type(copy) === 'array'))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && _type(src) === 'array' ? src : [];
                        } else {
                            clone = src && _isPlainObject(src) ? src : {};
                        }

                        target[name] = _extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    

    
    chrome.extension.onRequest.addListener(function(req, sender, res) {
        var ecp_event,_return,cur_event
        //console.log(req)

        if (req._ecp_event_){
            ecp_event = get_prefix(req._ecp_event_);
            cur_event = ecp.eList[ecp_event];
            if (!cur_event){
                return;
            }
            _return = ecp.eList[ecp_event].apply(this,req.param) || {}
            res(_extend(_return,{_sender:sender}));

        }
      
    });

    //添加事件
    ecp.on = function (eventName,fn){
        if (!fn){
            return
        }
        ecp.eList[get_prefix(eventName)] = fn;
    }

    //触发事件
    ecp.trigger = function (eventName){
        var _param,arg,callBack
        arg =  (Array.prototype.slice.call(arguments)).slice(1);
        lastArg = arg[arg.length-1] || '';
        callBack = /^function callback\(/i.test(lastArg.toString()) ? lastArg : function(){}
        _param = {
            _ecp_event_ : eventName,
            param : arg
        }
        //console.log(_extend(_param,arg))
        if (chrome.tabs){
            chrome.tabs.getSelected(function(tab){
                chrome.tabs.sendRequest(tab.id, _extend(_param,arg), callBack);
            })
        }else{
            chrome.extension.sendRequest(_extend(_param,arg),callBack);
        }
    }

    //获取前缀
    function get_prefix(str){
        return '_ecp_' + str;
    }

   /* function get_fn_name(fn){
        return fn.toString().match(/(^ \($)+/i);
    }*/

    ecp.on('init',function (){
        return {}
    });

    if (!chrome.tabs){
        ecp.trigger('init',function callback(data){
            if (!data){
                setTimeout(function(){
                    console.error('ecp启动失败!');
                    location.reload();
                },100)
            }else{
                console.log('ecp启动成功!')
            }
        });

    }

    ecp.type = _type;
    ecp.isPlainObject = _isPlainObject;
    ecp.extend = _extend;
    window.ecp = ecp;
    

})();



