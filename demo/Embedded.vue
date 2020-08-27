<template>
    <scheduler 
        :data-provider="dataProvider" 
        :options="config" 
        :style="{ height: '400px', margin: '5rem' }" 
    />
</template>

<script>
    import { Scheduler, MasonryRowFormatter } from '../src/index.js'
    import { FixedDataGenerator } from './DataGenerator.js'

    const config = {
        //rowFormatter: MasonryRowFormatter
    }

    export default {
        mixins: [FixedDataGenerator],
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