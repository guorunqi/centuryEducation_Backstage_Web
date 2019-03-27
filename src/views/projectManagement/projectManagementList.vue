<template>
    <div style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="project" class="demo-form-inline" >
            <el-form-item label="项目名称">
                <el-input v-model="project.name"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-select v-model="project.orgs"  placeholder="请选择">
                    <el-option v-for="item in Orgitems" :key="item.id" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="project.classOne" placeholder="一级分类">
                    <el-option v-for="item in classOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="project.classTwo" placeholder="二级分类">
                    <el-option v-for="item in classTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="project.status" placeholder="状态">
                    <el-option label="未发布" value="wfb"></el-option>
                    <el-option label="进行中" value="jxz"></el-option>
                    <el-option label="已结束" value="yjs"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px">
            <el-button size="" @click="add">新增</el-button>
        </div>
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" height="330" style="width: 97%;">
            <el-table-column type="selection" width="34"></el-table-column>
            <el-table-column prop="name" label="项目名称" width="250"></el-table-column>
            <el-table-column prop="classOne" label="一级分类" width="110" :formatter="formatClassOnes"></el-table-column>
            <el-table-column prop="classTwo" label="二级分类" width="110" :formatter="formatClassTwos"></el-table-column>
            <el-table-column prop="org" label="机构名称" width="220"></el-table-column>
            <el-table-column prop="stutas" label="状态" width="80" :formatter="formatStatus"></el-table-column>
            <el-table-column  label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="editeProject(scope.$index, tableData)" type="text" size="small">编辑</el-button>
                    <el-button @click.native.prevent="deleteSelectionTableRow(scope.$index, tableData)" type="text" size="small">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import common from '../../common/js/common.js';
    import qs from 'qs';
    import  router from "../../routes.js"

    export default {
        name: "projectManagementList",
        data() {
            return {
                project: {
                    orgs:'',
                    name:'',
                    classOne:'',
                    status:[],
                    classTwo:''
                },
                fileId:0,
                tableData:[],
                classOnes:[],
                classTwos:[],
                Orgitems:[],
                regions:[]
            }
        },
        mounted(){
           this.init()
            var _this = this;
            //加载 org
            this.getAllOrgs(function(data){
                _this.Orgitems = data;
            });
            //加载项目一级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_ONE',function(data){
                _this.classOnes = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_TWO',function(data){
                _this.classTwos = data;
            });
            //加载项目状态
            this.getDictAllByDictTypeId('PROJECT_STATUS',function(data){
                _this.status = data;
            });

        },
        methods: {
            init(){
                var me = this;
                var loginParams = {};
                this.$ajax({
                    method: 'post',
                    url: '/api/projectManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        me.tableData = data.data.data;
                    }
                });
            },
            onSubmit() {
                var _this = this
                this.AjaxJson("projectLoad",
                    {"name":this.project.name,"classOne":this.project.classOne,"status":this.project.status,"orgs":this.project.orgs,"classTwo":this.project.classTwo},
                    function(data){
                        if (data.data.code== "true"){
                            _this.tableData.splice(0,_this.tableData.length)
                            _this.tableData = data.data.data;
                        }
                    });
            },
            onReset() {
                this.project.name = "";
                this.project.orgs = "";
                this.project.classOne = "";
                this.project.classTwo = "";
                this.project.status = "";

            },
            add() {
                this.$router.push({ name: '项目详情',
                    params: {
                        id : this.fileId
                }
                })
            },
            deleteSelectionTableRow(index, rows){
                var _this = this
                var row = rows[index];
                var loginParams = {projectId:row.id};
                this.$ajax({
                    method: 'post',
                    url: '/api/deleteProject',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.messageOk("删除项目成功")
                        _this.tableData = []
                        _this.init()
                    }else{
                        _this.messageError(data.data.message)
                    }
                });
            },
            editeProject(index, rows){
                var row = rows[index];
                var projectId = row.id;
                // this.$router.push('/xmgl');
                this.$router.push({ name: '项目编辑',
                    params: {
                        id : row.id,
                    }
                })

            },
            formatClassOnes(row,column){
                if(this.classOnes.length>0){
                    return this.formatData(this.classOnes,row,"classOne");
                }
            },
            formatClassTwos(row,column){
                if(this.classTwos.length>0){
                    return this.formatData(this.classTwos,row,"classTwo");
                }
            },
            formatStatus(row,column){
                if(this.status != null){
                    if(this.status.length>0){
                        return this.formatData(this.status,row,"stutas");
                    }
                }
            },
            /*formatOrg(row,column){
                debugger
                var orgs = row.orgs;
                if(orgs != null){
                    if(orgs.length>0){
                        return this.formatData(this.status,row,"stutas");
                    }
                }
            },*/
        },

    }
</script>

<style scoped>
    .el-form-item__label{
        width:68px;
    }

    .el-input {
        width: 300px;
    }
</style>