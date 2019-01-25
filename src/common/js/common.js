import qs from 'qs';
import Vue from 'vue'


export default {
    install(Vue)  {
        Vue.prototype.getDictAllByDictTypeId = function(dictTypeId,Function){
            var loginParams = {dictTypeId:dictTypeId};
            this.$ajax({
                method: 'post',
                url: '/api/getDictAllByDictTypeId',
                data: qs.stringify(loginParams)
            }).then(data => {
                debugger
                if (data.data.code== "true"){
                    Function(data.data.data);
                }
                return null
            })
        };
        Vue.prototype.getAllOrgs = function(Function){
            var me = this;
            var loginParams = {};
            this.$ajax({
                method: 'post',
                url: '/api/selectAllOrg',
                data: qs.stringify(loginParams)
            }).then(data => {
                if (data.data.code== "true"){
                    Function(data.data.data);
                }
            });
        }
    }
}
