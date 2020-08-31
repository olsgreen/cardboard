import { StandardRowFormatter, Header, Grid, Row, Item, ColumnHeader, RowLabelColumnHeader, RowLabel } from './index.js'

let DefaultConfig = {
    debug: false,
    containerClassName: 'scheduler-container',
    daysToShow: 7,
    daysToScroll: 7,
    columnWidth: '1fr',
    rowHeight: 83,
    rowLabels: {
        enabled: false,
        columnLabel: '',
        columnWidth: 225,
        keys: { 
            id: 'id',
            label: 'label',
            sublabel: 'sublabel',
            image: 'image',
        },
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
            rowLabels: {
                header: RowLabelColumnHeader,
                body: RowLabel
            }
        }
    }
}

export default DefaultConfig