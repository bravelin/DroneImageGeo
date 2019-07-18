export default {
    someAsyncTask3 (context, payload) {
        console.log('DE  someAsyncTask......++++++++++++++++++', payload)
        context.commit('INCREMENT_MAIN_COUNTER', payload)
        console.log('someAsyncTask......--------------------')
    }
}
