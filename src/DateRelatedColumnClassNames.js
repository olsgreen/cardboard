import Moment from 'moment'

export default {
    methods: {
        dateClassPrefixes(date) {
            let classes = [];

            if (Moment().isBefore(date, 'day')) {
                classes.push('is-after')
            } else if (Moment().isAfter(date, 'day')) {
                classes.push('is-before')
            } else {
                classes.push('is-today')
            }

            return classes;
        }
    }
}