
<template>
    <div style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="project" class="demo-form-inline">
            <el-form-item label="项目名称">
                <el-input v-model="project.name" value="fildId" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-select v-model="project.orgs"  multiple  placeholder="请选择">
                    <el-option v-for="item in Orgitems" :key="item.id" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="project.classOne" placeholder="一级分类">
                    <el-option v-for="item in classOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起始时间">
                <el-date-picker type="date" placeholder="选择日期"  v-model="project.startTime" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="project.classTwo" placeholder="二级分类">
                    <el-option v-for="item in classTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="project.endTime" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
        </el-form>
        <!-- 相关文件 -->
        <div style="margin-bottom: 15px">
            <el-button type="primary" icon="plus" @click="AddFile()">新增文件</el-button>
            <div style="float: right">
                <el-button type="primary" @click="SaveProjectData">保存项目</el-button>
                <el-button type="primary" @click="closeProject">关闭项目</el-button>
            </div>
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
        <el-table ref="multipleTable" :data="filds" border tooltip-effect="dark" height="350" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column label="相关文件">
                    <el-table-column type="selection" width="45"> </el-table-column>
                    <el-table-column prop="policyName" label="文件名称" width="400"></el-table-column>
                    <el-table-column prop="classOne" label="一级分类" width="200" :formatter="formatClassOnes"></el-table-column>
                    <el-table-column prop="classTwo" label="二级分类" width="200"  :formatter="formatClassTwos"></el-table-column>
                    <el-table-column  label="操作"      width="140">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent="deleteSelectionTableFileRow(scope.$index, filds)" type="text" size="small">移除</el-button>
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

        <el-table ref="multipleTable" :data="SpecialistTable" border type=index tooltip-effect="dark" height="350" style="width: 100%;" @selection-change="handleSelectionChange">
            <el-table-column label="涉及专家">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="SpecialistSchool"    label="评估学校"  width="393" :formatter="formatSpecialistSchool"></el-table-column>
                <el-table-column prop="SpecialistName"      label="姓名"      width="150" ></el-table-column>
                <el-table-column prop="SpecialistPhone"     label="电话"      width="150"></el-table-column>
                <el-table-column prop="SpecialistRemarks"   label="备注"      width="150"></el-table-column>
                <el-table-column  label="操作"      width="100">
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
        name: "projectManagementList",
        data() {
            return {
                classOnes: '',//一级分类
                classTwos: '',//二级分类
                //fildData:'',//选择文件保存
                //保存数据
                //**********************************
                project: {  //                     *
                    id:"",
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
                policyDocumentClassTwos:[],
                Org_select:[],
                Orgitems: [],
                AllSpecialist:[],
                id: this.$route.params.id,
                outerVisible: false,
                outerVisibleFile: false,
                formInline: {
                    user: '',
                    region: ''
                },
                tableData3: [],
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
            AddFile(){
                debugger
                if(this.project.id == null || this.project.id == ""){
                    this.messageErrorEdit("请先保存项目文件")
                }else{
                    this.outerVisibleFile = true
                }
            },
            onSubmit() {
                console.log('submit!');
            },
            onReset() {
                console.log('reset!');
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            addZZ(){
                var _this = this
                if(this.project.id == null || this.project.id == ""){
                    this.messageErrorEdit("请先保存项目文件")
                }else{
                    _this.outerVisible = true
                    this.selectSchoolListByIdList(this.project.orgs,function(data){
                        _this.Org_select = data;
                    })
                }
            },
            AddRowFile(){
                var _this = this
                var selectAllPolicyDocumentData = _this.selectAllPolicyDocumentData
                var AllPolicyDocumentData = _this.AllPolicyDocumentData
                for ( var i = 0; i <AllPolicyDocumentData.length; i++){
                    var AllPolicyDocument = AllPolicyDocumentData[i];
                    for(let key  in AllPolicyDocument){
                        var value = AllPolicyDocument[key];
                        if(key == "id" && value == selectAllPolicyDocumentData){
                            var loginParams = {"AllPolicyDocument":AllPolicyDocument,"proId":_this.project.id};
                            this.$ajax({
                                method: 'post',
                                url: '/api/SaveProjectFile',
                                data: loginParams
                            }).then(data => {
                                if (data.data.code== "true"){
                                    _this.filds.push(AllPolicyDocument)
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
                var orgCode = _this.pgxx_orgs;
                var selectSpecialist = _this.selectSpecialist
                var AllSpecialist = _this.AllSpecialist
                debugger
                for ( var i = 0; i <AllSpecialist.length; i++){
                    var AllSpecia = AllSpecialist[i];
                    for(let key  in AllSpecia){
                        var value = AllSpecia[key];
                        if(key == "code" && value == selectSpecialist){
                           var loginParams = {"orgCode":orgCode,"AllSpeciaId":AllSpecia.id,"proId":_this.project.id};
                           this.$ajax({
                               method: 'post',
                               url: '/api/SaveProjectOrgUser',
                               data: loginParams
                           }).then(data => {
                               debugger
                               if (data.data.code== "true"){
                                   obj.SpecialistName = AllSpecia.name;
                                   obj.SpecialistId = AllSpecia.id;
                                   obj.SpecialistPhone = AllSpecia.phone;
                                   obj.SpecialistRemarks = AllSpecia.remarks;
                                   obj.SpecialistSchool = _this.pgxx_orgs
                                   _this.SpecialistTable.push(obj)
                               }
                           });
                       }
                    }
                }
                _this.outerVisible = false
            },
            deleteSelectionTableRow(index, rows){
                    rows.splice(index, 1);
            },
            deleteSelectionTableFileRow(index, rows){
                debugger
                var loginParams = {"AllPolicyDocumentId":rows[index].id,"proId":this.project.id};
                this.$ajax({
                    method: 'post',
                    url: '/api/DeleteProjectFile',
                    data: loginParams
                }).then(data => {
                    if (data.data.code== "true"){
                        rows.splice(index, 1);
                    }
                });


            },
            SaveProjectData(){
                if(this.project.id != ""){
                    return this.messageErrorEdit("项目已保存")
                }
                var _this = this;
                var orgs = this.project.orgs.join(',');
                //var loginParams = {project:this.project,filds:this.filds,SpecialistTable:this.SpecialistTable};
                var loginParams = {project:this.project,orgs:orgs};
                this.$ajax({
                    method: 'post',
                    url: '/api/SaveProjectData',
                    data: loginParams
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.messageOk("项目保存成功")
                        _this.project.id = data.data.data;
                        //this.$router.push('/xmgl');
                    }
                });
            },
            closeProject(){
                this.$router.push('/xmgl');
            },
            formatClassOnes(row,column){
                if(this.classOnes.length>0){
                    return this.formatData(this.classOnes,row,"classOne");
                }
            },
            formatClassTwos(row,column){
                if(this.policyDocumentClassTwos.length>0){
                    return this.formatData(this.policyDocumentClassTwos,row,"classTwo");
                }
            },
            formatSpecialistSchool(row,column){
                if(this.Org_select.length>0){
                    return this.formatOrg(this.Org_select,row,"SpecialistSchool");
                }
            },
        },
        mounted() {
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
                debugger
                _this.AllPolicyDocumentData = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('POLICY_DOCUMENT_TWO',function(data){
                _this.policyDocumentClassTwos = data;
            });
        },
    }
</script>
<style>
    .el-form-item__label{
        width:68px;
    }

    .el-input {
        width: 300px;
    }
</style>