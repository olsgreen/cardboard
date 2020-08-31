<template>
    <div class="scheduler-row-label">
        <img v-if="image" class="scheduler-row-label-image"  :src="image" :alt="label" />
        <div class="scheduler-row-label-text-container">
            <div class="scheduler-row-label-text" v-if="row">{{ label }}</div>
            <div v-if="sublabel" class="scheduler-row-label-sub-text">{{ sublabel }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            row: {
                type: Object,
                required: true
            },
            config: {
                type: Object,
                required: true
            }
        },
        computed: {
            label() {
                return this.row[this.config.rowLabels.keys.label]
            },
            sublabel() {
                return this.row[this.config.rowLabels.keys.sublabel]
            },
            image() {
                return this.row[this.config.rowLabels.keys.image]
            }
        }
    }
</script>