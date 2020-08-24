import { StandardRowFormatter, Header, Grid, Row, Item, ColumnHeader } from './index.js'

let DefaultConfig = {
    debug: false,
    containerClassName: 'card-board-container',
    daysToShow: 7,
    daysToScroll: 7,
    stickyHeader: {
        enabled: true,
        offsetTop: 0
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