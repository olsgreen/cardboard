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

const GroupedDataGenerator = {
    computed: {
        data() {
            let seed1, seed2, coolor, to, from;

            let rows = [
                {
                    id: 1,
                    label: 'Jeanne-France',
                    position: 'CEO',
                    image: 'assets/headshots/1.png',
                    entries: []
                },{
                    id: 2,
                    label: 'Jean-Marie',
                    position: 'CFO',
                    image: 'assets/headshots/2.png',
                    entries: []
                },{
                    id: 3,
                    label: 'Oliver',
                    position: 'CTO',
                    image: 'assets/headshots/4.png',
                    entries: []
                },{
                    id: 4,
                    label: 'Laetitia',
                    position: 'Creativity',
                    image: 'assets/headshots/3.png',
                    entries: []
                },{
                    id: 5,
                    label: 'Cedric',
                    position: 'Head Mechanic',
                    image: 'assets/headshots/6.png',
                    entries: []
                },{
                    id: 6,
                    label: 'Vanessa',
                    position: 'Head Chef',
                    image: 'assets/headshots/5.png',
                    entries: []
                },
            ]

            return rows.map(row => {
                to = new Moment().subtract('14', 'days').hour(0).minute(0).seconds(0)
                coolor = coolors[_.random(0, coolors.length - 1)]

                for(let i = 0; i <= 3; i++) {
                    from = to.clone().add(1, 'days')
                    seed2 = _.random(0,3)

                    if (seed2 > 0) {
                        to = from.clone().add(seed2, 'days')
                    } else {
                        to = from.clone();
                    }
                    
                    to = to.hour(23).minute(59).seconds(59)

                    row.entries.push({
                        content: 'Event ' + i,
                        color: coolor,
                        from,
                        to,
                    })
                }

                return row
            })
        }
    }        
}

export { RandomDataGenerator, FixedDataGenerator, GroupedDataGenerator }