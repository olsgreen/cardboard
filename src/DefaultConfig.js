import { StandardRowFormatter, Header, Grid, Row, Item, ColumnHeader } from './index.js'

let DefaultConfig = {
    debug: false,
    containerClassName: 'card-board-container',
    daysToShow: 7,
    daysToScroll: 7,
    columnWidth: '1fr',
    rowHeight: 83,
    dataSourceGroups: {
        enabled: false,
        rowLabel: 'label',
        rowKey: 'id',
        headerLabel: '',
    },
    gridLines: {
        columns: true,
        rows: true,
    },
    rowFormatter: StandardRowFormatter,
    components:{
        header: Header,
        grid: Grid,
        row: Row,
        cells: {
            body: Item,
            header: ColumnHeader,
        }
    }
}

export default DefaultConfig