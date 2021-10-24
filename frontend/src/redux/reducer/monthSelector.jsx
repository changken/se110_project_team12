import moment from 'moment'

const init = {
    startMonth: moment().subtract(1, 'years').format("YYYY-MM"),
    endMonth: moment().format("YYYY-MM")
}

const selectedMonthReducer = (state = init, action) => {
    switch (action.type) {
        case "SET_START_MONTH":
            console.log(action)
            return {...state, startMonth: action.startMonth}
        case "SET_END_MONTH":
            console.log(action)
            return {...state, endMonth: action.endMonth}
        default:
            return state
    }
}

export default selectedMonthReducer