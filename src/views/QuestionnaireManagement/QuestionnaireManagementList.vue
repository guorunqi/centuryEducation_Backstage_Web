<template>
    <div>
        <el-form :inline="true" :model="questionnaire" class="demo-form-inline">
            <el-form-item label="问卷名称">
                <el-input v-model="questionnaire.name"  placeholder="问卷名称"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="questionnaire.proName"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 55px">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item><br>
            <el-form-item label="面向人群">
                <el-select v-model="questionnaire.crowdOriented" placeholder="面向人群">
                    <el-option v-for="item in crowdOrienteds" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问卷类型">
                <el-select v-model="questionnaire.type" placeholder="问卷类型">
                    <el-option v-for="item in types" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px">
            <el-button size="" @click="add">新增问卷</el-button>
        </div>
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" height="250" style="width: 100%;height: 400px">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="问卷名称" width="300"></el-table-column>
            <el-table-column prop="proName" label="所属项目" width="300"></el-table-column>
            <el-table-column prop="crowdOriented" label="面向人群" width="100"></el-table-column>
            <el-table-column prop="type" label="问卷类型" width="100"></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="editQuestionnaire(scope.$index, tableData)" type="text" size="small">编辑问卷</el-button>
                    <el-button @click.native.prevent="deleteQuestionnaire(scope.$index, tableData)" type="text" size="small">删除问卷</el-button>
                    <el-button @click.native.prevent="fillResultQuestionnaire(scope.$index, tableData)" type="text" size="small">结果填写</el-button>
                </template>
            </el-table-column>
        </el-table>
       <!-- <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="200"
                    width="1000px">

            </el-pagination>
        </div>-->
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
                questionnaire: {
                    project:{
                        projectId:'',
                        proName:'',
                    },
                    name:'',
                    crowdOriented:'',
                    type:''
                },
                types:[],
                fileId:0,
                tableData:[],
                crowdOrienteds:[]
            }
        },
        mounted(){
           this.init()
            var _this = this;
            //加载面向人群
            this.getDictAllByDictTypeId('QUESTIONNAIRE_CROWD_ORIENTED',function(data){
                _this.crowdOrienteds = data;
            });
            //加载面向人群
            this.getDictAllByDictTypeId('QUESTIONNAIRE_TYPE',function(data){
                _this.types = data;
            });

        },
        methods: {
            init(){
                var _this = this
                var loginParams = {"name":this.questionnaire.name,"proName":this.questionnaire.project.proName,"crowdOriented":this.questionnaire.crowdOriented,"type":this.questionnaire.type}
                _this.AjaxJson("QuestionnaireManagementLoad",loginParams,
                    function(data){
                        if (data.data.code== "true"){
                            _this.tableData = data.data.data;
                        }
                    });
            },
            editQuestionnaire:function(index, rows){
                var row = rows[index];
                var questionnaireId = row.id;
                // this.$router.push('/xmgl');
                this.$router.push({ name: '编辑问卷',
                    params: {
                        id : row.id,
                    }
                })

            },
            onSubmit() {
                this.init();
            },
            onReset() {
                console.log('reset!');
            },
            add() {
                this.$router.push({ name: '新增问卷管理',
                    params: {
                        id : this.fileId
                }
                })
            },
            fillResultQuestionnaire:function(index, rows){
                var row = rows[index];
                this.$router.push({ name: '问题填写',
                    params: {
                        id : row.id
                    }
                })
            },
            deleteQuestionnaire:function(index, rows){
                var _this = this
                var row = rows[index];
                this.$ajax({
                    method: 'post',
                    url: '/api/deleteQuestionnaire',
                    data: qs.stringify({"id":row.id})
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.messageOk("删除项目成功")
                        _this.tableData = []
                        _this.init()
                    }else{
                        _this.messageError("删除项目失败")
                    }
                });
            },
        },

    }
</script>

<style>
    .el-input{
        width: 300px;
    }
</style>