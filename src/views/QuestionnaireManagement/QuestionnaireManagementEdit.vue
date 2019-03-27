<template>
    <div style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="Questionnaire" class="demo-form-inline">
            <el-form-item label="问卷名称">
                <el-input v-model="Questionnaire.name" value="fildId" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="所属项目">
                <el-select v-model="Questionnaire.projectId" placeholder="所属项目">
                    <el-option v-for="item in Project" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="SaveQuestionnaireData">保存问卷</el-button>
            <el-form-item label="面向人群">
                <el-select v-model="Questionnaire.crowdOriented" placeholder="面向人群">
                    <el-option v-for="item in crowdOrienteds" :key="item.dictId" :label="item.dictName"
                               :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="问卷类型">
                <el-select v-model="Questionnaire.type" placeholder="问卷类型">
                    <el-option v-for="item in types" :key="item.dictId" :label="item.dictName"
                               :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <br/>

            备注：
            <el-input type="textarea" :rows="2" width="100" placeholder="问题内容"
                      v-model="Questionnaire.remarks"></el-input>

        </el-form>

        <!-- 新增问题 -->
        <div style="margin-bottom: 15px">
            <el-button type="primary" icon="plus" @click="AddQuestionnaire">新增问题</el-button>
            <el-table ref="multipleTable" :data="QuestionDataList" border tooltip-effect="dark" height="300"
                      style="width: 77.6%;">
                <el-table-column label="问卷问题">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="content" label="问题内容" width="300"></el-table-column>
                    <el-table-column prop="answerType" label="答案类型" width="150"
                                     :formatter="formatAnswerType"></el-table-column>
                    <el-table-column prop="exhibitionType" label="汇总问卷展示类型" width="150"
                                     :formatter="formatExhibitionType"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="updataAddQuestionnaires(scope.$index, QuestionDataList)"
                                       type="text" size="small">修改
                            </el-button>
                            <el-button @click.native.prevent="deleteAddQuestion(scope.$index, QuestionDataList)"
                                       type="text" size="small">移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加问题" :visible.sync="outerVisibleFile">
            <el-form ref="form" :model="Question" label-width="auto">
                <el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;答案类型：
                    <el-select v-model="Question.answerType" placeholder="答案类型">
                        <el-option v-for="item in answerTypes" :key="item.dictId" :label="item.dictName"
                                   :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>汇总问卷展示类型：
                    <el-select v-model="Question.exhibitionType" placeholder="汇总问卷展示类型">
                        <el-option v-for="item in exhibitionTypes" :key="item.dictId" :label="item.dictName"
                                   :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题内容：">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-input type="textarea" :rows="2" width="100" placeholder="问题内容"
                              v-model="Question.content"></el-input>
                </el-form-item>
                <div style="text-align:center">
                    <el-button type="primary" icon="plus" @click="SaveQuestion">保存问题</el-button>
                </div>
                <el-button type="primary" icon="plus" @click="Addanswer">新增问题答案</el-button>
                <el-table ref="multipleTable" :data="answerDataList" border tooltip-effect="dark" height="200"
                          style="width: 97%;">
                    <el-table-column prop="code" label="选项代码" width="300"></el-table-column>
                    <el-table-column prop="content" label="选项内容" width="150"></el-table-column>
                    <el-table-column prop="" label="选择率" width="150"></el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteAnswerData(scope.$index, answerDataList)"
                                       type="text" size="small">移除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="CloseQusetion">关 闭</el-button>
            </div>
        </el-dialog>
        <!-- 新增问题答案 -->
        <el-dialog title="添加问题答案" :visible.sync="outerAnswer">
            <el-form ref="form" :model="answerData" label-width="auto">
                <el-form-item label="选项代码：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="选项代码"
                              v-model="answerData.code"></el-input>
                </el-form-item>
                <el-form-item label="选项内容：">
                    <el-input type="textarea" :rows="2" width="100" placeholder="选项内容"
                              v-model="answerData.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="SaveAnswer">保存</el-button>
                <el-button @click="outerAnswer = false">取 消</el-button>
            </div>
        </el-dialog>
        <div style="text-align:center">
            <el-button type="primary" @click="closeQuestionnaire">关闭问卷</el-button>
        </div>
    </div>
