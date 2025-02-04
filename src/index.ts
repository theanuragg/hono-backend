import { Hono} from 'hono'
import { userRouter } from './routes/user'
import { blogRoute } from './routes/blog'
export const App = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()
App.route('/api/v1', userRouter)
App.get('/', (c) => c.text('Please test me!'))
App.route('/api/v1/blog',blogRoute )

export default App;