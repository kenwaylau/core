


init();



function init(){
    var $config = $('#config'),
        config = {},
        ls = localStorage,
        $c_start = $config.find('.btn-start'),
        $tips = $('.alert-success'),
        $btn_update = $config.find('.btn-update'),
        alert_timeout = 0,
        $config_item = $('.form-control'),
        config_names = '',
        $c_stop = $config.find('.btn-stop')




    $config_item.each(function (k,v){
        var $cur,name
        $cur = $config_item.eq(k);
        name = $cur.attr('name');
        config_names += ','+name;
        if (ls[name]){
            $cur.val(ls[name]);
        }
    })
    ls['config_names'] = config_names.slice(1);


    ecp.trigger('get_work_sta',function _return(data){
        var sta = data.is_work;
        if (sta){
            btn_start()
            tips_alert($tips,'还在工作中...')
        }else{
            btn_stop();
        }
    })


    ecp.on('start',function (){
        btn_start();
        tips_alert($tips,'工作中...')
    })


    ecp.on('stop',function (tip){
        btn_stop();
        if (tip){
            tips_alert($tips,tip)
        }
    })

    function btn_start(){
        $c_stop.show();
        $c_start.hide();
    }
    function btn_stop(){
        $c_stop.hide();
        $c_start.show();
    }



    $c_start.click(function (){
        save_config();
        ecp.trigger('start');
    });

    $c_stop.click(function (){
        ecp.trigger('stop','手动停止 -- 来自popup.js');
    });


    $btn_update.click(function (){
        save_config();
        ecp.trigger('update');
        tips_alert($tips,'更新成功并且通知content.js')
    })


    function save_config(){
        var i
        config = ecp_common.getFormData($config);
        for(i in config){
            ls[i] = config[i];
        }
    }


    //提示
    function tips_alert($obj,tip){
        $obj.text(tip)
        clearTimeout(alert_timeout);
        $obj.slideDown(300);
        alert_timeout = setTimeout(function() {
            $obj.slideUp(300);
        },1500)

    }
}











