<template>
    <div class="scheduler-row-label-column-header-cell" :style="{ height: height }">
        <span>{{ label }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            height: {
                type: String,
                required: true
            },
            label: {
                type: String,
                required: true
            }
        }
    }
</script>