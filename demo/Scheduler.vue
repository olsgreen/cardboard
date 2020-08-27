<template>
    <div>
        <scheduler :data-provider="dataProvider" :options="config" />
    </div>
</template>

<script>
    import Moment from 'moment';
    import Scheduler from '../src/index.js'
    import DataGenerator from './DataGenerator.js'

    export default {
        mixins: [DataGenerator],
        components: { Scheduler },
        props: {
            config: {
                type: Object,
                required: false
            },
            schedulerStyles: {
                type: Object,
                required: false,
                default() {
                    return {}
                }
            }
        },
        methods: {
            dataProvider(from, to) {
                return this.data;
            }
        }
    }
</script>