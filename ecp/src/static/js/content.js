

/*ecp.trigger('match_url',function (tab){


})*/



(function (){
    var config,task={},start_num = 1,loop_out= 0;

    ecp.trigger('init',function callback(data){
        var sender = data._sender;
        if (sender.tab.url.indexOf(data.config['reg-url']) != -1){
            init();
        }
    })

    task.sta = 'stop'
    function init(){
        //获取配置参数
        ecp.on('starting',function (){
            if (config.interval*1 > 0){
                loop(starting)
            }
            starting();
        });

        ecp.on('stoped',function (){
            stoped();
        });


        ecp.on('get_task_sta',function (){
            return task;
        });

        ecp.on('update_config',update_config);

        console.log('初始化成功!');
        update_config()
    }



    //更新配置
    function update_config(){
        ecp.trigger('get_config',function callback(data){
            config = data;
            //console.log(config);
            init.sta = 1;
        })
    }


    //开始
    function starting(){
        if (!init.sta){
            console.log('正在初始化中')
            setTimeout(function(){
                starting();
            },1000);
        }
        console.log('\n');
        console.log('开始第'+start_num+'次工作');
        start_num++;
        task.sta = 'start';
        pull(push);
    }

    //结束
    function stoped(){
        clearTimeout(loop_out);
        task.sta = 'stop';
    }


    //拉取
    function pull(callback){
        try{
            $.ajax({
                url : config['source-url'],
                success : _success,
                error : _error
            })

        }catch(e){
            _error();
        }

        function _success(data){
            var reg = config.regular,
                rst
            if (reg){
                rst = reg_math(reg,data)
            }else{
                rst = data;
            }
            callback ? callback(rst) : '';
        }

        function _error(){
            end();
            console.log('抓取数据失败');
        }

    }

    //正在匹配
    function reg_math(reg,data){
        var _reg
        _reg = new RegExp(reg);
        return data.match(_reg);
    }

    //提交
    function push(data){
        try{
            $.ajax({
                url : config['push-url'],
                data : data,
                success : _success,
                error : _error
            })

        }catch(e){
            _error(e);
        }

        function _success(data){
            var _data = data.data;

            if (!data.sta){
                _error();
                return;
            }
            console.log('提交成功!');
            if (_data.next_link){
                next_link(_data.next_link);
            }
        }

        function _error(e){
            end();
            console.log('提交数据失败',e);
        }
    }

    //指定链接
    function next_link(link){
        console.log('有指定链接,正在响应该链接')
        try{
            $.ajax({
                url : link,
                success : _success,
                error : _error
            })

        }catch(e){
            _error();
        }

        function _success(data){
            var _data = data.data;
            if (!data.sta){
                _error();
                return;
            }
            console.log('请求指定链接成功!');
            if (_data.next_link){
                next_link(_data.next_link);
            }
            if (config.interval*1 == 0 || !config.interval){
                end();
            }

        }

        function _error(){
            end();
            console.log('请求指定链接失败!');
        }
    }


    function end(){
        stoped();
        ecp.trigger('btn-stop')
    }


    //循环收发器
    function loop(fn){
        var _fn = fn;
        clearTimeout(loop_out);
        loop_out = setTimeout(function(){
            _fn();
            loop(_fn);
        },config.interval * 1000)
    }


}())



