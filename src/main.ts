import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import App from '@/App.vue'
import theme from '../tailwind.theme.json'

// see https://quasar.dev for further customization instructions
// NOTE: importing icons is optional, you could use individual fontawesome SVGs instead
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import './style.css'

const app = createApp(App)

app.use(Quasar, {
    plugins: [ Notify ],
    config: {
        brand: {
            // import brand colors added to tailwind config
            ...theme.colors
        }
    }
})

app.mount('#app')