<template>
    <div style="height: 100%;">
        <card-board :columns="columns" :data="data">
            <div slot="cell">Booooo</div>
        </card-board>
    </div>
</template>

<script>
    import CardBoard from '../src/CardBoard.vue'

    export default {
        components: { CardBoard },
        data() {
            return {
                columns: [
                    {
                        label: 'Monday',
                    },{
                        label: 'Tuesday',
                    },{
                        label: 'Wednesday',
                    },{
                        label: 'Thursday',
                    },{
                        label: 'Friday',
                    },{
                        label: 'Saturday',
                    }
                ],
                data: [
                    {
                        content: 'Card 1',
                        column: 0,
                        span: 6,
                        color: 'red'
                    },{
                        content: 'Card 2',
                        column: 1,
                        span: 2,
                        color: 'green'
                    },{
                        content: 'Card 3',
                        column: 2,
                        color: 'blue'
                    },{
                        content: 'Card 4',
                        column: 4,
                        color: 'orange'
                    },{
                        content: 'Card 5',
                        column: 2,
                        span: 3,
                        color: 'grey'
                    },{
                        content: 'Card 6',
                        column: 1,
                        color: 'indigo'
                    },{
                        content: 'Card 7',
                        column: 1,
                        span: 2,
                        color: 'purple'
                    }
                ]
            }
        }
    }
</script>