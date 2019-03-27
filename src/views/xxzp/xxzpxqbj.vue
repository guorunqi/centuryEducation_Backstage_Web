<template>
    <div>
        <el-form :inline="true" :model="selfEvaluation" class="demo-form-inline">
            <el-form-item label="自评名称">
                <el-input v-model="selfEvaluation.name" value="fildId" placeholder="项目名称" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="selfEvaluation.projectId"  placeholder="请选择" :disabled="true">
                    <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="学校名称">
                <el-select v-model="orgID"  @change="orgChangeData" placeholder="请选择">
                    <el-option v-for="org in orgs" :key="org.id" :label="org.name" :value="org.id"></el-option>
                </el-select>
            </el-form-item>

        </el-form>
        <!-- 条目页面 -->
        <div style="margin-bottom: 15px">
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
                    <el-button type="primary" @click="saveSelfEvaluationEntryResult">保存</el-button>
                    <el-button @click="closeFrom">取 消</el-button>
                </div>
            </el-dialog>
        </div>

        <el-table ref="selfEvaluationEntryTable" :data="selfEvaluationEntrys" highlight-current-row border tooltip-effect="dark" style="width: 100%;" max-height="400" @current-change="handleCurrentChange">
            <el-table-column label="自评条目">
                <el-table-column prop="title" label="条目标题" ></el-table-column>
            </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer" style="margin-left: 10%;">
            <el-button type="primary" @click="saveSelfEvaluationEntryResult">保存</el-button>
            <div class="components-container">
                <div class="editor-container">
                    <UE :defaultMsg=selfEvaluationEntryResult.resultContent :config=config ref="ue"></UE>
                </div>
            </div>
        </div>







    </div>
</template>

<style type="text/css">
    .info{
        border-radius: 10px;
        line-height: 20px;
        padding: 10px;
        margin: 10px;
        background-color: #ffffff;
    }
</style>


<script>
    import common from '../../common/js/common.js';
    import qs from 'qs';
    import  router from "../../routes.js";
    import UE from '../../UE.vue';
    export default {
        components: {UE},
        name: "projectManagementList",
        data() {
        return {
            selfEvaluation:{
                resultContent:""
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
            selfEvaluationEntry:[],
            selectSelfEvaluationEntrys:[],
            orgs:[],
            orgID:{},
            content:null,
            editorOption:{},
            selfEvaluationEntryResult:{

            },
            selectProjectOrg:{
                id:""
            },
            //富文本
            defaultMsg: '',
            config: {
                initialFrameWidth: null,
                initialFrameHeight: 350,
                UEDITOR_HOME_URL: 'static/UE/'
            }
        }
    },
    methods: {
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
                    url: '/api/querySelfEvaluationEntryBySelfEvaluationID',
                    data: {id:this.selfEvaluation.id}
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
        orgChangeData(row){
            this.selectProjectOrg={};
            this.selectProjectOrg.id=row;
        },
        queryselfEvaluation(){
            this.$ajax({
                method: 'post',
                url: '/api/querySelfEvaluationByID',
                data: {id:this.id}
            }).then(data => {
                if (data.data.code== "true"){
                    this.selfEvaluation=data.data.data;
                    this.queryOrg();
                    this.queryselfEvaluationEntrys();
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
        },
        queryOrg(){
            this.$ajax({
                method: 'post',
                url: '/api/SelfEvaluationEntryResult/queryProjectOrgByProjectID',
                data: {id:this.selfEvaluation.projectId}
            }).then(data => {
                if (data.data.code== "true"){
                    this.orgs=data.data.data;
                    this.selectProjectOrg=this.orgs[this.orgs.length-1];
                }
            });
        },
        handleCurrentChange(val){
            this.$ajax({
                method: 'post',
                url: '/api/querySelfEvaluationEntryResultByOrgID',
                data:{data:JSON.stringify({selfEvaluationEntryId:val.id,projectOrgId:this.selectProjectOrg.id})}
            }).then(data => {
                this.selfEvaluationEntryResult=data.data.data;
                if(data.data.data.resultContent!=null&&data.data.data.resultContent!="") {
                    this.setUEContent(data.data.data.resultContent);
                }else{
                    this.setUEContent("");
                }
            });
        },
        saveSelfEvaluationEntryResult(){debugger
            let content = this.$refs.ue.getUEContent();
            this.selfEvaluationEntryResult.resultContent=content;
            this.$ajax({
                method: 'post',
                url: '/api/saveSelfEvaluationEntryResult',
                data:{data:JSON.stringify(this.selfEvaluationEntryResult)}
            }).then(data => {
                if(data.data.code=="true"){
                    this.$message({
                        message: '保存数据成功！',
                        type: 'success'
                    });
                    this.selfEvaluationEntryResult=data.data.data;
                }else {
                    this.$message.error('保存数据失败！请联系管理员。');
                }
            });
        },
        //富文本
        getUEContent() {
            let content = this.$refs.ue.getUEContent();
            this.$notify({
                title: '获取成功，可在控制台查看！',
                message: content,
                type: 'success'
            });
        },
        setUEContent(data){
            this.$refs.ue.setUEContent(data);
        }
    },
    mounted() {
        var _this = this;
        //加载 项目
        this.queryProject();
        if(this.id!=null&&this.id!=0){

            this.queryselfEvaluation();
        }
    },
    }



</script>

<style>
    .el-input{
        width: 300px;
    }
</style>