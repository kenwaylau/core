

(function (){

    var ls = localStorage,
        config = {}


    //返回配置值
    ecp.on('get_config',get_config);

    //生成配置信息
    function get_config(){
        var config_names = ls['config_names'],names
        names = config_names.split(',');
        names.forEach(function (v,k){
            config[v] = ls[v]
        })
        return {config:config};
    }
    
}())