</template>


<script>
    import common from '../../common/js/common.js';
    import qs from 'qs';
    import router from "../../routes.js"

    export default {
        data() {
            return {
                id: this.$route.params.id,
                index: "",
                outerAnswer: false,
                outerVisibleFile: false,
                //outerVisibleFile1:false,
                Project: [],
                //问卷数据
                Questionnaire: {
                    id: "",
                    remarks: "",
                    name: "",
                    projectId: "",
                    proName: "",
                    crowdOriented: "",
                    type: "",
                },
                //问题列表数据
                QuestionDataList: [],
                //新增问题数据
                Question: {
                    id: "",
                    questionnaireId: "",
                    exhibitionType: "",
                    content: "",
                    answerType: ""
                },
                //问题答案列表
                answerDataList: [],
                answerData: {
                    id: "",
                    problemId: "",
                    content: "",
                    code: ""
                },
                exhibitionTypes: [],
                answerTypes: [],
                types: [],
                crowdOrienteds: []
            }
        },
        methods: {
            initData:function(){
                var QuestionnaireId = this.id;
                var _this = this
                //var loginParams = {"QuestionnaireId":QuestionnaireId};
                this.$ajax({
                    method: 'post',
                    url: '/api/EditQuestionnaireManagementLoad',
                    data:{data: JSON.stringify({"QuestionnaireId":QuestionnaireId})}
                }).then(data => {
                    debugger
                    if (data.data.code== "true"){
                        _this.Questionnaire.id = data.data.data.id;
                        _this.Questionnaire.remarks = data.data.data.remarks;
                        _this.Questionnaire.name = data.data.data.name;
                        _this.Questionnaire.projectId = data.data.data.projectId;
                        _this.Questionnaire.proName = data.data.data.proName;
                        _this.Questionnaire.crowdOriented = data.data.data.crowdOriented;
                        _this.Questionnaire.type = data.data.data.type;
                        _this.QuestionnaireLoad();
                    }
                });
            },
            //新增问题答案
            Addanswer: function () {
                if (this.Question.id == "" || this.Question.id == null) {
                    return this.messageErrorEdit("请先保存问题")
                }
                this.outerAnswer = true
            },
            AddQuestionnaire() {
                if (this.Questionnaire.id == "" || this.Questionnaire.id == null) {
                    return this.messageErrorEdit("请先保存问卷")
                }
                this.outerVisibleFile = true
            },
            //保存问题答案
            SaveAnswer: function () {
                var _this = this;
                this.$ajax({
                    method: 'post',
                    url: '/api/SaveAnswer',
                    data: {data: JSON.stringify(this.answerData)}
                }).then(data => {
                    if (data.data.code == "true") {
                        this.$message({
                            message: '问题保存成功！',
                            type: 'success'
                        });
                        _this.answerDataList.push(data.data.data);
                        _this.outerAnswer = false
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                })
            },
            CloseQusetion: function () {
                this.outerVisibleFile = false
                this.QuestionDataList = []
                this.QuestionnaireLoad();
            },
            QuestionnaireLoad:function(){
                var _this = this;
                this.$ajax({
                    method: 'post',
                    url: '/api/QuestionnaireLoad',
                    data: {data: JSON.stringify(this.Questionnaire)}
                }).then(data => {
                    if (data.data.code == "true") {
                        var questionDataList = data.data.data;
                        for (var i = 0; i < questionDataList.length; i++) {
                            _this.QuestionDataList.push(questionDataList[i]);
                            _this.Question.id = "";
                            _this.Question.exhibitionType = "";
                            _this.Question.content = "";
                            _this.Question.answerType = "";
                            _this.answerDataList = [];
                        }
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                })
            },
            deleteAddQuestion: function (index, rows) {
                var _this = this
                this.$ajax({
                    method: 'post',
                    url: '/api/DeleteQuestionAndAnswer',
                    data: {data: JSON.stringify(rows[index])}
                }).then(data => {
                    if (data.data.code == "true") {
                        debugger
                        rows.splice(index, 1);
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },
            deleteAnswerData: function (index, rows) {
                this.$ajax({
                    method: 'post',
                    url: '/api/deleteAnswer',
                    data: {data: JSON.stringify(rows[index])}
                }).then(data => {
                    if (data.data.code == "true") {
                        this.$message({
                            message: '答案删除成功！',
                            type: 'success'
                        });
                        debugger
                        rows.splice(index, 1);
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },
            updataAddQuestionnaires: function (index, rows) {
                var _this = this
                this.$ajax({
                    method: 'post',
                    url: '/api/LoadAnswer',
                    data: {data: JSON.stringify(rows[index])}
                }).then(data => {
                    if (data.data.code == "true") {
                        debugger
                        _this.Question.id = rows[index].id;
                        _this.Question.questionnaireId = rows[index].questionnaireId;
                        _this.Question.exhibitionType = rows[index].exhibitionType;
                        _this.Question.content = rows[index].content;
                        _this.Question.answerType = rows[index].answerType;
                        _this.answerDataList = data.data.data
                        _this.outerVisibleFile = true;
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },
            SaveQuestion: function () {
                var _this = this;
                this.$ajax({
                    method: 'post',
                    url: '/api/SaveQuestion',
                    data: {data: JSON.stringify(this.Question)}
                }).then(data => {
                    if (data.data.code == "true") {
                        this.$message({
                            message: '问题保存成功！',
                            type: 'success'
                        });
                        _this.Question.id = data.data.data;
                        _this.answerData.problemId = data.data.data;
                    } else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },
            SaveQuestionnaireData: function () {
                var _this = this;
                this.$ajax({
                    method: 'post',
                    url: '/api/SaveQuestionnaire',
                    data: {data: JSON.stringify(this.Questionnaire)}
                }).then(data => {
                    if (data.data.code == "true") {
                        this.$message({
                            message: '数据保存成功！',
                            type: 'success'
                        });
                        _this.Questionnaire.id = data.data.data;
                        _this.Question.questionnaireId = data.data.data;

                    } else {
                        this.$message.error('数据保存失败！请联系管理员。');
                    }
                });
            },
            closeQuestionnaire() {
                this.$router.push('/wjgl');
            },
            belongToProject: function () {
                var _this = this
                //Questionnaire.proId proName*
                var loginParams = {};
                this.$ajax({
                    method: 'post',
                    url: '/api/projectManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code == "true") {
                        _this.Project = data.data.data;
                    }
                });
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
            }
        },
        mounted() {
            this.initData();
            var _this = this;
            //加载面向人群
            this.getDictAllByDictTypeId('QUESTIONNAIRE_CROWD_ORIENTED', function (data) {
                _this.crowdOrienteds = data;
            });
            //加载问卷类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_TYPE', function (data) {
                _this.types = data;
            });
            //加载汇总问卷展示类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_SHOW_TYPE', function (data) {
                _this.exhibitionTypes = data;
            });
            //加载答案类型
            this.getDictAllByDictTypeId('QUESTIONNAIRE_ANSWER_TYPE', function (data) {
                _this.answerTypes = data;
            });
            //加载所属项目
            this.belongToProject();

        },
    }
</script>
<style scoped>
    .el-button--primary {
        margin-top: 10px;
        margin-bottom: 3px;
    }

    .el-textarea {
        width: 71%;
    }

    .el-input[data-v-2d8b39e0] {
        width: 300px;
    }

    .el-input__inner {
        width: 300px;
    }

    .el-input {
        width: 250px;
    }
</style>