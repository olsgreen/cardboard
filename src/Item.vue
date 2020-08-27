<template>
    <div>
        <div class="card-board-body-cell" :style="'background: '+(data.color ? data.color : '#999')+';'" v-if="data">
            {{ data.content }} {{ data.index }} ({{ data.from | shortDate }} - {{ data.to | shortDate }})
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
        overflow: hidden;
        word-wrap: break-word;
    }
</style>

<script>
    export default {
        props: ['data'],
        filters: {
            shortDate(v) {
                return v.format('DD/MM')
            }
        }
    }
</script>