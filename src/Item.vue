<template>
    <div>
        <div :class="classes" :style="'background: '+(data.color ? data.color : '#999')+';'" v-if="data">
            {{ data.content }} {{ data.index }} ({{ data.from | shortDate }} - {{ data.to | shortDate }})
        </div>
    </div>
</template>

<style lang="scss">
    .card-board-body-cell {
        color: white; 
        padding: 1rem; 
        margin-top: 1rem; 
        margin-left: 1rem; 
        margin-right: 1rem; 
        overflow: hidden;
        word-wrap: break-word;

        &.is-continuation { margin-left: 0; }
        &.is-curtailed { margin-right: 0; }
    }
</style>

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
                let list = ['card-board-body-cell']

                if (this.data._display_state === 'continuation') {
                    list.push('is-continuation')
                } else if (this.data._display_state === 'curtailed') {
                    list.push('is-curtailed')
                }
                
                return list
            }
        }
    }
</script>