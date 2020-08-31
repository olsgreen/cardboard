<template>
    <div class="scheduler-header">
        <div class="scheduler-header-left">
            <slot name="left" v-bind:isLoading="{ isLoading }"></slot>
        </div>
        <div class="scheduler-header-center">
            <slot name="center">
                <button @click.prevent="$emit('previous')" class="prev"></button>
                <div class="scheduler-header-range">{{ rangeLabel }}</div>
                <button @click.prevent="$emit('next')" class="next"></button>
            </slot>
        </div>
        <div class="scheduler-header-right">
            <slot name="right" v-bind:isLoading="{ isLoading }">
                <div v-if="isLoading">Loading...</div>
            </slot>
        </div>
    </div>
</template>

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