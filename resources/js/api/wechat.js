import axios from 'axios'

const bassURLEl = document.querySelector('#wechat-menu-prefix')
const baseURL = bassURLEl && bassURLEl.getAttribute('data-prefix')
axios.defaults.baseURL = baseURL ? baseURL : 'wechat-menu'

export function getMenus() {
    return axios.get('/menus')
}