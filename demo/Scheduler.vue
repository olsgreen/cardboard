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
                data: [
                    {
                        content: 'Event One',
                        from: new Moment('2018-12-10'),
                        to: new Moment('2018-12-10')
                    },{
                        content: 'Event Two',
                        from: new Moment('2018-12-10'),
                        to: new Moment('2018-12-14')
                    },{
                        content: 'Event Three',
                        from: new Moment('2018-12-15'),
                        to: new Moment('2018-12-18')
                    },{
                        content: 'Event Four',
                        from: new Moment('2018-12-14'),
                        to: new Moment('2018-12-15')
                    },{
                        content: 'Event Five',
                        from: new Moment('2018-12-18'),
                        to: new Moment('2018-12-19')
                    },{
                        content: 'Event Six',
                        from: new Moment('2018-12-21'),
                        to: new Moment('2018-12-22')
                    },{
                        content: 'Christmas',
                        from: new Moment('2018-12-25'),
                        to: new Moment('2018-12-25'),
                        color: 'red'
                    },{
                        content: 'Event Seven',
                        from: new Moment('2018-12-10'),
                        to: new Moment('2018-12-11')
                    },{
                        content: 'Event Eight',
                        from: new Moment('2018-12-11'),
                        to: new Moment('2018-12-14')
                    },{
                        content: 'Event Nine',
                        from: new Moment('2018-12-13'),
                        to: new Moment('2018-12-16')
                    },
                ]
            }
        }
    }
</script>