/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

Route.post('/login', 'AuthController.login');
Route.post('/logout', 'AuthController.logout').middleware('auth');
Route.post('/register', 'AuthController.register');
Route.get('/user', 'AuthController.show').middleware('auth');
Route.put('/user', 'AuthController.update').middleware('auth');
Route.put('/password', 'AuthController.password').middleware('auth');

Route.resource('/images', 'ImagesController')
  .apiOnly()
  .middleware({
    store: ['auth'],
    index: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  });

Route.group(() => {
  Route.resource('/users', 'AdminUsersController').apiOnly();
})
  .prefix('/admin')
  .middleware(['auth', 'admin']);

Route.get('/', async ({ i18n }) => {
  return { hello: i18n.formatMessage('messages.hello') };
});
