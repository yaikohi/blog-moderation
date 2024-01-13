import { t } from "elysia";
// ---- POST
export const PostEventTypeSchema = t.Union([
  t.Literal("post.created"),
  t.Literal("post.updated"),
  t.Literal("post.deleted"),
]);

export const PostEventSchema = t.Object({
  type: PostEventTypeSchema,
  data: t.Object({
    post: t.Object({
      id: t.String(),
      title: t.String(),
      content: t.String(),
      comments: t.MaybeEmpty(t.Array(t.Object({
        id: t.String(),
        content: t.String(),
        status: t.String(),
      }))),
    }),
  }),
});
// ---- COMMENTS
export const CommentEventTypeSchema = t.Union([
  t.Literal("comment.created"),
  t.Literal("comment.updated"),
  t.Literal("comment.moderated"),
]);
export const CommentEventSchema = t.Object({
  type: CommentEventTypeSchema,
  data: t.Object({
    comment: t.Object({
      id: t.String(),
      content: t.String(),
      status: t.String(),
    }),
    postId: t.String(),
  }),
});
// ----- EVENTS

export const EventTypeSchema = t.Union([
  t.Literal("post.created"),
  t.Literal("post.updated"),
  t.Literal("post.deleted"),
  t.Literal("comment.created"),
  t.Literal("comment.updated"),
  t.Literal("comment.deleted"),
  t.Literal("comment.moderated"),
]);

export const EventBodySchema = t.Union([PostEventSchema, CommentEventSchema]);
