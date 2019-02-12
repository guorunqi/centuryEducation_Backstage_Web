<template>
    <section>
        <el-row :gutter="10">
            <el-col :span="7" >
                <div style="border: 1px solid #d1dbe5;padding-top: 10px;height: 500px;">
                    <el-tree
                            ref="tree"
                            :data="orgTree"
                            node-key="id"
                            :props="defaultProps"
                            highlight-current
                            check-on-click-node
                            draggable
                            style="border: 0px;"
                            @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16">
                <div style="border: 1px solid #d1dbe5;height: 500px;">
                        <el-form :inline="true" style="padding-left: 30px;padding-top:10px;">
                            <el-form-item>
                                <el-button type="primary" v-on:click="showFrom">增加顶级机构</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addSonOrg">增加下级机构</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="updateOrg">修改机构信息</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="deleteOrg">删除机构</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form :inline="true" style="padding-left: 30px;">
                            <el-form-item>
                                <el-button type="primary" v-on:click="showAddUserFrom">新增</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="showEditUserFrom">编辑</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="deleteUser">删除</el-button>
                            </el-form-item>
                        </el-form>

                        <el-table :data="users" highlight-current-row style="width: 100%;" ref="userTable" @selection-change="userSelectChange">
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column type="index" width="60">
                            </el-table-column>
                            <el-table-column prop="code" label="编号"  sortable>
                            </el-table-column>
                            <el-table-column prop="name" label="姓名"  sortable>
                            </el-table-column>
                            <el-table-column prop="role" label="角色"  sortable>
                            </el-table-column>
                            <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
                            </el-table-column>
                        </el-table>
                </div>
            </el-col>
        </el-row>




        <!--新增机构界面-->
        <el-dialog title="机构信息" v-model="addFormVisible" :close-on-click-modal="false" @close='closeDialog'>
            <el-form :model="org" label-width="80px" ref="addForm">
                <el-row>

                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="org.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="org.code" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="机构类型" prop="orgTypeId">
                            <el-input v-model="org.orgTypeId" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮编" prop="zipcode">
                            <el-input v-model="org.zipcode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电子邮箱" prop="emali">
                            <el-input v-model="org.emali" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="机构负责人" prop="charge">
                            <el-input v-model="org.charge" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式" prop="chargePhone">
                            <el-input v-model="org.chargePhone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="机构联系人" prop="contacts">
                            <el-input v-model="org.contacts" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式" prop="contactsPhone">
                            <el-input v-model="org.contactsPhone" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="网站地址" prop="website">
                            <el-input v-model="org.website" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="org.address" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remarks">
                            <el-input type="textarea" v-model="org.remarks" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveOrg" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--新增员工界面-->
        <el-dialog title="新增" v-model="addUserFormVisible" :close-on-click-modal="false">
            <el-form :model="addUserForm" label-width="80px" ref="addUserForm">
                <el-form-item label="编码" prop="code">
                    <el-input v-model="addUserForm.code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addUserForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="loginName">
                    <el-input v-model="addUserForm.loginName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-input v-model="addUserForm.roleId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addUserForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="birthDate" placeholder="选择日期" v-model="addUserForm.birthDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="remarks" v-model="addUserForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addUserFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="saveUserSubmit" :loading="addUserLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<style>
    .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}
</style>

