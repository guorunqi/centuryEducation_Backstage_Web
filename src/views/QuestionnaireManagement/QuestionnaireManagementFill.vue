<template>
    <div>
        <el-form :inline="true" :model="Questionnaire" class="demo-form-inline">
            <el-form-item label="问卷名称">
                <el-input v-model="Questionnaire.name" :disabled="true"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="Questionnaire.proId" disabled  placeholder="所属项目">
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
                <el-select v-model="Questionnaire.Org" placeholder="学校">
                    <el-option v-for="item in OrgData" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
            </el-form-item><br/>

        </el-form>
            <div style="margin-bottom: 15px">
                <el-table ref="multipleTable" :data="Questionnaire.QuestionnaireData"  tooltip-effect="dark" style="width:100%;height: 350px">
                    <el-table-column type="selection" width="60"> </el-table-column>
                    <el-table-column prop="content" label="问题内容" width="550"></el-table-column>
                    <el-table-column prop="answerType" label="答案类型" width="200"></el-table-column>
                    <el-table-column prop="exhibitionType" label="汇总问卷展示类型" width="200"></el-table-column>
                    <el-table-column fixed="right"              label="操作"      width="120">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="FillAnswer(scope.$index, Questionnaire.QuestionnaireData)" type="text" size="small">答案填写</el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        <el-dialog title="添加问题" :visible.sync="outerVisibleFile">
            <el-form ref="form" :model="AddQuestionnaires" label-width="auto">
                <el-form-item label="问题内容：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="问题内容" v-model="AddQuestionnaires.content"></el-input>
                </el-form-item>
                <el-form-item label="汇总问卷展示类型：">
                    <el-select v-model="AddQuestionnaires.exhibitionType" placeholder="汇总问卷展示类型">
                        <el-option v-for="item in exhibitionTypes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="答案类型：">
                    <el-select v-model="AddQuestionnaires.answerType" placeholder="答案类型">
                        <el-option v-for="item in answerTypes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" icon="plus" @click="outerAnswer = true">新增问题答案</el-button>
                <el-table ref="multipleTable" :data="AddQuestionnaires.answerData" border tooltip-effect="dark" style="width: 100%;height: 400px" @selection-change="handleSelectionChange">
                    <el-table-column prop="code" label="选项代码" width="300"></el-table-column>
                    <el-table-column prop="content" label="选项内容" width="150"></el-table-column>
                    <el-table-column prop="selectionRate" label="选择率" width="150"></el-table-column>
                    <el-table-column fixed="right"              label="操作"      width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="EditAnswerData(scope.$index, AddQuestionnaires.answerData)" type="text" size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveSelectionRate">保存</el-button>
                <el-button @click="outerVisibleFile = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="outEditAnswer">
            <el-form ref="form" :model="AddQuestionnaires" label-width="auto">
                <el-form-item label="选择率：">
                    <el-input-number v-model="SelectPro" controls-position="right" @change="handleChange" :min="1" :max="100"></el-input-number>
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
                AnswerIndex:"",
                SelectPro:0,
                outEditAnswer:false,
                outerVisibleFile:false,
                id: this.$route.params.id,
                index:"",
                outerAnswer:false,
                Project:[],
                OrgData:[],
                answerDatas:[],
                AddQuestionnaires: {
                    answerData:[],
                    exhibitionType: "",
                    content:"",
                    answerType:"",
                    SelectPro:""
                },
                Questionnaire:{
                    Org:"",
                    remarks:"",
                    QuestionnaireData:[],
                    name:"",
                    proId:"",
                    proName:"",
                    crowdOriented:"",
                    type:"",
                    answerType:""
                },
                answerDatas:{
                    content:"",
                    code:""
                },
                exhibitionTypes:[],
                answerTypes:[],
                types:[],
                crowdOrienteds:[]
            }
        },
        methods: {
            FillAnswer:function(index, rows){
                var row = rows[index];
                if (this.Questionnaire.Org == undefined)return
                this.outerVisibleFile = true;
                this.AddQuestionnaires.answerType = row.answerType;
                this.AddQuestionnaires.content = row.content;
                this.AddQuestionnaires.exhibitionType = row.exhibitionType;
                this.AddQuestionnaires.answerData = row.answerData;
            },
            SaveEditAnswer:function(){
                var row = this.AddQuestionnaires.answerData[this.AnswerIndex];
                this.answerDatas = row;
                this.answerDatas.selectionRate = this.SelectPro;
                row = this.answerDatas;
                var Org = this.Questionnaire.Org;
                for (var i=0;i<this.OrgData.length;i++){
                    var org = this.OrgData[i];
                    if(org.code == Org){
                        row.org = org;
                    }
                }
                this.outEditAnswer =false;
            },
            closeQuestionnaire:function(){
                this.$router.push('/wjgl');
            },
            EditAnswerData:function(index, rows){
                var row = rows[index];
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
            saveSelectionRate:function(){
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
            },
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
                        _this.Questionnaire = data.data.data;
                        _this.Questionnaire.proId = data.data.data.projectId;
                        _this.Questionnaire.QuestionnaireData = _this.objectToArr(data.data.data.QuestionnaireData);
                        _this.OrgData = data.data.data.OrgData;
                    }
                });
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