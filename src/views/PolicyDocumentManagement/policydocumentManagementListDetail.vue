<template>
    <div  style="width: 80%;margin: 0 auto;">
        <el-form :inline="true" :model="policyDocument" class="demo-form-inline">
            <el-form-item label="文件名称">
                <el-input v-model="policyDocument.policyName" placeholder="政策文件名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="SavePolicyDocumentData">保存政策文件</el-button>
            <el-button type="primary" @click="closeProject">关闭政策文件</el-button>
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
                <el-input type="textarea" :rows="2" style="width: 600px;" placeholder="政策文件名称" v-model="policyDocument.remarks">
                </el-input>
            </el-form-item>

            <div class="hello">
                <el-button type="primary" icon="plus" @click="addTiaomu">新增条目</el-button>
                <tree-grid :columns="columns" :tree-structure="true" :data-source="dataSource" v-on:childMethod="TreeAddSubordinatePolicyDocument" v-on:childEdit="TreeEditSubordinate" v-on:childDelete="TreeDeleteSubordinate"></tree-grid>
                <el-dialog :title="title" :visible.sync="outerVisibleFile">
                    <el-form ref="form" :model="form" label-width="auto">
                        <el-form-item label="条目名称：">
                            <el-input v-model="form.name" placeholder="请输入内容" style="width: 600px"></el-input>
                        </el-form-item><br>
                        <el-form-item label="条目内容：">
                            <!-- <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.content" style="width: 600px"></el-input> -->
                            <div class="components-container">
                                <div class="editor-container">
                                    <UE :defaultMsg=defaultText :config=config ref="ue"></UE>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer" >
                        <!-- 新增条目 -->
                        <el-button type="primary" @click="AddPolicyDocunentEdit" v-if="showAdd">保存</el-button>
                        <!-- 编辑条目 -->
                        <el-button type="primary" @click="EditSubordinatePolicyDocunent"  v-if="showEdit">保存</el-button>
                        <!-- 新增下级条目 -->
                        <el-button type="primary" @click="AddSubordinatePolicyDocunent" v-if="showCh">保存</el-button>
                        <el-button @click="outerVisibleFile = false">取 消</el-button>
                    </div>
                </el-dialog>
            </div>

            <div slot="footer" class="dialog-footer" style="margin-left: 10%;">

            </div>



        </el-form>
    </div>


</template>

<script>
    import {TreeGrid} from '../../components/treeTable'
    import UE from '../../UE.vue';
    import UE1 from '../../UE.vue';

    export default {

        name: "projectManagementList",
        data() {
            return {
                form:{
                    content:'',
                    name:''
                },
                title:"",
                showAdd:false,
                showEdit:false,
                showCh:false,
                policyClassOnes: [],//一级分类
                policyClassTwos: [],//二级分类
                TreeAddSubordinatePolicyDocumentData:{
                    pid:'',
                    content:'',
                    name:''
                },
                selfEvaluationEntryResult:{

                },
                selfEvaluation:{
                    resultContent:""
                },
                TreeEditSubordinatePolicyDocumentData:{},
                policyDocument: {
                    id:'',
                    remarks:'',
                    policyName:'',
                    classOne: '',//
                    classTwo: '',//
                },//
                //富文本
                defaultText: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 250,
                    UEDITOR_HOME_URL: 'static/UE/'
                },
                outerVisibleFile:false,
                addSubordinate:false,
                editSubordinate:false,
                id: this.$route.params.id,
                columns: [
                    {
                        text: '条目名称',
                        dataIndex: 'name'
                    }/*,
                    {
                        text: '条目内容',
                        dataIndex: 'exped1'
                    },*/
                ],
                dataSource: []
            }
        },
        methods: {
            TreeAddSubordinatePolicyDocument(data){
                this.showAdd=false
                this.showEdit=false
                this.showCh=true
                this.form.name = "";
                this.TreeAddSubordinatePolicyDocumentData.pid = data.id
                this.outerVisibleFile = true;
                this.$refs.ue.setUEContent("");
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
                this.outerVisibleFile = true;
                this.showAdd=false
                this.showEdit=true
                this.showCh=false
                var _this = this
                this.AjaxJson("selectEditSubordinatePolicyDocumentEntry",{"id":data.id},
                    function(data){
                        debugger
                        if (data.data.code== "true"){
                            debugger
                            _this.TreeEditSubordinatePolicyDocumentData.id = data.data.data.id;
                            _this.TreeEditSubordinatePolicyDocumentData.pid = data.data.data.parentId;
                            _this.form.name = data.data.data.name;
                            _this.defaultText = data.data.data.content;
                        }
                    });
            },
            EditSubordinatePolicyDocunent(){
                debugger
                var _this = this
                let content = this.$refs.ue.getUEContent();
                this.form.content = content;
                this.AjaxJson("EditSubordinatePolicyDocumentEntry",{"PolicyDocumentId":this.policyDocument.id,"content": content,"name":this.form.name,"pid":this.TreeEditSubordinatePolicyDocumentData.pid,"id":this.TreeEditSubordinatePolicyDocumentData.id},
                    function(data){
                        if (data.data.code== "true"){
                            _this.outerVisibleFile = false
                            _this.dataSource.splice(0,_this.dataSource.length)
                            _this.load()
                            _this.form.name = "";
                            _this.$refs.ue.setUEContent("");
                        }
                    });
            },
            AddSubordinatePolicyDocunent(){
                var _this = this
                this.TreeAddSubordinatePolicyDocumentData.name = this.form.name;
                this.TreeAddSubordinatePolicyDocumentData.content = this.$refs.ue.getUEContent();
                debugger
                this.AjaxJson("AddSubordinatePolicyDocumentEntry",{"PolicyDocumentId":this.policyDocument.id,"content": this.TreeAddSubordinatePolicyDocumentData.content,"name":this.TreeAddSubordinatePolicyDocumentData.name,"pid":this.TreeAddSubordinatePolicyDocumentData.pid},
                    function(data){
                        if (data.data.code== "true"){
                            debugger
                            _this.outerVisibleFile = false
                            _this.dataSource.splice(0,_this.dataSource.length)
                            _this.load()
                            _this.form.name = "";
                            _this.$refs.ue.setUEContent("");
                        }
                    });
            },
            AddPolicyDocunentEdit(){
                var _this = this
                let content = this.$refs.ue.getUEContent();
                this.form.content = content;
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
            },
            addTiaomu(){
                this.showAdd=true;
                this.showEdit=false,
                    this.showCh=false,
                    this.title = "新增条目"
                if(this.policyDocument.id == null){
                    this.messageErrorEdit("请先保存政策文件")
                    return
                }
                this.outerVisibleFile = true
                this.from.name = "";
                this.$refs.ue.setUEContent("");
            },
            load(){
                var _this = this
                this.AjaxJson("selectPolicyDocumentEntryByPolicyDocumentId",{"PolicyDocumentId":this.policyDocument.id},
                    function(data){
                        if (data.data.code== "true"){
                            _this.policyDocument = data.data.data.policyDocument
                            _this.dataSource = data.data.data.treeTableData
                        }
                    });
            },
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
            TreeGrid,UE
        }
    }
</script>


<!--

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
</script>-->
