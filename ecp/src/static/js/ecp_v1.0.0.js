/**
 * Created by way on 15/3/5.
 * 作者 : 刘嘉威
 * 邮箱:425530758@qq.com
 */

(function (){
    var ecp = {}
    ecp.str = {}
    ecp.eList = {};
    ecp.eList.tempFnNum = 0;

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
        var ecp_event,_return,cur_event,param
        //console.log(req)
        if (req._ecp_event_){
            param = req.param
            ecp_event = get_prefix(req._ecp_event_);
            cur_event = ecp.eList[ecp_event];
            if (!cur_event){
                return;
            }
            param.forEach(function (v,k){
                var filter ,_param,_eval,_eval_param,offCode
                if (_type(v) == 'string' && /^@ecp_fn /i.test(v)){
                    filter = param[k].replace(/^@ecp_fn /i,'');
                    _param = filter.match(/\((.{0,}?)\)/i)[0];
                    _eval_param = _param.slice(1,-1);
                    if (!/\w+/.test(_eval_param)){
                        _eval_param = '';
                    }else{
                        _eval_param = ','+_eval_param;
                    }

                    _eval = '(function '+_param+'{' +
                        'ecp.trigger("temp_'+req.tempFnNum[k]+'"'+_eval_param+');' +
                    '})'
                    param[k] =  eval(_eval)
                }
            })

            _return = ecp.eList[ecp_event].apply(this,param) || {}
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

    //移除事件
    ecp.off = function (eventName){
        var list,name
        list = ecp.eList;
        name = get_prefix(eventName);
        if (list[name]){
            delete ecp.eList[name];
        }
    }

    //触发事件
    ecp.trigger = function (eventName){
        var _param={},arg,callBack
        _param.tempFnNum = [];
        arg =  (Array.prototype.slice.call(arguments)).slice(1);
        arg.forEach(function (v,k){
            var num = ecp.eList.tempFnNum
            _param.tempFnNum.push(num);

            if (_type(v) == 'function' && /^function _return\(/i.test(v.toString())){
                callBack =  v;
                arg.splice(k,1);
                return;
            }
            if (_type(v) == 'function'){
                ;(function (){
                    var copy = arg[k]
                    ecp.on('temp_'+num,function (){
                        var _arg = arguments
                        ecp.off('temp_'+ num);
                        copy.call(this,_arg);
                    });
                    ecp.eList.tempFnNum++;
                    arg[k] = '@ecp_fn '+ v.toString();
                }());
            }

        })
        callBack = callBack || function(){};
        _extend(_param,{
            _ecp_event_ : eventName,
            param : arg
        })
        //console.log(_extend(_param,arg))


        if (chrome.tabs){
            chrome.tabs.getSelected(function(tab){
                extenSend();
                chrome.tabs.sendRequest(tab.id, _extend(_param,arg), callBack);
            })
        }else{
            extenSend();
        }

        function extenSend(){
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
        ecp.trigger('init',function _return(data){
            if (!data){
                setTimeout(function(){
                    location.reload();
                },100)
            }
        });

    }

    ecp.str.insert = function (str,start,content){
        return str.slice(0,start) + content +  str.slice(start);
    }

    ecp.type = _type;
    ecp.isPlainObject = _isPlainObject;
    ecp.extend = _extend;
    window.ecp = ecp;
    

})();



