<template>
    <div class="card-board-scheduler-container">
        <div :class="containerClasses">
            <div class="card-board-inner">
                <div class="grid-layout">
                    <div class="card-board-header" style="position: absolute; top:0; left: 0; right: 0; z-index: 2;">
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
                        <div v-if="config.components.cells.header" class="card-board-column-headers row" :style="rowCss">
                            <div v-for="(column, index) in columns" :index="index" class="col">
                                <component :is="config.components.cells.header" :data="column"></component>
                            </div>
                        </div>
                    </div>
                    <component 
                        :is="config.components.grid" 
                        :columns="columns"
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
    import { GeneratesColumnCss, Grid, Header, ColumnHeader, Row, Item } from './subcomponents.js'
    import Moment from 'moment'

    export default {
        mixins: [GeneratesColumnCss],
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

            this.getData()
        },
        mounted() {
            this.detectAndSetHeaderHeight()
            this.stickyHeader()
        },
        data() {
            return {
                data: [],
                from: null,
                isLoading: true,
                headerHeight: 0,
            }
        },
        methods: {
            detectAndSetHeaderHeight() {
                if (this.$el) {
                   this.headerHeight = this.$el.querySelector('.card-board-header').clientHeight
                }
            },
            stickyHeader() {
                var h = this.$el.querySelector('.card-board-header');
                var stuck = false;
                var stickPoint = getDistance();
                var offsetTop = (this.config.stickyHeader && this.config.stickyHeader.offsetTop) ?
                    this.config.stickyHeader.offsetTop :
                    0;

                function getDistance() {
                    return h.offsetTop;
                }

                window.onscroll = (e) => {
                    var offset = (window.pageYOffset - offsetTop);
                    var distance = getDistance() - offset;
                    if ( (distance <= 0) && !stuck) {
                        h.style.position = 'fixed';
                        h.style.top = offsetTop  > 0 ?
                        offsetTop + 'px' : 
                        this.$el.getBoundingClientRect().top + 'px';
                        h.style.left = this.$el.getBoundingClientRect().left + 'px';
                        h.style.width = this.$el.getBoundingClientRect().width + 'px';
                        stuck = true;
                    } else if (stuck && (offset <= stickPoint)){
                        h.style.position = 'absolute';
                        h.style.top = '0px';
                        h.style.left = '0px';
                        h.style.width = 'auto';
                        stuck = false;
                    }
                }
            },
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
            hasRows() {
                return this.rows.length > 0
            },
            dataLayoutStyles() {
                return 'margin-top: ' + this.headerHeight + 'px;'
            },
            containerClasses() {
                return this.config.containerClassName + (this.hasRows ? ' has-rows' : ' is-empty')
            },
            rows() {
                let rows = [];

                // The create row helper simply creates an array with n number 
                // of null indexes, where n equals the number of columns are 
                // being displaid to the user.
                const createRow = () => {
                    let row = []

                    for (let i in this.columns) {
                        row.push(null)
                    }

                    rows.push(row);

                    return rows.length - 1;
                }

                // The row finder helper method will return the next available 
                // row index for an entry or false if one is not available. It iterativly 
                // searches the current row set looking for space in a row at the entries 
                // designated column index.
                const findOrCreateRowIndexFor = (item) => {
                    let requiredColumnIndexes = []
                    let sComp = this.config.spanComputer.bind(this)
                    let cComp = this.config.columnComputer.bind(this)

                    // First, we work out the column indexes that the given entry requires, 
                    // e.g. an entry designated to column 2 with a span of 3 will require 
                    // row indexes 2, 3 and 4.
                    for (let i = cComp(item); i < (cComp(item) + sComp(item)); i++) {
                        requiredColumnIndexes.push(i);
                    }

                    // Next we iterate over each row in the current collection to check 
                    // whether it can accomodate the entry.
                    for (let i in rows) {
                        // Check each of the columns in the row that the item will occupy.
                        for (let c in requiredColumnIndexes) {
                            // If the required index is not empty break the loop 
                            // to move on to the next row.
                            if (rows[i][requiredColumnIndexes[c]] !== null) {
                                break;
                            }

                            // If we are on the last required column index we return the 
                            // current row index as we now know the item can be accomodated.
                            if ((requiredColumnIndexes.length - 1) === parseInt(c)) {
                                return i;
                            }
                        }
                    }

                    return createRow();
                }

                // First, we add properties to the entries for which columns
                // they should start in and how many columns they should take up.
                let sorted  = this.data.map(item => {
                    item._from = new Moment(item.from)
                    item._to = new Moment(item.to)

                    if (item._from.isBefore(this.from) && item._to.isAfter(this.from)) {
                        item._from = new Moment(this.from)
                    }

                    item._span = this.config.spanComputer.apply(this, [item]);
                    item._column = this.config.columnComputer.apply(this, [item]);
                    return item
                })

                // Then we sort the items via the configured sort comparator. By 
                // default entries that require more space / columns are placed 
                // lower in the sorted entries thus placing them in lower rows 
                // as they are assigned last.
                .sort(this.config.sortComparator);

                // Next we iterate over each entry and place it within its rows column collection.
                for (let k in sorted) {
                    let rowIndex = findOrCreateRowIndexFor(sorted[k]);

                    // We iterate over each column that the entry occupies.
                    for (let i = 0; i < sorted[k]._span; i++) {           
                        // We add the item to each column it occupies.
                        rows[rowIndex][sorted[k]._column + i] = Object.assign({}, sorted[k]);

                        if (i > 0) {   
                            // If this is not the first column the item occupies, we 
                            // mark the item as a placeholder.                     
                            rows[rowIndex][sorted[k]._column + i]._placeholder = true
                        }
                    }
                }

                return rows
            },
            hasResults() {
                return this.data.length > 0
            },
            to() {
                return new Moment(this.from).add(this.daysToShow, 'days');
            },
            columns() {
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
            config() {
                return merge({
                    containerClassName: 'card-board-container',
                    components:{
                        header: Header,
                        grid: Grid,
                        row: Row,
                        cells: {
                            body: Item,
                            header: ColumnHeader,
                        }
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
                        return Math.max(1, Math.ceil(to.diff(from, 'days', true)));
                    },
                    sortComparator(a, b) {
                        a = a._span ? a._span : 1
                        b = b._span ? b._span : 1

                        if (a > b) return 1;
                        if (a < b) return -1;

                        return 0;
                    }
                }, this.options);
            }
        }
    }
</script>

<style lang="scss">
    .card-board-container {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
        position: relative;
        min-height: 100%; width: 100%;

        .card-board-inner {
            overflow: hidden;
        }

        .card-board-header {
            background: rgba(255,255,255,0.95);
        }
    
        .row {
            display: grid;
        }
        .col, .row {
            margin: 0;
            padding: 0;
        }

        .grid-layout {
            position: absolute; 
            top: 0; left: 0; 
            width: 100%; height: 100%;

            & > div > .row > .col {
                border-bottom: 1px solid #e5e5e5;
            }
        }

        &.is-empty .grid-layout > .row > .col { border-bottom: none; }

        .data-layout {
            z-index: 1; 
            position: relative;
            padding-bottom: 1.5rem;
        }
    }

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