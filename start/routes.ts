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

import Env from '@ioc:Adonis/Core/Env';
import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'hello' };
  });

  Route.post('/login', 'AuthController.login');
  Route.post('/logout', 'AuthController.logout').middleware('auth');
  Route.post('/register', 'AuthController.register');
  Route.get('/user', 'AuthController.show').middleware('auth');
  Route.put('/user', 'AuthController.update').middleware('auth');
  Route.put('/password', 'AuthController.password').middleware('auth');

  Route.resource('images', 'ImagesController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      index: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });

  Route.resource('tags', 'TagsController').only(['index', 'show']);
  Route.resource('fonts', 'FontsController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });
  Route.resource('posts', 'PostsController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });
  Route.resource('posts.comments', 'CommentsController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });
  Route.resource('comments', 'CommentsController').only(['show']);
  Route.resource('posts.likes', 'PostLikesController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });
  Route.resource('comments.likes', 'CommentLikesController')
    .apiOnly()
    .middleware({
      store: ['auth'],
      update: ['auth'],
      destroy: ['auth'],
    });
  Route.resource('users', 'UsersController').only(['show']);
  Route.resource('notifications', 'NotificationsController')
    .only(['index', 'update', 'destroy'])
    .middleware({ index: ['auth'], update: ['auth'], destroy: ['auth'] });

  Route.group(() => {
    Route.resource('tags', 'TagsController').apiOnly();
    Route.resource('users', 'UsersController').apiOnly();
  })
    .prefix('/admin')
    .as('admin')
    .namespace('App/Controllers/Http/Admin')
    .middleware(['auth', 'admin']);
}).prefix('/api');

Route.get('*', async ({ view }) => {
  const html = await view.render('app', {
    SITE_NAME: Env.get('SITE_NAME'),
    SITE_LOGO: Env.get('SITE_LOGO'),
    SITE_DESCRIPTION: Env.get('SITE_DESCRIPTION'),
    SITE_URL: Env.get('SITE_URL'),
  });
  return html;
});
