<template>
    <div :class="classes" :style="'background: '+(data.color ? data.color : '#999')+';'" v-if="data">
        {{ data.content }} {{ data.index }} ({{ data.from | shortDate }} - {{ data.to | shortDate }})
    </div>
</template>

<script>
    import Moment from 'moment'

    export default {
        props: ['data'],
        filters: {
            shortDate(v) {
                return v.format('DD/MM')
            }
        },
        computed: {
            classes() {
                let list = ['scheduler-item']

                if (this.data._display_state === 'continuation') {
                    list.push('scheduler-is-continuation')
                } else if (this.data._display_state === 'curtailed') {
                    list.push('scheduler-is-curtailed')
                }
                
                return list
            }
        }
    }
</script>