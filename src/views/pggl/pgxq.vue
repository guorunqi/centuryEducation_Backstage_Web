<template>
    <div>
        <el-form :inline="true" :model="assessment" class="demo-form-inline" style="border: 1px solid #d1dbe5;padding: 20px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="评估名称">
                        <el-input v-model="assessment.name" placeholder="项目名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属项目">
                        <el-select v-model="assessment.projectId" placeholder="请选择">
                            <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="打分类型">
                        <el-select v-model="assessment.scoringType" placeholder="请选择" @change="scoringTypeChange">
                            <el-option v-for="scoringType in scoringTypes" :key="scoringType.id" :label="scoringType.name" :value="scoringType.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="outerVisibleDJ">
                    <el-form-item label="分为几等">
                        <el-input-number v-model="num1" :min="0" :max="10" label="描述文字" @change="numberChange" style="padding-right: 0px;"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="outerVisibleDF">
                    <el-form-item label="分值多少">
                        <el-input-number v-model="assessment.grade" :min="0" :max="100" label="分值多少" style="padding-right: 0px;"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="outerVisibleDJ">
                <el-col :span="24" v-for="(list,index) in lists">
                    <el-row>
                        <el-col :span="2">
                            第{{index+1}}等名称:
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="list.name" placeholder="名称" style="width:100px;"></el-input>
                        </el-col>
                        <el-col :span="2">
                            权重:
                        </el-col>
                        <el-col :span="4">
                            <el-input type="number" v-model="list.weight" placeholder="权重" style="width:100px;"></el-input>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="assessment.remarks" auto-complete="off" style="width: 600px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <div align="center">
                    <el-button type="primary" @click="saveAssessment">保存项目</el-button>
                    <el-button type="primary" @click="closeWindows">关闭项目</el-button>
             </div>


        </el-form>
        <!-- 条目页面 -->
        <div style="margin-bottom: 15px;padding-top: 20px;" class="example">
            <el-button type="primary" icon="plus" @click="openFrom">新增顶级指标</el-button>
            <!-- 添加指标页面 -->
            <el-dialog title="添加指标" :visible.sync="outerVisibleFile">
                <div style="border:1px solid #A9A9A9;padding: 1%">
                    <el-form ref="form" :model="quota" label-width="auto">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="指标层级:">
                                    <el-input type="remarks" v-model="quota.hierarchy" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="指标编码:">
                                    <el-input type="remarks" v-model="quota.code"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="指标名称:">
                                    <el-input type="remarks" v-model="quota.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="权重/分值:">
                                    <el-input v-model="quota.weight" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="评估内容:">
                                    <el-input type="textarea" v-model="quota.content"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>



                    <el-row>
                        <el-col :span="24" v-for="(quotaOrgUser,index) in quotaOrgUsers">
                            <el-row>
                                <el-col :span="3">
                                    机构名称:
                                </el-col>
                                <el-col :span="5">
                                    {{quotaOrgUser.orgName}}
                                </el-col>
                                <el-col :span="2">
                                    专家:
                                </el-col>
                                <el-col :span="4">
                                    <el-select v-model="quotaOrgUser.userID" placeholder="请选择">
                                        <el-option v-for="expert in experts" :key="expert.id" :label="expert.name" :value="expert.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addQuota">保存</el-button>
                        <el-button @click="closeFrom">取 消</el-button>
                    </div>
                </div>

                <div style="margin-bottom: 15px;width: 80%;margin: 0 auto;">
                    <el-button size="" @click="addPolicyDocumentEntry1">新建文件条目</el-button>
                    <el-button size="" @click="deletePolicyDocumentEntry">删除文件条目</el-button>
                </div>
                <el-table ref="policyDocumentEntryTable" :data="policyDocumentEntrys" border tooltip-effect="dark" style="width: 100%;height: 400px" @selection-change="policyDocumentEntrySelectRow">
                    <el-table-column label="相关文件条目">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="wjmc" label="文件名称" ></el-table-column>
                        <el-table-column prop="tmmc" label="条目名称" ></el-table-column>
                    </el-table-column>
                </el-table>
                <el-dialog title="新增文件条目" v-model="policyDocumentEntry" :close-on-click-modal="false" width="80%" top="40%" :modal-append-to-body='false'>
                    <el-form :model="policyDocumentEntryFrom" label-width="40px" label-position="right">
                        <el-form-item label="文件条目" prop="policyDocumentEntryId">
                            <el-select v-model="policyDocumentEntryName" filterable placeholder="请选择">
                                <el-option
                                        v-for="entry in quotaPolicyDocumentEntrys"
                                        :key="entry.id"
                                        :label="entry.title"
                                        :value="entry.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="policyDocumentEntry = false">取消</el-button>
                        <el-button type="primary" @click.native="savePolicyDocumentEntryFrom" :loading="addPolicyDocumentEntry">提交</el-button>
                    </div>
                </el-dialog>



                <div style="margin-bottom: 15px;width: 80%;margin: 0 auto;">
                    <el-button size="" @click="addProblem">新建问卷题目</el-button>
                    <el-button size="" @click="deleteProblem">删除问卷题目</el-button>
                </div>
                <el-table ref="problemTable" :data="quotaProblems" border tooltip-effect="dark" style="width: 100%;height: 400px" @selection-change="problemSelectRow">
                    <el-table-column label="相关问卷题目">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="wjmc" label="问卷名称" ></el-table-column>
                        <el-table-column prop="wtmc" label="问题名称" ></el-table-column>
                    </el-table-column>
                </el-table>
                <el-dialog title="新增问卷题目" v-model="problem" :close-on-click-modal="false" width="80%" top="60%" :modal-append-to-body='false'>
                    <el-form :model="quotaProblemFrom" label-width="40px" label-position="right">
                        <el-form-item label="问卷题目" prop="problemId">
                            <el-select v-model="problemName" filterable placeholder="请选择">
                                <el-option
                                        v-for="entry in problems"
                                        :key="entry.id"
                                        :label="entry.title"
                                        :value="entry.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>

                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="problem = false">取消</el-button>
                        <el-button type="primary" @click.native="saveProblemFrom" :loading="loadingProblem">提交</el-button>
                    </div>
                </el-dialog>


                <div>
                    <div style="margin-bottom: 15px;width: 80%;margin: 0 auto;">
                        <el-button size="" @click="addSelfEvaluationEntry">新建自评题目</el-button>
                        <el-button size="" @click="deleteSelfEvaluationEntry">删除自评题目</el-button>
                    </div>
                    <el-table ref="selfEvaluationEntryTable" :data="selfEvaluationEntrys" border tooltip-effect="dark" style="width: 100%;height: 400px" @selection-change="selfEvaluationEntrySelectRow">
                        <el-table-column label="相关自评题目">
                            <el-table-column type="selection" width="55"> </el-table-column>
                            <el-table-column prop="zpmc" label="自评名称" ></el-table-column>
                            <el-table-column prop="tmmc" label="条目名称" ></el-table-column>
                        </el-table-column>
                    </el-table>

                    <el-dialog title="新增自评题目" v-model="quotaSelfEvaluationEntry" :close-on-click-modal="false" width="80%" top="80%" :modal-append-to-body='false'>
                        <el-form :model="quotaSelfEvaluationEntryFrom" label-width="40px" ref="addUserForm" label-position="right">
                            <el-form-item label="自评题目" prop="selfEvaluationEntryId">
                                <el-select v-model="titleName" filterable placeholder="请选择">
                                    <el-option
                                            v-for="entry in quotaSelfEvaluationEntrys"
                                            :key="entry.id"
                                            :label="entry.title"
                                            :value="entry.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                        <div slot="footer" class="dialog-footer">
                            <el-button @click.native="quotaSelfEvaluationEntry = false">取消</el-button>
                            <el-button type="primary" @click.native="saveQuotaSelfEvaluationEntryFrom" :loading="addQuotaSelfEvaluationEntry">提交</el-button>
                        </div>
                    </el-dialog>
                </div>




            </el-dialog>
        </div>

        <tree-grid :columns="columns" :tree-structure="true" :data-source="quotas" v-on:childMethod="TreeAddSubordinatePolicyDocument" v-on:childEdit="TreeEditSubordinate" v-on:childDelete="TreeDeleteSubordinate"></tree-grid>




    </div>
