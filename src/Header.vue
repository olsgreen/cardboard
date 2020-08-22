<template>
    <div class="card-board-scheduler-header" style="max-height: 80px; color: #757575;">
        <div class="card-board-scheduler-header-left">
            <slot name="left" v-bind:isLoading="{ isLoading }"></slot>
        </div>
        <div class="card-board-scheduler-header-center">
            <slot name="center">
                <button @click.prevent="$emit('previous')" class="prev"></button>
                <div style="display: inline-block; font-size: 22px; width: 250px;">{{ rangeLabel }}</div>
                <button @click.prevent="$emit('next')" class="next"></button>
            </slot>
        </div>
        <div class="card-board-scheduler-header-right">
            <slot name="right" v-bind:isLoading="{ isLoading }">
                <div v-if="isLoading">Loading...</div>
            </slot>
        </div>
    </div>
</template>

<style lang="scss">
    .card-board-scheduler-header {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e5e5e5;

        .card-board-scheduler-header-left,
        .card-board-scheduler-header-center,
        .card-board-scheduler-header-right {
            flex: 1;
        }

        .card-board-scheduler-header-right {
            text-align: right;
        }

        .card-board-scheduler-header-center {
            text-align: center;

            button {
                display: inline-block;
                background: none;
                border: none;
                outline: none;

                &:after {
                    border-left: 2px solid #ccc;
                    border-top: 2px solid #ccc;
                    width: 10px;
                    height: 10px;
                    display: block;
                    content: " ";
                    cursor: pointer;
                }

                &:hover:after {
                    border-left: 2px solid #666;
                    border-top: 2px solid #666;
                }

                &.prev:after { transform: rotate(-45deg); }
                &.next:after { transform: rotate(135deg); }
            }
        }
    }
</style>

<script>
    import Moment from 'moment'

    export default {
        props: {
            from: {
                required: true,
                type: Object
            },
            to: {
                required: true,
                type: Object
            },
            isLoading: {
                required: true,
                type: Boolean
            }
        },
        computed: {
            rangeLabel() {
                let rangeStart = new Moment(this.from).format('MMM DD')
                let rangeEnd = new Moment(this.to).format('MMM DD, YYYY')
                return rangeStart + ' - ' + rangeEnd
            },
        }
    }
</script>