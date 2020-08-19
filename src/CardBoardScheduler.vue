<template>
    <div class="card-board-scheduler-container">
        <card-board @header-cell-click="e => $emit('header-cell-click', e)" :columns="days" :data="cardBoardData" :options="config">
            <component 
                :is="headerComponent"
                v-if="showHeader"
                slot="layout-header"
                :from="from" 
                :to="to" 
                :is-loading="isLoading"
                @next="next"
                @previous="previous"
            >
                <div slot="left"><slot name="header-left" v-bind:isLoading="isLoading"></slot></div>
                <div slot="right"><slot name="header-right" v-bind:isLoading="isLoading"></slot></div>
            </component>
            <div slot="data-layout-end">
                <slot name="data-layout-end" v-bind:isLoading="isLoading" v-bind:hasResults="hasResults"></slot>
            </div>
        </card-board>
    </div>
</template>

<style lang="scss">
    .card-board-scheduler-container {

        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        min-height: 100%;
        display: flex;
        flex-direction: column;

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

<script>
    import { merge } from 'lodash'
    import SchedulerHeader from './CardBoardSchedulerHeader.vue'
    import CardBoard from './CardBoard.vue'
    import CardBoardSchedulerHeaderCell from './CardBoardSchedulerHeaderCell.vue'
    import CardBoardSchedulerGrid from './CardBoardSchedulerGrid.vue'
    import Moment from 'moment'

    export default {
        mixins: [CardBoardSchedulerGrid],
        components: { CardBoard, SchedulerHeader },
        props: {
            showDate: {
                default() {
                    return Moment().startOf('isoWeek')
                }
            },
            daysToShow: {
                type: Number,
                default: 7
            },
            daysToScroll: {
                type: Number,
                default: 7
            },
            headerComponent: {
                type: Object,
                default() {
                    return SchedulerHeader
                }
            },
            showHeader: {
                type: Boolean,
                default: true
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
            this.from = this.showDate

            this.getData().catch(e => {});
        },
        data() {
            return {
                data: [],
                from: null,
                isLoading: true,
            }
        },
        methods: {
            next() {
                this.gotoDate(new Moment(this.from).add(this.daysToScroll, 'days'))
            },
            previous() {
                this.gotoDate(new Moment(this.from).subtract(this.daysToScroll, 'days'))
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
            hasResults() {
                return this.data.length > 0
            },
            to() {
                return new Moment(this.from).add(this.daysToShow, 'days');
            },
            days() {
                let columns = [];
                let day = new Moment(this.from);

                for (let i = 0; i < this.daysToShow; i++) {
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
            cardBoardData() {
                return this.data.map(item => {
                    item._from = new Moment(item.from)
                    item._to = new Moment(item.to)

                    if (item._from.isBefore(this.from) && item._to.isAfter(this.from)) {
                        item._from = new Moment(this.from)
                    }

                    return item;
                })
            },
            config() {
                return merge({
                    components: {
                        grid: CardBoardSchedulerGrid,
                        cells: { header: CardBoardSchedulerHeaderCell }
                    },
                    columnComputer(item) {
                        for (let i in this.columns) {
                            if (item._from.isBetween(this.columns[i].start, this.columns[i].end, null, '[]')) {
                                return parseInt(i)
                            }

                            if (item._to.isBetween(this.columns[i].start, this.columns[i].end, null, '[]')) {
                                return 0
                            }
                        }
                    },
                    spanComputer(item) {
                        let from = item._from.startOf('day');
                        let to = item._to.endOf('day');
                        return Math.ceil(to.diff(from, 'days', true));
                    }
                }, this.options)
            }
        }
    }
</script>