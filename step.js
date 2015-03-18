/**
 * Created by way on 2013/10/10.
 * 作者 : 刘嘉威
 * 邮箱:425530758@qq.com
 *
 * 步骤管理器
 * 更新时间:2015/01/12
 * 版本:v1.0.1
 *
 *
 *
 */


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

step._type = _type;
function step(){
    this.list = [];
    this.pointer = 0;
    this.loopNum = 0;
    this.loop = true;
    this.onEnd = function(){};
    this.onStart = function(){};
}

//添加
step.prototype.add = function (){
    var type = step._type,
        arg,
        cur,
        list = this.list
    arg = Array.prototype.slice.call(arguments);
    for (var i = 0, len = arg.length; i < len; i++){
        cur = arg[i];
        if (type(cur) == 'array'){
            list = list.concat(cur);
        }else{
            list.push(cur);
        }
    }
    this.list = list;
}

//删除
step.prototype.remove = function (num){
    if (num != undefined && typeof num == 'number'){
        this.list.splice(num,1)
    }else{
        this.list = [];
    }

}

//下一步
step.prototype.next = function (callback){
    this.pointer++;
    return this.run(callback);
}

//上一步
step.prototype.prev = function (callback){
    this.pointer--;
    return this.run(callback);
}
//执行当前步骤
step.prototype.cur = function (callback){
    if (this.pointer <= -1){
        this.pointer = 0;
    }
    return this.run(callback);
}

//步骤执行
step.prototype.run = function (callback){
    var cur_pointer,pointer,isEnd,isStart,_return,
        list = this.list,
        type = step._type
    pointer = this.pointer;
    if (pointer < 0 ){
        this.pointer = list.length + (pointer <= -1 ? 1 : 0) + pointer;
    }
    pointer = this.pointer;
    cur_pointer = list[pointer];
    if (!cur_pointer){
        return false;
    }
    isEnd = pointer == list.length - 1;
    isStart = pointer == 0;
    if (isEnd){
        if (this.loop){
            this.pointer = -1;
            this.loopNum++;
        }else{
            this.pointer--;
        }
    }
    if (type(cur_pointer) == 'function'){
        _return = cur_pointer();
    }else{
        _return = cur_pointer
    }
    isStart ? this.onStart() : '';
    isEnd ? this.onEnd() : '';
    callback ? callback() : '';
    return _return;
}


//移动指针
step.prototype.move = function (num){
    if (num != undefined && typeof num == 'number' && num >= 0){
        this.pointer = num;
    }
}








