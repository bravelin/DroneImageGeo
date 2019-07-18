export default {
    DECREMENT (state) {
        state.data--
        console.log('state.data---', state.data)
    },
    INCREMENT_MAIN_COUNTER (state, payload) {
        state.data++
        console.log('state.data+++', state.data, payload)
    }
}
