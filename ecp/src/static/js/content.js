
ecp.trigger('ecp_init',function _return(data){
    init(data)
})

function init(info){
    var C = info.config,
        is_work = false,
        timeout

    ecp.on('get_work_sta',function (){
        return {is_work : is_work}
    });

    ecp.on('start',function (){
        is_work = true;
        pull(push)
    });


    ecp.on('stop',function (tips){
        is_work = false;
        if (tips){
            console.log(tips);
        }
        clearTimeout(timeout)
    })


    function pull(callback){
        $.ajax({
            url : C.pull,
            success : function (){
                if (!is_work){
                    return;
                }
                console.log('pull成功!');
                callback()
            }
        })
    }

    function push(){
        $.ajax({
            url : C.pull,
            success : function (){
                timeout = setTimeout(function(){
                    if (!is_work){
                        return
                    }
                    console.log('push成功！')
                    ecp.trigger('stop','自动停止 -- 来自content.js');
                },5000)
            }
        })
    }


    ecp.on('update',function (){
        ecp.trigger('get_config',function _return(data){
            console.log('最新的配置是',data.config);
        });
    })


    function loop(fn,time){
        var _fn = fn;
        !loop.out ? loop.out = 0 : '';
        clearTimeout(loop.out);
        loop.out = setTimeout(function(){
            _fn();
            loop(_fn);
        },time)
    }

    loop.stop = function (){
        clearTimeout(loop.out);
    }

}
