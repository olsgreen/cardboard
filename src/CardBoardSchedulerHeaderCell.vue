<template>
    <div :class="'card-board-header-column' + dateClassPrefixes(data.start)">
        <span class="card-board-scheduler-header-day-name">{{ data.start | formatDay }}</span>
        <span class="card-board-scheduler-header-day-number">{{ data.start | formatDayOfMonth }}</span>
    </div>
</template>

<style lang="scss">
    .card-board-header-column {
        padding: .8rem;
        border-right: solid 1px #e5e5e5;
        border-bottom: 3px solid #fff;

        &.is-today {
            .card-board-scheduler-header-day-name,
            .card-board-scheduler-header-day-number {
                color: #4285f4 !important;
            }

            border-bottom: 3px solid #4285f4;
        }
    }

    .card-board-scheduler-header-day-name,
    .card-board-scheduler-header-day-number {
        color: #757575;
        font-weight: 500;
        display: block;
        line-height: normal;
    }

    .card-board-scheduler-header-day-number {
        font-size: 35px;
        line-height: normal;
    }
</style>

<script>
    import Moment from 'moment'
    import DateRelatedColumnClassNames from './DateRelatedColumnClassNames.js'

    export default {
        mixins: [DateRelatedColumnClassNames],
        props: ['data'],
        filters: {
            formatDay(date) {
                return (new Moment(date)).format('ddd')
            },
            formatDayOfMonth(date) {
                return (new Moment(date)).format('D')
            }
        }
    }
</script>