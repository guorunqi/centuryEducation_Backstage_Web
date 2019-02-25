<template>
    <div>
        <el-form :inline="true" :model="selfEvaluation" class="demo-form-inline"style="border: 1px solid #d1dbe5;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="评估名称">
                        <el-input v-model="selfEvaluation.name" placeholder="项目名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属项目">
                        <el-select v-model="selfEvaluation.projectId"  @change="projectChangeData" placeholder="请选择">
                            <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="打分类型">
                        <el-select v-model="selfEvaluation.projectId"  @change="projectChangeData" placeholder="请选择">
                            <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分为几等">
                        <el-input v-model="selfEvaluation.name" placeholder="项目名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remarks">
                        <el-input type="textarea" v-model="selfEvaluation.remarks" auto-complete="off" style="width: 500px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-button type="primary" @click="saveSelfEvaluation">保存项目</el-button>
                    <el-button type="primary" @click="closeProject">关闭项目</el-button>
                </el-col>
            </el-row>


        </el-form>
        <!-- 条目页面 -->
        <div style="margin-bottom: 15px">
            <el-button type="primary" icon="plus" @click="openFrom">新增条目</el-button>
            <el-button type="primary" icon="plus" @click="editFrom">编辑条目</el-button>
            <el-button type="primary" icon="plus" @click="deleteSelfEvaluationEntrys">删除条目</el-button>
            <!-- 添加条目页面 -->
            <el-dialog title="添加条目" :visible.sync="outerVisibleFile">
                <el-form ref="form" :model="selfEvaluationEntry" label-width="auto">
                    <el-form-item label="条目标题:">
                        <el-input type="remarks" v-model="selfEvaluationEntry.title"></el-input>
                    </el-form-item>
                    <el-form-item label="排序:">
                        <el-input v-model="selfEvaluationEntry.sortno" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="AddSelfEvaluationEntry">保存</el-button>
                    <el-button @click="closeFrom">取 消</el-button>
                </div>
            </el-dialog>
        </div>

        <el-table ref="selfEvaluationEntryTable" :data="selfEvaluationEntrys" border tooltip-effect="dark" style="width: 100%;height: 400px" @selection-change="selfEvaluationEntrySelect">
            <el-table-column label="自评条目">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="title" label="条目标题" ></el-table-column>
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
            selfEvaluation:{

            },
            selfEvaluationEntrys:[],
            SpecialistTable:[],// 专家列表      *
            //**********************************
            SpecialistTableSelectRowData:{},//专家列表，选中后数据
            pgxx_orgs:'',//评估学校
            selectSpecialist:'',//选择的专家
            AllPolicyDocumentData:[],//所有政策文件
            selectAllPolicyDocumentData:'',
            Org_select:[],
            projects: [],
            AllSpecialist:[],
            id: this.$route.params.id,
            outerVisible: false,
            outerVisibleFile: false,
            formInline: {
                user: '',
                region: ''
            },
            tableData3: [],
            selfEvaluationEntry: {
                title: '',
                sortno: ''
            },
            selectSelfEvaluationEntrys:[]
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        onReset() {
            console.log('reset!');
        },
        addZZ(){
        },
        AddSelfEvaluationEntry(){
            var selfEvaluationEntry=this.selfEvaluationEntry;
            this.$ajax({
                method:'post',
                url:'/api/saveSelfEvaluationEntry',
                data:{data:JSON.stringify(selfEvaluationEntry)}
            }).then(data =>{
                if(data.data.code=="true"){
                    this.addFormVisible=false;
                    this.$message({
                        message: '增加数据成功！',
                        type: 'success'
                    });

                    this.queryselfEvaluationEntrys();
                    this.selfEvaluationEntry={};
                }else {
                    this.$message.error('增加数据失败！请联系管理员。');
                }
            });
            this.outerVisibleFile = false;
        },
        addRowSpecialist(){
            var obj = {};
            var _this = this
            var selectSpecialist = _this.selectSpecialist
            var AllSpecialist = _this.AllSpecialist
            for ( var i = 0; i <AllSpecialist.length; i++){
                var AllSpecia = AllSpecialist[i];
                for(let key  in AllSpecia){
                    var value = AllSpecia[key];
                    if(key == "code" && value == selectSpecialist){
                        obj.SpecialistName = AllSpecia.name;
                        obj.SpecialistId = AllSpecia.id;
                        obj.SpecialistPhone = AllSpecia.phone;
                        obj.SpecialistRemarks = AllSpecia.remarks;
                        obj.SpecialistSchool = _this.pgxx_orgs
                        _this.SpecialistTable.push(obj)
                    }
                }
            }
            _this.outerVisible = false
        },
        deleteSelectionTableRow(index, rows){
            rows.splice(index, 1);
        },
        saveSelfEvaluation(){
            this.$ajax({
                method:'post',
                url:'/api/saveSelfEvaluation',
                data:{data:JSON.stringify(this.selfEvaluation)}
            }).then(data =>{
                if(data.data.code=="true"){
                    this.addFormVisible=false;
                    this.$message({
                        message: '保存数据成功！',
                        type: 'success'
                    });

                    this.queryselfEvaluationEntrys();
                    this.selectSelfEvaluationEntrys={};
                }else {
                    this.$message.error('保存数据失败！请联系管理员。');
                }
            });
        },
        closeProject(){
            this.$router.push('/xxzpgl');
        },
        queryProject(){
            this.$ajax({
                method: 'post',
                url: '/api/projectManagementLoad',
                data: {}
            }).then(data => {
                if (data.data.code== "true"){
                    this.projects=data.data.data;
                }
            });
        },
        queryselfEvaluationEntrys(){
            if(this.id!=null&&this.id!=0){
                this.$ajax({
                    method: 'post',
                    url: '/api/queryAllSelfEvaluationEntry',
                    data: {}
                }).then(data => {
                    if (data.data.code== "true"){
                        this.selfEvaluationEntrys=data.data.data;
                    }
                });
            }
        },
        closeFrom(){
            this.selfEvaluationEntry={};
            this.outerVisibleFile = false;
        },
        openFrom(){
            var selfEvaluation=this.selfEvaluation;
            if(selfEvaluation.id==null||selfEvaluation==""){
                this.$message({
                    showClose: true,
                    message: '请先保存自评',
                    type: 'warning'
                });
            }else{
                this.selfEvaluation.id=selfEvaluation.id;
                this.outerVisibleFile = true;
            }
        },
        projectChangeData(row){
            var projects=this.projects;
            for(var i=0;i<projects.length;i++){
                if(projects[i].id==row){
                    this.selfEvaluation.projectName=projects[i].name;
                }
            }
        },
        queryselfEvaluation(){
            this.$ajax({
                method: 'post',
                url: '/api/querySelfEvaluationByID',
                data: {id:this.id}
            }).then(data => {
                if (data.data.code== "true"){
                    this.selfEvaluation=data.data.data;
                }
            });
        },
        editFrom(){
            var selfEvaluationEntrys=this.selectSelfEvaluationEntrys;
            if(selfEvaluationEntrys.length!=1){
                this.$message({
                    showClose: true,
                    message: '请选择一个自评标题',
                    type: 'warning'
                });
            }else{
                this.selfEvaluationEntry=selfEvaluationEntrys[0];
                this.outerVisibleFile = true;
            }
        },
        selfEvaluationEntrySelect(val){
            this.selectSelfEvaluationEntrys=val;
        },
        deleteSelfEvaluationEntrys(){
            var selectSelfEvaluationEntrys=this.selectSelfEvaluationEntrys;
            if(selectSelfEvaluationEntrys.length<1){
                this.$message({
                    showClose: true,
                    message: '请至少选择一个自评标题',
                    type: 'warning'
                });
            }else{
                this.$ajax({
                    method: 'post',
                    url: '/api/deleteSelfEvaluationEntrys',
                    data: {data:JSON.stringify(selectSelfEvaluationEntrys)}
                }).then(data => {
                    if(data.data.code=="true"){
                        this.$message({
                            message: '删除数据成功！',
                            type: 'success'
                        });
                        this.queryselfEvaluationEntrys();
                        this.selectSelfEvaluationEntrys={};
                    }else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            }
        }
    },
    mounted() {
        var _this = this;
        //加载 项目
        this.queryProject();
        if(this.id!=null&&this.id!=0){
            this.queryselfEvaluationEntrys();
            this.queryselfEvaluation();
        }
        this.selectAllSpecialist(function(data){
            _this.AllSpecialist = data;
        });
        this.selectAllPolicyDocument(function(data){
            _this.AllPolicyDocumentData = data;
        });
    },
    }



</script>

<style>
    .el-input{
        width: 300px;
    }
</style>