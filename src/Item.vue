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
        margin: 1rem;
        overflow: hidden;
        word-wrap: break-word;
        border-radius: 4px;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.is-continuation { 
            margin-left: 0; 
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        &.is-curtailed { 
            margin-right: 0;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
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