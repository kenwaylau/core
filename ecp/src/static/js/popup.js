


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



    $c_start.click(function (){
        $c_stop.show();
        $c_start.hide();
        save_config();
        ecp.trigger('start',function _return(data){
            console.log(data.n);
        });
        tips_alert($tips,'正在开始...')
    });

    $c_stop.click(function (){
        $c_stop.hide();
        $c_start.show();
        ecp.trigger('stop');
        tips_alert($tips,'正在结束...')
    })


    $btn_update.click(function (){
        save_config();
        ecp.trigger('update');
        tips_alert($tips,'更新成功...同时通知content')
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