<script>
    import qs from 'qs';
    export default{
        data(){
            return {
                msg: '这个是Home模板页',
                orgTree: [],
                defaultProps: {children: 'childList', label: 'name'},
                clickNode:{},
                org:{
                    pid:"",
                    code:"",
                    name:"",
                    address:"",
                    zipcode:"",
                    emali:"",
                    website:"",
                    charge:"",
                    chargePhone:"",
                    contacts:"",
                    contactsPhone:"",
                    remarks:"",
                    orgTypeId:""
                },
                addFormVisible:false,
                addLoading:false,
                users:[],
                roles:[],
                addUserFormVisible:false,
                addUserForm:{},
                selectUsers:[],
                addUserLoading:false
            }
        },
        methods:{
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
            },
            queryOrgTreeData(){
                this.$ajax({
                    method: 'post',
                    url: '/api/queryOrgTree',
                    data: ""
                }).then(data =>{
                    this.orgTree=data.data.data;
                });
            },
            handleNodeClick(data){
                this.clickNode=data;
                this.$ajax({method: 'post',
                    url:'/api/queryUserByOrg',
                    data:{id:data.id}
                }).then(data =>{
                    var us=data.data.data;
                    if(this.roles.length>0&&us.length>0){
                        for(var i= 0;i<us.length;i++){
                            for(var a=0;a<this.roles.length;a++){
                                if(us[i].roleId==this.roles[a].id){
                                    us[i].role=this.roles[a].name;
                                }
                            }
                        }
                    }
                    this.users=us;
                });
            },
            addRootOrg(){

            },
            addSonOrg(){
                var checkNodes=this.clickNode;
                if(checkNodes.id==null){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个组织机构',
                        type: 'warning'
                    });
                }else{
                    this.org.pid=checkNodes.id;
                    this.addFormVisible=true;
                }
            },
            updateOrg(){
                var checkNodes=this.clickNode;
                if(checkNodes.id==null){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个组织机构',
                        type: 'warning'
                    });
                }else{
                    this.$ajax({
                        method:'post',
                        url:'/api/queryOrgById',
                        data:{id:checkNodes.id}
                    }).then(data =>{
                        this.org=data.data.data;
                        this.addFormVisible=true;
                    });
                }
            },
            deleteOrg(){
                var checkNodes=this.clickNode;
                if(checkNodes.id==null){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个组织机构',
                        type: 'warning'
                    });
                }else{
                    this.$ajax({
                        method:'post',
                        url:'/api/deleteOrg',
                        data:{ids:checkNodes.id}
                    }).then(data =>{
                        if(data.data.code=="true") {
                            this.queryOrgTreeData();
                            this.clickNode = {};
                            this.$message({
                                message: '删除数据成功！',
                                type: 'success'
                            });
                        }else{
                            this.$message.error('删除数据失败！请联系管理员。');
                        }
                    });
                }
            },
            showFrom(){
                this.addFormVisible=true;
            },
            saveOrg(){
                this.$ajax({method: 'post',
                            url:'/api/saveOrg',
                            data:{data:JSON.stringify(this.org)}
                }).then(data =>{
                    if(data.data.code=="true"){
                        this.addFormVisible=false;
                        this.$message({
                            message: '增加数据成功！',
                            type: 'success'
                        });

                        this.queryOrgTreeData();
                        this.clickNode={};
                    }else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            },
            closeDialog(){
                Object.assign(this.$data.org, this.$options.data().org);
            },
            queryRolesData(){
                this.$ajax({method: 'post',
                    url:'/api/queryRole',
                    data:{}
                }).then(data =>{
                    if(data.data.code=="true"){
                        this.roles=data.data.data;
                    }else {
                        this.$message.error('加载数据失败！请联系管理员。');
                    }
                });
            },
            showAddUserFrom(){
                var checkNodes=this.clickNode;
                if(checkNodes.id==null){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个组织机构',
                        type: 'warning'
                    });
                }else {
                    this.addUserFormVisible = true;
                }
            },
            showEditUserFrom(){
                if(this.selectUsers.length!=1){
                    this.$message({
                        showClose: true,
                        message: '请先选择一个用户',
                        type: 'warning'
                    });
                }else{
                    this.addUserForm=this.selectUsers[0];
                    this.addUserFormVisible=true;
                }
            },
            deleteUser(){
                if(this.selectUsers.length<1){
                    this.$message({
                        showClose: true,
                        message: '请先选择用户',
                        type: 'warning'
                    });
                }else{
                    this.$ajax({method: 'post',
                        url:'/api/deleteUser',
                        data:{data:JSON.stringify(this.selectUsers),orgid:this.clickNode.id}
                    }).then(data =>{
                        if(data.data.code=="true"){
                            this.addFormVisible=false;
                            this.$message({
                                message: '删除数据成功！',
                                type: 'success'
                            });
                            this.handleNodeClick(this.clickNode);
                            this.selectUsers=[];
                        }else {
                            this.$message.error('增加数据失败！请联系管理员。');
                        }
                    });
                }
            },
            userSelectChange(val){
                this.selectUsers=val;
            },
            saveUserSubmit(){
                this.$ajax({method: 'post',
                    url:'/api/saveUser',
                    data:{data:JSON.stringify(this.addUserForm),orgid:this.clickNode.id}
                }).then(data =>{
                    if(data.data.code=="true"){
                        this.addFormVisible=false;
                        this.$message({
                            message: '增加数据成功！',
                            type: 'success'
                        });
                        this.handleNodeClick(this.clickNode);
                        this.selectUsers=[];
                    }else {
                        this.$message.error('增加数据失败！请联系管理员。');
                    }
                });
            }

        },
        mounted() {
            this.queryOrgTreeData();
            this.queryRolesData();
        }
    }

</script>