<template>
    <div :class="containerClasses">
        <header ref="layoutHeader" class="scheduler-layout-header">
            <slot name="layout-header" v-if="config.components.header">
                <component 
                    :is="config.components.header"
                    :from="from" 
                    :to="to" 
                    :is-loading="isLoading"
                    @next="next"
                    @previous="previous"
                >
                    <div slot="left">
                        <slot name="header-left" v-bind:isLoading="isLoading"></slot>
                    </div>
                    <div slot="right">
                        <slot name="header-right" v-bind:isLoading="isLoading"></slot>
                    </div>
                </component>
            </slot>
        </header>
        <div class="scheduler-outer-pane-container">
            <div class="scheduler-outer-left-pane" 
                v-if="config.rowLabels.enabled" 
                :style="outerLeftPaneStyles"
            >
                <div ref="rowLabelColumnHeaderPane" class="scheduler-pane scheduler-row-label-column-header-pane">
                    <component
                        :is="config.components.cells.rowLabels.header"
                        :label="config.rowLabels.columnLabel"
                        :height="cellHeaderHeight + 'px'"
                    />
                </div>
                <div 
                    ref="rowLabelColumnBodyPane" 
                    class="scheduler-pane scheduler-row-label-column-body-pane" 
                    :style="{ height: dataPaneHeight + 'px' }"
                >
                    <div v-for="row in data" :style="{ height: config.rowHeight + 'px' }">
                        <component
                            :is="config.components.cells.rowLabels.body"
                            :config="config"
                            :row="row"
                        />
                    </div>
                </div>
            </div>
            <div class="scheduler-outer-right-pane">
                <div 
                    ref="columnHeaderPane" 
                    class="scheduler-pane scheduler-column-header-pane" 
                    :style="{ width: dataPaneWidth + 'px' }"
                >
                    <div v-if="config.components.cells.header" class="scheduler-row scheduler-column-header-row" :style="rowColumnCss">
                        <component 
                            :is="config.components.cells.header" 
                            :data="column"
                            v-for="(column, index) in columns" 
                            :key="index"
                        />
                    </div>
                </div>
                <div 
                    ref="innerPane" 
                    class="scheduler-pane scheduler-inner-pane" 
                    :style="{ width: dataPaneWidth + 'px', height: dataPaneHeight + 'px' }"
                >
                    <div class="scheduler-layout-container">
                        <div class="scheduler-grid-layout">
                            <component 
                                :is="config.components.grid" 
                                :columns="columns"
                                :num-rows="rows.length"
                                :row-height="config.rowHeight"
                                :offset-top="cellHeaderHeight + layoutHeaderHeight"
                                :config="config"
                            ></component>
                        </div>
                        <div class="scheduler-data-layout">
                            <slot name="data-layout-start" />
                            <component
                                :is="config.components.row"
                                v-for="(row, i) in rows" 
                                :key="i" 
                                class="scheduler-row" 
                                :style="rowColumnCss"
                                :columns="row"  
                                :config="config"
                            />
                            <slot 
                                name="data-layout-end" 
                                :isLoading="isLoading" 
                                :hasResults="hasResults"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { merge } from 'lodash'
    import GeneratesColumnCss from './GeneratesColumnCss.js'
    import DefaultConfig from './DefaultConfig.js'
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

                    let firstHeaderColumn = this.$el.querySelector('.scheduler-column-header')
                    this.cellHeaderHeight = firstHeaderColumn.clientHeight
                    this.cellHeaderInnerHeight = firstHeaderColumn.offsetHeight

                    this.layoutHeaderHeight = this.$refs.layoutHeader.clientHeight

                    if (this.$refs.rowLabelColumnBodyPane) {
                        this.rowLabelPaneWidth = this.$refs.rowLabelColumnBodyPane.offsetWidth
                    }
                }
            },
            wireScrollWatchers() {
                this.$refs.innerPane.onscroll = (e) => {
                    this.$refs.columnHeaderPane.scrollLeft = this.$refs.innerPane.scrollLeft

                     if (this.$refs.rowLabelColumnBodyPane) {
                        this.$refs.rowLabelColumnBodyPane.scrollTop = this.$refs.innerPane.scrollTop
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
            outerLeftPaneStyles() {
                return { 
                    flex: '0 0 ' + this.config.rowLabels.columnWidth + 'px' 
                }
            },
            dataPaneWidth() {
                return this.containerWidth - this.rowLabelPaneWidth
            },
            dataPaneHeight() {
                return this.containerHeight - 
                    this.cellHeaderInnerHeight - 
                    this.layoutHeaderHeight
            },
            hasRows() {
                return this.rows.length > 0
            },
            containerClasses() {
                let classes = [this.config.containerClassName]

                classes.push(this.hasRows ? ' has-rows' : ' is-empty')

                if (this.config.gridLines.rows) {
                    classes.push('scheduler-row-grid-lines')
                }

                if (this.config.gridLines.columns) {
                    classes.push('scheduler-column-grid-lines')
                }

                return classes
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
    .scheduler-container {
        font-family: -apple-system, 
                     BlinkMacSystemFont, 
                     Segoe UI, 
                     Roboto, 
                     Helvetica, 
                     Arial, 
                     sans-serif;
        display: flex;
        flex-direction: column;
        background: #fff;
        position: relative;

        .scheduler-pane { overflow:auto; }
        .scheduler-col { overflow: hidden; }
        .scheduler-row { display: grid; }
        .scheduler-col, .scheduler-row {
            margin: 0;
            padding: 0;
        }

        .scheduler-header {
            display: flex;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #e5e5e5;
            max-height: 80px; color: #757575;

            .scheduler-header-left,
            .scheduler-header-center,
            .scheduler-header-right {
                flex: 1;
            }

            .scheduler-header-right {
                text-align: right;
            }

            .scheduler-header-center {
                text-align: center;

                .scheduler-header-range {
                    display: inline-block; 
                    font-size: 22px; width: 250px;
                }

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

        .scheduler-outer-pane-container {
            display: flex;

            .scheduler-column-header-pane,
            .scheduler-row-label-column-header-pane {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
            }

            .scheduler-row-label-column-header-cell,
            .scheduler-column-header {
                border-bottom: 3px solid #e5e5e5; 
                border-right: 1px solid #e5e5e5; 
            }

            .scheduler-outer-left-pane {
                .scheduler-row-label-column-header-pane {
                    .scheduler-row-label-column-header-cell {
                        display: flex;
                        align-items: center;
                        border-right: 3px solid #e5e5e5; 

                        span {
                            color: #757575; 
                            font-weight: 500; 
                            padding: 0 1rem;
                        }
                    }
                }

                .scheduler-row-label-column-body-pane {
                    overflow: hidden; 
                    border-right: 3px solid #e5e5e5;
                    transform: translateY(-1px);

                    .scheduler-row-label {
                        border-bottom: 1px dashed #e5e5e5; 
                        height: 100%; 
                        display: flex; 
                        align-items: center;

                        .scheduler-row-label-text-container {
                            margin-left: 1rem;
                        }

                        .scheduler-row-label-image {
                            margin: 1rem 0 1rem 1rem;
                            width: 48px; height: auto;
                            border-radius: 50%;
                        }

                        .scheduler-row-label-sub-text {
                            font-size: .8rem; 
                            color: #999;
                        }
                    }
                }
            }

            .scheduler-outer-right-pane {
                .scheduler-column-header-pane {
                    overflow: hidden;

                    .scheduler-column-header-row {
                        .scheduler-column-header {
                            padding: .8rem;

                            &.is-today {
                                .scheduler-column-header-day-name,
                                .scheduler-column-header-day-number {
                                    color: #4285f4 !important;
                                }

                                border-bottom: 3px solid #4285f4;
                            }
                        }

                        .scheduler-column-header-day-name,
                        .scheduler-column-header-day-number {
                            color: #757575;
                            font-weight: 500;
                            display: block;
                            line-height: normal;
                        }

                        .scheduler-column-header-day-number {
                            font-size: 35px;
                            line-height: normal;
                        }
                    }
                }

                .scheduler-inner-pane {
                    position: relative;
                
                    .scheduler-layout-container {
                        position: relative; 
                        min-height: 100%;

                        .scheduler-grid-layout {
                            position: absolute; 
                            top: 0; left: 0; bottom: 0;
                            min-width: 100%; min-height: 100%;
                            overflow-y: hidden;

                            .scheduler-grid { 
                                height: 100%; 
                                .is-today {
                                    background: #f8f8f8;
                                }
                            }

                            & > div > .scheduler-row > .scheduler-col {
                                border-bottom: 1px solid #e5e5e5;
                            }

                            & > .scheduler-row > .scheduler-col {
                                border-bottom: solid 1px rgb(229,229,229);
                                border-left: none;
                                border-top: none;
                            }
                        }

                        .scheduler-data-layout {
                            z-index: 1; 
                            position: relative;

                            .scheduler-item {
                                color: white; 
                                padding: 1rem; 
                                margin: 1rem;
                                overflow: hidden;
                                word-wrap: break-word;
                                border-radius: 4px;

                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;

                                &.scheduler-is-continuation { 
                                    margin-left: 0; 
                                    border-top-left-radius: 0;
                                    border-bottom-left-radius: 0;
                                }
                                &.scheduler-is-curtailed { 
                                    margin-right: 0;
                                    border-top-right-radius: 0;
                                    border-bottom-right-radius: 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        &.scheduler-row-grid-lines { 
            .scheduler-grid-row {
                border-bottom: 1px dashed #e5e5e5;
            } 
        }

        &.scheduler-column-grid-lines {
            .scheduler-grid > .scheduler-col {
                border-right: solid 1px rgb(229,229,229);
            }
        }
    }
</style>