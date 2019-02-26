<template>
    <div>
        <el-form :inline="true" :model="selfEvaluation" class="demo-form-inline" style="width: 80%;margin: 0 auto;">
                <el-form-item label="自评名称">
                <el-input v-model="selfEvaluation.name"  placeholder="自评名称"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="selfEvaluation.projectName"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 55px">
                <el-button type="primary" @click="queryselfEvaluation">查询</el-button>
                <el-button type="primary" @click="initSelfEvaluation">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px;width: 80%;margin: 0 auto;">
            <el-button size="" @click="add">新增自评</el-button>
            <el-button size="" @click="edite">编辑自评</el-button>
            <el-button size="" @click="editeData">自评信息编辑</el-button>
            <el-button size="" @click="deleteSelfEvaluations">删除自评</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="selfEvaluationsSelect" style="width: 82%;height: 400px;margin: 0 auto;margin-top: 10px;">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="自评名称" ></el-table-column>
            <el-table-column prop="projectName" label="所属项目" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" ></el-table-column>
            <el-table-column prop="updateTime" label="最后修改时间" ></el-table-column>
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
    import  router from '../../routes.js';

    export default {
        data() {
            return {
                selfEvaluation: {
                    name:'',
                    projectName:''
                },
                tableData:[],
                selfEvaluations:[]
            }
        },
        mounted(){
            var _this = this;
            this.init();
        },
        methods: {
            queryselfEvaluation(){
                this.$ajax({
                    method: 'post',
                    url: '/api/querySelfEvaluation',
                    data: {data:JSON.stringify(this.selfEvaluation)}
                }).then(data =>{
                    this.tableData=data.data.data;
                });
            },
            initSelfEvaluation(){
                Object.assign(this.$data.selfEvaluation, this.$options.data().selfEvaluation);
            },
            init() {
                var _this = this;
                _this.queryselfEvaluation();
            },
            add() {
                this.$router.push({ name: '学校自评详情',
                                    params: {
                                        id : 0
                                    }})
            },
            deleteSelectionTableRow(index, rows){
                var _this = this
                var row = rows[index];
                var loginParams = {projectId:row.id};

            },
            edite(){
                var selfEvaluations=this.selfEvaluations;
                if(selfEvaluations.length!=1){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个自评',
                        type: 'warning'
                    });
                }else{
                    var id=selfEvaluations[0].id;
                    this.$router.push({ name: '学校自评详情',
                        params: {
                            id : id,
                        }
                    })
                }
            },
            editeData(){
                var selfEvaluations=this.selfEvaluations;
                if(selfEvaluations.length!=1){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个自评',
                        type: 'warning'
                    });
                }else{
                    var id=selfEvaluations[0].id;
                    this.$router.push({ name: '自评信息编辑',
                        params: {
                            id : id,
                        }
                    })
                }
            },
            selfEvaluationsSelect(val){
                this.selfEvaluations=val;
            },
            deleteSelfEvaluations(){
                var selfEvaluations=this.selfEvaluations;
                if(selfEvaluations.length<1){
                    this.$message({
                        showClose: true,
                        message: '请先选择自评',
                        type: 'warning'
                    });
                }else{
                    this.$ajax({method: 'post',
                        url:'/api/deleteSelfEvaluation',
                        data:{data:JSON.stringify(selfEvaluations)}
                    }).then(data =>{
                        if(data.data.code=="true"){
                            this.addFormVisible=false;
                            this.$message({
                                message: '删除数据成功！',
                                type: 'success'
                            });
                            this.queryselfEvaluation();
                            this.selfEvaluations=[];
                        }else {
                            this.$message.error('增加数据失败！请联系管理员。');
                        }
                    });
                }
            }
        }

    }
</script>

<style>
    .el-input{
        width: 300px;
    }
</style>