import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Font from 'App/Models/Font';

export default class FontsController {
  public async index({ request }: HttpContextContract) {
    const {
      tagId,
      search,
      page = 1,
      perPage = 10,
    } = await request.validate({
      schema: schema.create({
        tagId: schema.number.optional([
          rules.exists({
            table: 'tags',
            column: 'id',
          }),
        ]),
        search: schema.string.optional({ trim: true }),
        page: schema.number.optional([]),
        perPage: schema.number.optional([rules.range(5, 20)]),
      }),
    });

    const query = Font.query()
      .preload('user')
      .preload('files', (q) => {
        q.preload('langs');
      })
      .preload('tags', (q) => {
        q.preload('icon');
      })
      .withCount('likes')
      .withCount('reviews', (query) => {
        query.avg('rating').as('rating');
      });

    query.orderBy('downloads', 'desc');

    if (search) {
      search
        .split(' ')
        .filter(Boolean)
        .forEach((word) => {
          query.where((q) => {
            q.whereILike('title', `%${word}%`).orWhereILike('content', `%${word}%`);
          });
        });
    }

    if (tagId) {
      query.whereHas('tags', (q) => {
        q.where('tags.id', tagId);
      });
    }

    return await query.paginate(page, perPage);
  }

  public async show({ auth, request, response }: HttpContextContract) {
    const query = Font.query()
      .where('id', request.param('id'))
      .preload('user')
      .preload('tags', (q) => {
        q.preload('icon');
      })
      .withAggregate('likes', (q) => {
        q.sum('like').as('likes_sum');
      });

    if (auth.user) {
      query.preload('likes', (q) => {
        q.where('userId', auth.user!.id);
      });
    }

    const font = await query.first();

    if (!font) {
      return response.notFound();
    }

    await Font.query().where('id', request.param('id')).increment({ views: 1 });

    return font;
  }

  public async update({ request, response }: HttpContextContract) {
    const font = await Font.find(request.param('id'));

    if (!font) {
      return response.notFound();
    }

    const { title, content, tags } = await request.validate({
      schema: schema.create({
        title: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        content: schema.string.optional(),
        tags: schema.array.optional().members(
          schema.object().members({
            id: schema.number([
              rules.exists({
                table: 'tags',
                column: 'id',
              }),
            ]),
          })
        ),
      }),
    });

    font.merge({ title, content });
    await font.save();

    if (tags) {
      await font.related('tags').sync(tags.map((tag) => tag.id));
    }

    await font.load('tags');
    await font.load('user');

    return font;
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    const font = await Font.find(request.param('id'));
    if (!font) {
      return response.notFound();
    }
    if (font.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.unauthorized();
    }
    await font.delete();
    return response.ok({});
  }
}
