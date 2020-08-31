<template>
    <scheduler 
        :data-provider="dataProvider" 
        :options="config" 
        :style="{ height: '100vh' }" 
    />
</template>

<script>
    import { Scheduler, MasonryRowFormatter } from '../src/index.js'
    import { FixedDataGenerator, RandomDataGenerator } from './DataGenerator.js'

    const config = {
        rowFormatter: MasonryRowFormatter,
        columnWidth: '200px',
        daysToShow: 14,
        gridLines: {
            columns: false,
            rows: false,
        }
    }

    export default {
        mixins: [RandomDataGenerator],
        components: { Scheduler },
        data() {
            return {
                config
            }
        },
        methods: {
            dataProvider(from, to) {
                return this.data;
            }
        }
    }
</script>