import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${5}`,
    }),

    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic update start
        // const pathRequest2 = dispatch(
        //   apiSlice.util.updateQueryData("getConversations", arg.sender, (draft) => {
        //     draft?.push(arg.data);
        //   })
        // );
        // optimistic update end
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg.data.users;
            const senderUser = users.find(user => user.email === arg.sender);
            const receiverUser = users.find(user => user.email !== arg.sender);

            dispatch(messagesApi.endpoints.addMessage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg.data.message,
              timestamp: arg.data.timestamp,

            }))
          }
        } catch (error) {
          // pathRequest2.undo();
        }
      }
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => ({
        url: `/conversations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // optimistic update start
        const pathRequest1 = dispatch(
          apiSlice.util.updateQueryData("getConversations", arg.sender, (draft) => {
            const draftConversation = draft.find(c => c.id == arg.id)

            draftConversation.message = arg.data.message;
            draftConversation.timestamp = arg.data.timestamp;

          })
        );
        // optimistic update end

        try {

          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = arg.data.users;
            const senderUser = users.find(user => user.email === arg.sender);
            const receiverUser = users.find(user => user.email !== arg.sender);

            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: arg.data.timestamp,

              })
            ).unwrap();

            // update messages cache pessimistically start
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );
            // update messages cache pessimistically end
          }

        } catch (err) {
          pathRequest1.undo();
        }
      }
    }),
  }),
});

export const { useGetConversationsQuery, useGetConversationQuery, useAddConversationMutation, useEditConversationMutation } = conversationsApi;
