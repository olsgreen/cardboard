import Moment from 'moment'

export default {
    methods: {
        dateClassPrefixes(date) {
            let str = '';

            if (Moment().isBefore(date, 'day')) {
                str += ' is-after'
            } else if (Moment().isAfter(date, 'day')) {
                str += ' is-before'
            } else {
                str += ' is-today'
            }

            return str;
        }
    }
}