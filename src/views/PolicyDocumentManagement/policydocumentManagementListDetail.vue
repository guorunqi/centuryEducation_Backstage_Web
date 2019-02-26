<template>
    <div>
        <el-form :inline="true" :model="policyDocument" class="demo-form-inline">
            <el-form-item label="文件名称">
                <el-input v-model="policyDocument.policyName" placeholder="政策文件名称"></el-input>
            </el-form-item>
            <el-form-item label="一级分类">
                <el-select v-model="policyDocument.classOne" placeholder="一级分类">
                    <el-option v-for="item in policyClassOnes" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="policyDocument.classTwo" placeholder="二级分类">
                    <el-option v-for="item in policyClassTwos" :key="item.dictId" :label="item.dictName" :value="item.dictId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="policyDocument.remarks" placeholder="政策文件名称" clearable style="width: 710px"></el-input>
            </el-form-item>
            <el-button type="primary" @click="SavePolicyDocumentData">保存政策文件</el-button>
            <el-button type="primary" @click="closeProject">关闭政策文件</el-button>
            <div class="hello">
                <el-button type="primary" icon="plus" @click="outerVisibleFile = true">新增条目</el-button>
                <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" v-on:childMethod="TreeAddSubordinatePolicyDocument" v-on:childEdit="TreeEditSubordinate" v-on:childDelete="TreeDeleteSubordinate"></tree-grid>
                <el-dialog title="新增条目" :visible.sync="outerVisibleFile">
                    <el-form ref="form" :model="form" label-width="auto">
                        <el-form-item label="条目名称：">
                            <el-input v-model="form.name" placeholder="请输入内容" style="width: 600px"></el-input>
                        </el-form-item><br>
                        <el-form-item label="条目内容：">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content" style="width: 600px"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="AddPolicyDocunentEdit">保存</el-button>
                        <el-button @click="outerVisibleFile = false">取 消</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="新增下级条目" :visible.sync="addSubordinate">
                    <el-form ref="form" :model="TreeAddSubordinatePolicyDocumentData" label-width="auto">
                        <el-form-item label="条目名称：">
                            <el-input v-model="TreeAddSubordinatePolicyDocumentData.name" placeholder="请输入内容" style="width: 600px"></el-input>
                        </el-form-item><br>
                        <el-form-item label="条目内容：">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="TreeAddSubordinatePolicyDocumentData.content" style="width: 600px"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="AddSubordinatePolicyDocunent">保存</el-button>
                        <el-button @click="addSubordinate = false">取 消</el-button>
                    </div>
                </el-dialog>

                <el-dialog title="编辑条目" :visible.sync="editSubordinate">
                    <el-form ref="form" :model="TreeEditSubordinatePolicyDocumentData" label-width="auto">
                        <el-form-item label="条目名称：">
                            <el-input v-model="TreeEditSubordinatePolicyDocumentData.name" placeholder="请输入内容" style="width: 600px"></el-input>
                        </el-form-item><br>
                        <el-form-item label="条目内容：">
                            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="TreeEditSubordinatePolicyDocumentData.content" style="width: 600px"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="EditSubordinatePolicyDocunent">保存</el-button>
                        <el-button @click="editSubordinate = false">取 消</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-form>
    </div>
</template>


