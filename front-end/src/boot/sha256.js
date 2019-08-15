import sha256 from 'sha256'

export default ({ Vue }) => {
  Vue.prototype.$sha256 = sha256
}