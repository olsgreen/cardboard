export default {
    computed: {
        rowCss() {
            let columns = [];
            
            for (let i = 0; i < this.columns.length; i++) {
                columns.push('1fr');
            }

            return 'grid-template-columns: ' + columns.join(' ') + ' ;';
        }
    }
}