</template>

<style scoped>
    .el-input-number .el-input__inner {
        padding-right: 0px;
        width:100px;
    }
    .el-input {
        width:200px;
    }
</style>

<script>
    import common from '../../common/js/common.js';
    import qs from 'qs';
    import  router from "../../routes.js";
    import {TreeGrid} from '../../components/treeTable';

    export default {
        name: "projectManagementList",
        data() {
        return {
            selfEvaluation:{

            },
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
            scoringTypes:[
                {
                    id:'0',
                    name:'等级制'
                },
                {
                    id:'1',
                    name:'得分制'
                }
            ],
            assessment:{},
            num1:{},
            lists:[],
            outerVisibleDJ:false,
            outerVisibleDF:false,
            //评估专家
            experts:[],
            //相关文件条目
            policyDocumentEntrys:[],
            //相关问卷题目
            problems:[],
            //相关自评题目
            selfEvaluationEntrys:[],
            //指标
            quota:{},
            //选中的相关文件条目
            selectPolicyDocumentEntrys:[],
            //选中的相关问卷题目
            selectProblems:[],
            //选中的相关自评题目
            selectSelfEvaluationEntrys:[],
            //选中的条目
            selectquotas:[],
            //条目
            quotas:[],
            dataSource:[],
            columns: [
                {
                    text: '指标编码',
                    dataIndex: 'name'
                },
                {
                    text: '指标名称',
                    dataIndex: 'exped1'
                },
                {
                    text: '指标层级',
                    dataIndex: 'exped2'
                },
                {
                    text: '权重',
                    dataIndex: 'exped3'
                }
            ],
            //指标ID
            editQuotaSelfEvaluationEntryID:'',
            //指标下机构专家数组
            quotaOrgUsers:[],
            //可选专家
            experts:[],


            //------------------指标关联自评题目相关-----------------------------
            //新增自评题目页面显示隐藏
            quotaSelfEvaluationEntry:false,
            //指标关联自评题目页面from绑定数据
            quotaSelfEvaluationEntryFrom:{
                code:''
            },
            //指标关联自评题目页面提交按钮遮罩控制
            addQuotaSelfEvaluationEntry:false,
            //指标关联自评题目页面选中值绑定
            titleName:'',
            //可选指标关联自评题目列表
            quotaSelfEvaluationEntrys:[],


            //------------------指标关联文件条目相关-----------------------------
            //新增文件条目页面显示隐藏
            policyDocumentEntry:false,
            //指标关联文件条目页面from绑定数据
            policyDocumentEntryFrom:{
                code:''
            },
            //指标关联文件条目页面提交按钮遮罩控制
            addPolicyDocumentEntry:false,
            //指标关联文件条目页面选中值绑定
            policyDocumentEntryName:'',
            //可选指标关联文件条目列表
            quotaPolicyDocumentEntrys:[],



            //------------------指标关联问题题目相关-----------------------------
            //新增问题题目页面显示隐藏
            problem:false,
            //指标关联问题题目页面from绑定数据
            quotaProblemFrom:{
                code:''
            },
            //指标关联问题题目页面提交按钮遮罩控制
            loadingProblem:false,
            //指标关联问题题目页面选中值绑定
            problemName:'',
            //可选指标关联问题题目列表
            quotaProblems:[]
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
        addQuota(){
            var quota=this.quota;
            this.$ajax({
                method:'post',
                url:'/api/saveQuota',
                data:{data:JSON.stringify(quota)}
            }).then(data =>{
                if(data.data.code=="true"){
                    this.outerVisibleFile=false;
                    this.$message({
                        message: '操作数据成功！',
                        type: 'success'
                    });
                    this.quota={};
                    this.queryQuota();
                }else {
                    this.$message.error('操作数据失败！请联系管理员。');
                }
            });
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
        saveAssessment(){
            this.$ajax({
                method:'post',
                url:'/api/saveAssessment',
                data:{data:JSON.stringify({assessment:this.assessment,arades:this.lists})}
            }).then(data =>{
                if(data.data.code=="true"){
                    this.$message({
                        message: '保存数据成功！',
                        type: 'success'
                    });
                    this.assessment={};
                    this.assessment.id=data.data.data;
                }else {
                    this.$message.error('保存数据失败！请联系管理员。');
                }
            });
        },
        closeWindows(){
            this.$router.push('/pggl');
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
            var assessment=this.assessment;
            if(assessment.id==null||assessment.id==""){
                this.$message({
                    showClose: true,
                    message: '请先保存自评',
                    type: 'warning'
                });
            }else{
                this.queryExpert();
                this.queryProjectOrgUser();
                this.quota.assessmentId=assessment.id;
                this.quota.hierarchy='A'
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
        queryAssessment(){
            this.$ajax({
                method: 'post',
                url: '/api/queryAssessmentByID',
                data: {id:this.id}
            }).then(data => {
                if (data.data.code== "true"){

                    this.assessment=data.data.data;
                    this.queryQuota();
                    this.queryQuotaSelfEvaluationEntrys();
                    this.queryPolicyDocumentEntrys();

                    this.scoringTypeChange(this.assessment.scoringType);
                    if(this.assessment.scoringType=='0'){
                        this.queryGrade();
                    }
                }
            });
        },
        queryGrade(){
            this.$ajax({
                method: 'post',
                url: '/api/queryGradesByAssessmentID',
                data: {id:this.id}
            }).then(data => {
                if (data.data.code== "true"){
                    this.lists=data.data.data;
                    this.num1=this.lists.length;
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
        policyDocumentEntrySelectRow(val){
            this.selectPolicyDocumentEntrys=val;
        },
        problemSelectRow(val){
            this.selectProblems=val;
        },
        selfEvaluationEntrySelectRow(val){
            this.selectSelfEvaluationEntrys=val;
        },
        quotaSelectRow(val){
            this.selectquotas=val;
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
        numberChange(val){
            var lists=this.lists;
            if(lists.length==val){

            }else if(lists.length>val){
                this.lists=[];
                for(var i=0;i<val;i++){
                    this.lists.push(lists[i]);
                }
            }else if(lists.length<val){
                for(var i=0;i<(val-lists.length);i++){
                    this.lists.push({name:'',weight:0});
                }
            }
        },
        scoringTypeChange(vul){
            if(vul=="0"){
                this.num1=0;
                this.lists=[];
                this.assessment.grade=0;
                this.outerVisibleDJ=true;
                this.outerVisibleDF=false;
            }else if(vul=="1"){
                this.num1=0;
                this.lists=[];
                this.assessment.grade=0;
                this.outerVisibleDJ=false;
                this.outerVisibleDF=true;
            }
        },
        queryQuota(){
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaByAssessmentId',
                data: {assessmentId:this.assessment.id}
            }).then(data => {
                if (data.data.code== "true"){
                    this.quotas=data.data.data;
                }
            });
        },
        //获取可以选择的专家列表
        queryExpert(){
            this.$ajax({
                method: 'post',
                url: '/api/queryProjectOrgUserByProjectID',
                data:{projectID:this.assessment.projectId}
            }).then(data => {
                this.experts=data.data.data;
            });
        },
        //获取指标所在项目的机构和专家
        queryProjectOrgUser(){
            this.$ajax({
                method: 'post',
                url: '/api/SelfEvaluationEntryResult/queryProjectOrgByProjectIDAndQuotaID',
                data:{projectID:this.assessment.projectId,quotaID:this.editQuotaSelfEvaluationEntryID}
            }).then(data => {
                this.quotaOrgUsers=data.data.data;
            });
        },
        //指标树指标新增
        TreeAddSubordinatePolicyDocument(data){

            var hierarchy=data.exped2;
            if(hierarchy=='A'){
                this.quota.hierarchy='B';
                this.quota.pid = data.id;
                this.outerVisibleFile = true;
                this.quota.assessmentId=this.assessment.id;
            }else if(hierarchy=='B'){
                this.quota.hierarchy='C';
                this.quota.pid = data.id;
                this.outerVisibleFile = true;
                this.quota.assessmentId=this.assessment.id;
            }else if(hierarchy=='C'){
                this.$message({
                    showClose: true,
                    message: '指标只能为三级',
                    type: 'warning'
                });
            }

        },
        //指标树指标删除
        TreeDeleteSubordinate(data){
            var _this = this
            this.$confirm('此操作将永久删除该记录及下级记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.$ajax({
                    method: 'post',
                    url: '/api/deleteQuotas',
                    data: {id:data.id,assessmentId:this.assessment.id}
                }).then(data => {
                    if(data.data.code=="true"){
                        _this.$message({
                            message: '删除数据成功！',
                            type: 'success'
                        });
                        _this.queryQuota();
                    }else {
                        _this.$message.error('删除数据失败！请联系管理员。');
                    }
                });

            });

        },
        //指标树指标编辑
        TreeEditSubordinate(data){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaByID',
                data: {id:data.id}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.editQuotaSelfEvaluationEntryID=data.data.data.id;
                    _this.quota=data.data.data;
                    _this.querySelfEvaluationEntrys();
                    _this.queryDocumentEntrys();
                    _this.queryQuotaProblems();
                    _this.outerVisibleFile = true;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //指标关联自评新增页面打开
        addSelfEvaluationEntry(){
            this.quotaSelfEvaluationEntry=true;
        },
        //指标关联自评删除
        deleteSelfEvaluationEntry(){
            this.$ajax({
                method: 'post',
                url: '/api/deleteQuotaSelfEvaluationEntrys',
                data: {data:JSON.stringify(this.selectSelfEvaluationEntrys)}
            }).then(data => {
                if(data.data.code=="true"){
                    this.$message({
                        message: '删除数据成功！',
                        type: 'success'
                    });
                    this.querySelfEvaluationEntrys();
                }else {
                    this.$message.error('删除数据失败！请联系管理员。');
                }
            });
        },
        //指标关联自评新增保存
        saveQuotaSelfEvaluationEntryFrom(){
            var titleName=this.titleName;
            if(titleName!=null&&titleName!=""){
                this.$ajax({
                    method: 'post',
                    url: '/api/saveQuotaSelfEvaluationEntry',
                    data: {data:JSON.stringify({selfEvaluationEntryId:titleName,quotaId:this.editQuotaSelfEvaluationEntryID})}
                }).then(data => {
                    if(data.data.code=="true"){
                        _this.quotaSelfEvaluationEntrys=data.data.data;
                        _this.quotaSelfEvaluationEntry=false;
                        _this.querySelfEvaluationEntrys();
                    }else {
                        _this.$message.error('获取数据失败！请联系管理员。');
                    }
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '请选择一个自评题目',
                    type: 'warning'
                });
            }

        },
        //根据项目id获取可选的指标关联自评
        queryQuotaSelfEvaluationEntrys(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/querySelfEvaluationDataByID',
                data: {id:_this.assessment.projectId}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.quotaSelfEvaluationEntrys=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //获取指标关联自评
        querySelfEvaluationEntrys(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaSelfEvaluationEntryByQuotaID',
                data: {id:this.editQuotaSelfEvaluationEntryID}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.selfEvaluationEntrys=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //--------------------------********************************---------------------------
        //指标关联文件条目新增页面打开
        addPolicyDocumentEntry1(){
            this.policyDocumentEntry=true;
        },
        //指标关联文件条目删除
        deletePolicyDocumentEntry(){
            this.$ajax({
                method: 'post',
                url: '/api/deleteQuotaPolicyDocumentEntrys',
                data: {data:JSON.stringify(this.selectPolicyDocumentEntrys)}
            }).then(data => {
                if(data.data.code=="true"){
                    this.$message({
                        message: '删除数据成功！',
                        type: 'success'
                    });
                    this.queryDocumentEntrys();
                }else {
                    this.$message.error('删除数据失败！请联系管理员。');
                }
            });
        },
        //指标关联文件条目新增保存
        savePolicyDocumentEntryFrom(){
            var _this=this;
            var policyDocumentEntryName=this.policyDocumentEntryName;
            if(policyDocumentEntryName!=null&&policyDocumentEntryName!=""){
                this.$ajax({
                    method: 'post',
                    url: '/api/saveQuotaPolicyDocumentEntry',
                    data: {data:JSON.stringify({policyDocumentEntryId:policyDocumentEntryName,quotaId:this.editQuotaSelfEvaluationEntryID})}
                }).then(data => {
                    if(data.data.code=="true"){
                        _this.policyDocumentEntry=false;
                        _this.queryDocumentEntrys();


                    }else {
                        _this.$message.error('获取数据失败！请联系管理员。');
                    }
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '请选择一个自评题目',
                    type: 'warning'
                });
            }

        },
        //根据项目id获取可选的指标文件条目
        queryPolicyDocumentEntrys(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryPolicyDocumentEntryByID',
                data: {id:this.assessment.projectId}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.quotaPolicyDocumentEntrys=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //获取指标文件条目
        queryDocumentEntrys(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaPolicyDocumentEntryByQuotaID',
                data: {id:this.editQuotaSelfEvaluationEntryID}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.policyDocumentEntrys=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //--------------------------********************************---------------------------
        //指标关联问卷问题新增页面打开
        addProblem(){
            this.problem=true;
        },
        //指标关联问卷问题删除
        deleteProblem(){
            this.$ajax({
                method: 'post',
                url: '/api/deleteQuotaProblems',
                data: {data:JSON.stringify(this.selectProblems)}
            }).then(data => {
                if(data.data.code=="true"){
                    this.$message({
                        message: '删除数据成功！',
                        type: 'success'
                    });
                    this.queryQuotaProblems();
                }else {
                    this.$message.error('删除数据失败！请联系管理员。');
                }
            });
        },
        //指标关联问卷问题新增保存
        saveProblemFrom(){
            var _this=this;
            var problemName=this.problemName;
            if(problemName!=null&&problemName!=""){
                this.$ajax({
                    method: 'post',
                    url: '/api/saveQuotaProblem',
                    data: {data:JSON.stringify({problemId:problemName,quotaId:this.editQuotaSelfEvaluationEntryID})}
                }).then(data => {
                    if(data.data.code=="true"){
                        _this.problem=false;
                        _this.queryQuotaProblems();


                    }else {
                        _this.$message.error('获取数据失败！请联系管理员。');
                    }
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '请选择一个自评题目',
                    type: 'warning'
                });
            }

        },
        //根据项目id获取可选的指标问卷问题
        queryProblems(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryProblemByID',
                data: {id:this.assessment.projectId}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.problems=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        },
        //获取指标问卷问题
        queryQuotaProblems(){
            var _this = this;
            this.$ajax({
                method: 'post',
                url: '/api/queryQuotaProblemByQuotaID',
                data: {id:this.editQuotaSelfEvaluationEntryID}
            }).then(data => {
                if(data.data.code=="true"){
                    _this.quotaProblems=data.data.data;
                }else {
                    _this.$message.error('获取数据失败！请联系管理员。');
                }
            });
        }


    },
        mounted() {
            var _this = this;
            _this.queryProject();
            if(this.id!=null&&this.id!=0){
                this.queryAssessment();
            }
        },
        components: {
            TreeGrid
        }
    }



</script>

