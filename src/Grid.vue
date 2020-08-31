<template>
    <div class="scheduler-grid scheduler-row" :style="rowColumnCss">
        <div v-for="(column, index) in columns" :index="index" :class="['scheduler-col', dateClassPrefixes(column.start)]">
            <div class="scheduler-grid-row" v-for="row in numRows" :style="{ height: (rowHeight - 1) + 'px' }"></div>
        </div>
    </div>
</template>

<script>
    import GeneratesColumnCss from './GeneratesColumnCss.js'
    import DateRelatedColumnClassNames from './DateRelatedColumnClassNames.js'

    export default {
        mixins: [GeneratesColumnCss, DateRelatedColumnClassNames],
        props: {
            numRows: {
                type: Number,
                required: true,
            },
            rowHeight: {
                type: Number,
                required: true,
            },
            offsetTop: {
                type: Number,
                required: true,
            },
            columns: {
                type: Array,
                required: true,
            },
            config: {
                type: Object,
                required: true,
            }
        }
    }
</script>