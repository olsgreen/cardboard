<template>
    <div>
        <div v-if="cell && !cell._placeholder" v-for="(cell, c) in columns" class="scheduler-col" :style="'grid-column-start:'+ (c + 1) +'; grid-column-end: '+ ((cell._span ? cell._span : 1) + c + 1) +';'">
            <component :is="config.components.cells.body" :data="cell"></component>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            columns: {
                type: Array,
                required: true
            },
            config: {
                type: Object,
                required: true
            }
        }
    }
</script>