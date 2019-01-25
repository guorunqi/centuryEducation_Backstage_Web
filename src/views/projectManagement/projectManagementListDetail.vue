<template>
    <div>
        <el-form :inline="true" :model="project" class="demo-form-inline">
            <el-form-item label="项目名称">
                <el-input v-model="project.name" value="fildId" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="project.classOne" placeholder="一级分类">
                    <el-option v-for="item in classOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="起始时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="project.createTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-select v-model="project.orgs"  multiple  placeholder="请选择">
                    <el-option v-for="item in Orgitems" :key="item.id" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="project.classTwo" placeholder="一级分类">
                    <el-option v-for="item in classTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker type="date" placeholder="选择日期" v-model="project.endTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
        </el-form>
        <!-- 相关文件 -->
        <div style="margin-bottom: 15px">
            <el-button type="primary" icon="plus" @click="outerVisibleFile = true">新增文件</el-button>
            <el-button size="" type="danger" @click="">删除文件</el-button>
            <!-- 添加文件页面 -->
            <el-dialog title="添加文件" :visible.sync="outerVisibleFile">
                <el-form ref="form" :model="form" label-width="auto">
                    <el-form-item label="文件名称：">
                        <el-select v-model="project.classTwo" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="innerVisible = true">保存</el-button>
                    <el-button @click="outerVisibleFile = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>
        <el-table
                ref="multipleTable"
                :data="tableData3"
                border
                tooltip-effect="dark"
                style="width: 100%;height: 400px"
                @selection-change="handleSelectionChange">
                <el-table-column label="相关文件">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            label="文件名称"
                            width="300">
                        <template slot-scope="scope">{{ scope.row.date }}</template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="一级分类"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="二级分类"
                            width="150">
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
            <el-button size="" type="danger" @click="">删除专家</el-button>
            <!-- 添加专家子页面 -->
            <el-dialog title="添加专家" :visible.sync="outerVisible">
                <el-form ref="form" :model="form" label-width="auto">
                    <el-form-item label="评估学校：">
                        <el-select v-model="project.pgxx_orgs"  multiple  placeholder="请选择">
                            <el-option v-for="item in Org_select" :key="item.id" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="专家名称：">
                        <el-select v-model="请选择" filterable placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="innerVisible = true">保存</el-button>
                    <el-button @click="outerVisible = false">取 消</el-button>
                </div>
            </el-dialog>
        </div>

        <el-table
                ref="multipleTable"
                :data="tableData3"
                border
                tooltip-effect="dark"
                style="width: 100%;height: 400px"
                @selection-change="handleSelectionChange">
            <el-table-column label="涉及专家">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="评估学习"
                        width="300">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="电话"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="备注"
                        width="150">
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
                classOnes: '',
                classTwos: '',
                fildData:'',//选择文件保存
                filds:[],//文件选择数据
                project: {
                    classOne: '',
                    classTwo: '',
                    orgs: [],
                    pgxx_orgs:'',
                },
                Org_select:[],
                Orgitems: [],
                id: this.$route.params.id,
                outerVisible: false,
                outerVisibleFile: false,
                formInline: {
                    user: '',
                    region: ''
                },
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            addZZ(){
                var _this = this
                _this.outerVisible = true
                this.selectSchoolListByIdList(this.project.orgs,function(data){
                    debugger
                    _this.Org_select = data;
                    console.log(_this.Org_select)
                    debugger
                })
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
        },
    }



</script>

<style>
    .el-input{
        width: 300px;
    }
</style>