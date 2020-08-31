<template>
    <div class="card-board-grid row" :style="[{ height: '100%', /*paddingTop: offsetTop + 'px'*/ }, rowColumnCss]">
        <div v-for="(column, index) in columns" :index="index" :class="'col' + dateClassPrefixes(column.start)">
            <div v-for="row in numRows" :style="{ height: (rowHeight - 1) + 'px', borderBottom: '1px dashed #e5e5e5' }"></div>
        </div>
    </div>
</template>

<style lang="scss">
    .card-board-grid {
        .col.is-today {
            background: #f8f8f8;
        }
    }
</style>

<script>
    import GeneratesColumnCss from './GeneratesColumnCss.js'
    import DateRelatedColumnClassNames from './DateRelatedColumnClassNames.js'

    export default {
        mixins: [GeneratesColumnCss,DateRelatedColumnClassNames],
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