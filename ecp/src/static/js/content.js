
ecp.trigger('init',function _return(info){
    init(info._sender)
})

function init(info){
    var num = 0,
        is_work = false,
        timeout = 1




    ecp.on('',function (){
        is_work = true;
        loop(function (){
            num++;
            console.log(num)
        })
    })

    ecp.on('start',function (){
        is_work = true;
        loop(function (){
            num++;
            console.log(num)
        })
    })





    ecp.on('stop',function (){
        is_work = false;
        loop.stop();
    })

    ecp.on('update',function (){
        ecp.trigger('get_config',function _return(data){
            console.log('最新的配置是',data.config);
        });
    })


    //循环收发器
    function loop(fn){
        var _fn = fn;
        !loop.out ? loop.out = 0 : '';
        clearTimeout(loop.out);
        loop.out = setTimeout(function(){
            _fn();
            loop(_fn);
        },1000)
    }

    loop.stop = function (){
        clearTimeout(loop.out);
    }

}
