<template>
    <div>
        <el-form :inline="true" :model="policyDocument" class="demo-form-inline">
            <el-form-item label="文件名称">
                <el-input v-model="policyDocument.policyName"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="policyDocument.classOne" placeholder="一级分类">
                    <el-option v-for="item in policyDocumentClassOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="policyDocument.classTwo" placeholder="二级分类">
                    <el-option v-for="item in policyDocumentClassTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                        v-model="policyDocument.createTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="至：">
                <el-date-picker
                        v-model="policyDocument.createTime"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-left: 55px">
                <el-button type="primary" @click="init">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px">
            <el-button size="" @click="add">新增政策文件</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;height: 400px">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="policyName" label="文件名称" width="310"></el-table-column>
            <el-table-column prop="classOne" label="一级分类" width="150"></el-table-column>
            <el-table-column prop="classTwo" label="二级分类" width="150"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
            <el-table-column prop="updateTime" label="最后修改时间" width="150"></el-table-column>
            <el-table-column fixed="right" label="操作" width="140">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="editeProject(scope.$index, tableData)" type="text" size="small">编辑</el-button>
                    <el-button @click.native.prevent="deleteSelectionTableRow(scope.$index, tableData)" type="text" size="small">移除</el-button>
                    <el-button @click.native.prevent="exportSelectionTableRow(scope.$index, tableData)" type="text" size="small">导出</el-button>
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
    import  router from "../../routes.js"

    export default {
        data() {
            return {
                policyDocument: {
                    policyName:'',
                    classOne:'',
                    classTwo:'',
                    createTime:'',
                    updateTime:''
                },
                tableData:[],
                policyDocumentClassOnes:[],
                policyDocumentClassTwos:[],
            }
        },
        mounted(){
            var _this = this;
            //加载项目一级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_ONE',function(data){
                _this.policyDocumentClassOnes = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_TWO',function(data){
                _this.policyDocumentClassTwos = data;
            });
            this.init()
        },
        methods: {
            exportSelectionTableRow(){

            },
            init() {
                var _this = this
                _this.AjaxJson("policyDocumentManagementLoad",
                    {"policyName":this.policyDocument.policyName,"classOne":this.policyDocument.classOne,"classTwo":this.policyDocument.classTwo},
                    function(data){
                        if (data.data.code== "true"){
                            _this.tableData.splice(0,_this.tableData.length)
                            _this.tableData = data.data.data;
                        }
                    });
            },
            add() {
                this.$router.push({ name: '政策文件详情',params: {}})
            },
            deleteSelectionTableRow(index, rows){
                var _this = this
                var row = rows[index];
                var loginParams = {projectId:row.id};

            },
            editeProject(index, rows){
                var row = rows[index];
                var projectId = row.id;
                /*this.$router.push({ name: '项目编辑',
                    params: {
                        id : row.id,
                    }
                })*/

            }
        },

    }
</script>

<style>
    .el-input{
        width: 300px;
    }
</style>