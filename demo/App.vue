<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    import VueRouter from 'vue-router'
    import FullScreen from './FullScreen.vue'
    import Embedded from './Embedded.vue'
    import RowLabels from './RowLabels.vue'

    const routes = [
        { path: '/', component: FullScreen },
        { path: '/embedded', component: Embedded },
        { path: '/labels', component: RowLabels }
    ]

    const router = new VueRouter({
        routes
    })

    export default {
        router
    }
</script>