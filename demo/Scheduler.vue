<template>
    <div style="height: 100%;">
        <card-board-scheduler :data-provider="dataProvider"></card-board-scheduler>
    </div>
</template>

<script>
    import Moment from 'moment';
    import { CardBoardScheduler } from '../src/index.js'

    export default {
        components: { CardBoardScheduler },
        methods: {
            dataProvider(from, to) {
                return this.data;
            }
        },
        data() {
            return {
                //
            }
        },
        computed: {
            data() {
                let entries = []
                let seed1, seed2, from, to;

                for (let i = 0; i < 35; i++) {
                    seed1 = _.random(-14, 14)
                    seed2 = _.random(0,3)

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
                        from,
                        to
                    })
                }

                return entries
            }
        }
    }
</script>