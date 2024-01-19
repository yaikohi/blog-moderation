import { env } from "bun";
import { CommentType, EventType } from "./types";

export const getURL = (): string => {
  const PORT_EVENTBUS = `4005`;
  const HOST_EVENTBUS = `event-bus-srv`;
  const URL_EVENTBUS = `http://${HOST_EVENTBUS}:${PORT_EVENTBUS}/events`;

  const localURL = `http://localhost:4005/events`;

  if (env.NODE_ENV === "development") {
    return localURL;
  } else {
    return URL_EVENTBUS;
  }
};

export async function sendCommentModeratedEvent(
  { comment, postId }: { comment: CommentType; postId: string },
) {
  const event: EventType = {
    type: "comment.moderated",
    data: {
      comment,
      postId,
    },
  };
  const url = getURL();

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
