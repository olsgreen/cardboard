import Moment from 'moment'

const coolors = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9844a',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#4d908e',
    '#577590',
    '#277da1',
]

const RandomDataGenerator = {
    computed: {
        data() {
            let entries = []
            let seed1, seed2, from, to, coolor;

            for (let i = 0; i < 35; i++) {
                seed1 = _.random(-14, 14)
                seed2 = _.random(0,3)
                coolor = coolors[_.random(0, coolors.length - 1)]

                if (seed1 < 0) {
                    from = Moment().subtract(Math.abs(seed1), 'days')
                } else if (seed1 > 0) {
                    from = Moment().add(seed1, 'days')
                }

                if (seed2 > 0) {
                    to = from.clone().add(seed2, 'days')
                } else {
                    to = from.clone();
                }

                from = from.hour(0).minute(0).seconds(0)
                to = to.hour(23).minute(59).seconds(59)

                entries.push({
                    content: 'Event ' + (i + 1),
                    color: coolor,
                    from,
                    to,
                })
            }

            return entries
        }
    }
}

const FixedDataGenerator = {
    computed: {
        data() {
            let entries = []
            let from = new Moment().subtract('14', 'days').hour(0).minute(0).seconds(0)
            let seed1, seed2, to, coolor;

            for(let i = 0; i <= 28; i++) {
                from = from.clone().add(1, 'days')

                seed2 = 1//_.random(0,3)
                coolor = coolors[_.random(0, coolors.length - 1)]

                if (seed2 > 0) {
                    to = from.clone().add(seed2, 'days')
                } else {
                    to = from.clone();
                }
                
                to = to.hour(23).minute(59).seconds(59)

                entries.push({
                    content: 'Event ' + i,
                    color: coolor,
                    from,
                    to,
                })
            }

            return entries
        }
    }    
}

export { RandomDataGenerator, FixedDataGenerator }