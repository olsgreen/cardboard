<template>
    <div class="card-board-grid row" :style="'height: 100%;' + rowCss">
        <div v-for="(column, index) in columns" :index="index" :class="'col' + dateClassPrefixes(column.start)"></div>
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
            columns: {
                type: Array
            }
        }
    }
</script>