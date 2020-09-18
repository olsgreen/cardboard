export default {
    computed: {
        rowColumnCss() {
            let columns = [];
            
            for (let i = 0; i < this.columns.length; i++) {
                if (this.config.columnMinWidth) {
                    columns.push('minmax(' + this.config.columnMinWidth + ',' + this.config.columnWidth + ')');
                } else {
                    columns.push(this.config.columnWidth);
                }
            }

            return { gridTemplateColumns: columns.join(' ') };
        }
    }
}