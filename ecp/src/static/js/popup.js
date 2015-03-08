

$(function (){


    var $t_set = $('#t-set'),
        $t_start = $t_set.find('.btn-start'),
        $t_stop = $t_set.find('.btn-stop'),
        $t_save = $t_set.find('.btn-save'),
        $other = $('#other-set'),
        $other_save = $other.find('.btn-save'),
        ls = localStorage,
        alert_timeout  = 0,
        is_mathch_url = false,
        $tips = $('.alert-success')

    chrome.tabs.getSelected(function(tabs)
    {
        if (tabs.url.indexOf(ls['reg-url']) != -1){
            is_mathch_url = true;
        }
    });

    ecp.trigger('init',function callback(data){

    })

    init();


    function init(){
        var $fControl = $('.form-control'),
            config_names = '';

        $fControl.each(function (k,v){
            var $cur = $fControl.eq(k),
                name  = $cur.attr('name');
            config_names += name +',';
            $cur.val(ls[name] ? ls[name] : ls[name] = '');
        })
        ls['config_names'] = config_names.slice(0,config_names.length - 1);

        ecp.on('btn-stop',function (){
            $t_stop.click();
        })

        ecp.trigger('get_task_sta',function callback(task){
            if (task.sta == 'start'){
                $t_start.hide();
                $t_stop.show();
                $t_save_off();
            }else{
                $t_start.show();
                $t_stop.hide();
                $t_save_on();
            }
        })

    }

    //开始按钮
    $t_start.click(function (){
        if (!is_mathch_url){
            tips_alert($tips,'不允许在当前域名运行!');
            return;
        }
        starting();
        $(this).hide();
        $t_stop.show();
        $t_save_off();
        tips_alert($tips,'开始工作中....');
    })

    function $t_save_on(){
        $t_save.addClass('btn-primary');
        $t_save.removeClass('btn-default');
    }
    function $t_save_off(){
        $t_save.addClass('btn-default');
        $t_save.removeClass('btn-primary');
    }

    //工作区保存按钮
    $t_save.click(function (){
        var formData,i;
        if ($t_save.hasClass('btn-primary')){
            formData = ecp_common.getFormData($t_set);
            for(i in formData){
                ls[i] = formData[i];
            }
            ecp.trigger('update_config');
            tips_alert($tips,'保存成功....');
        }


    })

    //停止按钮
    $t_stop.click(function (){
        $(this).hide();
        $t_start.show();
        window.scroll(0,0);
        $t_save_on();
        stoped();
        tips_alert($tips,'正在停止....');
    })

    //保存按钮
    $other_save.click(function (){
        var formData,i
        formData = ecp_common.getFormData($other);
        for(i in formData){
            ls[i] = formData[i];
        }
        tips_alert($tips,'保存成功....')
    })


    function starting(){
        ecp.trigger('starting')
    }

    function stoped(){
        ecp.trigger('stoped')
    }


   /* $btn_save.click(function (){
        var data = ecp_common.getFormData($set),
            i;
        for(i in data){
            ls['set_'+i] = data[i];
        }
        send({type: "p_save"});
        tips_alert($tips_success,'保存成功');
    })*/


    //提示
    function tips_alert($obj,tip){
        $obj.text(tip)
        clearTimeout(alert_timeout);
        $obj.slideDown(300);
        alert_timeout = setTimeout(function() {
            $obj.slideUp(300);
        },1500)

    }


})