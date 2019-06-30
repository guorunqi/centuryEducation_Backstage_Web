<template>
    <div>
        <el-form :inline="true" :model="assessment" class="demo-form-inline" style="width: 80%;margin: 0 auto;">
            <el-form-item label="评估名称">
                <el-input v-model="assessment.name"  placeholder="评估名称"></el-input>
            </el-form-item>
            <el-form-item label="项目名称">
                <el-input v-model="assessment.projectName"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="打分制度">
                <el-select v-model="assessment.scoringType" placeholder="请选择">
                    <el-option v-for="scoringType in scoringTypes" :key="scoringType.id" :label="scoringType.name" :value="scoringType.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 55px">
                <el-button type="primary" @click="queryAssessment">查询</el-button>
                <el-button type="primary" @click="initAssessment">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px;width: 80%;margin: 0 auto;">
            <el-button size="" @click="add">新建评估</el-button>
            <el-button size="" @click="edite">编辑评估</el-button>
            <el-button size="" @click="editeData">查看评估结果</el-button>
            <el-dialog title="查看评估结果" :visible.sync="outerVisibleFile">
                <el-table ref="assessmentResultTable" :data="assessmentResultData" tooltip-effect="dark"  style="width: 82%;height: 400px;margin: 0 auto;margin-top: 10px;">
                    <el-table-column prop="orgName" label="机构名称" ></el-table-column>
                    <el-table-column prop="total_score" label="评估结果" :formatter="formatType"></el-table-column>
                    <el-table-column  label="操作" width="210">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="openAssessmentResultDetails(scope.$index, assessmentResultData)" type="text" size="small">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <el-button size="" @click="deleteAssessments">删除评估</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="selectAssessmentsChange" style="width: 82%;height: 400px;margin: 0 auto;margin-top: 10px;">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name" label="学校名称" ></el-table-column>
            <el-table-column prop="projectname" label="所属项目" ></el-table-column>
            <el-table-column prop="scoring_type" label="打分类型" :formatter="formatType"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import common from '../../common/js/common.js';
    import  router from '../../routes.js';
    import qs from 'qs';

    export default {
        data() {
        return {
            assessment: {
                projectName:"",
                name:"",
                scoringType:null
            },
            tableData:[],
            selectAssessments:[],
            outerVisibleFile:false,
            assessmentResultData:[],
            scoringTypes:[
                {
                    id:'0',
                    name:'等级制'
                },
                {
                    id:'1',
                    name:'得分制'
                }
            ]
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
        initAssessment(){
            Object.assign(this.$data.assessment, this.$options.data().assessment);
        },
        init() {
            var _this = this;
            _this.queryAssessment();
        },
        add() {
            this.$router.push({ name: '评估详情',
                params: {
                    id : 0
                }})
        },
        edite(){
            var assessments=this.selectAssessments;
            if(assessments.length!=1){
                this.$message({
                    showClose: true,
                    message: '请先选择一个自评',
                    type: 'warning'
                });
            }else{
                var id=assessments[0].id;
                this.$router.push({ name: '评估详情',
                    params: {
                        id : id,
                    }
                })
            }
        },
        editeData(){
            var _this = this;
            var selfEvaluations=this.selectAssessments;
            if(selfEvaluations.length!=1){
                this.$message({
                    showClose: true,
                    message: '请先选择一个自评',
                    type: 'warning'
                });
            }else{

                this.$ajax({
                    method: 'post',
                    url: '/api/queryAssessmentScore',
                    data: {assessmentId:selfEvaluations[0].id}
                }).then(data=>{
                    if(data.data.code=="true"){
                        _this.assessmentResultData=data.data.data;
                        _this.outerVisibleFile=true;
                    }else {
                        _this.$message.error('获取数据失败！请联系管理员。');
                    }
                });


//                var id=selfEvaluations[0].id;
//                this.$router.push({ name: '自评信息编辑',
//                    params: {
//                        id : id,
//                    }
//                })
            }
        },
        openAssessmentResultDetails:function(index, rows){
            var row = rows[index];
            var id=row.projectOrgId;
            this.$router.push({ name: '评估结果',
                    params: {
                        id : id,
                        assessmentId:row.assessmentId,
                    }
                })
        },
        selectAssessmentsChange(val){
            this.selectAssessments=val;
        },
        deleteAssessments(){
            var assessments=this.selectAssessments;
            if(assessments.length<1){
                this.$message({
                    showClose: true,
                    message: '请先选择评估',
                    type: 'warning'
                });
            }else{
                this.$ajax({method: 'post',
                    url:'/api/deleteAssessments',
                    data:{data:JSON.stringify(assessments)}
                }).then(data =>{
                    if(data.data.code=="true"){
                        this.addFormVisible=false;
                        this.$message({
                            message: '删除数据成功！',
                            type: 'success'
                        });
                        this.queryAssessment();
                        this.selectAssessments=[];
                    }else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            }
        },
        queryAssessment(){
            this.$ajax({
                method: 'post',
                url: '/api/queryAssessment',
                data: qs.stringify(this.assessment)
            }).then(data => {
                if (data.data.code== "true"){
                    this.tableData=data.data.data;
                }
            });
        },
        formatType(row,column){
            var returnData='';
            var scoringTypes=this.scoringTypes;
            for(var i=0;i<scoringTypes.length;i++){
                if(scoringTypes[i].id==row.scoring_type){
                    returnData=scoringTypes[i].name;
                }
            }
            return returnData;
        }
    }

    }
</script>

<style>
    .el-input{
        width: 300px;
    }
</style>