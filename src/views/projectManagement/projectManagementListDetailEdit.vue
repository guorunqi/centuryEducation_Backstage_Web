<template>
    <div  style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="project" class="demo-form-inline">
            <el-form-item label="项目名称">
                <el-input v-model="project.name" value="fildId" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-select v-model="project.orgs"  multiple  placeholder="请选择">
                    <el-option v-for="item in Orgitems" :key="item.id" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>

            <el-button type="primary" @click="SaveProjectData">保存项目</el-button>
            <el-button type="primary" @click="closeProject">关闭项目</el-button>
            <el-form-item label="一级分类">
                <el-select v-model="project.classOne" placeholder="一级分类">
                    <el-option v-for="item in classOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="project.classTwo" placeholder="二级分类">
                    <el-option v-for="item in classTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起始时间">
                <el-date-picker type="date" placeholder="选择日期"  v-model="project.startTime" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>


            <el-form-item label="结束时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="project.endTime"  style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
        </el-form>
        <!-- 相关文件 -->
        <div style="margin-bottom: 15px">
            <el-button type="primary" icon="plus" @click="outerVisibleFile = true">新增文件</el-button>
            <!-- 添加文件页面 -->
            <el-dialog title="添加文件" :visible.sync="outerVisibleFile">
                <el-form ref="form" :model="form" label-width="auto">
                    <el-form-item label="文件名称：">
                        <el-select v-model="selectAllPolicyDocumentData" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in AllPolicyDocumentData"
                                    :key="item.id"
                                    :label="item.policyName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="AddRowFile">保存</el-button>
                    <el-button @click="outerVisibleFile = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <el-table ref="multipleTable" :data="filds" border tooltip-effect="dark" style="width: 100%;height: 400px">
                <el-table-column label="相关文件">
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column prop="policyName" label="文件名称" width="300"></el-table-column>
                    <el-table-column prop="classOne" label="一级分类" width="150" :formatter="formatClassOnes"></el-table-column>
                    <el-table-column prop="classTwo" label="二级分类" width="150"  :formatter="formatClassTwos"></el-table-column>
                    <el-table-column fixed="right"              label="操作"      width="80">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteSelectionTableRowFiled(scope.$index, filds)" type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
            </el-table-column>
        </el-table>
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

        <!-- 涉及专家 -->
        <div style="margin-bottom: 15px;margin-top: 15px">
            <el-button type="primary" icon="plus" @click="addZZ">新增专家</el-button>
            <!-- 添加专家子页面 -->
            <el-dialog title="添加专家" :visible.sync="outerVisible">
                <el-form ref="form" :model="form" label-width="auto">
                    <el-form-item label="评估学校：">
                        <el-select v-model="pgxx_orgs"  placeholder="请选择">
                            <el-option v-for="item in Org_select" :key="item.id" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专家名称：">
                        <el-select v-model="selectSpecialist" filterable placeholder="请选择">
                            <el-option v-for="item in AllSpecialist" :key="item.id" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addRowSpecialist">保存</el-button>
                    <el-button @click="outerVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>

        <el-table ref="multipleTable" :data="SpecialistTable" border type=index tooltip-effect="dark" style="width: 100%;height: 400px">
            <el-table-column label="涉及专家">
                <el-table-column type="selection"                        width="55"></el-table-column>
                <el-table-column prop="OrgCode"        label="评估学校"  width="300"></el-table-column>
                <el-table-column prop="userName"        label="姓名"      width="150" ></el-table-column>
                <el-table-column prop="userPhone"       label="电话"      width="150"></el-table-column>
                <el-table-column prop="userRemarks"     label="备注"      width="150"></el-table-column>
                <el-table-column fixed="right"          label="操作"      width="80">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteSelectionTableRow(scope.$index, SpecialistTable)" type="text" size="small">移除</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
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
                classOnes: '',//一级分类
                classTwos: '',//二级分类
                //fildData:'',//选择文件保存
                //保存数据
                //**********************************
                project: {  //                     *
                    id:'',
                    endTime:'',//                  *
                    startTime:'',//               *
                    classOne: '',//                *
                    classTwo: '',//                *
                    orgs: [],//                    *
                },//                               *
                filds:[],//文件选择数据             *
                SpecialistTable:[],// 专家列表      *
                //**********************************
                SpecialistTableSelectRowData:{},//专家列表，选中后数据
                pgxx_orgs:'',//评估学校
                selectSpecialist:'',//选择的专家
                AllPolicyDocumentData:[],//所有政策文件
                selectAllPolicyDocumentData:'',
                Org_select:[],
                Orgitems: [],
                AllSpecialist:[],
                id: this.$route.params.id,
                outerVisible: false,
                outerVisibleFile: false,
                policyDocumentClassTwos:[],
                formInline: {
                    user: '',
                    region: ''
                },
                Valuedata:{},
                AllSpeciaData:{},
                tableData3: [],
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
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
                var _this = this
                _this.outerVisible = true
                this.selectSchoolListByIdList(this.project.orgs,function(data){
                    _this.Org_select = data;
                })
            },
            AddRowFile(){
                debugger
                var _this = this
                var selectAllPolicyDocumentData = _this.selectAllPolicyDocumentData
                var AllPolicyDocumentData = _this.AllPolicyDocumentData
                for ( var i = 0; i <AllPolicyDocumentData.length; i++){
                    var AllPolicyDocument = AllPolicyDocumentData[i];
                    for(let key  in AllPolicyDocument){
                        var value = AllPolicyDocument[key];
                        if(key == "id" && value == selectAllPolicyDocumentData){
                            this.Valuedata = AllPolicyDocument;
                            _this.AjaxJson("insertProjectPolicyDocument",{projectId:_this.project.id,policyDocumentId:AllPolicyDocument.id},function(data){
                                if (data.data.code== "true"){
                                    _this.filds.push(_this.Valuedata)
                                }else{
                                    _this.messageOk(data.data.message)
                                }
                            });

                        }
                    }
                }
                _this.outerVisibleFile = false
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
                           this.AllSpeciaData = AllSpecia;
                           _this.AjaxJson("insertProjectOrgUser",{projectId:_this.project.id,userId:AllSpecia.id,orgCode:_this.pgxx_orgs},function(data){
                              debugger
                               if (data.data.code== "true"){
                                   obj.userName = _this.AllSpeciaData.name;
                                   obj.SpecialistId = _this.AllSpeciaData.id;
                                   obj.userPhone = _this.AllSpeciaData.phone;
                                   obj.userRemarks = _this.AllSpeciaData.remarks;
                                   obj.OrgCode = _this.pgxx_orgs;
                                   _this.SpecialistTable.push(obj)
                               }else{
                                    _this.messageError(data.data.message);
                               }
                           });

                       }
                    }
                }
                _this.outerVisible = false
            },
            deleteSelectionTableRowFiled(index, rows){
                var _this = this
                var row = rows[index];
                _this.AjaxJson("deleteProjectPolicyDocument",{projectId:_this.project.id,policyDocumentId:row.id},function(data){
                    if (data.data.code== "true"){
                        rows.splice(index, 1);
                    }
                });

            },
            deleteSelectionTableRow(index, rows){
                var _this = this
                var row = rows[index];
                _this.AjaxJson("deleteProjectOrgUser",{ProjectOrgUserId:row.ProjectOrgUserId},function(data){
                    if (data.data.code== "true"){
                        rows.splice(index, 1);
                    }
                });
            },
            SaveProjectData(){
                var loginParams = {"project":this.project};
                this.$ajax({
                    method: 'post',
                    url: '/api/upDataProjectData',
                    data: loginParams
                }).then(data => {
                    if (data.data.code== "true"){
                        this.$router.push('/xmgl');
                    }
                });
            },
            init(){
                var _this = this;
                var loginParams = { projectId: this.id};
                this.$ajax({
                    method: 'post',
                    url: '/api/selectProjectEdit',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        //_this.project.orgs = data.data.data.Orgs;
                        _this.filds = data.data.data.PolicyDocumentList;
                        _this.SpecialistTable = data.data.data.SpecialistList;
                        data.data.data.project.orgs = data.data.data.Orgs;
                        _this.project = data.data.data.project;

                    } else {
                        this.$message({
                            message: data.data.message,
                            type: 'error'
                        });
                    }
                });
            },
            closeProject(){
                this.$router.push('/xmgl');
            },
            formatClassOnes(row,column){
                debugger
                var returnData='';
                if(this.classOnes.length>0){
                    return this.formatData(this.classOnes,row,"classOne");
                }
            },
            formatClassTwos(row,column){
                var returnData='';
                if(this.policyDocumentClassTwos.length>0){
                    return this.formatData(this.policyDocumentClassTwos,row,"classTwo");
                }
            },
        },
        mounted() {
            this.init();
            var _this = this;
            //加载 org
            this.getAllOrgs(function(data){
                _this.Orgitems = data;
            });
            //加载项目一级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_ONE',function(data){
                _this.classOnes = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_TWO',function(data){
                _this.classTwos = data;
            });
            this.selectAllSpecialist(function(data){
                _this.AllSpecialist = data;
            });
            this.selectAllPolicyDocument(function(data){
                _this.AllPolicyDocumentData = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('POLICY_DOCUMENT_TWO',function(data){
                _this.policyDocumentClassTwos = data;
            });
        },
    }
</script>
