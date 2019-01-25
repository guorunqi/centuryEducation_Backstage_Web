<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="项目名称">
                <el-input v-model="formInline.user" placeholder="项目名称"></el-input>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="formInline.region" placeholder="一级分类">
                    <el-option label="学前教育" value="jichujiaoyu"></el-option>
                    <el-option label="基础教育" value="xueqianjiaoyu"></el-option>
                    <el-option label="职业教育" value="zhiyejiaoyu"></el-option>
                    <el-option label="特殊教育" value="teshujiaoyu"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" style="text-indent : 0px;">
                <el-select v-model="formInline.region" placeholder="状态">
                    <el-option label="未发布" value="weifabu"></el-option>
                    <el-option label="进行中" value="jinxingzhong"></el-option>
                    <el-option label="已结束" value="yijieshu"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="机构名称">
                <el-input v-model="formInline.user" placeholder="机构名称"></el-input>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="formInline.region" placeholder="二级分类">
                    <el-option label="教学质量" value="jiaoxuezhiliang"></el-option>
                    <el-option label="办学水平" value="banxueshuiping"></el-option>
                    <el-option label="综合发展" value="zonghefazhan"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 55px">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="onReset">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 15px">
            <el-button size="" @click="add">新增</el-button>
            <el-button size="" @click="">编辑</el-button>
            <el-button size="" type="danger" @click="">删除</el-button>
        </div>
        <el-table
                ref="multipleTable"
                :data="tableData3"
                tooltip-effect="dark"
                style="width: 100%;height: 400px"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="项目名称"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="classOne"
                    label="一级分类"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="classTwo"
                    label="二级分类"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop=""
                    label="机构名称"
                    width="300">
            </el-table-column>
            <el-table-column
                    prop="stutas"
                    label="状态"
                    width="150">
            </el-table-column>
        </el-table>
       <!-- <div class="block">
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
    import qs from 'qs';
    import  router from "../../routes.js"
    export default {
        name: "projectManagementList",
        data() {
            return {
                formInline: {
                    user: '',
                    region: ''
                },
                fileId:0,
                tableData3:[],
            }
        },
        mounted(){
           this.init()
        },
        methods: {
            init(){
                var me = this;
                var loginParams = {};
                this.$ajax({
                    method: 'post',
                    url: '/api/projectManagementLoad',
                    data: qs.stringify(loginParams)
                }).then(data => {
                    if (data.data.code== "true"){
                        me.tableData3 = data.data.data;
                    }
                });
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
            add() {
                this.$router.push({ name: '项目详情',
                    params: {
                        id : this.fileId
                }
                })
            }
        },

    }
</script>

<style>
    .el-input{
        width: 300px;
    }
</style>