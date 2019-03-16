<template>
    <div>
        <el-form :inline="true" :model="Questionnaire" class="demo-form-inline">
            <el-form-item label="问卷名称">
                <el-input v-model="Questionnaire.name" value="fildId"  placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="Questionnaire.proId" placeholder="所属项目">
                    <el-option v-for="item in Project" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="SaveQuestionnaireData">保存问卷</el-button>
            <el-button type="primary" @click="closeQuestionnaire">关闭问卷</el-button>
            <el-form-item label="面向人群">
                <el-select v-model="Questionnaire.crowdOriented" placeholder="面向人群">
                    <el-option v-for="item in crowdOrienteds" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问卷类型">
                <el-select v-model="Questionnaire.type" placeholder="问卷类型">
                    <el-option v-for="item in types" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item><br/>
            备注：<el-input type="textarea" :rows="2" width="100" placeholder="问题内容" v-model="Questionnaire.remarks"></el-input>

        </el-form>

            <!-- 新增问题 -->
            <div style="margin-bottom: 15px">
                <el-button type="primary" icon="plus" @click="outerVisibleFile = true">新增问题</el-button>
                <el-table ref="multipleTable" :data="Questionnaire.QuestionnaireData" border tooltip-effect="dark" style="width: 100%;height: 400px">
                    <el-table-column label="问卷问题">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="content" label="问题内容" width="300"></el-table-column>
                        <el-table-column prop="answerType" label="答案类型" width="150" :formatter="formatAnswerType"></el-table-column>
                        <el-table-column prop="exhibitionType" label="汇总问卷展示类型" width="150" :formatter="formatExhibitionType"></el-table-column>
                        <el-table-column fixed="right"              label="操作"      width="100">
                            <template slot-scope="scope">
                                <el-button @click.native.prevent="updataAddQuestionnaires(scope.$index, Questionnaire.QuestionnaireData)" type="text" size="small">修改</el-button>
                                <el-button @click.native.prevent="deleteAddQuestionnaires(scope.$index, Questionnaire.QuestionnaireData)" type="text" size="small">移除</el-button>
                            </template>
                        </el-table-column>
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
                <el-table ref="multipleTable" :data="AddQuestionnaires.answerData" border tooltip-effect="dark" style="width: 100%;height: 400px">
                    <el-table-column prop="code" label="选项代码" width="300"></el-table-column>
                    <el-table-column prop="content" label="选项内容" width="150"></el-table-column>
                    <el-table-column prop="" label="选择率" width="150"></el-table-column>
                    <el-table-column fixed="right"              label="操作"      width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteAnswerData(scope.$index, AddQuestionnaires.answerData)" type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SaveAddQuestionnaires">保存</el-button>
                <el-button @click="outerVisibleFile = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 新增问题答案 -->
        <el-dialog title="添加问题答案" :visible.sync="outerAnswer">
            <el-form ref="form" :model="answerDatas" label-width="auto">
                <el-form-item label="选项代码：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="选项代码" v-model="answerDatas.code"></el-input>
                </el-form-item>
                <el-form-item label="选项内容：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="选项内容" v-model="answerDatas.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SaveAnswer">保存</el-button>
                <el-button @click="outerAnswer = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="修改问题" :visible.sync="outerVisibleFile1">
            <el-form ref="form" :model="AddQuestionnaires1" label-width="auto">
                <el-form-item label="问题内容：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="请输入内容" v-model="AddQuestionnaires1.content"></el-input>
                </el-form-item>
                <el-form-item label="汇总问卷展示类型：">
                    <el-select v-model="AddQuestionnaires1.exhibitionType" placeholder="汇总问卷展示类型">
                        <el-option v-for="item in exhibitionTypes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="答案类型：">
                    <el-select v-model="AddQuestionnaires1.answerType" placeholder="答案类型">
                        <el-option v-for="item in answerTypes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" icon="plus" @click="outerAnswer = true">新增问题答案</el-button>
                <el-table ref="multipleTable" :data="AddQuestionnaires1.answerData" border tooltip-effect="dark" style="width: 100%;height: 300px">
                    <el-table-column prop="code" label="选项代码" width="300"></el-table-column>
                    <el-table-column prop="content" label="选项内容" width="150"></el-table-column>
                    <el-table-column prop="" label="选择率" width="150"></el-table-column>
                    <el-table-column fixed="right"              label="操作"      width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteAnswerData(scope.$index, AddQuestionnaires1.answerData)" type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveUpdateAddQuestionnaires">保存</el-button>
                <el-button @click="outerVisibleFile1 = false">取 消</el-button>
            </div>
        </el-dialog>
        <!--<div class="block">
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
        data() {
            return {
                id: this.$route.params.id,
                index:"",
                outerAnswer:false,
                outerVisibleFile:false,
                outerVisibleFile1:false,
                Project:[],
                Questionnaire:{
                    remarks:"",
                    QuestionnaireData:[],
                    name:"",
                    proId:"",
                    proName:"",
                    crowdOriented:"",
                    type:"",
                    answerType:""
                },
                AddQuestionnaires: {
                    answerData:[],
                    exhibitionType: "",
                    content:"",
                    answerType:""
                },
                AddQuestionnaires1: {
                    answerData:[],
                    exhibitionType: "",
                    content:"",
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
            SaveAnswer:function(){
                var answerData = this.AddQuestionnaires.answerData;
                var answerData1 = this.AddQuestionnaires1.answerData;
                answerData.push(this.answerDatas);
                answerData1.push(this.answerDatas);
                this.answerDatas = {}
                this.outerAnswer = false
            },
            SaveAddQuestionnaires:function(){
                debugger
                var QuestionnaireData = this.Questionnaire.QuestionnaireData;
                QuestionnaireData.push(this.AddQuestionnaires);
                this.AddQuestionnaires={}
                this.outerVisibleFile = false
            },
            deleteAddQuestionnaires:function(index, rows){
                rows.splice(index, 1);
            },
            deleteAnswerData:function(index, rows){
                rows.splice(index, 1);
            },
            updataAddQuestionnaires:function(index, rows){
                var _this = this
                var row = rows[index];
                this.outerVisibleFile1 = true;
                this.AddQuestionnaires1.answerType = row.answerType;
                this.AddQuestionnaires1.content = row.content;
                this.AddQuestionnaires1.exhibitionType = row.exhibitionType;
                this.AddQuestionnaires1.answerData = row.answerData;
                this.index = index;
            },
            saveUpdateAddQuestionnaires:function(){
                var QuestionnaireData = this.Questionnaire.QuestionnaireData;
                var selectRow = QuestionnaireData[this.index];
                selectRow.answerType = this.AddQuestionnaires1.answerType
                selectRow.content = this.AddQuestionnaires1.content
                selectRow.exhibitionType = this.AddQuestionnaires1.exhibitionType
                this.outerVisibleFile1 = false;
            },
            SaveQuestionnaireData: function(){
                var _this = this;
                this.$ajax({method: 'post',
                    url:'/api/SaveEditQuestionnaire',
                    data:{data:JSON.stringify(this.Questionnaire)}
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
            closeQuestionnaire(){
                this.$router.push('/wjgl');
            },
            belongToProject:function(){
                var _this = this
                /*Questionnaire.proId proName*/
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
            initData:function(){
                var QuestionnaireId = this.id;
                var _this = this
                var loginParams = {"QuestionnaireId":QuestionnaireId};
                this.$ajax({
                    method: 'post',
                    url: '/api/EditQuestionnaireManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    debugger
                    if (data.data.code== "true"){
                        _this.Questionnaire = data.data.data;
                        _this.Questionnaire.proId = data.data.data.projectId;
                        var QuestionnaireData = _this.objectToArr(data.data.data.QuestionnaireData);
                        if(QuestionnaireData.length>0){
                            _this.Questionnaire.QuestionnaireData = _this.objectToArr(data.data.data.QuestionnaireData);
                        }
                    }
                });
            },
            formatAnswerType(row,column){
                var returnData='';
                if(this.answerTypes.length>0){
                    return this.formatData(this.answerTypes,row,"answerType");
                }
            },
            formatExhibitionType(row,column){
                var returnData='';
                if(this.exhibitionTypes.length>0){
                    return this.formatData(this.exhibitionTypes,row,"exhibitionType");
                }
            },
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