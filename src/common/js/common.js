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
            if (IdList.length == 0){
                Function([]);
                return
            }
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
        };
        //查询所有专家
        Vue.prototype.selectAllSpecialist = function(Function){
            this.$ajax({
                method: 'post',
                url: '/api/selectAllSpecialist',
            }).then(data => {
                if (data.data.code== "true"){
                    Function(data.data.data);
                }
            });
        };
        //查询所有政策文件
        Vue.prototype.selectAllPolicyDocument = function(Function){
            this.$ajax({
                method: 'post',
                url: '/api/selectAllPolicyDocument',
            }).then(data => {
                if (data.data.code== "true"){
                    Function(data.data.data);
                }
            });
            Vue.prototype.messageOk = function(message){
                this.$message({
                    message: message,
                    type: 'success'
                });
            };
            Vue.prototype.messageError = function(message){
                this.$message.error('错了哦，这是一条错误消息');
            };
            Vue.prototype.AjaxJson = function(url,loginParams,trueFunction){
                this.$ajax({
                    method: 'post',
                    url: '/api/'+url,
                    data: qs.stringify(loginParams)
                }).then(data => {
                    trueFunction(data);
                })
            };
            Vue.prototype.Ajax = function(url,loginParams,trueFunction){
                this.$ajax({
                    method: 'post',
                    url: '/api/'+url,
                    data: loginParams
                }).then(data => {
                    if (data.data.code== "true"){
                        trueFunction(data.data.data);
                    }
                })
            }
        }
    }
}
