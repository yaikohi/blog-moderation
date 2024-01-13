import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { CommentType, EventType } from "./types";

// --- CONFIG
const PORT = 4003;

// -- APP
const app = new Elysia();

// --- MIDDLEWARE
app
  .use(cors());

// --- ROUTES
app
  .get("/", () => "Hello Elysia")
  .group("/events", (app) =>
    app
      .post("/", async ({ body, set }) => {
        console.log({ body });
        const { type, data } = body;
        if (type === "comment.created") {
          const { comment, postId } = data;

          const status: CommentType["status"] =
            comment.content.toLowerCase().includes("orange")
              ? "REJECTED"
              : "APPROVED";

          const moderatedComment = {
            content: comment.content,
            id: comment.id,
            status,
          };

          await sendCommentModeratedEvent({
            comment: moderatedComment,
            postId: postId,
          });
        }
      }, {
        body: t.Object({
          type: t.Union([
            t.Literal("comment.created"),
            t.Literal("comment.moderated"),
            t.Literal("comment.updated"),
          ]),
          data: t.Object({
            comment: t.Object({
              id: t.String(),
              content: t.String(),
              status: t.Union([
                t.Literal("PENDING"),
                t.Literal("APPROVED"),
                t.Literal("REJECTED"),
              ]),
            }),
            postId: t.String(),
          }),
        }),
      }))
  .listen(PORT);

console.log(
  `🦊 Elysia is running the 'moderation' service at ${app.server?.hostname}:${app.server?.port}`,
);

export async function sendCommentModeratedEvent(
  { comment, postId }: { comment: CommentType; postId: string },
) {
  const url = `http://localhost:4005/events`;
  const event: EventType = {
    type: "comment.moderated",
    data: {
      comment,
      postId,
    },
  };

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
