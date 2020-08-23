import Moment from 'moment'

class StandardRowFormatter 
{
    constructor(scheduler) {
        this.scheduler = scheduler
    }

    columnComputer(item) {
        if (this.scheduler.config.columnComputer) {
            return this.scheduler.config.columnComputer.apply(this, [item])
        }

        let start, end
        for (let i in this.scheduler.columns) {
            start = this.scheduler.columns[i].start
            end = this.scheduler.columns[i].end

            if (item._from.isBetween(start, end, null, '[]')) {
                return parseInt(i)
            }

            if (item._to.isBetween(start, end, null, '[]')) {
                return 0
            }
        }
    }

    spanComputer(item) {
        if (this.scheduler.config.spanComputer) {
            return this.scheduler.config.spanComputer.apply(this, [item])
        }

        let from = item._from.startOf('day');
        let to = item._to.endOf('day');
        return Math.max(1, Math.ceil(to.diff(from, 'days', true)));
    }

    sortComparator(a, b) {
        if (this.scheduler.config.sortComparator) {
            return this.scheduler.config.sortComparator.apply(this, [item])
        }

        a = a._span ? a._span : 1
        b = b._span ? b._span : 1

        if (a > b) return 1;
        if (a < b) return -1;

        return 0;
    }

    prepare(data) {
        // First, we add properties to the entries for which columns
        // they should start in and how many columns they should take up.
       return data.map(item => {
            item._from = new Moment(item.from)
            item._to = new Moment(item.to)

            if (item._from.isBefore(this.from) && item._to.isAfter(this.from)) {
                item._from = new Moment(this.from)
            }

            item._span = this.spanComputer(item);
            item._column = this.columnComputer(item);
            return item
        })

        // Then we sort the items via the configured sort comparator. By 
        // default entries that require more space / columns are placed 
        // lower in the sorted entries thus placing them in lower rows 
        // as they are assigned last.
        .sort(this.sortComparator.bind(this));
    }

    format(data) {
        return this.prepare(data).map(i => [i]);
    }
}


class MasonryRowFormatter extends StandardRowFormatter
{
    constructor(scheduler) {
        super(scheduler)

        this.rows = []
    }

    // The create row helper simply creates an array with n number 
    // of null indexes, where n equals the number of columns are 
    // being displaid to the user.
    createRow() {
        let row = []

        for (let i in this.scheduler.columns) {
            row.push(null)
        }

        this.rows.push(row);

        return this.rows.length - 1;
    }

    // The row finder helper method will return the next available 
    // row index for an entry or false if one is not available. It iterativly 
    // searches the current row set looking for space in a row at the entries 
    // designated column index.
    findOrCreateRowIndexFor(item) {
        let requiredColumnIndexes = []
        let sComp = this.spanComputer.bind(this)
        let cComp = this.columnComputer.bind(this)

        // First, we work out the column indexes that the given entry requires, 
        // e.g. an entry designated to column 2 with a span of 3 will require 
        // row indexes 2, 3 and 4.
        for (let i = cComp(item); i < (cComp(item) + sComp(item)); i++) {
            requiredColumnIndexes.push(i);
        }

        // Next we iterate over each row in the current collection to check 
        // whether it can accomodate the entry.
        for (let i in this.rows) {
            // Check each of the columns in the row that the item will occupy.
            for (let c in requiredColumnIndexes) {
                // If the required index is not empty break the loop 
                // to move on to the next row.
                if (this.rows[i][requiredColumnIndexes[c]] !== null) {
                    break;
                }

                // If we are on the last required column index we return the 
                // current row index as we now know the item can be accomodated.
                if ((requiredColumnIndexes.length - 1) === parseInt(c)) {
                    return i;
                }
            }
        }

        return this.createRow();
    }

    format(data) {
        let sorted = this.prepare(data)

        // Next we iterate over each entry and place it within its rows column collection.
        for (let k in sorted) {
            let rowIndex = this.findOrCreateRowIndexFor(sorted[k]);

            // We iterate over each column that the entry occupies.
            for (let i = 0; i < sorted[k]._span; i++) {           
                // We add the item to each column it occupies.
                this.rows[rowIndex][sorted[k]._column + i] = Object.assign({}, sorted[k]);

                if (i > 0) {   
                    // If this is not the first column the item occupies, we 
                    // mark the item as a placeholder.                     
                    this.rows[rowIndex][sorted[k]._column + i]._placeholder = true
                }
            }
        }

        return this.rows
    }
}

export { StandardRowFormatter, MasonryRowFormatter }