export default {
    computed: {
        rowColumnCss() {
            let columns = [];
            
            for (let i = 0; i < this.columns.length; i++) {
                columns.push(this.config.columnWidth);
            }

            return { gridTemplateColumns: columns.join(' ') };
        }
    }
}