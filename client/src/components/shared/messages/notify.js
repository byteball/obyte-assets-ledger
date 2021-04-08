import { Notify } from 'quasar'
//import storeAuth from 'src/store/auth/store-auth'

export default {
  success (result) {
    let message = '';
    if (result.message) message = result.message
    else message = result
    Notify.create({
      color: 'green-4',
      textColor: 'white',
      message: message
    })
  },

  warning (message) {
      Notify.create({
      color: 'orange',
      icon: 'warning',
      message: message,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  },

  processError (err) {
    let message = ''

    if (typeof err === 'string' || err instanceof String) {
      message = err
    }
    else {
      message = 'An Error has occurred.'

      // The request was made and the server responded with a status code that falls out of the range of 2xx
      if (err.response) {
        if (err.response.status === 401) {
          message = '401: You are not authorized to make this request. Please login.'
          console.log('401 message detected by notify.js function')
          storeAuth.actions.logoutUser()
        }
        else if (err.response.status === 405) message = 'You are not authorized to perform this function.'
        else if (err.response.data && err.response.data.error) message = err.response.data.error
        else if (err.response.statusText && (typeof err.response.statusText === 'string'
            || err.response.statusText instanceof String)) message = err.response.statusText
        else message = 'An error has occured.'
      }
      else if (err.request) message = 'Network/Server error had occurred.'
      else if (err.error) message = err.error
    }

    Notify.create({
      color: 'red',
      caption: message,
      message: 'Error:',
      icon: 'error',
      multiLine: true,
      actions: [
        { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  }
}
