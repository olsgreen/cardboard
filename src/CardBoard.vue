<template>
    <div :class="containerClasses">
        <div class="card-board-inner">
            <div class="grid-layout">
                <div class="card-board-header" style="position: absolute; top:0; left: 0; right: 0; z-index: 2;">
                    <slot name="layout-header"></slot>
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
                <div v-for="(row, i) in rows" :index="i" class="row" :style="rowCss">
                    <div v-if="cell && !cell._silent" v-for="(cell, c) in row" class="col" :style="'grid-column-start:'+ (c + 1) +'; grid-column-end: '+ ((cell._span ? cell._span : 1) + c + 1) +';'">
                        <component :is="config.components.cells.body" :data="cell"></component>
                    </div>
                </div>
                <slot name="data-layout-end" />
            </div>
        </div>
    </div>
</template>

<script>
    import { merge } from 'lodash'
    import CardBoardBodyCell from './CardBoardBodyCell.vue'
    import CardBoardHeaderCell from './CardBoardHeaderCell.vue'
    import CardBoardGrid from './CardBoardGrid.vue'
    import GeneratesColumnCss from './GeneratesColumnCss.js'

    export default {
        mixins: [GeneratesColumnCss],
        props: {
            columns: {
                type: Array
            },
            data: {
                type: Array
            }, 
            options: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                headerHeight: 0
            }
        },
        mounted() {
            this.detectAndSetHeaderHeight()
            this.stickyHeader()
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
                  var topDist = h.offsetTop;
                  return topDist;
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
            config() {
                return merge({
                    containerClassName: 'card-board-container',
                    components:{
                        grid: CardBoardGrid,
                        cells: {
                            body: CardBoardBodyCell,
                            header: CardBoardHeaderCell,
                        }
                    },
                    columnComputer(item) {
                        return item.column;
                    },
                    spanComputer(item) {
                        return item.span ? item.span : 1
                    },
                    spanComparator(a, b) {
                        a = a._span ? a._span : 1
                        b = b._span ? b._span : 1

                        if (a > b) return 1;
                        if (a < b) return -1;

                        return 0;
                    }
                }, this.options);
            },
            rows() {
                let rows = [];

                let sorted  = this.data.map(item => {
                    item._span = this.config.spanComputer.apply(this, [item]);
                    item._column = this.config.columnComputer.apply(this, [item]);
                    return item
                }).sort(this.config.spanComparator);

                const createRow = () => {
                    let row = []

                    for (let i in this.columns) {
                        row.push(null)
                    }

                    rows.push(row);

                    return rows.length - 1;
                }

                const findRowIndexFor = (item) => {
                    let requiredColumnIndexes = [];

                    for (
                        let i = this.config.columnComputer.apply(this, [item]); 
                        i < (this.config.columnComputer.apply(this, [item]) + this.config.spanComputer.apply(this, [item])); 
                        i++
                    ) {
                        requiredColumnIndexes.push(i);
                    }

                    for (let i in rows) {
                        for (let c in requiredColumnIndexes) {

                            if (rows[i][requiredColumnIndexes[c]] !== null) {
                                break;
                            }

                            if ((requiredColumnIndexes.length - 1) === parseInt(c)) {
                                return i;
                            }
                        }
                    }

                    return false;
                }

                for (let k in sorted) {
                    let rowIndex = findRowIndexFor(sorted[k]);

                    if (!rowIndex) {
                       rowIndex = createRow();
                    }

                    if (!sorted[k]._span) {
                        sorted[k]._span = 1;
                    }

                    for (let i = 0; i < sorted[k]._span; i++) {                        
                        rows[rowIndex][sorted[k]._column + i] = Object.assign({}, sorted[k]);
                        
                        if (i > 0) {
                            rows[rowIndex][sorted[k]._column + i]._silent = true
                        }
                    }
                }

                return rows;
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
</style>