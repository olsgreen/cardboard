<template>
    <div class="card-board-grid row" :style="'height: 100%;' + rowCss">
        <div v-for="(column, index) in columns" :index="index" class="col"></div>
    </div>
</template>

<script>
    import GeneratesColumnCss from './GeneratesColumnCss.js'
    
    export default {
        mixins: [GeneratesColumnCss],
        props: {
            columns: {
                type: Array
            }
        }
    }
</script>