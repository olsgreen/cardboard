<template>
    <div style="height: 100%;">
        <scheduler :data-provider="dataProvider" :options="config"></scheduler>
    </div>
</template>

<script>
    import Moment from 'moment';
    import { Scheduler, MasonryRowFormatter } from '../src/index.js'

    const coolors = [
        '#f94144',
        '#f3722c',
        '#f8961e',
        '#f9844a',
        '#f9c74f',
        '#90be6d',
        '#43aa8b',
        '#4d908e',
        '#577590',
        '#277da1',
    ]

    export default {
        components: { Scheduler },
        methods: {
            dataProvider(from, to) {
                return this.data;
            }
        },
        data() {
            return {
                config: {
                    rowFormatter: MasonryRowFormatter
                }
            }
        },
        computed: {
            data() {
                let entries = []
                let seed1, seed2, from, to, coolor;

                for (let i = 0; i < 35; i++) {
                    seed1 = _.random(-14, 14)
                    seed2 = _.random(0,3)
                    coolor = coolors[_.random(0, coolors.length - 1)]

                    if (seed1 < 0) {
                        from = Moment().subtract(Math.abs(seed1), 'days')
                    } else if (seed1 > 0) {
                        from = Moment().add(seed1, 'days')
                    }

                    if (seed2 > 0) {
                        to = from.clone().add(seed2, 'days')
                    } else {
                        to = from.clone();
                    }

                    from = from.hour(0).minute(0).seconds(0)
                    to = to.hour(23).minute(59).seconds(59)

                    entries.push({
                        content: 'Event ' + (i + 1),
                        color: coolor,
                        from,
                        to,
                    })
                }

                return entries
            }
        }
    }
</script>