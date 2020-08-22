<template>
    <div>
        <div class="card-board-body-cell" :style="'background: '+(data.color ? data.color : '#999')+';'" v-if="data">
            {{ data.content }} {{ data.index }}
        </div>
    </div>
</template>

<style lang="scss">
    .card-board-body-cell {
        color: white; 
        padding: 1rem; 
        margin-top: 1rem; 
        margin-left: 1rem; 
        margin-right: 1rem; 
    }
</style>

<script>
    export default {
        props: ['data']
    }
</script>