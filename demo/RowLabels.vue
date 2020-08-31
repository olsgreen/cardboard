<template>
    <scheduler 
        :data-provider="dataProvider" 
        :options="config" 
        :style="{ height: '100vh' }" 
    />
</template>

<script>
    import { Scheduler, GroupedRowFormatter } from '../src/index.js'
    import { FixedDataGenerator, RandomDataGenerator, GroupedDataGenerator } from './DataGenerator.js'

    const config = {
        rowFormatter: GroupedRowFormatter,
        //columnWidth: '250px',
        rowLabels: {
            enabled: true,
            columnLabel: 'Team Members',
            keys: {
                sublabel: 'position'
            }
        },
    }

    export default {
        mixins: [GroupedDataGenerator],
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