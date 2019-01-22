<template>
    <el-tree
            :data="orgTree"
            node-key="id"
            default-expand-all
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag">
    </el-tree>
</template>

<style>

</style>

<script>
    export default{
        data(){
            var orgTree;
                this.$ajax({
                    method: 'post',
                    url: '/api/queryOrgTree',
                    data: ""
                }).then(data => {
                    orgTree=data.data.data;
                });
                return {msg: '这个是Home模板页',orgTree:orgTree}
            },
        methods: {
        test(){
            this.$ajax({
                method: 'post',
                url: '/api/queryOrgTree',
                data: ""
            }).then(data => {
                debugger
            });
        },
        mounted() {
            this.test();
        }
    }
    }
</script>