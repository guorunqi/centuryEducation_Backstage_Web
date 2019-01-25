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
            })
        };
        //根据学校ID数组，查询对应的学校
        Vue.prototype.selectSchoolListByIdList = function(IdList,Function){
            var me = this;
            var loginParams = {IdList};
            this.$ajax({
                method: 'post',
                url: '/api/selectSchoolListByIdList',
                data: loginParams
            }).then(data => {
                if (data.data.code== "true"){
                    Function(data.data.data);
                }
            });
        }
    }
}
