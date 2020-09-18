import { StandardRowFormatter } from './RowFormatters.js'
import Header from './Header.vue'
import Grid from './Grid.vue'
import Row from './Row.vue'
import Item from './Item.vue'
import ColumnHeader from './ColumnHeader.vue'
import RowLabelColumnHeader from './RowLabelColumnHeader.vue'
import RowLabel from './RowLabel.vue'

let DefaultConfig = {
    debug: false,
    containerClassName: 'scheduler-container',
    daysToShow: 7,
    daysToScroll: 7,
    columnMinWidth: '0px',
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
        rows: false,
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