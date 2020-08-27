<template>
    <div class="card-board-scheduler-container">
        <div :class="containerClasses">
            <div class="card-board-layout-header">
                <slot name="layout-header" v-if="config.components.header">
                    <component 
                        :is="config.components.header"
                        :from="from" 
                        :to="to" 
                        :is-loading="isLoading"
                        @next="next"
                        @previous="previous"
                    >
                        <div slot="left"><slot name="header-left" v-bind:isLoading="isLoading"></slot></div>
                        <div slot="right"><slot name="header-right" v-bind:isLoading="isLoading"></slot></div>
                    </component>
                </slot>
            </div>
            <div class="card-board-inner">
                <div class="grid-layout" :style="gridLayoutStyles">
                    <div class="col card-board-cell-header" :style="cellHeaderStyles">
                        <div v-if="config.components.cells.header" class="card-board-column-headers row" :style="rowCss">
                            <div v-for="(column, index) in columns" :index="index" class="col">
                                <component :is="config.components.cells.header" :data="column"></component>
                            </div>
                        </div>
                    </div>
                    <component 
                        :is="config.components.grid" 
                        :columns="columns"
                        :config="config"
                    ></component>
                </div>
                <div class="data-layout" :style="dataLayoutStyles">
                    <slot name="data-layout-start" />
                    <component
                        :is="config.components.row"
                        v-for="(row, i) in rows" 
                        :key="i" 
                        class="row" 
                        :style="rowCss"
                        :columns="row"  
                        :config="config"
                    />
                    <slot 
                        name="data-layout-end" 
                        v-bind:isLoading="isLoading" 
                        v-bind:hasResults="hasResults"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { merge } from 'lodash'
    import { GeneratesColumnCss, DefaultConfig } from './index.js'
    import Moment from 'moment'

    export default {
        mixins: [GeneratesColumnCss],
        props: {
            initialDate: {
                default() {
                    return Moment().startOf('isoWeek')
                }
            },
            dataProvider: {
                required: true,
                type: Function
            },
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        created() {
            this.from = this.initialDate

            this.getData()
        },
        mounted() {
            this.detectAndSetHeaderHeights()

            this.stickyHeader()
        },
        data() {
            return {
                data: [],
                from: null,
                isLoading: true,
                cellHeaderHeight: 0,
                layoutHeaderHeight: 0,
            }
        },
        methods: {
            detectAndSetHeaderHeights() {
                if (this.$el) {
                   this.cellHeaderHeight = this.$el.querySelector('.card-board-cell-header').clientHeight
                   this.layoutHeaderHeight = this.$el.querySelector('.card-board-layout-header').clientHeight
                }
            },
            stickyHeader() {
                var layoutHeader = this.$el.querySelector('.card-board-layout-header');
                var cellHeader = this.$el.querySelector('.card-board-cell-header');
                var offsetTop = (this.config.stickyHeader.offsetTop) ?
                    this.config.stickyHeader.offsetTop :
                    0;

                this.$el.onscroll = (e) => {
                    window.requestAnimationFrame(() => {
                        layoutHeader.style.left = this.$el.scrollLeft + 'px';

                        if (!this.config.stickyHeader.enabled) {
                            return
                        }

                        cellHeader.style.top = offsetTop  > 0 ?
                                offsetTop + 'px' : 
                                (this.$el.scrollTop - 1) + 'px';
                        
                        layoutHeader.style.top = offsetTop  > 0 ?
                                offsetTop + 'px' : 
                                this.$el.scrollTop + 'px';
                    })
                }
            },
            next() {
                this.gotoDate(new Moment(this.from).add(this.config.daysToScroll, 'days'))
            },
            previous() {
                this.gotoDate(new Moment(this.from).subtract(this.config.daysToScroll, 'days'))
            },
            gotoDate(date) {
                let oldDate = this.from;

                this.$set(this, 'from', date)

                this.getData().then(() => {
                    this.$emit('change', oldDate, date)
                }).catch(e => {});
            },
            setData(data) {
                this.data = data
            },
            getData() {
                this.isLoading = true
                this.setData([]);

                return new Promise((resolve, reject) => {
                    
                    let promise = this.dataProvider(this.from, this.to);

                    if (typeof promise === 'object' && promise.constructor.name === 'Array') {
                        this.setData(promise)
                        this.isLoading = false
                        resolve()
                        return;
                    } 

                    promise.then(data => {
                        this.setData(data);
                        this.isLoading = false
                        resolve(data);
                    }).catch(e => { 
                        this.isLoading = false
                        reject(e);
                    });
                })
            }
        },
        computed: {
            hasRows() {
                return this.rows.length > 0
            },
            dataLayoutStyles() {
                return 'padding-top: ' + (this.cellHeaderHeight + this.layoutHeaderHeight) + 'px;'
            },
            gridLayoutStyles() {
                //return 'padding-top: ' + this.layoutHeaderHeight + 'px;'
            },
            cellHeaderStyles() {
                return 'padding-top: ' + this.layoutHeaderHeight + 'px;'
            },
            containerClasses() {
                return this.config.containerClassName + 
                    (this.hasRows ? ' has-rows' : ' is-empty') +
                    (this.config.stickyHeader.enabled ? ' has-sticky-header' : '')
            },
            rows() {
                let formatter = new this.config.rowFormatter(this)

                return formatter.format(this.data)
            },
            hasResults() {
                return this.data.length > 0
            },
            to() {
                return new Moment(this.from).add(this.config.daysToShow, 'days');
            },
            columns() {
                let columns = [];
                let day = new Moment(this.from);

                for (let i = 0; i < this.config.daysToShow; i++) {
                    let date = new Moment(day)

                    columns.push({
                        label: date.format('ddd DD-MM-YYYY'),
                        start: new Moment(date).startOf('day'),
                        end: new Moment(date).endOf('day'),
                    });

                    day.add(1, 'days');
                }

                return columns
            },
            config() {
                return merge(DefaultConfig, this.options);
            }
        }
    }
</script>

<style lang="scss">
    .card-board-container {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        position: relative;
        min-height: 100%; width: 100%;

        .card-board-cell-header {
            position: absolute; 
            top:0; left: 0;
            z-index: 2;
            background: rgba(255,255,255,0.95);
            min-width: 100%;
        }

        .card-board-inner { position: relative; min-height: 100%; }
    
        .row {
            display: grid;
        }
        .col, .row {
            margin: 0;
            padding: 0;
        }

        .grid-layout {
            position: absolute; 
            top: 0; left: 0; bottom: 0;
            width: 100%; min-height: 100%;

            & > div > .row > .col {
                border-bottom: 1px solid #e5e5e5;
            }
        }

        &.is-empty .grid-layout > .row > .col { border-bottom: none; }

        .card-board-layout-header {
            position: absolute; 
            width: 100%; z-index: 101;
            background: rgba(255, 255, 255, 0.95);
        }

        .data-layout {
            z-index: 1; 
            position: relative;
            padding-bottom: 1.5rem;
        }
    }

    .card-board-scheduler-container {

        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        display: flex;
        flex-direction: column;
        background: #fff;
        overflow: auto;
        position: relative;

        & > div { flex: 1; }

        .card-board-container {
            .grid-layout {
                & > .row > .col {
                    border-bottom: solid 1px rgb(229,229,229);
                    border-right: solid 1px rgb(229,229,229);
                    border-left: none;
                    border-top: none;
                }
            }
        }
    }
</style>