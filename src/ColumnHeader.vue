<template>
    <div :class="'scheduler-col scheduler-column-header ' + dateClassPrefixes(data.start)">
        <span class="scheduler-column-header-day-name">{{ data.start | formatDay }}</span>
        <span class="scheduler-column-header-day-number">{{ data.start | formatDayOfMonth }}</span>
    </div>
</template>

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