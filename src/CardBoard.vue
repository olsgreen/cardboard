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
                <component
                    :is="config.components.row"
                    v-for="(row, i) in rows" 
                    :key="i" 
                    class="row" 
                    :style="rowCss"
                    :columns="row"  
                    :config="config"
                />
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
    import CardBoardRow from './CardBoardRow.vue'

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
                        row: CardBoardRow,
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
                    sortComparator(a, b) {
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