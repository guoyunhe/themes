import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Comment from 'App/Models/Comment';
import Post from 'App/Models/Post';

export default class CommentsController {
  public async store({ auth, request, response }: HttpContextContract) {
    const post = await Post.find(request.param('post_id'));

    if (!post) {
      return response.notFound();
    }

    const { content, parentId } = await request.validate({
      schema: schema.create({
        content: schema.string(),
        parentId: schema.number.nullableAndOptional([
          rules.exists({
            table: 'comments',
            column: 'id',
          }),
        ]),
      }),
    });

    const comment = await Comment.create({
      content,
      userId: auth.user!.id,
      postId: post.id,
      parentId,
    });

    return comment;
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const comment = await Comment.find(request.param('id'));

    if (!comment) {
      return response.notFound();
    }

    if (comment.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.unauthorized();
    }

    const { content } = await request.validate({
      schema: schema.create({
        content: schema.string.optional(),
      }),
    });

    comment.merge({ content });
    await comment.save();

    return comment;
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    const comment = await Comment.find(request.param('id'));
    if (!comment) {
      return response.notFound();
    }
    if (comment.userId !== auth.user!.id && auth.user!.role !== 'admin') {
      return response.unauthorized();
    }
    await comment.delete();
    return response.ok({});
  }
}
