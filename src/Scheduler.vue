<template>
    <div class="card-board-scheduler-container">
        <div :class="containerClasses">
            <div ref="layoutHeader" class="card-board-layout-header">
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
            <div style="display: flex;">
                <div v-if="config.dataSourceGroups.enabled" style="flex: 0 0 225px;">
                    <div ref="rowLabelHeaderPane" class="pane" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);">
                        <div :style="{ height: cellHeaderHeight + 'px', borderBottom: '3px solid #e5e5e5', borderRight: '3px solid #e5e5e5', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)', display: 'flex', alignItems: 'center'  }">
                            <span style="color: #757575; font-weight: 500; padding: 0 1rem;">{{ config.dataSourceGroups.headerLabel }}</span>
                        </div>
                    </div>
                    <div ref="rowLabelPane" class="pane" :style="{ overflow: 'hidden', height: dataPaneHeight + 'px', borderRight: '3px solid #e5e5e5', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)' }">
                        <div class="card-board-row-label-column">
                            <div v-for="row in data" :style="{ display: 'flex', alignItems: 'center', height: (config.rowHeight - 1) + 'px', borderBottom: '1px dashed #e5e5e5' }">
                                    <img style="padding: .5rem; width: 48px; height: auto; border-radius: 50%;" :src="row.image" :alt="row.label" />
                                    <span v-if="row">{{ row.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div ref="cellHeaderPane" class="pane" :style="{ width: (containerWidth - rowLabelPaneWidth) + 'px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)' }">
                        <div class="card-board-cell-header" :style="cellHeaderStyles">
                            <div v-if="config.components.cells.header" class="card-board-column-headers row" :style="rowColumnCss">
                                <div v-for="(column, index) in columns" :index="index" class="col">
                                    <component :is="config.components.cells.header" :data="column"></component>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref="innerPane" class="pane" :style="{ width: (containerWidth - rowLabelPaneWidth) + 'px', height: dataPaneHeight + 'px' }">
                        <div class="card-board-inner">
                            <div class="grid-layout" :style="gridLayoutStyles">
                                <component 
                                    :is="config.components.grid" 
                                    :columns="columns"
                                    :num-rows="rows.length"
                                    :row-height="config.rowHeight"
                                    :offset-top="cellHeaderHeight + layoutHeaderHeight"
                                    :config="config"
                                ></component>
                            </div>
                            <div class="data-layout" :style="dataLayoutStyles">
                                <slot name="data-layout-start" />
                                <component
                                    :is="config.components.row"
                                    v-for="(row, i) in rows" 
                                    :key="i" 
                                    :class="rowClasses" 
                                    :style="rowColumnCss"
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
            this.detectProportions()

            this.wireScrollWatchers()
            this.wireResizeWatchers();
        },
        updated() {
            this.detectProportions()
        },
        data() {
            return {
                data: [],
                from: null,
                isLoading: true,
                containerWidth: 0,
                containerHeight: 0,
                cellHeaderHeight: 0,
                cellHeaderInnerHeight: 0,
                layoutHeaderHeight: 0,
                rowLabelPaneWidth: 0,
            }
        },
        methods: {
            detectProportions() {
                if (this.$el) {
                    this.containerHeight = this.$el.clientHeight
                    this.containerWidth = this.$el.clientWidth

                    let firstHeaderColumn = this.$el.querySelector('.card-board-header-column')
                    this.cellHeaderHeight = firstHeaderColumn.clientHeight
                    this.cellHeaderInnerHeight = firstHeaderColumn.offsetHeight

                    this.layoutHeaderHeight = this.$refs.layoutHeader.clientHeight

                    if (this.$refs.rowLabelPane) {
                        this.rowLabelPaneWidth = this.$refs.rowLabelPane.offsetWidth
                    }
                }
            },
            wireScrollWatchers() {
                this.$refs.innerPane.onscroll = (e) => {
                    this.$refs.cellHeaderPane.scrollLeft = this.$refs.innerPane.scrollLeft

                     if (this.$refs.rowLabelPane) {
                        this.$refs.rowLabelPane.scrollTop = this.$refs.innerPane.scrollTop
                    }
                }
            },
            wireResizeWatchers() {
                window.onresize = (e) => {
                    this.detectProportions()
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
            dataPaneHeight() {
                return this.containerHeight - this.cellHeaderInnerHeight - this.layoutHeaderHeight
            },
            hasRows() {
                return this.rows.length > 0
            },
            dataLayoutStyles() {
                //return 'padding-top: ' + (this.cellHeaderHeight + this.layoutHeaderHeight) + 'px;'
                return {}
            },
            gridLayoutStyles() {
                //return 'padding-top: ' + this.layoutHeaderHeight + 'px;'
            },
            cellHeaderStyles() {
                //return 'padding-top: ' + this.layoutHeaderHeight + 'px;'
                return {}
            },
            containerClasses() {
                let classes = [this.config.containerClassName]

                classes.push(this.hasRows ? ' has-rows' : ' is-empty')

                return classes
            },
            rowClasses() {
                let list = ['row']

                return list
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
.pane { overflow:auto; }
    .card-board-container {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        position: relative;
        /*min-height: 100%;*/ width: 100%;

        .card-board-cell-header {
            /*position: absolute; 
            top:0; left: 0;
            z-index: 2;*/
            background: rgba(255,255,255,0.95);
            min-width: 100%;
        }

        .card-board-inner { 
            position: relative; 
            min-height: 100%; 
        }

        .col { overflow: hidden; }
    
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
            min-width: 100%; min-height: 100%;
            overflow-y: hidden;

            & > div > .row > .col {
                border-bottom: 1px solid #e5e5e5;
            }
        }

        &.is-empty .grid-layout > .row > .col { border-bottom: none; }

        .card-board-layout-header {
            /*position: absolute; 
            width: 100%; z-index: 101;*/
            background: rgba(255, 255, 255, 0.95);
        }

        .data-layout {
            z-index: 1; 
            position: relative;
            //padding-bottom: 1.5rem;
        }
    }

    .card-board-scheduler-container {

        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        display: flex;
        flex-direction: column;
        background: #fff;
        //overflow: auto;
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