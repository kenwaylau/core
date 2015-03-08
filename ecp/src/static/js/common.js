
var ecp_common = {};
ecp_common.getFormData = function ($obj){
    var $form,data={},$input,$radio,radio_list = {},$select;
    $form = $($obj);
    $input = $form.find('input');
    function getval($obj){
        if ($obj.length > 0){
            $obj.each(function (k,v){
                var $cur = $obj.eq(k),
                    key = $cur.attr("name")
                data[key] = $cur.val()
            })
        }
    }
    //文本类型处理
    getval($input.filter('[type=text]'));
    //密码类型处理
    getval($input.filter('[type=password]'));
    //复选框框处理
    getval($input.filter('[type=checkbox]'));
    //隐藏类处理
    getval($input.filter('[type=hidden]'));
    //数字类处理
    getval($input.filter('[type=number]'));
    //电话类处理
    getval($input.filter('[type=tel]'));
    //日期处理
    getval($input.filter('[type=date]'));
    //文本框处理
    getval($form.find('textarea'));

    //单选框类型处理
    $radio = $input.filter('[type=radio]');
    if ($radio.length > 0){
        $radio.each(function (k,v){
            var $cur = $radio.eq(k),
                cur_name = $cur.attr('name');
            if (!radio_list[cur_name]){
                radio_list[cur_name] =[];
            }
            radio_list[cur_name].push($cur);
        });
        (function (){
            var i,cur,val;
            for(i in radio_list){
                cur = radio_list[i];
                for (var w = 0, len = cur.length; w < len; w++){
                    if (cur[w][0].checked){
                        val = w
                    }
                }
                data[i] = val
            }
        }());
    }

    //下拉框处理
    $select = $form.find('select');
    if ($select.length > 0){
        $select.each(function (k,v){
            var $cur = $select.eq(k),
                val,
                $option,
                key = $cur.attr("name");
            $option = $cur.find('option')
            $option.each(function (k,v){
                var $cur = $option.eq(k);
                if ($cur[0].selected){
                    //获取下标值
                    //val = k
                    //获取value值
                    val = $option.eq(k).val()
                }
            })
            data[key] = val;
        })
    }
    return data;
}