<script>

    import {TreeGrid} from '../../components/treeTable'
    export default {
        name: "projectManagementList",
        data() {
            return {
                form:{
                    content:'',
                    name:''
                },
                policyClassOnes: [],//一级分类
                policyClassTwos: [],//二级分类
                TreeAddSubordinatePolicyDocumentData:{
                    pid:'',
                    content:'',
                    name:''
                },
                TreeEditSubordinatePolicyDocumentData:{},
                policyDocument: {
                    id:'',
                    remarks:'',
                    policyName:'',
                    classOne: '',//
                    classTwo: '',//
                },//
                outerVisibleFile:false,
                addSubordinate:false,
                editSubordinate:false,
                id: this.$route.params.id,
                columns: [
                    {
                        text: '条目名称',
                        dataIndex: 'name'
                    },
                    {
                        text: '条目内容',
                        dataIndex: 'exped1'
                    },
                ],
                dataSource: []
            }
        },
        methods: {
            TreeAddSubordinatePolicyDocument(data){
                this.TreeAddSubordinatePolicyDocumentData.pid = data.id
                this.addSubordinate = true
            },
            TreeDeleteSubordinate(data){
                var _this = this
                    this.$confirm('此操作将永久删除该记录及下级记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.AjaxJson("DeleteSubordinatePolicyDocumentEntry",{"id":data.id},
                            function(data){
                                if (data.data.code== "true"){
                                    _this.dataSource.splice(0,_this.dataSource.length)
                                    _this.load()
                                    _this.messageOk("删除成功")
                                }
                            });
                    }).catch(() => {
                        _this.messageOk("已取消删除")
                    })

            },
            TreeEditSubordinate(data){
                var _this = this
                this.AjaxJson("selectEditSubordinatePolicyDocumentEntry",{"id":data.id},
                    function(data){
                        if (data.data.code== "true"){
                            _this.editSubordinate = true
                            _this.TreeEditSubordinatePolicyDocumentData = data.data.data
                        }
                    });
            },
            EditSubordinatePolicyDocunent(){
                var _this = this
                this.AjaxJson("EditSubordinatePolicyDocumentEntry",{"PolicyDocumentId":this.policyDocument.id,"content": this.TreeEditSubordinatePolicyDocumentData.content,"name":this.TreeEditSubordinatePolicyDocumentData.name,"pid":this.TreeEditSubordinatePolicyDocumentData.pid,"id":this.TreeEditSubordinatePolicyDocumentData.id},
                    function(data){
                        if (data.data.code== "true"){
                            _this.editSubordinate = false
                            _this.dataSource.splice(0,_this.dataSource.length)
                            _this.load()
                        }
                    });
            },
            AddSubordinatePolicyDocunent(){
                var _this = this
                this.AjaxJson("AddSubordinatePolicyDocumentEntry",{"PolicyDocumentId":this.policyDocument.id,"content": this.TreeAddSubordinatePolicyDocumentData.content,"name":this.TreeAddSubordinatePolicyDocumentData.name,"pid":this.TreeAddSubordinatePolicyDocumentData.pid},
                    function(data){
                        if (data.data.code== "true"){
                            _this.addSubordinate = false
                            _this.dataSource.splice(0,_this.dataSource.length)
                            _this.load()
                        }
                    });
            },
            AddPolicyDocunentEdit(){
                var _this = this
                debugger
                this.AjaxJson("AddPolicyDocumentEntry",{"PolicyDocumentId":this.policyDocument.id,"content": this.form.content,"name":this.form.name},
                    function(data){
                        if (data.data.code== "true"){
                            _this.outerVisibleFile = false
                            _this.dataSource.splice(0,_this.dataSource.length)
                            _this.load()
                        }
                    });
            },
            load(){
                var _this = this
                this.AjaxJson("selectPolicyDocumentEntryByPolicyDocumentId",{"PolicyDocumentId":this.policyDocument.id},
                    function(data){
                        if (data.data.code== "true"){
                            console.log(data.data.data.policyDocument)
                            _this.policyDocument = data.data.data.policyDocument
                           _this.dataSource = data.data.data.treeTableData
                        }
                    });
            },
            SavePolicyDocumentData(){
                var _this = this;
                var loginParams = {policyDocument:this.policyDocument};
                this.$ajax({
                    method: 'post',
                    url: '/api/SavePolicyDocumentManagement',
                    data: loginParams
                }).then(data => {
                    if (data.data.code== "true"){
                        _this.policyDocument.id = data.data.data.id;
                        _this.messageOk("政策文件保存成功")
                    }
                });
            },
            closeProject(){
                this.$router.push('/zcwxgl');
            }
        },
        mounted() {
            this.policyDocument.id = this.id
            this.load()
            var _this = this;
            //加载项目一级分类
            this.getDictAllByDictTypeId('PROJECT_CLASS_ONE',function(data){
                _this.policyClassOnes = data;
            });
            //加载项目二级分类
            this.getDictAllByDictTypeId('POLICY_DOCUMENT_TWO',function(data){
                _this.policyClassTwos = data;
            });
        },
        components: {
            TreeGrid
        }
    }



</script>

<style>
    .el-input{
        width: 300px;
    }
</style>