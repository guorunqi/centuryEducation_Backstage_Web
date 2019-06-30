<template>
    <section>
        <el-row :gutter="10">
            <el-col :span="7" >
                <div style="border: 1px solid #d1dbe5;padding-top: 10px;height: 500px;">
                    <el-tree
                            ref="tree"
                            :data="quotaTree"
                            node-key="id"
                            :props="defaultProps"
                            highlight-current
                            check-on-click-node
                            draggable
                            style="border: 0px;"
                            @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="border: 1px solid #d1dbe5;height: 500px;">
                    <el-form :inline="true" :model="quotaResult" class="demo-form-inline" style="width: 80%;margin: 0 auto;">
                        <el-form-item label="评分">
                            <el-select v-model="quotaResult.results">
                                <el-option v-for="grade in grades" :value="grade.name" :label="grade.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="优势">
                            <el-input type="textarea" v-model="quotaResult.advantage" auto-complete="off" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="不足">
                            <el-input type="textarea" v-model="quotaResult.insufficient" auto-complete="off" style="width: 500px;"></el-input>
                        </el-form-item>
                        <el-form-item label="改进建议">
                            <el-input type="textarea" v-model="quotaResult.proposal" auto-complete="off" style="width: 500px;"></el-input>
                            <!--<el-select v-model="quotaResult.proposal" placeholder="请选择">-->
                                <!--<el-option v-for="scoringType in scoringTypes" :key="scoringType.id" :label="scoringType.name" :value="scoringType.id"></el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        <el-form-item style="margin-left: 55px">
                            <el-button type="primary" @click="saveQuotaResult">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>


    </section>
</template>

<style>
    .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
    .orgFrom .el-input{width: 80%;}
</style>

<script>
    import qs from 'qs';
    export default{
        data(){
        return {
            id: this.$route.params.id,
            assessmentId:this.$route.params.assessmentId,
            msg: '这个是Home模板页',
            quotaTree: [],
            defaultProps: {children: 'children', label: 'exped1'},
            clickNode:{},
            quotaResult:{results:"",advantage:"",insufficient:"",proposal:""},
            grades:[]
        }
    },
    methods:{
        queryQuotaTreeData(){
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaByAssessmentId',
                data: {assessmentId:this.assessmentId}
            }).then(data =>{
                this.quotaTree=data.data.data;
            });
        },
        handleNodeClick(data){
            var _this=this;
            this.clickNode=data;
            this.$ajax({method: 'post',
                url:'/api/queryQuotaResultByProjectOrgIdAndQuotaId',
                data:{quotaId:data.id,projectOrgId:_this.id}
            }).then(data =>{
                _this.queryGrades();
                _this.quotaResult=data.data.data;

            });
        },
        queryGrades(){
            var _this=this;
            this.$ajax({method: 'post',
                url:'/api/queryGradesByAssessmentID',
                data:{id:_this.assessmentId}
            }).then(data =>{
                _this.grades=data.data.data;
            });
        },
        saveQuotaResult(){
            var _this=this;
            this.$ajax({method: 'post',
                url:'/api/saveQuotaResults',
                data:{data:[_this.quotaResult]}
            }).then(data =>{
                if(data.data.code=="true"){
                    this.$message({
                        message: '保存数据成功！',
                        type: 'success'
                    });
                    this.queryAssessment();
                    this.selectAssessments=[];
                }else {
                    this.$message.error('保存数据失败！请联系管理员。');
                }
            });
        }

    },
    mounted() {
        this.queryQuotaTreeData();
    }
    }

</script>