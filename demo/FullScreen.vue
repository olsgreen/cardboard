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
        rowFormatter: MasonryRowFormatter
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