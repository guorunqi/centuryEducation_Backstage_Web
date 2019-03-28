<template>
    <div style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="Questionnaire" class="demo-form-inline">
            <el-form-item label="问卷名称">
                <el-input v-model="Questionnaire.name" :disabled="true"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="Questionnaire.projectId" disabled  placeholder="所属项目">
                    <el-option v-for="item in Project"  :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="closeQuestionnaire" style="float: right">关闭</el-button><br/>
            <el-form-item label="面向人群">
                <el-select v-model="Questionnaire.crowdOriented" disabled placeholder="面向人群">
                    <el-option v-for="item in crowdOrienteds" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问卷类型">
                <el-select v-model="Questionnaire.type" disabled placeholder="问卷类型">
                    <el-option v-for="item in types" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item><br/>
            备注：<el-input type="textarea" :rows="2" :disabled="true" width="100" placeholder="问题内容" v-model="Questionnaire.remarks"></el-input>
            <el-form-item label="学校">
                <el-select v-model="SelectOrg" placeholder="学校">
                    <el-option v-for="item in OrgData" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item><br/>

        </el-form>
            <div style="margin-bottom: 15px">
                <el-table ref="multipleTable" :data="ProblemList" border  tooltip-effect="dark" height="300" style="width:100%;">
                    <el-table-column type="selection" width="60"> </el-table-column>
                    <el-table-column prop="content" label="问题内容" width="400"></el-table-column>
                    <el-table-column prop="answerType" label="答案类型" width="200" :formatter="formatAnswerType"></el-table-column>
                    <el-table-column prop="exhibitionType" label="汇总问卷展示类型" width="200" :formatter="formatExhibitionType"></el-table-column>
                    <el-table-column label="操作"      width="120">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="FillAnswer(scope.$index, ProblemList)" type="text" size="small">答案填写</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <el-dialog title="添加问题" :visible.sync="outerVisibleFile">
            <el-form ref="form" :model="problemData" label-width="auto">
                <el-form-item label="问题内容：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="问题内容" :disabled="true" v-model="problemData.content"></el-input>
                </el-form-item>
                <el-form-item label="">&nbsp;汇总问卷展示类型：
                    <el-select v-model="problemData.exhibitionType" disabled placeholder="汇总问卷展示类型">
                        <el-option v-for="item in exhibitionTypes" :key="item.dictId"  :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答案类型：
                    <el-select v-model="problemData.answerType" disabled placeholder="答案类型">
                        <el-option v-for="item in answerTypes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-table ref="multipleTable" :data="answerDatas" border tooltip-effect="dark" height="250" style="width: 97%;">
                    <el-table-column prop="code" label="选项代码" width="300"></el-table-column>
                    <el-table-column prop="content" label="选项内容" width="150"></el-table-column>
                    <el-table-column prop="selection_rate" label="选择率（%）" width="150"></el-table-column>
                    <el-table-column label="操作"      width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="EditAnswerData(scope.$index, answerDatas)" type="text" size="small">结果填写</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="saveSelectionRate">保存</el-button>-->
                <el-button @click="outerVisibleFile = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="outEditAnswer">
            <el-form ref="form" :model="AnswerResult" label-width="auto">
                <el-form-item label="选择率：">
                    <el-input-number v-model="AnswerResult.selectionRate" controls-position="right" :min="1" :max="100"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SaveEditAnswer">确定</el-button>
                <el-button @click="outEditAnswer = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>
    import common from '../../common/js/common.js';
    import qs from 'qs';
    import  router from "../../routes.js"
    export default {
        data() {
            return {
                //选择的学校名称
                SelectOrg:"",
                id: this.$route.params.id,
                outEditAnswer:false,
                AnswerIndex:0,
                outerVisibleFile:false,
                index:0,
                rows:[],
                /*
                SelectPro:0,



                index:"",
                outerAnswer:false,

                */
                //answerDatas:[],
                //选择率表
                AnswerResult:{
                    id:"",
                    answerId:"",
                    projectOrgId:"",
                    selectionRate:"",
                },
                /*AddQuestionnaires: {
                    answerData:[],
                    exhibitionType: "",
                    content:"",
                    answerType:"",
                    SelectPro:""
                },*/
                answerDatas:[],
                problemData:{
                    id:"",
                    content:"",
                    questionnaireId:"",
                    exhibitionType:"",
                    answerType:"",
                    answerData:"",
                },
                ProblemList:[],
                //项目机构关联表
                ProjectOrgData:[],
                Questionnaire:{
                    id:"",
                    name:"",
                    projectId:"",
                    crowdOriented:"",
                    type:"",
                    remarks:"",
                },
                /*answerDatas:{
                    content:"",
                    code:""
                },*/
                OrgData:[],
                Project:[],
                exhibitionTypes:[],
                answerTypes:[],
                types:[],
                crowdOrienteds:[]
            }
        },
        methods: {
            FillAnswer:function(index, rows){
debugger
                var _this = this
                if(this.SelectOrg == null || this.SelectOrg == "" || this.SelectOrg == undefined){
                    return this.messageErrorEdit("请先选择学校")
                }

                var org = this.getorg(this.OrgData,this.SelectOrg);
                var projectOrgId = this.getProjectOrg(org.id);
                var problem = rows[index];
                var loginParams = {"problem":problem,"projectOrgId":projectOrgId};
                this.$ajax({
                    method: 'post',
                    url: '/api/LoadAnswer',
                    data: {data: JSON.stringify(loginParams)}
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.problemData.id = rows[index].id;
                        _this.problemData.questionnaireId = rows[index].questionnaireId;
                        _this.problemData.exhibitionType = rows[index].exhibitionType;
                        _this.problemData.content = rows[index].content;
                        _this.problemData.answerType = rows[index].answerType;
                        _this.answerDatas = data.data.data
                        _this.outerVisibleFile = true;
                        _this.rows = rows;
                        _this.index = index;
                    }
                });
               /* this.$ajax({
                    method: 'post',
                    url: '/api/LoadAnswer',
                    data: {data: JSON.stringify(rows[index])}
                }).then(data => {
                    if (data.data.code == "true") {
                        debugger
                        _this.problemData.id = rows[index].id;
                        _this.problemData.questionnaireId = rows[index].questionnaireId;
                        _this.problemData.exhibitionType = rows[index].exhibitionType;
                        _this.problemData.content = rows[index].content;
                        _this.problemData.answerType = rows[index].answerType;
                        _this.answerDatas = data.data.data
                        _this.outerVisibleFile = true;
                        _this.rows = rows;
                        _this.index = index;
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });*/


                /*var ProjectOrgData = this.ProjectOrgData;
                var row = rows[index];
                var org = this.getorg(this.OrgData,this.Questionnaire.Org);
                var ProjectOrgId = this.getProjectOrg(org.id,ProjectOrgData);
                this.AddQuestionnaires.answerType = row.answerType;
                this.AddQuestionnaires.content = row.content;
                this.AddQuestionnaires.exhibitionType = row.exhibitionType;
                this.AddQuestionnaires.answerData = row.answerData;
                for (var i=0;i<this.AddQuestionnaires.answerData.length;i++){
                    var AnswerResult = this.getSelectionRate(row.AnswerResultData,ProjectOrgId,this.AddQuestionnaires.answerData[i].id);
                    this.AddQuestionnaires.answerData[i].selectionRate =AnswerResult.selectionRate
                }*/
            },
            formatAnswerType: function (row, column) {
                if (this.answerTypes.length > 0) {
                    return this.formatData(this.answerTypes, row, "answerType");
                }
            },
            formatExhibitionType: function (row, column) {
                if (this.exhibitionTypes.length > 0) {
                    return this.formatData(this.exhibitionTypes, row, "exhibitionType");
                }
            },
            SaveEditAnswer:function(){
                var org = this.getorg(this.OrgData,this.SelectOrg);
                var projectOrgId = this.getProjectOrg(org.id);

                var row = this.answerDatas[this.AnswerIndex];
                this.AnswerResult.answerId = row.id
                this.AnswerResult.projectOrgId = projectOrgId;

                var _this = this;
                this.$ajax({
                    method: 'post',
                    url: '/api/SaveAnswerResult',
                    data: {data: JSON.stringify(this.AnswerResult)}
                }).then(data => {
                    if (data.data.code == "true") {
                        debugger
                        _this.AnswerResult.id = data.data.data
                        _this.answerDatas = [];
                        _this.FillAnswer(_this.index,_this.rows);
                        _this.outEditAnswer = false
                    } else {
                        this.$message.error('数据保存失败！请联系管理员。');
                    }
                });


                //var data = {}


                //this.AddQuestionnaires.answerData[this.AnswerIndex].selectionRate = this.SelectPro;
                //row = this.answerDatas;
                /*var org = this.getorg(this.OrgData,this.Questionnaire.Org);
                this.outEditAnswer =false;
                for (var i=0;i<this.AddQuestionnaires.answerData.length;i++){

                    this.AddQuestionnaires.answerData[i].selectionRate =
                }*/
            },
            closeQuestionnaire:function(){
                this.$router.push('/wjgl');
            },
            EditAnswerData:function(index, rows){
                debugger
                this.AnswerResult.id = rows[index].result_id
                this.outEditAnswer = true;
                this.AnswerIndex = index;
            },
            belongToProject:function(){
                var _this = this
                var loginParams = {};
                this.$ajax({
                    method: 'post',
                    url: '/api/projectManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.Project = data.data.data;
                    }
                });
            },
            /*saveSelectionRate:function(){
                var _this = this;
                this.$ajax({method: 'post',
                    url:'/api/saveSelectionRate',
                    data:{data:JSON.stringify(this.AddQuestionnaires.answerData)}
                }).then(data =>{
                    if(data.data.code=="true"){
                        this.$message({
                            message: '保存数据成功！',
                            type: 'success'
                        });
                        _this.closeQuestionnaire();
                    }else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },*/
            initData:function(){
                var QuestionnaireId = this.id;
                var _this = this
                var loginParams = {"QuestionnaireId":QuestionnaireId};
                this.$ajax({
                    method: 'post',
                    url: '/api/FillAnswerQuestionnaireManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.Questionnaire.name = data.data.data.name
                        _this.Questionnaire.projectId = data.data.data.projectId
                        _this.Questionnaire.crowdOriented = data.data.data.crowdOriented
                        _this.Questionnaire.type = data.data.data.type
                        _this.Questionnaire.remarks = data.data.data.remarks
                        _this.OrgData = data.data.data.OrgData;
                        _this.ProblemList = data.data.data.ProblemList;
                        _this.ProjectOrgData = data.data.data.ProjectOrgData;
                    }
                });
            },
            getorg(data,OrgName){
                for (var i=0;i<data.length;i++){
                    var org = data[i];
                    if(org.name == OrgName){
                        return org;
                    }
                }
            },
            /*getSelectionRate(data,ProjectOrgId,id){
                debugger
                for(var i=0;i<data.length;i++){
                    if(data[i].answerId == id && data[i].projectOrgId == ProjectOrgId){
                        return data[i];
                    }
                }
            },*/
            getProjectOrg(orgId){
                for(var i=0;i<this.ProjectOrgData.length;i++){
                    if(this.ProjectOrgData[i].orgId == orgId){
                        return this.ProjectOrgData[i].id;
                    }
                }
            }
        },
        mounted() {
            this.initData();
            var _this = this;
            //加载面向人群
            this.getDictAllByDictTypeId('QUESTIONNAIRE_CROWD_ORIENTED',function(data){
                _this.crowdOrienteds = data;
            });
            //加载问卷类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_TYPE',function(data){
                _this.types = data;
            });
            //加载汇总问卷展示类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_SHOW_TYPE',function(data){
                _this.exhibitionTypes = data;
            });
            //加载答案类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_ANSWER_TYPE',function(data){
                _this.answerTypes = data;
            });
            //加载所属项目
            this.belongToProject();

        },
    }



</script>

<style>
    .el-input{
        width: 300px;
    }
</style>