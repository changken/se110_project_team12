const init = localStorage.getItem('projectId') || 0

const currentProjectIdReducer = (state = init, action) => {
    switch (action.type) {
        case "SET_CURRENT_PROJECT_ID":
            localStorage.setItem('projectId', action.projectId)
            return action.projectId
        default:
            return state
    }
}

export default currentProjectIdReducer